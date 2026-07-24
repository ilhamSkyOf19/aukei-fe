import { useQuery } from "@tanstack/react-query";
import { TransactionServices } from "../../../services/transaction.service";
import { useMemo, useState } from "react";
import {
  PAYMENT_METHOD_TYPE,
  ROLE_INTERNAL_TYPE,
  TRANSACTION_STATUS_TYPE,
} from "../../../types/constant.type";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useAuthStore } from "../../../stores/authStore";

const useTransactionDetail = (params: {
  handleSteps?: (value: number) => void;
  transactionId?: number;
}) => {
  const { handleSteps, transactionId: transactionIdProps } = params;

  // state is ubah data
  const [isUbahData, setIsUbahData] = useState<boolean>(false);

  // get pengguna
  const pengguna = useAuthStore((state) => state.pengguna);

  // current pathname
  const currentPathname = useLocation().pathname;

  // navigate
  const navigate = useNavigate();

  // handle back transaksi
  const handleBackTransaksi = () => {
    if (pengguna?.role === ROLE_INTERNAL_TYPE.OWNER) {
      return navigate(currentPathname.split("/").slice(0, -2).join("/"));
    } else {
      if (handleSteps) {
        handleSteps?.(1);

        // remove local storage
        localStorage.removeItem("transaction");
      } else {
        navigate(currentPathname.split("/").slice(0, -2).join("/"));
      }
    }
  };

  // get local storage
  const { transactionId } = useParams<{ transactionId: string }>();

  //   parse
  const validatedId = parseId(transactionId) ?? transactionIdProps;

  // query
  const { data: dataTransaction, isLoading: isLoadingTransaction } = useQuery({
    queryKey: ["transaction", validatedId],
    queryFn: () => TransactionServices.findById({ id: validatedId! }),
    retry: false,
    enabled: !!validatedId,
    refetchOnWindowFocus: false,
  });

  // data kebutuhan barang
  const { data: dataKebutuhanBarang, isLoading: isLoadingKebutuhanBarang } =
    useQuery({
      queryKey: ["kebutuhan-barang", dataTransaction?.data?.id],
      queryFn: () =>
        TransactionServices.kebutuhanBarang({
          transactionId: dataTransaction?.data?.id!,
        }),
      enabled:
        !!dataTransaction?.data?.id &&
        dataTransaction?.data?.status === TRANSACTION_STATUS_TYPE.BOOKING,
      retry: false,
      refetchOnWindowFocus: false,
    });

  // is status booking
  const isStatusBooking =
    dataTransaction?.data?.status === TRANSACTION_STATUS_TYPE.BOOKING;

  const isExistingDataTransaction: boolean =
    !isLoadingTransaction && dataTransaction?.data ? true : false;

  const transactionSummary = useMemo(() => {
    if (!dataTransaction?.data) {
      return {
        totalQuantity: 0,
        totalPembayaran: 0,

        totalDiBayar: 0,
        totalKembalian: 0,

        uangMuka: 0,

        sisaTagihan: 0,
      };
    }

    let totalQuantity = 0;
    let totalPembayaran = 0;

    const totalDiBayar = dataTransaction.data.paymentTransactions?.reduce(
      (total, item) => total + item.diBayar,
      0,
    );

    const totalKembalian = dataTransaction.data.paymentTransactions?.reduce(
      (total, item) => total + item.kembalian,
      0,
    );

    const uangMuka =
      dataTransaction?.data?.status === TRANSACTION_STATUS_TYPE.BOOKING ||
      dataTransaction?.data?.metodePembayaran === PAYMENT_METHOD_TYPE.TEMPO
        ? (dataTransaction.data.tempo?.uangMuka ??
          dataTransaction?.data?.totalDiBayar)
        : undefined;

    for (const item of dataTransaction.data.details) {
      totalQuantity += item.quantity;
      totalPembayaran += item.quantity * item.hargaJual - item.diskon;
    }

    return {
      totalQuantity,
      totalPembayaran,

      totalDiBayar,
      totalKembalian,

      uangMuka,

      sisaTagihan: Math.abs(totalPembayaran - (totalDiBayar ?? 0)),
    };
  }, [dataTransaction?.data]);

  // is booking kasir
  const isPageBookingKasir =
    currentPathname.includes("booking") &&
    pengguna?.role === ROLE_INTERNAL_TYPE.KASIR;

  return {
    dataTransaction,
    isLoadingTransaction,
    isExistingDataTransaction,
    handleBackTransaksi,
    transactionSummary,
    isStatusBooking,
    isPageBookingKasir,
    isUbahData,
    setIsUbahData,
    dataKebutuhanBarang,
    isLoadingKebutuhanBarang,
  };
};

export default useTransactionDetail;
