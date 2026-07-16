import { useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BarangMasukServices } from "../../../services/barangMasuk.service";
import { useAlertAnimation } from "../../../hooks/useAlert";
import { useToastAnimation } from "../../../hooks/useToast";
import axios from "axios";
import type { ErrorResponse } from "../../../types/response.type";
import useConfirm from "../../../hooks/useConfirm";
import {
  ROLE_INTERNAL_TYPE,
  STATUS_INVENTORI_TYPE,
  type StatusInventoriType,
} from "../../../types/constant.type";

import useDeleteBarangMasuk from "../../../hooks/useDeleteBarangMasuk";
import { useAuthStore } from "../../../stores/authStore";
import { PengajuanBarangMasukServices } from "../../../services/pengajuanBarangMasuk.service";
import useModal from "../../../hooks/useModal";

const useBarangMasukDetail = (params: { fromPengajuanBarang?: boolean }) => {
  const { fromPengajuanBarang } = params;

  const pengguna = useAuthStore((state) => state.pengguna);
  // query client
  const queryClient = useQueryClient();

  // navigate
  const navigate = useNavigate();

  // show modal konfirmasi posting
  const {
    modalRef: modalKonfirmasiPostingRef,
    confirm,
    handleConfirm: handleConfirmPosting,
    handleCancel: handleCancelConfirmPosting,
    data: dataConfirm,
  } = useConfirm<{ bigTitle: string; smallTitle: string }>();

  // handle show modal ajukan
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
    if (dataBarangMasukDetail?.data?.detailBarangMasuks.length === 0) {
      handleSetAlert("empty_barang_masuk");
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
  const { data: dataBarangMasukDetail, isLoading: isLoadingBarangMasukDetail } =
    useQuery({
      queryKey: ["barang-masuk-detail", validatedId],
      queryFn: () => BarangMasukServices.detail({ id: validatedId! }),
      enabled: !!validatedId,
      retry: false,
      refetchOnWindowFocus: false,
    });

  // mutate posting
  const { mutateAsync: mutatePosting, isPending: isPendingPosting } =
    useMutation({
      mutationFn: (id: number) => BarangMasukServices.posted(id),
      onSuccess: () => {
        // handle toast
        handleSetToast("posted");

        // revalidated
        queryClient.invalidateQueries({
          queryKey: ["barang-masuk-detail", validatedId],
        });
        queryClient.invalidateQueries({
          queryKey: ["notifikasi-global"],
        });
        queryClient.invalidateQueries({
          queryKey: ["notifikasi-produk"],
        });
      },
      onError: (err) => {
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

  // handle posting
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

      // confirm
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

  // mutate cancel posting
  const {
    mutateAsync: mutateCancelPosting,
    isPending: isPendingCancelPosting,
  } = useMutation({
    mutationFn: (id: number) => BarangMasukServices.cancelPosted(id),

    onSuccess: () => {
      // handle toast
      handleSetToast("cancel_posted");

      // invalidated
      queryClient.invalidateQueries({
        queryKey: ["barang-masuk-detail", validatedId],
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

  // cancel verifikasi
  const {
    mutateAsync: mutateCancelVerifikasi,
    isPending: isPendingCancelVerifikasi,
  } = useMutation({
    mutationFn: (id: number) =>
      PengajuanBarangMasukServices.cancelVerifikasi({ barangMasukId: id }),

    onSuccess: () => {
      // handle toast
      handleSetToast("canceled_verifikasi");

      // invalidated
      queryClient.invalidateQueries({
        queryKey: ["barang-masuk-detail", validatedId],
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
    dataBarangMasukDetail?.data &&
    dataBarangMasukDetail?.data?.postedAt &&
    Date.now() - new Date(dataBarangMasukDetail.data.postedAt).getTime() >
      2 * 60 * 1000; // 2 minutes

  // handle posting
  const handleCancelPosting = async (id?: number) => {
    try {
      if (
        dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.DRAFT ||
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

  // handle verifikasi
  const handleCancelVerifikasi = async (id?: number) => {
    try {
      if (
        dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.DRAFT ||
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

  // use delete barang masuk
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

  // mutation
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
      // revalidated
      queryClient.invalidateQueries({
        queryKey: ["barang-masuk-detail", validatedId],
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

  const isStatusPosted =
    dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.POSTED;
  const isStatusDraft =
    dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.DRAFT;
  const isStatusRejected =
    dataBarangMasukDetail?.data?.status === STATUS_INVENTORI_TYPE.REJECTED;

  const canShowFormTambahBarang =
    (!fromPengajuanBarang && pengguna?.role === ROLE_INTERNAL_TYPE.OWNER) ||
    (fromPengajuanBarang && pengguna?.role === ROLE_INTERNAL_TYPE.KASIR);

  const isCanUpdate =
    isStatusDraft ||
    (isStatusRejected && pengguna?.role === ROLE_INTERNAL_TYPE.KASIR);
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
  };
};

export default useBarangMasukDetail;
