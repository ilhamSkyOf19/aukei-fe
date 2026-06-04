import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProdukServices } from "../../../services/produk.service";
import { useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import type { UpdateProdukType } from "../../../models/produk.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProdukValidation } from "../../../validations/produk.validation";
import { KategoriProdukServices } from "../../../services/kategoriProduk.service";

const useProdukDetail = () => {
  // state key update
  const [keyUpdate, setKeyUpdate] = useState<string>("");

  // query client
  const queryClient = useQueryClient();

  // current pathname
  const currentPathname = useLocation().pathname;

  // navigate
  const navigate = useNavigate();

  //   get id from params
  const { id } = useParams<{ id: string }>();

  // validated id params
  const validatedIdParams = parseId(id);

  // use query
  const { data: dataProduk, isLoading: isLoadingDataProduk } = useQuery({
    queryKey: ["detail-produk", validatedIdParams],
    queryFn: () => ProdukServices.detail({ id: validatedIdParams! }),
    enabled: !!validatedIdParams,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // is exist data
  const isExistData = dataProduk?.data !== null;

  // use query kategori produk
  const { data: dataKategoriForChoose, isLoading: isLoadingKategoriForChoose } =
    useQuery({
      queryKey: ["kategori-produk"],
      queryFn: () => KategoriProdukServices.findAllForChoose(),
      enabled: isExistData,
      refetchOnWindowFocus: false,
      retry: false,
    });

  // handle redirect detail
  const handleRedirectDetail = () => {
    navigate(`${currentPathname}/${validatedIdParams}`);
  };

  // use form
  const {
    register,
    control,
    formState: { errors },
    setValue,
    reset,
    handleSubmit,
  } = useForm<UpdateProdukType>({
    resolver: zodResolver(ProdukValidation.UPDATE),
  });

  // kategori id controller
  const kategoriController = useController({
    name: "kategoriId",
    control,
  });

  // harga jual controller
  const hargaJualController = useController({
    name: "hargaJual",
    control,
  });

  // harga beli controller
  const hargaBeliController = useController({
    name: "hargaBeli",
    control,
  });

  // reset
  useEffect(() => {
    if (!keyUpdate || !dataProduk?.data) return;

    switch (keyUpdate) {
      case "nama":
        setValue("nama", dataProduk.data.nama);
        break;
      case "kode":
        setValue("kode", dataProduk.data.kode);
        break;
      case "kategoriId":
        setValue("kategoriId", dataProduk.data.kategori.id);
        break;
      case "hargaJual":
        setValue("hargaJual", dataProduk.data.hargaJual);
        break;
      case "hargaBeli":
        setValue("hargaBeli", dataProduk.data.hargaBeli);
        break;
      case "stok":
        setValue("stok", dataProduk.data.stok);
        break;
      case "isiPerBox":
        setValue("isiPerBox", dataProduk.data.isiPerBox);
        break;
      case "stokMinimum":
        setValue("stokMinimum", dataProduk.data.stokMinimum);
        break;
    }
  }, [keyUpdate, dataProduk, setValue]);

  // handle reset form
  const handleResetForm = () => {
    reset(undefined);
    setKeyUpdate("");
  };

  // mutate
  const { mutateAsync: mutateUpdateProduk, isPending: isPendingUpdateProduk } =
    useMutation({
      mutationFn: (req: FormData) =>
        ProdukServices.update({ id: validatedIdParams!, req }),
      onSuccess: () => {
        handleResetForm();

        // refetch
        queryClient.refetchQueries({
          queryKey: ["detail-produk", validatedIdParams],
        });
      },
      onError: (err) => {
        console.log(err);
      },
    });

  // handle update
  const onSubmit = async (data: UpdateProdukType) => {
    try {
      // form data
      const formData = new FormData();

      // check nama
      if (data.nama) {
        formData.append("nama", data.nama);
      }

      // check kode
      if (data.kode) {
        formData.append("kode", data.kode);
      }

      // check kategori
      if (data.kategoriId) {
        formData.append("kategoriId", data.kategoriId.toString());
      }

      // check harga jual
      if (data.hargaJual) {
        formData.append("hargaJual", data.hargaJual.toString());
      }

      // check harga beli
      if (data.hargaBeli) {
        formData.append("hargaBeli", data.hargaBeli.toString());
      }

      // check stok
      if (data.stok) {
        formData.append("stok", data.stok.toString());
      }

      // check isi per box
      if (data.isiPerBox) {
        formData.append("isiPerBox", data.isiPerBox.toString());
      }

      // check stok minimum
      if (data.stokMinimum) {
        formData.append("stokMinimum", data.stokMinimum.toString());
      }

      await mutateUpdateProduk(formData);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleRedirectDetail,
    isExistData,
    isLoadingDataProduk,
    dataProduk,
    handleKeyUpdate: setKeyUpdate,
    handleResetForm,
    keyUpdate,
    register,
    errors,
    onSubmit,
    isPendingUpdateProduk,
    handleSubmit,
    kategoriController,
    dataKategoriForChoose,
    isLoadingKategoriForChoose,
    hargaJualController,
    hargaBeliController,
  };
};

export default useProdukDetail;
