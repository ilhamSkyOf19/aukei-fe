import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PAYMENT_METHOD_TYPE,
  type PaymentMethodType,
} from "../types/constant.type";
import { TransactionServices } from "../services/transaction.service";
import { LOCAL_STORAGE_KEYS } from "../utils/localStorageKeys";

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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["transaksi-draft"] });

      if (data.data) {
        if (data.data.metodePembayaran !== PAYMENT_METHOD_TYPE.CASH) {
          // remove dibayar form local storage
          localStorage.removeItem(LOCAL_STORAGE_KEYS.DI_BAYAR);
        }
      }
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
