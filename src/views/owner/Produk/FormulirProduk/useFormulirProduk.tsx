import React from "react";
import { useController, useForm } from "react-hook-form";
import type {
  CreateProdukType,
  UpdateProdukType,
} from "../../../../models/produk.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProdukValidation } from "../../../../validations/produk.validation";
import { useQuery } from "@tanstack/react-query";
import { KategoriProdukServices } from "../../../../services/kategoriProduk.service";

const useFormulirProduk = (dataUpdate?: any) => {
  // use form
  const {
    register,
    control,
    formState: { errors },
  } = useForm<CreateProdukType | UpdateProdukType>({
    resolver: zodResolver(
      dataUpdate ? ProdukValidation.UPDATE : ProdukValidation.CREATE,
    ),
  });

  // file controller
  const fileController = useController({
    name: "img",
    control,
  });

  //   kategori controller
  const kategoriController = useController({
    name: "kategoriId",
    control,
  });

  //   harga beli controller
  const hargaBeliController = useController({
    name: "hargaBeli",
    control,
  });

  // harga jual controller
  const hargaJualController = useController({
    name: "hargaJual",
    control,
  });

  //   query kategori
  const { data: dataKategori, isLoading: isLoadingKategori } = useQuery({
    queryKey: ["kategori"],
    queryFn: () => KategoriProdukServices.findAllForChoose(),
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    register,
    errors,
    fileController,
    kategoriController,
    dataKategori,
    isLoadingKategori,
    hargaBeliController,
    hargaJualController,
  };
};

export default useFormulirProduk;
