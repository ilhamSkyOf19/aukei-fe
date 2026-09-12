import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { useAuthStore } from "../../../stores/authStore";

import { parseId } from "../../../helpers/helpers";

import { useAlertAnimation } from "../../../hooks/useAlert";
import { useToastAnimation } from "../../../hooks/useToast";
import useConfirm from "../../../hooks/useConfirm";
import useModal from "../../../hooks/useModal";
import useDeleteStockOpnameDetail from "../../../hooks/useDeleteStockOpnameDetail";

import {
  BATAS_WAKTU_BATALKAN_POSTING_MS,
  ROLE_INTERNAL_TYPE,
  STATUS_STOCK_OPNAME_TYPE,
} from "../../../types/constant.type";

import { StockOpnameServices } from "../../../services/stockOpname.service";
import { PengajuanStockOpnameServices } from "../../../services/pengajuanStockOpname.service";
import type { ErrorResponse } from "../../../types/response.type";
import axios from "axios";
import { useMemo } from "react";

const useStockOpnameDetail = (params: { fromPengajuan?: boolean }) => {
  const { fromPengajuan = false } = params;

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const pengguna = useAuthStore((state) => state.pengguna);

  const { id } = useParams<{
    id: string;
  }>();

  const stockOpnameId = parseId(id);

  // ============================================================
  // ALERT & TOAST
  // ============================================================

  const { alert, handleSetAlert } = useAlertAnimation();

  const { toast, handleSetToast } = useToastAnimation();

  // ============================================================
  // CONFIRM
  // ============================================================

  const {
    confirm,
    modalRef: modalKonfirmasiRef,
    handleConfirm,
    handleCancel,
    data: dataConfirm,
  } = useConfirm<{
    bigTitle: string;
    smallTitle: string;
  }>();

  // ============================================================
  // QUERY
  // ============================================================

  const {
    data: dataStockOpnameDetail,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["stock-opname-detail", stockOpnameId],

    queryFn: () =>
      StockOpnameServices.detail({
        id: stockOpnameId!,
      }),

    enabled: !!stockOpnameId,

    retry: false,

    refetchOnWindowFocus: false,
  });

  // ============================================================
  // ROLE
  // ============================================================

  const isKasir = pengguna?.role === ROLE_INTERNAL_TYPE.KASIR;

  // ============================================================
  // MODE
  // ============================================================

  const isModeDetail = !fromPengajuan;

  const isModePengajuan = fromPengajuan && isKasir;

  // ============================================================
  // STATUS
  // ============================================================

  const status = dataStockOpnameDetail?.data?.status;

  const isStatusDraft = status === STATUS_STOCK_OPNAME_TYPE.DRAFT;

  const isStatusPending = status === STATUS_STOCK_OPNAME_TYPE.PENDING;

  const isStatusRejected = status === STATUS_STOCK_OPNAME_TYPE.REJECTED;

  const isStatusApproved = status === STATUS_STOCK_OPNAME_TYPE.APPROVED;

  // ============================================================
  // PERMISSION
  // ============================================================

  /**

Data stock opname hanya dapat diedit ketika:




Status DRAFT


Status REJECTED


Dan berada pada:




halaman detail


halaman pengajuan kasir
*/
  const isCanUpdate =
    (isStatusDraft || isStatusRejected) &&
    (isModeDetail || isModePengajuan) &&
    dataStockOpnameDetail?.data?.adminOpname?.id === pengguna?.id;

  /**

Kelola detail produk mengikuti permission update.
*/
  const isCanManageDetail = isCanUpdate;

  /**

Kasir hanya dapat mengajukan ketika:




berada di halaman pengajuan


status DRAFT atau REJECTED
*/
  const isCanAjukan = isModePengajuan && (isStatusDraft || isStatusRejected);

  /**

Owner hanya dapat melakukan verifikasi
ketika data masih PENDING.
*/
  const isCanVerifikasi = isStatusPending || isStatusRejected;

  // ============================================================
  // INVALIDATE QUERIES
  // ============================================================

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["stock-opname-detail", stockOpnameId],
    });

    await queryClient.invalidateQueries({
      queryKey: ["stock-opname"],
    });

    await queryClient.invalidateQueries({
      queryKey: ["notifikasi-global"],
    });

    await queryClient.invalidateQueries({
      queryKey: ["riwayat-pengajuan-stock-opname", stockOpnameId],
    });
  };

  // ============================================================
  // MODAL PENGAJUAN / PENOLAKAN
  // ============================================================

  const {
    modalRef: modalFormulirRef,

    handleShowModal: showModalFormulir,

    handleCloseModal: handleCloseModalFormulir,

    idModal: idModalFormulir,

    dataModal: dataModalFormulir,
  } = useModal<{
    type: "pengajuan" | "tolak";
  }>();

  /**

Membuka modal formulir untuk:




pengajuan stock opname oleh kasir


penolakan stock opname oleh owner
*/
  const handleShowModalFormulir = (
    id?: number,
    type?: "pengajuan" | "tolak",
  ) => {
    if (!id || !type) {
      return;
    }
    /**
     * Validasi pengajuan.
     *
     * Stock opname tidak boleh diajukan
     * apabila belum memiliki produk.
     */
    if (
      type === "pengajuan" &&
      dataStockOpnameDetail?.data?.details.length === 0
    ) {
      handleSetAlert("empty_produk");

      return;
    }

    showModalFormulir(id, {
      type,
    });
  };

  /**

Helper khusus pengajuan.
*/
  const handleAjukan = () => {
    if (!stockOpnameId || !isCanAjukan) {
      return;
    }
    handleShowModalFormulir(stockOpnameId, "pengajuan");
  };

  /**

Helper khusus penolakan.
*/
  const handleTolak = () => {
    console.log(stockOpnameId, isCanVerifikasi);
    if (!stockOpnameId || !isCanVerifikasi) {
      return;
    }
    handleShowModalFormulir(stockOpnameId, "tolak");
  };

  // ============================================================
  // DELETE DETAIL
  // ============================================================

  const deleteDetail = useDeleteStockOpnameDetail({
    stockOpnameId: stockOpnameId!,

    status,

    handleSetToast,
  });

  // ============================================================
  // APPROVE
  // ============================================================

  const {
    mutateAsync: mutateSetuju,

    isPending: isPendingSetuju,
  } = useMutation({
    mutationFn: () =>
      PengajuanStockOpnameServices.verifikasi({
        stockOpnameId: stockOpnameId!,

        status: STATUS_STOCK_OPNAME_TYPE.APPROVED,
      }),

    onSuccess: async () => {
      handleSetToast("approved_pengajuan");

      await invalidateQueries();
    },
  });

  const handleSetuju = async () => {
    if (!stockOpnameId || !isCanVerifikasi) {
      return;
    }

    const isConfirm = await confirm({
      bigTitle: "Apakah Anda yakin ingin menyetujui pengajuan stock opname?",

      smallTitle:
        "Setelah disetujui, stok produk akan disesuaikan berdasarkan hasil stock opname.",
    });

    if (!isConfirm) {
      return;
    }

    await mutateSetuju();
  };

  // ============================================================
  // DELETE STOCK OPNAME
  // ============================================================

  const isExpired =
    dataStockOpnameDetail?.data &&
    dataStockOpnameDetail?.data?.verifiedAt &&
    Date.now() - new Date(dataStockOpnameDetail.data.verifiedAt).getTime() >
      BATAS_WAKTU_BATALKAN_POSTING_MS;

  const {
    modalRef: modalDeleteStockOpnameRef,

    handleShowModal: handleShowModalDeleteStockOpname,

    handleCloseModal: handleCloseModalDeleteStockOpname,

    idModal: idDeleteStockOpname,

    dataModal: dataDeleteStockOpname,
  } = useModal<{
    kodeReferensi?: string;
  }>();

  const {
    mutateAsync: mutateDeleteStockOpname,

    isPending: isPendingDeleteStockOpname,
  } = useMutation({
    mutationFn: (id: number) => StockOpnameServices.delete(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["stock-opname"],
      });

      navigate("/dashboard/stok-opname?cluster=stockOpname", {
        state: {
          toast: "deleted_stock_opname",
        },
      });
    },
  });

  const handleDeleteStockOpname = async () => {
    if (!idDeleteStockOpname) {
      return;
    }

    await mutateDeleteStockOpname(idDeleteStockOpname);
  };

  // ============================================================
  // BACK
  // ============================================================

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
        if (axios.isAxiosError<ErrorResponse>(err)) {
          if (
            err?.response?.data?.meta?.customField?.includes(
              "empty_stock_opname",
            )
          ) {
            handleSetAlert("empty_stock_opname");
          }

          if (
            err?.response?.data?.meta?.customField?.includes("stok_not_enough")
          ) {
            handleSetAlert("stok_not_enough");
          }
        }
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
        handleSetAlert("empty_stock_opname");
        return;
      }

      // confirm
      const isConfirm = await confirm({
        bigTitle: "Apakah Anda yakin ingin memposting data stok opname?",
        smallTitle:
          "Pastikan seluruh data stok opname telah sesuai. Setelah diposting, stok barang akan diperbarui dan transaksi akan tercatat dalam sistem.",
      });

      if (!isConfirm) {
        return;
      }

      await mutatePosting(id);
    } catch (error) {
      console.log(error);
    }
  };

  // Invalidate seluruh query terkait detail barang masuk & notifikasi setelah suatu aksi berhasil
  const invalidateStockOpnameQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["stock-opname-detail", stockOpnameId],
    });

    queryClient.invalidateQueries({
      queryKey: ["notifikasi-global"],
    });

    queryClient.invalidateQueries({
      queryKey: ["notifikasi-produk"],
    });

    // invalidated riwayat
    queryClient.invalidateQueries({
      queryKey: ["riwayat-stock-opname", stockOpnameId],
    });
  };

  // Mutation untuk membatalkan posting barang masuk (stok dikembalikan)
  const {
    mutateAsync: mutateCancelPosting,
    isPending: isPendingCancelPosting,
  } = useMutation({
    mutationFn: (id: number) => StockOpnameServices.cancelPosted(id),

    onSuccess: () => {
      handleSetToast("cancel_posted");
      invalidateStockOpnameQueries();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // Mutation untuk membatalkan verifikasi pengajuan barang masuk
  const {
    mutateAsync: mutateCancelVerifikasi,
    isPending: isPendingCancelVerifikasi,
  } = useMutation({
    mutationFn: (id: number) =>
      PengajuanStockOpnameServices.cancelVerifikasi({ stockOpnameId: id }),

    onSuccess: () => {
      handleSetToast("canceled_verifikasi");
      invalidateStockOpnameQueries();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // Proses batalkan posting: validasi status, cek expired, konfirmasi, lalu kirim ke server
  const handleCancelPosting = async (id?: number) => {
    try {
      if (
        dataStockOpnameDetail?.data?.status ===
          STATUS_STOCK_OPNAME_TYPE.DRAFT ||
        !id
      )
        return;

      if (isExpired) {
        handleSetAlert("expired");
        return;
      }

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

  // Proses batalkan verifikasi pengajuan: validasi status, cek expired, konfirmasi, lalu kirim ke server
  const handleCancelVerifikasi = async (id?: number) => {
    try {
      if (
        dataStockOpnameDetail?.data?.status ===
          STATUS_STOCK_OPNAME_TYPE.DRAFT ||
        !id
      )
        return;

      if (isExpired) {
        handleSetAlert("expired");
        return;
      }

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

  const stockOpname = dataStockOpnameDetail?.data;

  const informasiStockOpnameDetail = useMemo(() => {
    const status = stockOpname?.status;

    const tanggalDiajukan =
      status === STATUS_STOCK_OPNAME_TYPE.PENDING ||
      status === STATUS_STOCK_OPNAME_TYPE.REJECTED ||
      status === STATUS_STOCK_OPNAME_TYPE.APPROVED
        ? stockOpname?.riwayat?.[1]?.createdAt
        : stockOpname?.riwayat?.[0]?.createdAt;

    const totalProduk = stockOpname?.details?.length ?? 0;

    const totalItem =
      stockOpname?.details?.reduce(
        (total, detail) => total + (detail.stokFisik ?? 0),
        0,
      ) ?? 0;

    return {
      author: stockOpname?.adminOpname,
      tanggalDiajukan,
      isUpdate: isCanManageDetail,
      totalProduk,
      totalItem,
      idStockOpnameDetail: stockOpname?.id,
      isLoadingStocOpnameDetail: isLoading,
      keterangan: stockOpname?.keterangan ?? "",
      status,
      tanggal: stockOpname?.tanggalOpname,
    };
  }, [stockOpname, isCanManageDetail, isLoading]);

  return {
    // ============================================================
    // DATA
    // ============================================================

    isLoadingStockOpnameDetail: isLoading || isFetching,

    pengguna,

    // ============================================================
    // MODE
    // ============================================================

    // ============================================================
    // STATUS
    // ============================================================

    isStatusDraft,

    isStatusPending,

    isStatusRejected,

    isStatusApproved,

    // ============================================================
    // PERMISSION
    // ============================================================

    isCanManageDetail,

    isCanAjukan,

    isCanVerifikasi,

    // ============================================================
    // ALERT
    // ============================================================

    alert,

    handleSetAlert,

    // ============================================================
    // TOAST
    // ============================================================

    toast,

    handleSetToast,

    // ============================================================
    // CONFIRM
    // ============================================================

    modalKonfirmasiRef,

    handleConfirm,

    handleCancel,

    dataConfirm,

    // ============================================================
    // PENGAJUAN / PENOLAKAN
    // ============================================================

    modalFormulirRef,

    handleCloseModalFormulir,

    idModalFormulir,

    dataModalFormulir,

    handleAjukan,

    handleTolak,

    // ============================================================
    // VERIFIKASI SETUJU
    // ============================================================

    handleSetuju,

    isPendingSetuju,

    // ============================================================
    // DELETE DETAIL
    // ============================================================

    ...deleteDetail,

    // ============================================================
    // OTHER
    // ============================================================

    handlePosting,
    isPendingPosting,

    isExpired,

    modalDeleteStockOpnameRef,

    handleShowModalDeleteStockOpname,

    handleCloseModalDeleteStockOpname,

    dataDeleteStockOpname,

    isPendingDeleteStockOpname,

    handleDeleteStockOpname,

    handleCancelPosting,

    handleCancelVerifikasi,

    isPendingCancelVerifikasi,

    isPendingCancelPosting,

    stockOpname,

    informasiStockOpnameDetail,
  };
};

export default useStockOpnameDetail;
