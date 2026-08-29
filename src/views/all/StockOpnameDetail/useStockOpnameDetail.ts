import { useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAlertAnimation } from "../../../hooks/useAlert";
import { useToastAnimation } from "../../../hooks/useToast";
import useConfirm from "../../../hooks/useConfirm";
import {
  BATAS_WAKTU_BATALKAN_POSTING_MS,
  ROLE_INTERNAL_TYPE,
  STATUS_INVENTORI_TYPE,
  STATUS_STOCK_OPNAME_TYPE,
  type StatusStockOpnameType,
} from "../../../types/constant.type";
import { BarangKeluarServices } from "../../../services/barangKeluar.service";
import useDeleteBarangKeluar from "../../../hooks/useDeleteBarangKeluar";
import { useAuthStore } from "../../../stores/authStore";
import useModal from "../../../hooks/useModal";
import { useMemo } from "react";
import { LOCAL_STORAGE_KEYS } from "../../../utils/localStorageKeys";
import { StockOpnameServices } from "../../../services/stockOpname.service";
import { PengajuanStockOpnameServices } from "../../../services/pengajuanStockOpname.service";

const useStockOpnameDetail = (params: { fromPengajuan?: boolean }) => {
  const { fromPengajuan } = params;

  const pengguna = useAuthStore((state) => state.pengguna);

  // query client
  const queryClient = useQueryClient();

  // navigate
  const navigate = useNavigate();

  // use alert
  const { alert, handleSetAlert } = useAlertAnimation();

  // use toast
  const { toast, handleSetToast } = useToastAnimation();

  // get id from params
  const { id } = useParams<{ id: string }>();
  // parse
  const validatedId = parseId(id);

  // show modal konfirmasi posting
  const {
    modalRef: modalKonfirmasiPostingRef,
    confirm,
    handleConfirm: handleConfirmPosting,
    handleCancel: handleCancelConfirmPosting,
    data: dataConfirm,
  } = useConfirm<{ bigTitle: string; smallTitle: string }>();

  // use query
  const {
    data: dataStockOpnameDetail,
    isLoading: isLoadingStockOpnameDetail,
    isFetching: isFetchingStockOpnameDetail,
  } = useQuery({
    queryKey: ["stock-opname-detail", validatedId],
    queryFn: () => StockOpnameServices.detail({ id: validatedId! }),
    enabled: !!validatedId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // handle show modal verifikasi rejected
  const {
    modalRef: modalFormulirVerifikasiOrPengajuan,
    handleShowModal: showModalFormulirVerifikasiOrPengajuan,
    handleCloseModal: handleCloseModalFormulirVerifikasiOrPengajuan,
    idModal: idModalFormulirVerifikasiOrPengajuan,
    dataModal: dataModalFormulirVerifikasiOrPengajuan,
  } = useModal<{ type: "pengajuan" | "tolak" }>();

  // handle show modal formulir verifikasi or pengajuan
  const handleShowModalFormulirVerifikasiOrPengajuan = (
    id?: number | undefined,
    data?:
      | {
          type: "pengajuan" | "tolak";
        }
      | undefined,
  ) => {
    if (dataStockOpnameDetail?.data?.details.length === 0) {
      handleSetAlert("empty_produk");
      return;
    }
    showModalFormulirVerifikasiOrPengajuan(id, data);
  };

  // invalidate
  const invalidateQueries = () => {
    // revalidated
    queryClient.invalidateQueries({
      queryKey: ["stock-opname-detail", validatedId],
    });

    // revalidated
    queryClient.invalidateQueries({
      queryKey: ["notifikasi-global"],
    });

    // revalidated
    queryClient.invalidateQueries({
      queryKey: ["notifikasi-produk"],
    });

    // invalidated riwayat
    queryClient.invalidateQueries({
      queryKey: ["riwayat-pengajuan-stock-opname", validatedId],
    });
  };

  // mutate posting
  const { mutateAsync: mutatePosting, isPending: isPendingPosting } =
    useMutation({
      mutationFn: (id: number) => StockOpnameServices.posted(id),
      onSuccess: () => {
        // handle toast
        handleSetToast("posted");

        // revalidated
        invalidateQueries();
      },
      onError: (err) => {
        console.log(err);
      },
    });

  // handle posting
  const handlePosting = async (id?: number) => {
    try {
      if (
        dataStockOpnameDetail?.data?.status ===
          STATUS_STOCK_OPNAME_TYPE.APPROVED ||
        !id
      )
        return;

      if (dataStockOpnameDetail?.data?.details.length === 0) {
        handleSetAlert("empty_produk");
        return;
      }

      // confirm
      const isConfirm = await confirm({
        bigTitle: "Apakah Anda yakin ingin memposting data stok opname?",
        smallTitle:
          pengguna?.role === ROLE_INTERNAL_TYPE.KASIR
            ? "Setelah diposting, stok barang akan diperbarui"
            : "Setelah diposting, menunggu persetujuan dari Owner",
      });

      if (!isConfirm) {
        return;
      }

      await mutatePosting(id);
    } catch (error) {
      console.log(error);
    }
  };

  // mutate cancel posting
  const {
    mutateAsync: mutateCancelPosting,
    isPending: isPendingCancelPosting,
  } = useMutation({
    mutationFn: (id: number) => BarangKeluarServices.cancelPosted(id),

    onSuccess: () => {
      // handle toast
      handleSetToast("cancel_posted");

      // invalidated
      invalidateQueries();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // cancel verifikasi
  const {
    mutateAsync: mutateCancelVerifikasi,
    isPending: isPendingCancelVerifikasi,
  } = useMutation({
    mutationFn: (id: number) =>
      PengajuanStockOpnameServices.cancelVerifikasi({ stockOpnameId: id }),

    onSuccess: () => {
      // handle toast
      handleSetToast("canceled_verifikasi");

      // invalidated
      invalidateQueries();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // is expired
  const isExpired =
    dataStockOpnameDetail?.data &&
    dataStockOpnameDetail?.data?.verifiedAt &&
    Date.now() - new Date(dataStockOpnameDetail?.data?.verifiedAt).getTime() >
      BATAS_WAKTU_BATALKAN_POSTING_MS;

  // handle posting
  const handleCancelPosting = async (id: number) => {
    try {
      if (
        dataStockOpnameDetail?.data?.status === STATUS_INVENTORI_TYPE.DRAFT ||
        isExpired ||
        !id
      )
        return;

      // check expired
      if (isExpired) {
        handleSetAlert("expired");
        return;
      }

      // confirm
      const isConfirm = await confirm({
        bigTitle:
          "Apakah Anda yakin ingin membatalkan posting data stok opname?",
        smallTitle:
          "Stok akan dikembalikan ke kondisi sebelum posting. Setelah pembatalan, transaksi dapat diedit dan diposting kembali.",
      });

      if (!isConfirm) {
        return;
      }

      await mutateCancelPosting(id);
    } catch (error) {
      console.log(error);
    }
  };

  // handle verifikasi
  const handleCancelVerifikasi = async (id?: number) => {
    try {
      if (
        dataStockOpnameDetail?.data?.status === STATUS_INVENTORI_TYPE.DRAFT ||
        !id
      )
        return;

      // check expired
      if (isExpired) {
        handleSetAlert("expired");
        return;
      }

      // confirm
      const isConfirm = await confirm({
        bigTitle:
          "Apakah Anda yakin ingin membatalkan verifikasi pengajuan stok opname?",
        smallTitle:
          "Stok akan dikembalikan ke kondisi sebelum diverifikasi. Setelah pembatalan, pengajuan dapat lakukan verifikasi kembali.",
      });

      if (!isConfirm) {
        return;
      }

      await mutateCancelVerifikasi(id);
    } catch (error) {
      console.log(error);
    }
  };

  const isStatusPosted =
    dataStockOpnameDetail?.data?.status === STATUS_STOCK_OPNAME_TYPE.APPROVED;
  const isStatusDraft =
    dataStockOpnameDetail?.data?.status === STATUS_STOCK_OPNAME_TYPE.DRAFT;

  const isStatusRejected =
    dataStockOpnameDetail?.data?.status === STATUS_STOCK_OPNAME_TYPE.REJECTED;

  // can show form tambah barang
  const canShowFormTambahBarang =
    ((!fromPengajuan && pengguna?.role === ROLE_INTERNAL_TYPE.OWNER) ||
      (fromPengajuan && pengguna?.role === ROLE_INTERNAL_TYPE.KASIR)) &&
    (dataStockOpnameDetail?.data?.status === STATUS_STOCK_OPNAME_TYPE.DRAFT ||
      dataStockOpnameDetail?.data?.status ===
        STATUS_STOCK_OPNAME_TYPE.REJECTED);

  const isCanBatalkanPosting =
    isStatusPosted && pengguna?.role === ROLE_INTERNAL_TYPE.OWNER && !isExpired;

  // use delete barang keluar
  const {
    dataDelete,
    handleCloseModalDelete,
    handleDelete,
    handleShowModalDelete,
    isPendingDelete,
    modalDeleteRef,
  } = useDeleteBarangKeluar({
    redirect: () => {
      navigate("/dashboard/inventori", {
        state: {
          toast: "deleted_barang_keluar",
        },
      });
    },
  });

  // mutation
  const {
    mutateAsync: mutateVerifikasiPengajuanStockOpname,
    isPending: isPendingVerifikasiPengajuanStockOpname,
  } = useMutation({
    mutationFn: (data: {
      stockOpnameId: number;
      keterangan?: string;
      status: Exclude<StatusStockOpnameType, "DRAFT" | "PENDING">;
    }) => PengajuanStockOpnameServices.verifikasi(data),

    onSuccess: () => {
      // set toast
      handleSetToast("approved_pengajuan");

      // invalidate queries
      invalidateQueries();
    },

    onError: (err) => {
      console.log(err);
    },
  });
  // handle setuju
  const handleSetuju = async () => {
    try {
      // check validated id
      if (!validatedId || !fromPengajuan) return;

      // confirm
      const isConfirm = await confirm({
        bigTitle: "Apakah Anda yakin ingin menyetujui pengajuan stok opname?",
        smallTitle:
          "Pastikan seluruh data stok opname telah sesuai. Setelah disetujui, data akan diposting dan stok barang akan diperbarui",
      });

      if (!isConfirm) {
        return;
      }

      await mutateVerifikasiPengajuanStockOpname({
        stockOpnameId: validatedId,
        status: STATUS_STOCK_OPNAME_TYPE.APPROVED,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const isCanUpdate =
    isStatusDraft ||
    (isStatusRejected && pengguna?.role === ROLE_INTERNAL_TYPE.KASIR);

  // hadle back
  const handleBack = () => {
    return navigate(-1);
  };

  const fromPengajuanStockOpnameNotifikasi = useMemo<boolean | null>(() => {
    const data = localStorage.getItem(
      LOCAL_STORAGE_KEYS.FROM_PENGAJUAN_STOCK_OPNAME,
    );

    if (!data) return null;

    try {
      return JSON.parse(data) as boolean;
    } catch {
      return null;
    }
  }, []);

  // // download invoice barang keluar
  // const {
  //   handleDownloadInvoiceBarangKeluarPdf,
  //   isPendingDownloadInvoiceBarangKeluar,
  // } = useDownloadInvoiceBarangKeluar({ handleSetAlert, handleSetToast });

  // // get use print
  // const { handlePrintInvoiceBarangKeluar, isLoadingPrintInvoiceBarangKeluar } =
  //   usePrintInvoiceBarangKeluar({ handleSetAlert });

  return {
    dataStockOpnameDetail,
    isLoadingStockOpnameDetail:
      isLoadingStockOpnameDetail || isFetchingStockOpnameDetail,
    alert,
    toast,
    handlePosting,
    isPendingPosting,
    modalKonfirmasiPostingRef,
    handleCancelPosting,
    handleConfirmPosting,
    handleCancelConfirmPosting,
    isPendingCancelPosting,
    isStatusPosted,
    isStatusDraft,
    isExpired,
    modalDeleteRef,
    handleShowModalDelete,
    handleCloseModalDelete,
    dataDelete,
    handleDelete,
    isPendingDelete,
    handleSetToast,
    handleSetAlert,

    pengguna,

    handleSetuju,
    isPendingVerifikasiPengajuanStockOpname,

    dataConfirm,

    handleCancelVerifikasi,
    isPendingCancelVerifikasi,

    modalFormulirVerifikasiOrPengajuan,
    handleShowModalFormulirVerifikasiOrPengajuan,
    handleCloseModalFormulirVerifikasiOrPengajuan,
    idModalFormulirVerifikasiOrPengajuan,
    dataModalFormulirVerifikasiOrPengajuan,

    isStatusRejected,
    canShowFormTambahBarang,
    isCanUpdate,
    isCanBatalkanPosting,

    handleBack,

    fromPengajuanStockOpnameNotifikasi,
  };
};

export default useStockOpnameDetail;
