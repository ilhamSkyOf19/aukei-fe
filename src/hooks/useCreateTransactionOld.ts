import { useMutation } from "@tanstack/react-query";
import { TransactionDetailOldServices } from "../services/transactionDetailOld.service";

const useCreateTransactionOld = () => {
  // use mutation
  const { mutateAsync: mutateCreate, isPending: isPendingTransactionOld } =
    useMutation({
      mutationFn: (transactionId: number) =>
        TransactionDetailOldServices.create({ transactionId }),
      onSuccess: () => {},
      onError: (err) => {
        console.log(err);
      },
    });

  //   handle
  const handleCreateTransactionOld = async (transactionId: number) => {
    try {
      await mutateCreate(transactionId);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleCreateTransactionOld,
    isPendingTransactionOld,
  };
};

export default useCreateTransactionOld;
