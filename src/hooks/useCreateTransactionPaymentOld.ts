import { useMutation } from "@tanstack/react-query";
import { TransactionPaymentOldServices } from "../services/transactionPaymentOld.service";

const useCreateTransactionPaymentOld = (params: { callback?: () => void }) => {
  // use mutation
  const {
    mutateAsync: mutateCreate,
    isPending: isPendingTransactionPaymentOld,
  } = useMutation({
    mutationFn: (transactionId: number) =>
      TransactionPaymentOldServices.create({ transactionId }),
    onSuccess: () => {
      params.callback?.();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  //   handle
  const handleCreateTransactionPaymentOld = async (transactionId: number) => {
    try {
      await mutateCreate(transactionId);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleCreateTransactionPaymentOld,
    isPendingTransactionPaymentOld,
  };
};

export default useCreateTransactionPaymentOld;
