import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreateShadowFeatureType,
  ResponseShadowFeatureType,
} from "../../../../models/shadowFeature.model";
import { ShadowFeatureValidation } from "../../../../validations/shadowFeature.validation";
import { ShadowFeatureServices } from "../../../../services/shadowFeature.service";

const useModalAddShadowFeature = (params: {
  handleCloseModal: () => void;
  handleSetToast: (value: string) => void;
  id?: number;
  data?: ResponseShadowFeatureType;
  handleShowModalChoose: () => void;
}) => {
  // get params
  const { data, handleCloseModal, handleShowModalChoose, handleSetToast } =
    params;

  // query client
  const queryClient = useQueryClient();

  // use form
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<CreateShadowFeatureType>({
    resolver: zodResolver(ShadowFeatureValidation.CREATE),
  });

  //   reset
  useEffect(() => {
    reset({
      nama: data?.nama ?? undefined,
    });
  }, [data, reset]);

  //   mutation
  const {
    mutateAsync: handleMutateAddShadowFeature,
    isPending: isPendingAddShadowFeature,
  } = useMutation({
    mutationFn: (data: CreateShadowFeatureType) => {
      return ShadowFeatureServices.create(data);
    },
    onSuccess: () => {
      // invalidate queries
      queryClient.invalidateQueries({ queryKey: ["shadow-feature-list"] });

      // close modal
      handleCloseModal();

      handleShowModalChoose();

      // reset
      reset();

      handleSetToast("created_nilai");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  //   on submit
  const onSubmit = async (data: CreateShadowFeatureType) => {
    try {
      await handleMutateAddShadowFeature(data);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isPendingAddShadowFeature,
    isDirty,
  };
};

export default useModalAddShadowFeature;
