import { useMemo, useRef, useState } from "react";
import {
  PAYMENT_METHOD_TYPE,
  TRANSACTION_PAYMENT_STATUS_TYPE,
  TRANSACTION_STATUS_TYPE,
  type ErrorType,
  type PaymentMethodType,
} from "../../../../types/constant.type";
import useModalCalculator from "../../../../hooks/useModalCalculator";
import useModalTempo from "../../../../hooks/useModalTempo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreateTransactionForRequestType,
  ResponseTransactionType,
} from "../../../../models/transaction.model";
import { TransactionServices } from "../../../../services/transaction.service";
import triggerAnimation from "../../../../hooks/triggerAnimation";
import type { ResponseStructure } from "../../../../types/response.type";
import { useAuthStore } from "../../../../stores/authStore";
import { useLocation, useNavigate } from "react-router-dom";
import useDownloadInvoice from "../../../../hooks/useDownloadInvoice";
import useConfirm from "../../../../hooks/useConfirm";
import { useAlertAnimation } from "../../../../hooks/useAlert";
import usePrintInvoiceTransaksi from "../../../../hooks/usePrintInvoiceTransaksi";
import { useToastAnimation } from "../../../../hooks/useToast";
import usePrintInvoiceKirimBarang from "../../../../hooks/usePrintInvoiceKirimBarang";

const LOCAL_STORAGE_DI_BAYAR_KEY = "di-bayar";

interface TransactionSummary {
  totalQuantity: number;
  totalPembayaran: number;
  totalDiBayar: number | undefined;
  totalKembalian: number | undefined;
  sisaTagihan: number | undefined;
}

interface UseInformasiPembayaranParams {
  dataTransaction?: ResponseStructure<ResponseTransactionType | null>;
  transactionSummary: TransactionSummary;
  siapKirim?: boolean;
}

