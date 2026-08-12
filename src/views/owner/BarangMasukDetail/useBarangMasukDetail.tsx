import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BarangMasukServices } from "../../../services/barangMasuk.service";
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

import useDeleteBarangMasuk from "../../../hooks/useDeleteBarangMasuk";
import { useAuthStore } from "../../../stores/authStore";
import { PengajuanBarangMasukServices } from "../../../services/pengajuanBarangMasuk.service";
import useModal from "../../../hooks/useModal";
import useDownloadInvoiceBarangMasuk from "../../../hooks/useDownloadInvoiceBarangMasuk";

// Batas waktu (ms) setelah posting sebelum dianggap expired dan tidak bisa dibatalkan

const useBarangMasukDetail = (params: { fromPengajuanBarang?: boolean }) => {
  const { fromPengajuanBarang } = params;

  // Ambil dan validasi id barang masuk dari URL params
  const { id } = useParams<{ id: string }>();
  const validatedId = parseId(id);

  const pengguna = useAuthStore((state) => state.pengguna);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  // currentpathname
  const currentPathname = useLocation().pathname;

  // Invalidate seluruh query terkait detail barang masuk & notifikasi setelah suatu aksi berhasil
  const invalidateBarangMasukQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["barang-masuk-detail", validatedId],
    });

    queryClient.invalidateQueries({
      queryKey: ["notifikasi-global"],
    });

    queryClient.invalidateQueries({
      queryKey: ["notifikasi-produk"],
    });

    // invalidated riwayat
    queryClient.invalidateQueries({
      queryKey: ["riwayat-pengajuan-barang-keluar", validatedId],
    });
  };

  // Modal konfirmasi untuk aksi posting/cancel posting/cancel verifikasi/setuju
  const {
    modalRef: modalKonfirmasiPostingRef,
    confirm,
    handleConfirm: handleConfirmPosting,
    handleCancel: handleCancelConfirmPosting,
    data: dataConfirm,
  } = useConfirm<{ bigTitle: string; smallTitle: string }>();

  // Modal formulir verifikasi (setuju/tolak) pengajuan barang masuk
  const {
    modalRef: modalFormulirVerifikasiOrPengajuan,
    handleShowModal: showModalFormulirVerifikasiOrPengajuan,
    handleCloseModal: handleCloseModalFormulirVerifikasiOrPengajuan,
    idModal: idModalFormulirVerifikasiOrPengajuan,
    dataModal: dataModalFormulirVerifikasiOrPengajuan,
  } = useModal<{ type: "pengajuan" | "tolak" }>();

  // Buka modal formulir verifikasi/pengajuan, tolak jika daftar barang masuk masih kosong
  const handleShowModalFormulirVerifikasiOrPengajuan = (
    id?: number | undefined,
    data?:
      | {
          type: "pengajuan" | "tolak";
        }
      | undefined,
  ) => {
    if (dataBarangMasukDetail?.data?.detailBarangMasuks.length === 0) {
      handleSetAlert("empty_barang_masuk");
      return;
    }

    showModalFormulirVerifikasiOrPengajuan(id, data);
  };

  // Alert animasi (misal: barang masuk kosong, expired)
  const { alert, handleSetAlert } = useAlertAnimation();

  // Toast notifikasi hasil aksi (posting, cancel, verifikasi, dsb)
  const { toast, handleSetToast } = useToastAnimation();

  // Ambil detail data barang masuk dari server
  const { data: dataBarangMasukDetail, isLoading: isLoadingBarangMasukDetail } =
    useQuery({
      queryKey: ["barang-masuk-detail", validatedId],
      queryFn: () => BarangMasukServices.detail({ id: validatedId! }),
      enabled: !!validatedId,
      retry: false,
      refetchOnWindowFocus: false,
    });

  // Mutation untuk memposting barang masuk (stok diperbarui)
  const { mutateAsync: mutatePosting, isPending: isPendingPosting } =
    useMutation({
      mutationFn: (id: number) => BarangMasukServices.posted(id),
      onSuccess: () => {
        handleSetToast("posted");
        invalidateBarangMasukQueries();
      },
      onError: (err) => {
        // Tampilkan alert khusus jika gagal karena daftar barang masuk kosong
        if (axios.isAxiosError<ErrorResponse>(err)) {
          if (
            err?.response?.data?.meta?.customField?.includes(
              "empty_barang_masuk",
            )
          ) {
            handleSetAlert("empty_barang_masuk");
          }
        }
      },
    });

  // Proses posting barang masuk: validasi status & data, konfirmasi, lalu kirim ke server
  const handlePosting = async (id?: number) => {
    try {
      if (
        dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.POSTED ||
        !id
      )
        return;

      if (dataBarangMasukDetail?.data?.detailBarangMasuks.length === 0) {
        handleSetAlert("empty_barang_masuk");
        return;
      }

      const isConfirm = await confirm({
        bigTitle: "Apakah Anda yakin ingin memposting data barang masuk?",
        smallTitle:
          "Pastikan seluruh data barang masuk telah sesuai. Setelah diposting, stok barang akan diperbarui dan transaksi akan tercatat dalam sistem.",
      });

      if (!isConfirm) {
        return;
      }

      await mutatePosting(id);
    } catch (error) {
      console.log(error);
    }
  };

  // Mutation untuk membatalkan posting barang masuk (stok dikembalikan)
  const {
    mutateAsync: mutateCancelPosting,
    isPending: isPendingCancelPosting,
  } = useMutation({
    mutationFn: (id: number) => BarangMasukServices.cancelPosted(id),

    onSuccess: () => {
      handleSetToast("cancel_posted");
      invalidateBarangMasukQueries();
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
      PengajuanBarangMasukServices.cancelVerifikasi({ barangMasukId: id }),

    onSuccess: () => {
      handleSetToast("canceled_verifikasi");
      invalidateBarangMasukQueries();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // Apakah batas waktu untuk membatalkan posting sudah lewat
  const isExpired =
    dataBarangMasukDetail?.data &&
    dataBarangMasukDetail?.data?.postedAt &&
    Date.now() - new Date(dataBarangMasukDetail.data.postedAt).getTime() >
      BATAS_WAKTU_BATALKAN_POSTING_MS;

  // Proses batalkan posting: validasi status, cek expired, konfirmasi, lalu kirim ke server
  const handleCancelPosting = async (id?: number) => {
    try {
      if (
        dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.DRAFT ||
        !id
      )
        return;

      if (isExpired) {
        handleSetAlert("expired");
        return;
      }

      const isConfirm = await confirm({
        bigTitle:
          "Apakah Anda yakin ingin membatalkan posting data barang masuk?",
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
        dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.DRAFT ||
        !id
      )
        return;

      if (isExpired) {
        handleSetAlert("expired");
        return;
      }

      const isConfirm = await confirm({
        bigTitle:
          "Apakah Anda yakin ingin membatalkan verifikasi pengajuan barang masuk?",
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

  // Hapus barang masuk (mutation & redirect dikelola oleh useDeleteBarangMasuk)
  const {
    dataDelete,
    handleCloseModalDelete,
    handleDelete,
    handleShowModalDelete,
    isPendingDelete,
    modalDeleteRef,
  } = useDeleteBarangMasuk({
    redirect: () => {
      navigate(
        fromPengajuanBarang
          ? "/dashboard/pengajuan-barang-masuk"
          : "/dashboard/inventori",
        {
          state: {
            toast: "deleted_barang_masuk",
          },
        },
      );
    },
  });

  // Mutation untuk verifikasi (setuju/tolak) pengajuan barang masuk
  const {
    mutateAsync: mutateVerifikasiPengajuanBarang,
    isPending: isPendingVerifikasiPengajuanBarang,
  } = useMutation({
    mutationFn: (data: {
      barangMasukId: number;
      keterangan?: string;
      status: Exclude<StatusInventoriType, "DRAFT" | "PENDING">;
    }) => PengajuanBarangMasukServices.verifikasi(data),
    onSuccess: () => {
      handleSetToast("approved_pengajuan");

      invalidateBarangMasukQueries();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // Proses setuju pengajuan barang masuk: konfirmasi, lalu verifikasi dengan status POSTED
  const handleSetuju = async () => {
    try {
      if (!validatedId || !fromPengajuanBarang) return;

      const isConfirm = await confirm({
        bigTitle: "Apakah Anda yakin ingin menyetujui pengajuan barang masuk?",
        smallTitle:
          "Pastikan seluruh data barang masuk telah sesuai. Setelah disetujui, data akan diposting dan stok barang akan diperbarui",
      });

      if (!isConfirm) {
        return;
      }

      await mutateVerifikasiPengajuanBarang({
        barangMasukId: validatedId,
        status: STATUS_INVENTORI_TYPE.POSTED,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Status barang masuk saat ini
  const isStatusPosted =
    dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.POSTED;
  const isStatusDraft =
    dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.DRAFT;
  const isStatusRejected =
    dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.REJECTED;

  // Apakah form tambah barang boleh ditampilkan, tergantung asal halaman & role pengguna
  const canShowFormTambahBarang =
    (!fromPengajuanBarang &&
      pengguna?.role === ROLE_INTERNAL_TYPE.OWNER &&
      dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.DRAFT) ||
    (fromPengajuanBarang &&
      pengguna?.role === ROLE_INTERNAL_TYPE.KASIR &&
      (dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.DRAFT ||
        dataBarangMasukDetail?.data?.status ===
          STATUS_INVENTORI_TYPE.REJECTED));

  // Apakah data barang masuk masih bisa diupdate
  const isCanUpdate =
    isStatusDraft ||
    (isStatusRejected && pengguna?.role === ROLE_INTERNAL_TYPE.KASIR);

  // Apakah posting masih bisa dibatalkan (status posted, role owner, belum expired)
  const isCanBatalkanPosting =
    isStatusPosted && pengguna?.role === ROLE_INTERNAL_TYPE.OWNER && !isExpired;

  // hadle back
  const handleBack = () => {
    return navigate(
      currentPathname
        .split("/")
        .slice(0, pengguna?.role === ROLE_INTERNAL_TYPE.OWNER ? -2 : -1)
        .join("/"),
    );
  };

  // use download invoice barang masuk
  const {
    handleDownloadInvoiceBarangMasukPdf,
    isLoadingDownloadInvoiceBarangMasukPdf,
  } = useDownloadInvoiceBarangMasuk();

  // Ekspos state & handler yang dibutuhkan oleh komponen UI detail barang masuk
  return {
    dataBarangMasukDetail,
    isLoadingBarangMasukDetail,

    alert,

    toast,

    handlePosting,
    isPendingPosting,
    handleCancelPosting,
    handleConfirmPosting,
    modalKonfirmasiPostingRef,
    handleCancelConfirmPosting,
    isPendingCancelPosting,
    isStatusDraft,
    isStatusPosted,
    isStatusRejected,
    isExpired,

    dataDelete,
    handleCloseModalDelete,
    handleDelete,
    isPendingDelete,
    handleShowModalDelete,
    modalDeleteRef,
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
    dataModalFormulirVerifikasiOrPengajuan,
    idModalFormulirVerifikasiOrPengajuan,

    canShowFormTambahBarang,
    isCanUpdate,
    isCanBatalkanPosting,

    handleBack,
    handleDownloadInvoiceBarangMasukPdf,
    isLoadingDownloadInvoiceBarangMasukPdf,
  };
};

export default useBarangMasukDetail;
