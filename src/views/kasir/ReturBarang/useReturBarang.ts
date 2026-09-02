import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { TransactionServices } from "../../../services/transaction.service";
import { useMemo } from "react";
import useConfirm from "../../../hooks/useConfirm";
import { ReturBarangServices } from "../../../services/returBarang.service";
import axios from "axios";
import type { ErrorResponse } from "../../../types/response.type";
import { useAuthStore } from "../../../stores/authStore";
import useModal from "../../../hooks/useModal";
import { useToastAnimation } from "../../../hooks/useToast";
import type { AddReturnDetailByIdRequestType } from "../../../models/returBarang.model";

const useReturBarang = () => {
  const pengguna = useAuthStore((state) => state.pengguna);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const currentPathname = useLocation().pathname;

  // alert
  const { handleSetToast, toast } = useToastAnimation();

  const { transactionId, returBarangId } = useParams<{
    transactionId: string;
    returBarangId: string;
  }>();

  /**
   * ============================================================
   * PARSE ID
   * ============================================================
   */
  const validateTransactionId = parseId(transactionId);

  const validateReturBarangId = parseId(returBarangId);

  /**
   * ============================================================
   * CONFIRM MODAL
   * ============================================================
   */
  const {
    confirm,
    data: dataConfirm,
    handleCancel: handleCancelConfirm,
    handleConfirm,
    modalRef: modalConfirmRef,
  } = useConfirm<{
    bigTitle: string;
    smallTitle: string;
  }>();

  // use modal pengajuan or verifikasi
  const {
    modalRef: modalPengajuanOrVerifikasiRef,
    handleCloseModal: handleCloseModalPengajuanOrVerifikasi,
    handleShowModal: handleShowModalPengajuanOrVerifikasi,
  } = useModal();

  // buat modal confirm untuk owner
  // modal confirm
  const {} = useConfirm();

  /**
   * ============================================================
   * QUERY
   * ============================================================
   *
   * Query pertama:
   * mengambil detail transaksi yang bisa diretur.
   *
   * Query kedua:
   * mengambil ReturnDetail dari container return jika
   * returnTransactionId sudah tersedia.
   */
  const data = useQueries({
    queries: [
      {
        queryKey: ["transaction-for-retur-barang", validateTransactionId],

        queryFn: () =>
          TransactionServices.findTransaksiForReturBarang({
            id: validateTransactionId!,
          }),

        enabled: !!validateTransactionId,

        retry: false,

        refetchOnWindowFocus: false,
      },

      {
        queryKey: ["return-draft-details", validateTransactionId],

        queryFn: () =>
          ReturBarangServices.findDraftByReturnTransactionId({
            transactionId: validateTransactionId!,
          }),

        enabled: !!validateTransactionId && !validateReturBarangId,

        retry: false,

        refetchOnWindowFocus: false,
      },

      {
        queryKey: ["return-details", validateReturBarangId],

        queryFn: () =>
          ReturBarangServices.findReturnDetails({
            returId: validateReturBarangId!,
          }),

        enabled: !!validateReturBarangId,

        retry: false,

        refetchOnWindowFocus: false,
      },
    ],
  });

  const [
    { data: dataForReturBarang, isLoading: isLoadingForReturBarang },

    { data: dataReturDraftDetail, isLoading: isLoadingReturDraftDetail },

    { data: dataReturDetails, isLoading: isLoadingReturDetails },
  ] = data;

  /**
   * ============================================================
   * RETURN DETAILS
   * ============================================================
   *
   * Data return sekarang sepenuhnya berasal dari API.
   *
   * Tidak ada lagi useFieldArray.
   */
  const returnDetails =
    dataReturDraftDetail?.data?.details ??
    dataReturDetails?.data?.details ??
    [];

  /**
   * ============================================================
   * TRANSACTION DETAIL MAP
   * ============================================================
   */
  const transactionDetailMap = useMemo(() => {
    return new Map(
      dataForReturBarang?.data?.details.map((item) => [item.id, item]) ?? [],
    );
  }, [dataForReturBarang]);

  /**
   * ============================================================
   * RETURN DETAIL MAP
   * ============================================================
   */
  const returnDetailMap = useMemo(() => {
    return new Map(
      returnDetails.map((item) => [item.transactionDetailId, item]),
    );
  }, [returnDetails]);

  /**
   * ============================================================
   * HANDLE APPEND / ADD PRODUCT
   * ============================================================
   *
   * Sekarang tidak menggunakan append().
   *
   * Ketika user memilih produk:
   *
   * POST /return/detail
   *
   * Backend:
   * - create ReturnTransaction jika belum ada
   * - create ReturnDetail
   */
  const {
    mutateAsync: mutateAddReturnDetail,
    // isPending: isPendingAddReturnDetail,
  } = useMutation({
    mutationFn: (data: AddReturnDetailByIdRequestType) => {
      if (returBarangId && data.returnId) {
        return ReturBarangServices.addReturnDetailById({
          returnId: data.returnId,
          transactionDetailId: data.transactionDetailId,
          transactionId: data.transactionId,
        });
      } else {
        return ReturBarangServices.addReturnDetail({
          transactionDetailId: data.transactionDetailId,
          transactionId: data.transactionId,
        });
      }
    },

    onSuccess: async () => {
      /**
       * Jika container sudah ada, cukup refresh detail.
       */
      await queryClient.invalidateQueries({
        queryKey: ["transaction-for-retur-barang", validateTransactionId],
      });

      /**
       * Refresh transaksi juga jika diperlukan.
       */
      await queryClient.invalidateQueries({
        queryKey: ["return-draft-details", validateTransactionId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["return-details", validateReturBarangId],
      });
    },

    onError: (err) => {
      if (axios.isAxiosError<ErrorResponse>(err)) {
        console.error(err.response?.data);
      }
    },
  });

  /**
   * ============================================================
   * HANDLE ADD PRODUCT
   * ============================================================
   *
   * Dipanggil ketika user memilih satu produk.
   */
  const handleAppend = async (params: {
    detailId: number;
    hargaJual: number;
    maxQuantity: number;
    quantityWasRetur: number;
  }) => {
    /**
     * Jangan tambahkan jika sudah ada di ReturnDetail.
     */
    if (returnDetailMap.has(params.detailId)) {
      return;
    }

    /**
     * Default quantity ketika pertama kali
     * ditambahkan adalah 1.
     */

    if (params.maxQuantity <= 0) {
      return;
    }

    await mutateAddReturnDetail({
      transactionId: validateTransactionId!,
      transactionDetailId: params.detailId,
      returnId: validateReturBarangId ?? null,
    });
  };

  /**
   * ============================================================
   * DELETE RETURN DETAIL
   * ============================================================
   */
  // const {
  //   mutateAsync: mutateDeleteReturnDetail,
  //   isPending: isPendingDeleteReturnDetail,
  // } = useMutation({
  //   mutationFn: ReturBarangServices.deleteReturnDetail,

  //   onSuccess: async () => {
  //     await queryClient.invalidateQueries({
  //       queryKey: ["return-details", validateReturBarangId],
  //     });

  //     await queryClient.invalidateQueries({
  //       queryKey: ["transaction-for-retur-barang", validateTransactionId],
  //     });
  //   },

  //   onError: (err) => {
  //     if (axios.isAxiosError<ErrorResponse>(err)) {
  //       console.error(err.response?.data);
  //     }
  //   },
  // });

  /**
   * ============================================================
   * HANDLE DELETE
   * ============================================================
   */
  // const handleRemove = async (returnDetailId: number) => {
  //   if (!validateReturBarangId) {
  //     return;
  //   }

  //   await mutateDeleteReturnDetail({
  //     returnTransactionId: validateReturBarangId,

  //     returnDetailId,
  //   });
  // };

  /**
   * ============================================================
   * SUMMARY
   * ============================================================
   *
   * Summary sekarang berasal dari data API.
   */
  const summary = useMemo(() => {
    return returnDetails.reduce(
      (acc, detail) => {
        const transactionDetail = transactionDetailMap.get(
          detail.transactionDetailId,
        );

        const quantity = detail.quantityReturn ?? 0;

        const hargaJual = transactionDetail?.hargaJual ?? 0;

        acc.totalQuantity += quantity;

        acc.totalRefund += detail.totalRefund ?? quantity * hargaJual;

        return acc;
      },
      {
        totalQuantity: 0,
        totalRefund: 0,
      },
    );
  }, [returnDetails, transactionDetailMap]);

  /**
   * ============================================================
   * HANDLE BACK
   * ============================================================
   */
  const handleBack = () => {
    return navigate(currentPathname.split("/").slice(0, -1).join("/"));
  };

  const combinedReturnDetails = useMemo(() => {
    return returnDetails.map((returnDetail) => {
      const transactionDetail = transactionDetailMap.get(
        returnDetail.transactionDetailId,
      );

      return {
        ...returnDetail,

        returnTransactionId:
          dataReturDraftDetail?.data?.id ?? dataReturDetails?.data?.id,

        produk: transactionDetail?.produk,

        hargaJual: transactionDetail?.hargaJual ?? 0,

        quantityTransaction: transactionDetail?.quantity ?? 0,

        totalRetur: transactionDetail?.totalRetur ?? 0,
      };
    });
  }, [returnDetails, transactionDetailMap]);

  /**
   * ============================================================
   * HANDLE BATAL RETURN
   * ============================================================
   *
   * Karena sekarang delete dilakukan per detail,
   * tombol batal hanya kembali dari halaman.
   *
   * Container tidak otomatis dihapus.
   */
  // const handleBatalRetur = async () => {
  //   const useConfirmResult = await confirm({
  //     bigTitle: "Apakah Anda yakin ingin membatalkan retur barang?",

  //     smallTitle:
  //       "Data produk return yang sudah ditambahkan tidak akan diproses sampai pengajuan dilakukan.",
  //   });

  //   if (!useConfirmResult) {
  //     return;
  //   }

  //   handleBack();
  // };

  /**
   * ============================================================
   * CAN SUBMIT
   * ============================================================
   */
  const isCanSimpanAndAjukan = returnDetails.length > 0;

  /**
   * ============================================================
   * SUBMIT / PENGAJUAN
   * ============================================================
   *
   * Sekarang submit tidak lagi mengirim details[].
   *
   * Karena semua produk sudah tersimpan di database,
   * submit hanya perlu menggunakan ReturnTransaction ID.
   */
  // const { mutateAsync: mutatePengajuan, isPending: isPendingPengajuan } =
  //   useMutation({
  //     mutationFn: ReturBarangServices.pengajuan,

  //     onSuccess: () => {
  //       handleCloseModalConfirm();

  //       const basePath = currentPathname.split("/").slice(0, -1).join("/");

  //       navigate(basePath, {
  //         state: {
  //           toast:
  //             pengguna?.role === ROLE_INTERNAL_TYPE.OWNER
  //               ? "created_retur_barang_owner"
  //               : "created_retur_barang_kasir",
  //         },
  //       });
  //     },

  //     onError: (err) => {
  //       if (axios.isAxiosError<ErrorResponse>(err)) {
  //         console.error(err.response?.data);
  //       }
  //     },
  //   });

  /**
   * ============================================================
   * ON SUBMIT
   * ============================================================
   */
  // const onSubmit = async (params?: { keterangan?: string }) => {
  //   if (!validateReturBarangId) {
  //     return;
  //   }

  //   if (!isCanSimpanAndAjukan) {
  //     return;
  //   }

  //   const isConfirm = await confirm(
  //     {
  //       bigTitle: "Apakah Anda yakin ingin mengajukan retur barang?",

  //       smallTitle:
  //         pengguna?.role === ROLE_INTERNAL_TYPE.OWNER
  //           ? "Pastikan seluruh data retur sudah benar. Retur akan masuk tahap review."
  //           : "Pastikan seluruh data retur sudah benar. Setelah diajukan, retur akan menunggu verifikasi dari owner.",
  //     },
  //     {
  //       disableCloseAfterSubmit: true,
  //     },
  //   );

  //   if (!isConfirm) {
  //     return;
  //   }

  //   await mutatePengajuan({
  //     id: validateReturBarangId,

  //     keterangan: params?.keterangan,
  //   });
  // };

  const { mutateAsync: mutatePosted, isPending: isPendingPosted } = useMutation(
    {
      mutationFn: (data: { kodeReferensi: string }) =>
        ReturBarangServices.posted({
          kodeReferensi: data.kodeReferensi,
        }),

      onSuccess: async () => {
        /**
         * Jika container sudah ada, cukup refresh detail.
         */
        await queryClient.invalidateQueries({
          queryKey: ["transaction-for-retur-barang", validateTransactionId],
        });

        /**
         * Refresh transaksi juga jika diperlukan.
         */
        await queryClient.invalidateQueries({
          queryKey: ["return-draft-details", validateTransactionId],
        });

        await queryClient.invalidateQueries({
          queryKey: ["return-details", validateReturBarangId],
        });
      },

      onError: (err) => {
        console.log(err);
      },
    },
  );

  const handlePosted = async () => {
    try {
      if (!dataForReturBarang?.data?.nomorTransaksi) return;

      const isConfirm = await confirm({
        bigTitle: "Apakah anda yakin ingin menyimpan data retur barang?",
        smallTitle:
          "Data akan langsung diposting dan tidak melewati proses verifikasi",
      });

      if (!isConfirm) {
        handleCancelConfirm();
      }

      await mutatePosted({
        kodeReferensi: dataForReturBarang?.data?.nomorTransaksi,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleBack,

    dataForReturBarang,

    isLoadingForReturBarang,

    returnDetails,

    handleAppend,

    summary,

    modalConfirmRef,

    handleCancelConfirm,

    handleConfirm,

    dataConfirm,

    isCanSimpanAndAjukan,

    pengguna,

    isLoadingReturDraftDetail,

    combinedReturnDetails,

    handleShowModalPengajuanOrVerifikasi,
    handleCloseModalPengajuanOrVerifikasi,
    modalPengajuanOrVerifikasiRef,

    dataReturDraftDetail,

    isLoadingReturDetails,

    validateReturBarangId,

    toast,

    handleSetToast,

    handlePosted,

    isPendingPosted,
  };
};

export default useReturBarang;
