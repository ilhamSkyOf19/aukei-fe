import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PaymentMethodType } from "../types/constant.type";
import { TransactionServices } from "../services/transaction.service";

const useUpdateMetodePembayaran = () => {
  // query client
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateMetodePembayaran,
    isPending: isPendingUpdateMetodePembayaran,
  } = useMutation({
    mutationFn: (data: {
      transactionId: number;
      metodePembayaran: PaymentMethodType;
    }) =>
      TransactionServices.updateMetodePembayaran({
        transactionId: data.transactionId,
        data: { metodePembayaran: data.metodePembayaran },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaksi-draft"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return {
    updateMetodePembayaran,
    isPendingUpdateMetodePembayaran,
  };
};

export default useUpdateMetodePembayaran;
