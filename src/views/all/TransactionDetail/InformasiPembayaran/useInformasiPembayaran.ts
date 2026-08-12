import { useRef, useState } from "react";
import {
  PAYMENT_METHOD_TYPE,
  TRANSACTION_STATUS_TYPE,
  type ErrorType,
  type PaymentMethodType,
} from "../../../../types/constant.type";
import useModalCalculator from "../../../../hooks/useModalCalculator";
import useModalTempo from "../../../../hooks/useModalTempo";
import type { DataTempoType } from "../../../../models/tempo.model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreateTransactionForRequestType,
  ResponseTransactionType,
} from "../../../../models/transaction.model";
import { TransactionServices } from "../../../../services/transaction.service";
import triggerAnimation from "../../../../hooks/triggerAnimation";
import type { ResponseStructure } from "../../../../types/response.type";
import { useAuthStore } from "../../../../stores/authStore";
import { useNavigate } from "react-router-dom";
import useDownloadInvoice from "../../../../hooks/useDownloadInvoice";
import useConfirm from "../../../../hooks/useConfirm";

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
  const kasir = useAuthStore((state) => state.pengguna);

  const [isOpenHistory, setIsOpenHistory] = useState<boolean>(false);
  const [isErrors, setIsErrors] = useState<ErrorType[]>([]);
  const [dataTempo, setDataTempo] = useState<DataTempoType | null>(null);
  const [dataDiBayar, setDataDiBayar] = useState<number>(0);
  const [metodePembayaran, setMetodePembayaran] =
    useState<PaymentMethodType | null>(null);

  const buttonBayarRef = useRef<HTMLButtonElement | null>(null);
  const buttonAturTempoRef = useRef<HTMLButtonElement | null>(null);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

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

        navigate(
          `/dashboard/riwayat-transaksi/pelanggan/${data?.data?.pelanggan?.id}/transaksi/${data?.data?.id}`,
          {
            state: {
              toast: "created_transaction_booking_success",
            },
          },
        );
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

  const calculateDiBayar = (): number => {
    switch (metodePembayaran) {
      case PAYMENT_METHOD_TYPE.TEMPO:
        return dataTempo?.metodePembayaranUangDp === PAYMENT_METHOD_TYPE.CASH
          ? (dataTempo.diBayar ?? 0)
          : (dataTempo?.uangMuka ?? 0);
      case PAYMENT_METHOD_TYPE.CASH:
        return dataDiBayar;
      default:
        return transactionSummary.sisaTagihan ?? 0;
    }
  };

  const calculateKembalian = (): number => {
    if (
      metodePembayaran !== PAYMENT_METHOD_TYPE.CASH &&
      metodePembayaran !== PAYMENT_METHOD_TYPE.TEMPO
    )
      return 0;
    return metodePembayaran === PAYMENT_METHOD_TYPE.TEMPO
      ? dataTempo?.metodePembayaranUangDp === PAYMENT_METHOD_TYPE.CASH
        ? (dataTempo?.kembalian ?? 0)
        : 0
      : dataDiBayar - (transactionSummary.totalPembayaran ?? 0);
  };

  const buildTransactionPayload = (
    transactionData: ResponseTransactionType,
    kasirId: number,
  ): CreateTransactionForRequestType => {
    return {
      id: transactionData.id,
      status: TRANSACTION_STATUS_TYPE.COMPLETED,
      ...(dataTempo && {
        tempo: {
          jumlahCicilan: dataTempo.jumlahCicilan,
          periode: dataTempo.periode,
          uangMuka: dataTempo.uangMuka,
          installments: dataTempo.installments,
        },
        metodePembayaranUangDp: dataTempo.metodePembayaranUangDp,
      }),
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
      if (!dataTransaction?.data || !kasir) return;

      const payload = buildTransactionPayload(dataTransaction.data, kasir.id);

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

  // handle metode pembayaran
  const handleMetodePembayaran = (metode: PaymentMethodType) => {
    if (metode !== PAYMENT_METHOD_TYPE.CASH) {
      setDataDiBayar(0);
    }
    setMetodePembayaran(metode);
  };

  // handle download
  const { handleDownloadPdf, isLoadingDownloadInvoicePdf } =
    useDownloadInvoice();

  return {
    isOpenHistory,
    setIsOpenHistory,
    metodePembayaran,
    setMetodePembayaran: handleMetodePembayaran,
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
    setDataTempo,
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
  };
};

export default useInformasiPembayaran;
