import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AuthValidations } from "../../../validations/auth.validation";
import { AuthServices } from "../../../services/auth.service";
import type { UpdateDataPenggunaType } from "../../../models/penggunaInternal.model";
import { useAuthStore } from "../../../stores/authStore";
import { useEffect } from "react";

const useModalUpdateDataPengguna = (params: {
  handleCloseModal: () => void;
  handleSetToast: (value: string) => void;
}) => {
  // get params
  const { handleCloseModal, handleSetToast } = params;

  //   auth store
  const { setPengguna, pengguna } = useAuthStore((state) => state);

  // use form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Partial<UpdateDataPenggunaType>>({
    resolver: zodResolver(AuthValidations.UPDATE_DATA_PENGGUNA),
  });

  //   reset
  useEffect(() => {
    reset({
      nama: pengguna?.nama ?? undefined,
      email: pengguna?.email ?? undefined,
      username: pengguna?.username ?? undefined,
    });
  }, [pengguna, reset]);

  //   mutation
  const {
    mutateAsync: handleMutateUpdateDataPengguna,
    isPending: isPendingMutateUpdateDataPengguna,
  } = useMutation({
    mutationFn: (data: Partial<UpdateDataPenggunaType>) => {
      return AuthServices.updateDataPengguna(data);
    },
    onSuccess: (data) => {
      //   set pengguna
      if (data.data) {
        setPengguna(data.data);
      }

      // set toast
      handleSetToast("updated_data_pengguna");

      // close modal
      handleCloseModal();

      // reset form
      reset();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  //   on submit
  const onSubmit = async (data: Partial<UpdateDataPenggunaType>) => {
    try {
      await handleMutateUpdateDataPengguna(data);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isPendingMutateUpdateDataPengguna,
  };
};

export default useModalUpdateDataPengguna;
