import { useMutation } from "@tanstack/react-query";
import { TransactionServices } from "../services/transaction.service";

const useCancelUpdateTransactionPayment = (params: {
  onSuccess?: () => void;
}) => {
  const { onSuccess } = params;

  // use mutation
  const {
    mutateAsync: mutateCancelUpdateTransactionPayment,
    isPending: isPendingCancelUpdateTransactionPayment,
  } = useMutation({
    mutationFn: (transactionId: number) =>
      TransactionServices.cancelUpdatePembayaran({ transactionId }),
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  //   handle
  const handleCancelUpdateTransactionPayment = async (
    transactionId: number,
  ) => {
    try {
      await mutateCancelUpdateTransactionPayment(transactionId);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleCancelUpdateTransactionPayment,
    isPendingCancelUpdateTransactionPayment,
  };
};

export default useCancelUpdateTransactionPayment;
