import { useController, useForm } from "react-hook-form";
import type {
  CreatePegawaiForRequestType,
  ResponsePegawaiType,
  UpdatePegawaiForRequestType,
} from "../../../models/pegawai.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { PegawaiValidations } from "../../../validations/pegawai.validation";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PegawaiServices } from "../../../services/pegawai.service";
import axios from "axios";
import type { ErrorResponse } from "../../../types/response.type";
import { useLocation, useNavigate } from "react-router-dom";

const useModalFormulirPegawai = (params: {
  id?: number;
  data?: ResponsePegawaiType;
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
  } = useForm<UpdatePegawaiForRequestType | CreatePegawaiForRequestType>({
    resolver: zodResolver(
      id ? PegawaiValidations.UPDATE : PegawaiValidations.CREATE,
    ),
  });

  //   reset
  useEffect(() => {
    reset({
      nama: data?.nama ?? "",
      role: data?.role ?? undefined,
      username: data?.username ?? "",
      password: "",
      confirmPassword: "",
    });
  }, [data, reset]);

  //   role controller
  const roleController = useController({
    control,
    name: "role",
  });

  //   mutation
  const {
    mutateAsync: handleMutatePegawai,
    isPending: isPendingMutatePegawai,
  } = useMutation({
    mutationFn: (
      data: UpdatePegawaiForRequestType | CreatePegawaiForRequestType,
    ) => {
      if (id) {
        return PegawaiServices.update({
          id: id,
          req: data as UpdatePegawaiForRequestType,
        });
      } else {
        return PegawaiServices.create(data as CreatePegawaiForRequestType);
      }
    },
    onSuccess: () => {
      // invalidate queries
      queryClient.invalidateQueries({ queryKey: ["pegawai"] });

      // close modal
      handleCloseModal();

      // set toast
      navigate(currentPathname, {
        state: {
          toast: id ? "updated_pegawai" : "created_pegawai",
        },
      });
    },
    onError: (err) => {
      if (axios.isAxiosError<ErrorResponse>(err)) {
        if (err.response?.data?.meta?.statusCode === 409) {
          if (
            err?.response?.data?.meta?.customField?.includes(
              "pengguna_internal_username_key",
            )
          ) {
            setError("username", {
              message: "Username sudah digunakan",
            });
          }
        }
      }
    },
  });

  //   on submit
  const onSubmit = async (
    data: UpdatePegawaiForRequestType | CreatePegawaiForRequestType,
  ) => {
    try {
      if (id) {
        if (data.password === "") {
          delete data.password;
          delete data.confirmPassword;
        }
      }

      await handleMutatePegawai(data);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    roleController,
    onSubmit,
    isPendingMutatePegawai,
    isDirty,
  };
};

export default useModalFormulirPegawai;
