import { useQuery } from "@tanstack/react-query";
import { TransactionServices } from "../../../../services/transaction.service";
import useIsModeKasirStore from "../../../../stores/iseModaKasirStore";
import { useMemo } from "react";
import { TRANSACTION_STATUS_TYPE } from "../../../../types/constant.type";

const useStruk = (params: { handleSteps: (value: number) => void }) => {
  const { handleSteps } = params;

  // get is mode kasir from store
  const isModeKasir = useIsModeKasirStore((state) => state.isModeKasir);

  // handle back transaksi
  const handleBackTransaksi = () => {
    handleSteps(1);

    // remove local storage
    localStorage.removeItem("transaction");
  };

  // get local storage
  const transaction = localStorage.getItem("transaction");
  const transactionId = transaction
    ? JSON.parse(transaction).transactionId
    : null;

  // query
  const { data: dataTransaction, isLoading: isLoadingTransaction } = useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: () => TransactionServices.findById({ id: transactionId! }),
    retry: false,
    enabled: !!transactionId,
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
    isModeKasir,
    isNotFullBooking,
    transactionSummary,
    isStatusBooking,
  };
};

export default useStruk;