const useInformasiPembayaran = ({
  dataTransaction,
  transactionSummary,
  siapKirim,
}: UseInformasiPembayaranParams) => {
  const pengguna = useAuthStore((state) => state.pengguna);

  // alert
  const { alert, handleSetAlert } = useAlertAnimation();

  // toast
  const { handleSetToast, toast } = useToastAnimation();

  const [isOpenHistory, setIsOpenHistory] = useState<boolean>(false);
  const [isErrors, setIsErrors] = useState<ErrorType[]>([]);
  const [dataDiBayar, setDataDiBayar] = useState<number>(0);

  const buttonBayarRef = useRef<HTMLButtonElement | null>(null);
  const buttonAturTempoRef = useRef<HTMLButtonElement | null>(null);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const currentPathname = useLocation().pathname;

  const isPageTransaction = currentPathname.includes("kasir");

  // total after diskon
  const metodePembayaran: PaymentMethodType | null = useMemo(() => {
    return dataTransaction?.data?.metodePembayaran ?? null;
  }, [dataTransaction]);

  // Data tempo (cicilan) jika pelanggan memilih metode pembayaran TEMPO
  const dataTempo = useMemo(() => {
    return dataTransaction?.data?.tempo;
  }, [dataTransaction]);

  const {
    handleCloseModalCalculator,
    handleShowModalCalculator,
    modalCalculatorRef,
  } = useModalCalculator({ setIsErrors });

  // modal confirm
  const {
    modalRef: modalConfirmRef,
    confirm,
    data: dataConfirm,
    handleCancel: handleCancelModalConfirm,
    handleConfirm,
  } = useConfirm<{ bigTitle: string; smallTitle: string }>();

  const { handleCloseModalTempo, handleShowModalTempo, modalTempoRef } =
    useModalTempo({ setIsErrors });

  const { mutateAsync: mutateTransaction, isPending: isPendingTransaction } =
    useMutation({
      mutationFn: (data: CreateTransactionForRequestType) =>
        TransactionServices.create(data),
      onSuccess: (data) => {
        // invlaidated query
        if (data?.data) {
          queryClient.invalidateQueries({
            queryKey: ["transaction", data?.data?.id],
          });
        }

        navigate(`/dashboard/riwayat-transaksi/${data?.data?.id}`, {
          state: {
            toast: "created_transaction_booking_success",
          },
        });
      },
      onError: (err) => {
        console.log(err);
      },
    });

  const addError = (error: ErrorType) => {
    setIsErrors((prev) => [...prev, error]);
  };

  const handlePay = (amount: number) => {
    localStorage.setItem(LOCAL_STORAGE_DI_BAYAR_KEY, JSON.stringify(amount));
    setDataDiBayar(amount);
    handleCloseModalCalculator();
  };

  const validateTransactionForm = (): boolean => {
    // check siap kirin
    if (!siapKirim) return false;

    if (!metodePembayaran) {
      addError("METODE_PEMBAYARAN_KOSONG");
      return false;
    }

    if (metodePembayaran === "CASH" && !dataDiBayar) {
      triggerAnimation(buttonBayarRef);
      addError("DATA_DI_BAYAR_KOSONG");
      return false;
    }

    if (metodePembayaran === "TEMPO" && !dataTempo) {
      triggerAnimation(buttonAturTempoRef);
      addError("DATA_TEMPO_KOSONG");
      return false;
    }

    return true;
  };

  const tempoDpPayment = dataTransaction?.data?.paymentTransactions?.find(
    (item) => item.jenis === TRANSACTION_PAYMENT_STATUS_TYPE.TEMPO_DP,
  );

  const calculateDiBayar = (): number => {
    switch (metodePembayaran) {
      // ==================================================
      // TEMPO
      // ==================================================

      case PAYMENT_METHOD_TYPE.TEMPO:
        return tempoDpPayment?.diBayar ?? dataTempo?.uangMuka ?? 0;

      // ==================================================
      // CASH
      // ==================================================

      case PAYMENT_METHOD_TYPE.CASH:
        return dataDiBayar;

      // ==================================================
      // NON CASH
      // ==================================================

      default:
        return transactionSummary.sisaTagihan ?? 0;
    }
  };

  const calculateKembalian = (): number => {
    // ==================================================
    // TEMPO
    // ==================================================

    if (metodePembayaran === PAYMENT_METHOD_TYPE.TEMPO) {
      return tempoDpPayment?.kembalian ?? 0;
    }

    // ==================================================
    // CASH
    // ==================================================

    if (metodePembayaran === PAYMENT_METHOD_TYPE.CASH) {
      return Math.max(
        dataDiBayar - (transactionSummary.totalPembayaran ?? 0),
        0,
      );
    }

    // ==================================================
    // NON CASH
    // ==================================================

    return 0;
  };

  const buildTransactionPayload = (
    transactionData: ResponseTransactionType,
    kasirId: number,
  ): CreateTransactionForRequestType => {
    return {
      id: transactionData.id,

      status: TRANSACTION_STATUS_TYPE.COMPLETED,

      details: transactionData.details.map((detail) => ({
        diskon: detail.diskon,

        hargaJual: detail.hargaJual,

        produkId: detail.produk.id,

        quantity: detail.quantity,
      })),

      diBayar: calculateDiBayar(),

      kembalian: calculateKembalian(),

      metodePembayaran,

      pelangganId: transactionData.pelanggan.id,

      kasirId,
    };
  };
  const handleTransaction = async () => {
    try {
      if (!validateTransactionForm()) return;
      if (!dataTransaction?.data || !pengguna) return;

      const payload = buildTransactionPayload(
        dataTransaction.data,
        pengguna.id,
      );

      // confirm
      const isConfirm = await confirm({
        bigTitle: "Apakah Anda yakin ingin menyelesaikan transaksi ini?",
        smallTitle: "Data transaksi tidak dapat diubah setelah selesai.",
      });

      if (!isConfirm) return;

      await mutateTransaction(payload);
    } catch (error) {
      console.log(error);
    }
  };

  // handle download
  const { handleDownloadPdf, isLoadingDownloadInvoicePdf } = useDownloadInvoice(
    { handleSetAlert, handleSetToast },
  );

  // handle print
  const { handlePrintInvoiceTransaksi, isLoadingPrintInvoiceTransaksi } =
    usePrintInvoiceTransaksi({ handleSetAlert });

  // handle print invoice kirim barang
  const { handlePrintInvoiceKirimBarang, isLoadingPrintInvoiceKirimBarang } =
    usePrintInvoiceKirimBarang({ handleSetAlert });

  // handle redirect detail booking
  const handleRedirectDetailBooking = (params: {
    transactionId?: number;
    pelangganId?: number;
  }) => {
    return navigate(`/dashboard/booking/${params.transactionId}`);
  };

  // total after diskon
  const totalAfterDiskon = useMemo(() => {
    return (
      dataTransaction?.data?.details?.reduce(
        (a, b) =>
          a +
          (b.hargaJual * b.quantity - b.diskon) -
          (dataTransaction?.data?.paymentTransactions?.reduce(
            (acc, curr) => acc + (curr.diBayar ?? 0) - (curr.kembalian ?? 0),
            0,
          ) ?? 0),
        dataTransaction?.data?.ongkir ?? 0,
      ) ?? 0
    );
  }, [dataTransaction]);

  // mutate update metode pembayaran
  const {
    mutateAsync: updateMetodePembayaran,
    isPending: isPendingUpdateMetodePembayaran,
  } = useMutation({
    mutationFn: (data: {
      transactionId: number;
      metodePembayaran: PaymentMethodType;
    }) =>
      TransactionServices.updateMetodePembayaran({
        transactionId: data.transactionId,
        data: { metodePembayaran: data.metodePembayaran },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // Ubah metode pembayaran, sinkronkan ke localStorage, dan bersihkan data terkait metode lama
  const handleMetodePembayaran = async (metode: PaymentMethodType) => {
    if (metodePembayaran === metode || !dataTransaction?.data?.id) return;

    await updateMetodePembayaran({
      transactionId: dataTransaction?.data?.id,
      metodePembayaran: metode,
    });

    // // Hapus nominal dibayar jika metode bukan CASH
    // if (metode !== "CASH") localStorage.removeItem(LOCAL_STORAGE_KEYS.DI_BAYAR);
    // // Hapus data tempo jika metode bukan TEMPO
    // if (metode !== "TEMPO") {
    //   localStorage.removeItem(LOCAL_STORAGE_KEYS.TEMPO);
    //   setDataTempo(null);
    // }
    // Bersihkan error "metode pembayaran kosong" karena sudah dipilih
    setIsErrors((prev) =>
      prev.filter((item) => item !== "METODE_PEMBAYARAN_KOSONG"),
    );
  };

  return {
    isOpenHistory,
    setIsOpenHistory,
    metodePembayaran,
    handleMetodePembayaran,
    isPendingUpdateMetodePembayaran,
    dataDiBayar,
    handlePay,
    buttonBayarRef,
    isErrors,
    handleShowModalCalculator,
    modalCalculatorRef,
    handleCloseModalCalculator,
    handleShowModalTempo,
    modalTempoRef,
    handleCloseModalTempo,
    dataTempo,
    buttonAturTempoRef,
    handleTransaction,
    isPendingTransaction,
    handleDownloadPdf,
    isLoadingDownloadInvoicePdf,

    // confirm
    handleCancelModalConfirm,
    handleConfirm,
    dataConfirm,
    modalConfirmRef,

    alert,
    toast,

    // print
    handlePrintInvoiceTransaksi,
    isLoadingPrintInvoiceTransaksi,

    handleRedirectDetailBooking,

    pengguna,

    isPageTransaction,

    handlePrintInvoiceKirimBarang,
    isLoadingPrintInvoiceKirimBarang,

    totalAfterDiskon,

    tempoDpPayment,
  };
};

export default useInformasiPembayaran;
