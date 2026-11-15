import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RequestUpdateUangMukaBookingType } from "../../../models/transaction.model";
import { TransactionServices } from "../../../services/transaction.service";
import { useController, useForm, useWatch } from "react-hook-form";
import { TransactionValidation } from "../../../validations/transaction.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import type { PaymentMethodType } from "../../../types/constant.type";

const useModalUpdateUangMuka = (params: {
  handleCloseModal: () => void;
  transactionId?: number;
  data?: Pick<
    RequestUpdateUangMukaBookingType,
    "metodePembayaran" | "uangMuka"
  >;
}) => {
  const { handleCloseModal, transactionId, data } = params;

  const queryClient = useQueryClient();

  const { reset, control, handleSubmit, setValue } = useForm<
    Pick<RequestUpdateUangMukaBookingType, "metodePembayaran" | "uangMuka">
  >({
    resolver: zodResolver(TransactionValidation.UPDATE_UANG_MUKA_BOOKING),
  });

  useEffect(() => {
    reset(data);
  }, [data]);

  const metodePembayaranWatch = useWatch({
    name: "metodePembayaran",
    control,
  });

  const uangMukaController = useController({
    name: "uangMuka",
    control,
  });

  //   handle set metode pembayaran
  const handleSetMetodePembayaran = (
    metodePembayaran: Exclude<PaymentMethodType, "TEMPO">,
  ) => {
    setValue("metodePembayaran", metodePembayaran);
  };

  const handleSetUangMuka = (uangMuka: number) => {
    setValue("uangMuka", uangMuka);
  };

  const {
    mutateAsync: mutateUangMukaBooking,
    isPending: isPendingUpdateUangMuka,
  } = useMutation({
    mutationFn: (req: RequestUpdateUangMukaBookingType) => {
      return TransactionServices.updateUangMukaBooking({
        transactionId: req.transactionId,
        req: {
          uangMuka: req.uangMuka,
          metodePembayaran: req.metodePembayaran,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transaction", transactionId],
      });

      handleCloseModal();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const onSubmit = async (
    data: Pick<
      RequestUpdateUangMukaBookingType,
      "metodePembayaran" | "uangMuka"
    >,
  ) => {
    try {
      console.log(data);
      console.log(transactionId);
      if (!transactionId) return;

      await mutateUangMukaBooking({
        ...data,
        transactionId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleSubmit,
    onSubmit,
    isPendingUpdateUangMuka,
    uangMukaController,
    handleSetMetodePembayaran,
    metodePembayaranWatch,
    handleSetUangMuka,
  };
};

export default useModalUpdateUangMuka;
