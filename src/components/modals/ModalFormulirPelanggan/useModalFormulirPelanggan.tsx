import { useController, useForm } from "react-hook-form";
import type {
  CreatePelangganType,
  ResponsePelangganType,
  UpdatePelangganType,
} from "../../../models/pelanggan.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { ErrorResponse } from "../../../types/response.type";
import { useLocation, useNavigate } from "react-router-dom";
import { PelangganServices } from "../../../services/pelanggan.service";
import { PelangganValidations } from "../../../validations/pelanggan.validation";

const useModalFormulirPelanggan = (params: {
  id?: number;
  data?: ResponsePelangganType;
  handleCloseModal: () => void;
}) => {
  // get params
  const { id, data, handleCloseModal } = params;

  // query client
  const queryClient = useQueryClient();

  // navigate
  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  // use form
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    control,
    setError,
    clearErrors,
  } = useForm<UpdatePelangganType | CreatePelangganType>({
    resolver: zodResolver(
      id ? PelangganValidations.UPDATE : PelangganValidations.CREATE,
    ),
  });

  // handle clear error no wa
  const handleClearErrorNoWa = () => {
    clearErrors("noWa");
  };

  //   reset
  useEffect(() => {
    reset({
      nama: data?.nama ?? "",
      noWa: data?.noWa ?? "",
    });
  }, [data, reset]);

  //   role controller
  const noWaController = useController({
    control,
    name: "noWa",
  });

  //   mutation
  const {
    mutateAsync: handleMutatePelanggan,
    isPending: isPendingMutatePelanggan,
  } = useMutation({
    mutationFn: (data: UpdatePelangganType | CreatePelangganType) => {
      if (id) {
        return PelangganServices.update({
          id: id,
          req: data as UpdatePelangganType,
        });
      } else {
        return PelangganServices.create(data as CreatePelangganType);
      }
    },
    onSuccess: () => {
      // invalidate queries
      queryClient.invalidateQueries({ queryKey: ["pelanggan"] });

      // close modal
      handleCloseModal();

      // reset form
      reset();

      // set toast
      navigate(currentPathname, {
        state: {
          toast: id ? "updated_pelanggan" : "created_pelanggan",
        },
      });
    },
    onError: (err) => {
      if (axios.isAxiosError<ErrorResponse>(err)) {
        if (err.response?.data?.meta?.statusCode === 409) {
          if (
            err?.response?.data?.meta?.customField?.includes(
              "pelanggan_noWa_key",
            )
          ) {
            setError("noWa", {
              message: "Nomor Whatsapp sudah digunakan",
            });
          }
        }
      }
    },
  });

  //   on submit
  const onSubmit = async (data: UpdatePelangganType | CreatePelangganType) => {
    try {
      await handleMutatePelanggan(data);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isDirty,
    isPendingMutatePelanggan,
    noWaController,
    clearErrors,
    handleClearErrorNoWa,
  };
};

export default useModalFormulirPelanggan;
