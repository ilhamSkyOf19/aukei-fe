import { useQuery } from "@tanstack/react-query";
import { TransactionServices } from "../../../../services/transaction.service";
import useIsModeKasirStore from "../../../../stores/iseModaKasirStore";

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

  const isExistingDataTransaction: boolean =
    !isLoadingTransaction && dataTransaction?.data ? true : false;

  return {
    dataTransaction,
    isLoadingTransaction,
    isExistingDataTransaction,
    handleBackTransaksi,
    isModeKasir,
  };
};

export default useStruk;
