import { useQuery } from "@tanstack/react-query";
import { TransactionServices } from "../../../../services/transaction.service";
import { useToastAnimation } from "../../../../hooks/useToast";

const useStruk = (params: { handleSteps: (value: number) => void }) => {
  const { handleSteps } = params;

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

  const isExistingDataTransaction: boolean =
    !isLoadingTransaction && dataTransaction?.data ? true : false;

  return {
    dataTransaction,
    isLoadingTransaction,
    isExistingDataTransaction,
    handleBackTransaksi,
  };
};

export default useStruk;
