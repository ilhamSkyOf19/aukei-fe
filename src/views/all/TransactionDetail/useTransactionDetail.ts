import { useQuery } from "@tanstack/react-query";
import { TransactionServices } from "../../../services/transaction.service";
import { useMemo } from "react";
import {
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
      handleSteps?.(1);

      // remove local storage
      localStorage.removeItem("transaction");
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

  // is status booking
  const isStatusBooking =
    dataTransaction?.data?.status === TRANSACTION_STATUS_TYPE.BOOKING;

  const isExistingDataTransaction: boolean =
    !isLoadingTransaction && dataTransaction?.data ? true : false;

  // is full booking
  const isNotFullBooking = dataTransaction?.data?.details?.some(
    (item) => item.quantityDelivered > 0,
  );

  const transactionSummary = useMemo(() => {
    if (!dataTransaction?.data) {
      return {
        // jumlah barang
        totalJumlahBarangDikirim: 0,
        totalJumlahBarangBooking: 0,

        // uang
        totalUangBarangDikirim: 0,
        totalUangBarangBooking: 0,
      };
    }

    let totalJumlahBarangDikirim = 0;
    let totalJumlahBarangBooking = 0;

    let totalUangBarangDikirim = 0;
    let totalUangBarangBooking = 0;

    for (const item of dataTransaction?.data?.details) {
      const quantity = item.quantity;
      const stokDikirim = item.quantityDelivered ?? 0;
      const stokBooking = quantity - stokDikirim;

      // ===========================
      // Jumlah Barang
      // ===========================
      totalJumlahBarangDikirim += stokDikirim;
      totalJumlahBarangBooking += stokBooking;

      // ===========================
      // Nilai Uang
      // ===========================

      totalUangBarangDikirim += stokDikirim * item.hargaJual;
      totalUangBarangBooking += stokBooking * item.hargaJual;
    }

    return {
      // jumlah
      totalJumlahBarangDikirim,
      totalJumlahBarangBooking,

      // uang
      totalUangBarangDikirim,
      totalUangBarangBooking,
    };
  }, [dataTransaction?.data]);

  return {
    dataTransaction,
    isLoadingTransaction,
    isExistingDataTransaction,
    handleBackTransaksi,
    isNotFullBooking,
    transactionSummary,
    isStatusBooking,
  };
};

export default useTransactionDetail;
