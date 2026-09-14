import { useMutation } from "@tanstack/react-query";
import { TransactionDetailOldServices } from "../services/transactionDetailOld.service";
import { useNavigate } from "react-router-dom";

const useDeleteTransactionDetailOld = (params: {
  link?: string;
  toast: string;
}) => {
  const navigate = useNavigate();

  const {
    mutateAsync: mutateDeleteTransactiondetailOld,
    isPending: isPendingDeleteTransactiondetailOld,
  } = useMutation({
    mutationFn: (transactionId: number) =>
      TransactionDetailOldServices.delete({ transactionId }),
    onSuccess: () => {
      if (params.link) {
        navigate(params.link, {
          state: { toast: params.toast },
        });
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  //   handle delete
  const handleDeleteTransactionDetailOld = async (transactionId: number) => {
    try {
      await mutateDeleteTransactiondetailOld(transactionId);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleDeleteTransactionDetailOld,
    isPendingDeleteTransactiondetailOld,
  };
};

export default useDeleteTransactionDetailOld;
