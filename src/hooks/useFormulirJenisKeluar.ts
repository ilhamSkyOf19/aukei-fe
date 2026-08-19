import { useEffect } from "react";
import type { CreateKategoriProdukType } from "../models/kategoriProduk.model";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { ErrorResponse } from "../types/response.type";
import type {
  CreateJenisKeluarType,
  UpdateJenisKeluarType,
} from "../models/jenisKeluar.model";
import { JenisKeluarValidation } from "../validations/jenisKeluar.validation";
import { JenisKeluarServices } from "../services/jenisKeluar.service";

type Props = {
  dataUpdate?: UpdateJenisKeluarType;
  handleCloseModal?: () => void;
  handleSetToast?: (toast: string) => void;
};

const useFormulirjenisKeluar = ({
  dataUpdate,
  handleCloseModal,
  handleSetToast,
}: Props) => {
  // query client
  const queryClient = useQueryClient();

  // use form
  const {
    register,
    formState: { errors, isDirty },
    reset,
    handleSubmit,
    setError,
  } = useForm<CreateJenisKeluarType | Pick<UpdateJenisKeluarType, "nama">>({
    resolver: zodResolver(
      dataUpdate ? JenisKeluarValidation.UPDATE : JenisKeluarValidation.CREATE,
    ),
  });

  // reset form
  useEffect(() => {
    reset({
      nama: dataUpdate?.nama ?? "",
    });
  }, [dataUpdate, reset]);

  //   use mutation
  const {
    mutateAsync: handleMutateJenisKeluar,
    isPending: isPendingMutateJenisKeluar,
  } = useMutation({
    mutationFn: (
      req: CreateJenisKeluarType | Pick<UpdateJenisKeluarType, "nama">,
    ) => {
      if (dataUpdate?.nama && dataUpdate?.id) {
        return JenisKeluarServices.update({
          id: dataUpdate.id,
          req: {
            nama: req.nama,
          },
        });
      } else {
        return JenisKeluarServices.create(req as CreateKategoriProdukType);
      }
    },
    onSuccess: () => {
      // invalidate
      queryClient.invalidateQueries({ queryKey: ["jenis-keluar"] });

      //   close modal
      handleCloseModal?.();

      handleSetToast?.(
        dataUpdate ? "updated_jenis_keluar" : "created_jenis_keluar",
      );

      //   reset
      reset();
    },
    onError: (err) => {
      if (axios.isAxiosError<ErrorResponse>(err)) {
        if (err.response?.data.meta.statusCode === 409) {
          if (
            err.response?.data?.meta?.customField?.includes(
              "JenisKeluar_nama_key",
            )
          ) {
            setError("nama", {
              message: "jenis keluar sudah digunakan",
            });
          }
        }
      }
    },
  });

  //   handle submit
  const onSubmit = async (
    data: CreateJenisKeluarType | Pick<UpdateJenisKeluarType, "nama">,
  ) => {
    await handleMutateJenisKeluar(data);
  };

  return {
    register,
    errors,
    isPendingMutateJenisKeluar,
    onSubmit,
    handleSubmit,
    reset,
    isDirty,
  };
};

export default useFormulirjenisKeluar;
