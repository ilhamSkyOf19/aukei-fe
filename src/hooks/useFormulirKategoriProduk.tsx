import { useEffect } from "react";
import type {
  CreateKategoriProdukType,
  ResponseKategoriProdukType,
  UpdateKategoriProdukType,
} from "../models/kategoriProduk.model";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KategoriProdukValidations } from "../validations/kategori.validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { KategoriProdukServices } from "../services/kategoriProduk.service";
import axios from "axios";
import type { ErrorResponse } from "../types/response.type";

type Props = {
  data?: Pick<ResponseKategoriProdukType, "id" | "nama" | "keterangan">;
};

const useFormulirKategoriProduk = ({ data }: Props) => {
  // query client
  const queryClient = useQueryClient();

  // use form
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    setError,
  } = useForm<CreateKategoriProdukType | UpdateKategoriProdukType>({
    resolver: zodResolver(
      data
        ? KategoriProdukValidations.UPDATE
        : KategoriProdukValidations.CREATE,
    ),
  });

  // reset form
  useEffect(() => {
    if (data) {
      reset({
        nama: data.nama,
        keterangan: data.keterangan || undefined,
      });
    }
  }, [data, reset]);

  //   use mutation
  const {
    mutateAsync: handleMutateKategoriProduk,
    isPending: isPendingMutateKategoriProduk,
  } = useMutation({
    mutationFn: (req: CreateKategoriProdukType | UpdateKategoriProdukType) => {
      if (data) {
        return KategoriProdukServices.update({
          id: data.id,
          req: req as UpdateKategoriProdukType,
        });
      } else {
        return KategoriProdukServices.create(req as CreateKategoriProdukType);
      }
    },
    onSuccess: () => {
      // invalidate
      queryClient.invalidateQueries({ queryKey: ["kategori-produk"] });

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
    data: CreateKategoriProdukType | UpdateKategoriProdukType,
  ) => {
    // check keterangan
    if (data.keterangan === "") {
      delete data.keterangan;
    }

    await handleMutateKategoriProduk(data);
  };

  return {
    register,
    errors,
    isPendingMutateKategoriProduk,
    onSubmit,
    handleSubmit,
  };
};

export default useFormulirKategoriProduk;
