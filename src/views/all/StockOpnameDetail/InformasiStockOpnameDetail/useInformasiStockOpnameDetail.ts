import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useController, useForm } from "react-hook-form";
import type { UpdateBarangMasukForRequestType } from "../../../../models/barangMasuk.model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useModal from "../../../../hooks/useModal";
import {
  BATAS_WAKTU_BATALKAN_POSTING_MS,
  ROLE_INTERNAL_TYPE,
  STATUS_STOCK_OPNAME_TYPE,
  type StatusStockOpnameType,
} from "../../../../types/constant.type";
import type { UpdateStockOpnameForRequestType } from "../../../../models/stockOpname.model";
import { StockOpnameValidation } from "../../../../validations/stockOpname.validation";
import { StockOpnameServices } from "../../../../services/stockOpname.service";
import type { PayloadPenggunaInternalType } from "../../../../models/penggunaInternal.model";
import { PengajuanStockOpnameServices } from "../../../../services/pengajuanStockOpname.service";
import useConfirm from "../../../../hooks/useConfirm";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import type { ErrorResponse } from "../../../../types/response.type";

interface DataType {
  status: StatusStockOpnameType;
  isCanUpdate: boolean;
  produkIdChoose: number[];
}

const useInformasiStockOpnameDetail = (params: {
  idStockOpnameDetail?: number | null;
  handleSetToast: (data: string) => void;
  handleSetData: Dispatch<SetStateAction<DataType | null>>;
  refreshDaftarProdukStockOpname: () => Promise<void>;
  pengguna: PayloadPenggunaInternalType | null;
  fromPengajuan?: boolean;
  handleSetAlert: (value: string) => void;
}) => {
  const {
    idStockOpnameDetail,
    handleSetToast,
    handleSetData,
    refreshDaftarProdukStockOpname,
    pengguna,
    fromPengajuan,
    handleSetAlert,
  } = params;
  // state key update
  const [keyUpdate, setKeyUpdate] = useState<"tanggal" | "keterangan" | "">("");

  const navigate = useNavigate();

  const currentPathname = useLocation().pathname;

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

  const {
    data: dataStockOpnameDetail,
    isLoading: isLoadingStockOpnameDetail,
    isFetching: isFetchingStockOpnameDetail,
    refetch: refetchStockOpnameDetail,
  } = useQuery({
    queryKey: ["stock-opname-detail", idStockOpnameDetail],

    queryFn: () =>
      StockOpnameServices.detail({
        id: idStockOpnameDetail!,
      }),

    enabled: !!idStockOpnameDetail,

    retry: false,

    refetchOnWindowFocus: false,
  });

  const handleRefresh = async () => {
    Promise.allSettled([
      refreshDaftarProdukStockOpname(),
      refetchStockOpnameDetail({
        throwOnError: true,
      }),
    ]);
  };

  const status = dataStockOpnameDetail?.data?.status;

  const tanggalDiajukan =
    status === STATUS_STOCK_OPNAME_TYPE.PENDING ||
    status === STATUS_STOCK_OPNAME_TYPE.REJECTED ||
    status === STATUS_STOCK_OPNAME_TYPE.APPROVED
      ? dataStockOpnameDetail?.data?.riwayat?.[1]?.createdAt
      : dataStockOpnameDetail?.data?.riwayat?.[0]?.createdAt;

  //   query client
  const queryClient = useQueryClient();

  // use form upadate
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    control,
  } = useForm<UpdateStockOpnameForRequestType>({
    resolver: zodResolver(StockOpnameValidation.UPDATE),
  });

  //   use controll tanggal masuk
  const tanggalOpnameController = useController({
    name: "tanggalOpname",
    control,
  });

  useEffect(() => {
    if (!keyUpdate || !dataStockOpnameDetail?.data?.keterangan) return;

    switch (keyUpdate) {
      case "keterangan":
        reset({
          keterangan: dataStockOpnameDetail.data.keterangan,
        });
        break;
    }
  }, [keyUpdate, setValue, dataStockOpnameDetail?.data?.keterangan]);

  const {
    modalRef: modalDeleteStockOpnameRef,

    handleShowModal: handleShowModalDeleteStockOpname,

    handleCloseModal: handleCloseModalDeleteStockOpname,

    idModal: idDeleteStockOpname,

    dataModal: dataDeleteStockOpname,
  } = useModal<{
    kodeReferensi?: string;
  }>();

  //   use modal input tanggal opname
  const {
    modalRef: modalInputTanggalOpnameRef,
    handleShowModal: showModalInputTanggalOpname,
    handleCloseModal: closeModalInputTanggalOpname,
  } = useModal();

  //   handle show modal input tanggal opname
  const handleShowModalInputTanggalOpname = () => {
    if (!dataStockOpnameDetail?.data?.tanggalOpname) return;

    reset({
      tanggalOpname: new Date(
        dataStockOpnameDetail?.data?.tanggalOpname,
      ).toISOString(),
    });
    showModalInputTanggalOpname();
  };

  //   handle close modal input tanggal opname
  const handleCloseModalInputTanggalOpname = () => {
    reset(undefined);
    closeModalInputTanggalOpname();
  };

  // handle reset form
  const handleResetForm = () => {
    reset(undefined);
    setKeyUpdate("");
  };

  //   mutate

  const { mutateAsync: mutateUpdate, isPending: isPendingUpdate } = useMutation(
    {
      mutationFn: (data: UpdateStockOpnameForRequestType) =>
        StockOpnameServices.update({
          id: idStockOpnameDetail!,
          req: data,
        }),
      onSuccess: () => {
        if (keyUpdate === "keterangan") {
          // handle toast
          handleSetToast("updated_keterangan");
        }

        if (keyUpdate === "tanggal") {
          // handle toast
          handleSetToast("updated_tanggal");
        }

        // refetch
        queryClient.refetchQueries({
          queryKey: ["stock-opname-detail", idStockOpnameDetail],
        });

        // close modal
        closeModalInputTanggalOpname();

        if (keyUpdate === "tanggal") {
          // reset timer
          setTimeout(() => {
            handleResetForm();
          }, 500);
        } else {
          handleResetForm();
        }
      },
      onError: (err) => {
        console.log(err);
      },
    },
  );

  const onSubmit = async (data: UpdateBarangMasukForRequestType) => {
    try {
      if (status === STATUS_STOCK_OPNAME_TYPE.APPROVED) return;

      await mutateUpdate(data);
    } catch (error) {
      console.log(error);
    }
  };

  //   handle key update
  const handleKeyUpdate = (key: "tanggal" | "keterangan") => {
    setKeyUpdate(key);

    //   show modal
    if (key === "tanggal") {
      handleShowModalInputTanggalOpname();
    }
  };

  const isKasir = pengguna?.role === ROLE_INTERNAL_TYPE.KASIR;

  const isModeDetail = !fromPengajuan;

  const isModePengajuan = fromPengajuan && isKasir;

  const isStatusDraft = status === STATUS_STOCK_OPNAME_TYPE.DRAFT;

  const isStatusPending = status === STATUS_STOCK_OPNAME_TYPE.PENDING;

  const isStatusRejected = status === STATUS_STOCK_OPNAME_TYPE.REJECTED;

  const isStatusApproved = status === STATUS_STOCK_OPNAME_TYPE.APPROVED;

  const isCanUpdate =
    (isStatusDraft || isStatusRejected) &&
    (isModeDetail || isModePengajuan) &&
    dataStockOpnameDetail?.data?.adminOpname?.id === pengguna?.id;

  const isCanManageDetail = isCanUpdate;

  const isCanAjukan = isModePengajuan && (isStatusDraft || isStatusRejected);

  const isCanVerifikasi = isStatusPending || isStatusRejected;

  const isExpired =
    dataStockOpnameDetail?.data &&
    dataStockOpnameDetail?.data?.verifiedAt &&
    Date.now() - new Date(dataStockOpnameDetail.data.verifiedAt).getTime() >
      BATAS_WAKTU_BATALKAN_POSTING_MS;

  const {
    modalRef: modalFormulirRef,

    handleShowModal: showModalFormulir,

    handleCloseModal: handleCloseModalFormulir,

    idModal: idModalFormulir,

    dataModal: dataModalFormulir,
  } = useModal<{
    type: "pengajuan" | "tolak";
  }>();

  const handleShowModalFormulir = (
    id?: number,
    type?: "pengajuan" | "tolak",
  ) => {
    if (!id || !type) {
      return;
    }

    if (
      type === "pengajuan" &&
      dataStockOpnameDetail?.data?.totalProduk === 0
    ) {
      handleSetAlert("empty_produk");

      return;
    }

    showModalFormulir(id, {
      type,
    });
  };

  const handleTolak = () => {
    console.log(idStockOpnameDetail, isCanVerifikasi);
    if (!idStockOpnameDetail || !isCanVerifikasi) {
      return;
    }
    handleShowModalFormulir(idStockOpnameDetail, "tolak");
  };

  const invalidateQueries = async () => {
    Promise.allSettled([
      queryClient.invalidateQueries({
        queryKey: ["stock-opname-detail", idStockOpnameDetail],
      }),

      queryClient.invalidateQueries({
        queryKey: ["daftar-produk-stock-opname", idStockOpnameDetail],
      }),

      queryClient.invalidateQueries({
        queryKey: ["stock-opname"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["notifikasi-global"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["riwayat-pengajuan-stock-opname", idStockOpnameDetail],
      }),
    ]);
  };

  const invalidateStockOpnameQueries = () => {
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["stock-opname-detail", idStockOpnameDetail],
      }),

      queryClient.invalidateQueries({
        queryKey: ["daftar-produk-stock-opname", idStockOpnameDetail],
      }),

      queryClient.invalidateQueries({
        queryKey: ["notifikasi-global"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["notifikasi-produk"],
      }),

      // invalidated riwayat
      queryClient.invalidateQueries({
        queryKey: ["riwayat-stock-opname", idStockOpnameDetail],
      }),
    ]);
  };

  const {
    mutateAsync: mutateSetuju,

    isPending: isPendingSetuju,
  } = useMutation({
    mutationFn: (data: { stokOpnameId: number }) =>
      PengajuanStockOpnameServices.verifikasi({
        stockOpnameId: data.stokOpnameId,

        status: STATUS_STOCK_OPNAME_TYPE.APPROVED,
      }),

    onSuccess: async () => {
      handleSetToast("approved_pengajuan");

      await invalidateQueries();
    },
  });

  const handleSetuju = async () => {
    if (!idStockOpnameDetail || !isCanVerifikasi) {
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

    await mutateSetuju({ stokOpnameId: idStockOpnameDetail });
  };

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

      if (dataStockOpnameDetail?.data?.totalProduk === 0) {
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

  const handleAjukan = () => {
    if (!idStockOpnameDetail || !isCanAjukan) {
      return;
    }
    handleShowModalFormulir(idStockOpnameDetail, "pengajuan");
  };

  // Sinkronisasi data query ke parent
  useEffect(() => {
    if (!dataStockOpnameDetail?.data || isCanUpdate === undefined) return;
    handleSetData({
      status: dataStockOpnameDetail.data.status,
      isCanUpdate: isCanUpdate,
      produkIdChoose: dataStockOpnameDetail.data.produkIdChooses,
    });
  }, [dataStockOpnameDetail?.data, handleSetData, isCanUpdate]);

  const handleBack = () => {
    return navigate(currentPathname.split("/").slice(0, -1).join("/"));
  };

  return {
    errors,
    handleSubmit,
    isPendingUpdate,
    keyUpdate,
    onSubmit,
    register,
    handleKeyUpdate,
    handleResetForm,
    handleCloseModalInputTanggalOpname,
    modalInputTanggalOpnameRef,
    tanggalOpnameController,
    dataStockOpnameDetail,
    isLoadingStockOpnameDetail:
      isLoadingStockOpnameDetail || isFetchingStockOpnameDetail,
    tanggalDiajukan,
    handleRefresh,
    isStatusApproved,
    isStatusDraft,
    isStatusPending,
    isStatusRejected,
    isExpired,
    isCanAjukan,
    isCanManageDetail,
    isCanVerifikasi,
    handleTolak,
    handleSetuju,
    isPendingSetuju,
    handleDeleteStockOpname,
    isPendingDeleteStockOpname,
    handleCloseModalDeleteStockOpname,
    handleShowModalDeleteStockOpname,
    modalDeleteStockOpnameRef,
    handleCloseModalFormulir,
    handlePosting,
    isPendingPosting,
    modalFormulirRef,
    handleCancelPosting,
    handleCancelVerifikasi,
    isPendingCancelPosting,
    isPendingCancelVerifikasi,
    handleAjukan,
    dataDeleteStockOpname,
    dataConfirm,
    handleCancel,
    handleConfirm,
    modalKonfirmasiRef,
    idModalFormulir,
    dataModalFormulir,

    handleBack,
  };
};

export default useInformasiStockOpnameDetail;
