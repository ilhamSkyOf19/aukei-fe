import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAlertAnimation } from "../../../hooks/useAlert";
import { useToastAnimation } from "../../../hooks/useToast";
import axios from "axios";
import type { ErrorResponse } from "../../../types/response.type";
import useConfirm from "../../../hooks/useConfirm";
import {
  BATAS_WAKTU_BATALKAN_POSTING_MS,
  ROLE_INTERNAL_TYPE,
  STATUS_INVENTORI_TYPE,
  type StatusInventoriType,
} from "../../../types/constant.type";
import { BarangKeluarServices } from "../../../services/barangKeluar.service";
import useDeleteBarangKeluar from "../../../hooks/useDeleteBarangKeluar";
import { useAuthStore } from "../../../stores/authStore";
import useModal from "../../../hooks/useModal";
import { PengajuanBarangKeluarServices } from "../../../services/pengajuanBarangkeluar.service";

const useBarangKeluarDetail = (params: { fromPengajuanBarang?: boolean }) => {
  const { fromPengajuanBarang } = params;

  const pengguna = useAuthStore((state) => state.pengguna);

  // query client
  const queryClient = useQueryClient();

  // navigate
  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  // show modal konfirmasi posting
  const {
    modalRef: modalKonfirmasiPostingRef,
    confirm,
    handleConfirm: handleConfirmPosting,
    handleCancel: handleCancelConfirmPosting,
    data: dataConfirm,
  } = useConfirm<{ bigTitle: string; smallTitle: string }>();

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
    if (dataBarangKeluarDetail?.data?.detailBarangKeluars.length === 0) {
      handleSetAlert("empty_barang_keluar");
      return;
    }

    showModalFormulirVerifikasiOrPengajuan(id, data);
  };

  // use alert
  const { alert, handleSetAlert } = useAlertAnimation();

  // use toast
  const { toast, handleSetToast } = useToastAnimation();

  // get id from params
  const { id } = useParams<{ id: string }>();
  // parse
  const validatedId = parseId(id);

  // use query
  const {
    data: dataBarangKeluarDetail,
    isLoading: isLoadingBarangKeluarDetail,
  } = useQuery({
    queryKey: ["barang-keluar-detail", validatedId],
    queryFn: () => BarangKeluarServices.detail({ id: validatedId! }),
    enabled: !!validatedId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // mutate posting
  const { mutateAsync: mutatePosting, isPending: isPendingPosting } =
    useMutation({
      mutationFn: (id: number) => BarangKeluarServices.posted(id),
      onSuccess: () => {
        // handle toast
        handleSetToast("posted");

        // revalidated
        queryClient.invalidateQueries({
          queryKey: ["barang-keluar-detail", validatedId],
        });

        // revalidated
        queryClient.invalidateQueries({
          queryKey: ["notifikasi-global"],
        });

        // revalidated
        queryClient.invalidateQueries({
          queryKey: ["notifikasi-produk"],
        });
      },
      onError: (err) => {
        if (axios.isAxiosError<ErrorResponse>(err)) {
          if (
            err?.response?.data?.meta?.customField?.includes(
              "empty_barang_keluar",
            )
          ) {
            handleSetAlert("empty_barang_keluar");
          }
        }
      },
    });

  // handle posting
  const handlePosting = async (id?: number) => {
    try {
      if (
        dataBarangKeluarDetail?.data?.status === STATUS_INVENTORI_TYPE.POSTED ||
        !id
      )
        return;

      if (dataBarangKeluarDetail?.data?.detailBarangKeluars.length === 0) {
        handleSetAlert("empty_barang_keluar");
        return;
      }

      // confirm
      const isConfirm = await confirm({
        bigTitle: "Apakah Anda yakin ingin memposting data barang keluar?",
        smallTitle:
          "Pastikan seluruh data barang keluar telah sesuai. Setelah diposting, stok barang akan diperbarui dan transaksi akan tercatat dalam sistem.",
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

      // revalidated
      queryClient.invalidateQueries({
        queryKey: ["barang-keluar-detail", validatedId],
      });

      // revalidated
      queryClient.invalidateQueries({
        queryKey: ["notifikasi-global"],
      });

      // revalidated
      queryClient.invalidateQueries({
        queryKey: ["notifikasi-produk"],
      });
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
      PengajuanBarangKeluarServices.cancelVerifikasi({ barangKeluarId: id }),

    onSuccess: () => {
      // handle toast
      handleSetToast("canceled_verifikasi");

      // invalidated
      queryClient.invalidateQueries({
        queryKey: ["barang-keluar-detail", validatedId],
      });
      queryClient.invalidateQueries({
        queryKey: ["notifikasi-global"],
      });
      queryClient.invalidateQueries({
        queryKey: ["notifikasi-produk"],
      });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // is expired
  const isExpired =
    dataBarangKeluarDetail?.data &&
    dataBarangKeluarDetail?.data?.postedAt &&
    Date.now() - new Date(dataBarangKeluarDetail?.data?.postedAt).getTime() >
      BATAS_WAKTU_BATALKAN_POSTING_MS;

  // handle posting
  const handleCancelPosting = async (id: number) => {
    try {
      if (
        dataBarangKeluarDetail?.data?.status === STATUS_INVENTORI_TYPE.DRAFT ||
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
          "Apakah Anda yakin ingin membatalkan posting data barang keluar?",
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
        dataBarangKeluarDetail?.data?.status === STATUS_INVENTORI_TYPE.DRAFT ||
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
          "Apakah Anda yakin ingin membatalkan verifikasi pengajuan barang keluar?",
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
    dataBarangKeluarDetail?.data?.status === STATUS_INVENTORI_TYPE.POSTED;
  const isStatusDraft =
    dataBarangKeluarDetail?.data?.status === STATUS_INVENTORI_TYPE.DRAFT;

  const isStatusRejected =
    dataBarangKeluarDetail?.data?.status === STATUS_INVENTORI_TYPE.REJECTED;

  const canShowFormTambahBarang =
    (!fromPengajuanBarang && pengguna?.role === ROLE_INTERNAL_TYPE.OWNER) ||
    (fromPengajuanBarang && pengguna?.role === ROLE_INTERNAL_TYPE.KASIR);

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
    mutateAsync: mutateVerifikasiPengajuanBarang,
    isPending: isPendingVerifikasiPengajuanBarang,
  } = useMutation({
    mutationFn: (data: {
      barangKeluarId: number;
      keterangan?: string;
      status: Exclude<StatusInventoriType, "DRAFT" | "PENDING">;
    }) => PengajuanBarangKeluarServices.verifikasi(data),
    onSuccess: () => {
      // revalidated
      queryClient.invalidateQueries({
        queryKey: ["barang-keluar-detail", validatedId],
      });

      // set toast
      handleSetToast("approved_pengajuan");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // handle setuju
  const handleSetuju = async () => {
    try {
      // check validated id
      if (!validatedId || !fromPengajuanBarang) return;

      // confirm
      const isConfirm = await confirm({
        bigTitle: "Apakah Anda yakin ingin menyetujui pengajuan barang keluar?",
        smallTitle:
          "Pastikan seluruh data barang keluar telah sesuai. Setelah disetujui, data akan diposting dan stok barang akan diperbarui",
      });

      if (!isConfirm) {
        return;
      }

      await mutateVerifikasiPengajuanBarang({
        barangKeluarId: validatedId,
        status: STATUS_INVENTORI_TYPE.POSTED,
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
    return navigate(
      currentPathname
        .split("/")
        .slice(0, pengguna?.role === ROLE_INTERNAL_TYPE.OWNER ? -2 : -1)
        .join("/"),
    );
  };

  return {
    dataBarangKeluarDetail,
    isLoadingBarangKeluarDetail,
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
    isPendingVerifikasiPengajuanBarang,

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
  };
};

export default useBarangKeluarDetail;
