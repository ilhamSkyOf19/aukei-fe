import { useEffect } from "react";
import type {
  CreateKategoriProdukType,
  UpdateKategoriProdukType,
} from "../models/kategoriProduk.model";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KategoriProdukValidations } from "../validations/kategori.validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { KategoriProdukServices } from "../services/kategoriProduk.service";
import axios from "axios";
import type { ErrorResponse } from "../types/response.type";
import { useNavigate } from "react-router-dom";

type Props = {
  dataUpdate?: UpdateKategoriProdukType & { id: number };
  handleCloseModal?: () => void;
};

const useFormulirKategoriProduk = ({ dataUpdate, handleCloseModal }: Props) => {
  // query client
  const queryClient = useQueryClient();

  // navigate
  const naviate = useNavigate();

  // use form
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    setError,
  } = useForm<CreateKategoriProdukType | UpdateKategoriProdukType>({
    resolver: zodResolver(
      dataUpdate
        ? KategoriProdukValidations.UPDATE
        : KategoriProdukValidations.CREATE,
    ),
  });

  // reset form
  useEffect(() => {
    reset({
      nama: dataUpdate?.nama ?? "",
      keterangan: dataUpdate?.keterangan ?? "",
    });
  }, [dataUpdate, reset]);

  //   use mutation
  const {
    mutateAsync: handleMutateKategoriProduk,
    isPending: isPendingMutateKategoriProduk,
  } = useMutation({
    mutationFn: (req: CreateKategoriProdukType | UpdateKategoriProdukType) => {
      if (dataUpdate) {
        return KategoriProdukServices.update({
          id: dataUpdate.id,
          req: req as UpdateKategoriProdukType,
        });
      } else {
        return KategoriProdukServices.create(req as CreateKategoriProdukType);
      }
    },
    onSuccess: () => {
      // invalidate
      queryClient.invalidateQueries({ queryKey: ["kategori-produk"] });

      //   close modal
      handleCloseModal?.();

      // set toast
      naviate(".", {
        state: {
          toast: dataUpdate ? "updated_produk" : "created_produk",
        },
      });

      //   reset
      reset();
    },
    onError: (err) => {
      if (axios.isAxiosError<ErrorResponse>(err)) {
        if (
          err?.response?.data?.meta?.customField?.includes(
            "kategori_produk_nama_key",
          )
        ) {
          setError("nama", {
            message: "Kategori Produk sudah ada",
          });
        }
      }
    },
  });

  //   handle submit
  const onSubmit = async (
    dataUpdate: CreateKategoriProdukType | UpdateKategoriProdukType,
  ) => {
    // check keterangan
    if (dataUpdate.keterangan === "") {
      delete dataUpdate.keterangan;
    }

    await handleMutateKategoriProduk(dataUpdate);
  };

  return {
    register,
    errors,
    isPendingMutateKategoriProduk,
    onSubmit,
    handleSubmit,
    reset,
  };
};

export default useFormulirKategoriProduk;
