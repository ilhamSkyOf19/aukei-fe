import { useController, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { CreateShadowTransactionType } from "../../../models/shadowTransaction.model";
import { ShadowTransactionValidation } from "../../../validations/shadowTransaction.validation";
import { ShadowTransactionServices } from "../../../services/shadowTransaction.service";

const useModalShadowTransaction = (params: {
  handleCloseModal: () => void;
  handleSetToast: (value: string) => void;
  shadowFeatureId?: number;
}) => {
  // get params
  const { handleCloseModal, handleSetToast, shadowFeatureId } = params;

  // use form
  const { handleSubmit, reset, control, setValue } = useForm<
    Pick<CreateShadowTransactionType, "startDate" | "endDate">
  >({
    resolver: zodResolver(ShadowTransactionValidation.CREATE),
  });

  //   start date controller
  const startDateController = useController({
    control,
    name: "startDate",
  });

  //   end date controller
  const endDateController = useController({
    control,
    name: "endDate",
  });

  // use start date watch
  const startDateWatch = useWatch({
    control,
    name: "startDate",
  });

  // use end date watch
  const endDateWatch = useWatch({
    control,
    name: "endDate",
  });

  // handle set value
  const handleSetValue = (params: { startDate: string; endDate: string }) => {
    setValue("startDate", params.startDate);
    setValue("endDate", params.endDate);
  };

  //   mutation
  const {
    mutateAsync: handleMutateAddShadowTransaction,
    isPending: isPendingAddShadowTransaction,
  } = useMutation({
    mutationFn: (data: CreateShadowTransactionType) => {
      return ShadowTransactionServices.create(data);
    },
    onSuccess: () => {
      // close modal
      handleCloseModal();

      // reset
      reset();

      handleSetToast("created_shadow_transaction");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  //   on submit
  const onSubmit = async (
    data: Pick<CreateShadowTransactionType, "startDate" | "endDate">,
  ) => {
    try {
      if (!shadowFeatureId) return;

      await handleMutateAddShadowTransaction({
        ...data,
        shadowFeatureId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleSubmit,
    onSubmit,
    isPendingAddShadowTransaction,

    startDateController,
    endDateController,

    handleSetValue,
    startDateWatch,
    endDateWatch,
  };
};

export default useModalShadowTransaction;
