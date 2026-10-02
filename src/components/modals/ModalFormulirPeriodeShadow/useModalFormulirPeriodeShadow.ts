import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { ErrorResponse } from "../../../types/response.type";
import type {
  CreatePeriodeShadowRequestType,
  ResponsePeriodeShadowType,
  UpdatePeriodeShadowRequestType,
} from "../../../models/periodeShadow.model";
import { PeriodeShadowValidation } from "../../../validations/periodeShadow.validation";
import { PeriodeShadowServices } from "../../../services/periodeShadow.service";

const useModalFormulirPeriodeShadow = (params: {
  id?: number;
  data?: ResponsePeriodeShadowType;
  handleSetToast: (value: string) => void;
  handleCloseModal: () => void;
}) => {
  // get params
  const { id, data, handleCloseModal, handleSetToast } = params;

  // query client
  const queryClient = useQueryClient();

  // use form
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setError,
    control,
  } = useForm<UpdatePeriodeShadowRequestType | CreatePeriodeShadowRequestType>({
    resolver: zodResolver(
      id ? PeriodeShadowValidation.UPDATE : PeriodeShadowValidation.CREATE,
    ),
  });

  //   reset
  useEffect(() => {
    reset({
      nilai: data?.nilai ?? undefined,
      tahun: data?.tahun ?? undefined,
    });
  }, [data, reset]);

  //   nilai controller
  const useNilaiController = useController({
    name: "nilai",
    control,
  });

  //   mutation
  const {
    mutateAsync: handlePeriodeShadow,
    isPending: isPendingPeriodeShadow,
  } = useMutation({
    mutationFn: (
      data: UpdatePeriodeShadowRequestType | CreatePeriodeShadowRequestType,
    ) => {
      if (id) {
        return PeriodeShadowServices.update({
          id: id,
          req: data as UpdatePeriodeShadowRequestType,
        });
      } else {
        return PeriodeShadowServices.create(
          data as CreatePeriodeShadowRequestType,
        );
      }
    },
    onSuccess: () => {
      // invalidate queries
      queryClient.invalidateQueries({ queryKey: ["periode-shadow"] });

      // close modal
      handleCloseModal();

      // set toast
      handleSetToast(id ? "updated" : "created");

      // reset
      reset();
    },
    onError: (err) => {
      if (axios.isAxiosError<ErrorResponse>(err)) {
        if (err.response?.data?.meta?.statusCode === 409) {
          setError("tahun", {
            message: "Tahun sudah digunakan",
          });
        }
      }
    },
  });

  //   on submit
  const onSubmit = async (
    data: UpdatePeriodeShadowRequestType | CreatePeriodeShadowRequestType,
  ) => {
    try {
      await handlePeriodeShadow(data);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isPendingPeriodeShadow,
    isDirty,
    useNilaiController,
  };
};

export default useModalFormulirPeriodeShadow;
