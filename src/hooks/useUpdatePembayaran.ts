import { TransactionServices } from "../services/transaction.service";
import { useMutation } from "@tanstack/react-query";

const useUpdatePembayaran = (params: { handleRedirect: () => void }) => {
  const { handleRedirect } = params;
  // use mutation
  const {
    mutateAsync: mutateUpdatePembayaran,
    isPending: isPendingUpdatePembayaran,
  } = useMutation({
    mutationFn: (data: { nominal: number; transactionId: number }) =>
      TransactionServices.updatePembayaran({
        data: {
          nominal: data.nominal,
        },
        transactionId: data.transactionId,
      }),
    onSuccess: () => {
      handleRedirect();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return {
    mutateUpdatePembayaran,
    isPendingUpdatePembayaran,
  };
};

export default useUpdatePembayaran;
