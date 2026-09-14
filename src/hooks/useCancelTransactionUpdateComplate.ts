import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { TransactionDetailServices } from "../services/transactionDetail.service";

const useCancelUpdateTransactionComplate = (params: {
  linkBack: string;
  onSuccess?: () => void;
}) => {
  const { linkBack, onSuccess } = params;

  const navigate = useNavigate();
  // use mutation
  const { mutateAsync: mutateCancelUpdate, isPending: isPendingCancelUpdate } =
    useMutation({
      mutationFn: (transactionId: number) =>
        TransactionDetailServices.updateOld({ transactionId }),
      onSuccess: () => {
        onSuccess?.();

        navigate(linkBack, {
          state: {
            toast: "cancel_updated",
          },
        });
      },
      onError: (err) => {
        console.log(err);
      },
    });

  //   handle
  const handleCancelUpdate = async (transactionId: number) => {
    try {
      await mutateCancelUpdate(transactionId);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleCancelUpdate,
    isPendingCancelUpdate,
  };
};

export default useCancelUpdateTransactionComplate;
