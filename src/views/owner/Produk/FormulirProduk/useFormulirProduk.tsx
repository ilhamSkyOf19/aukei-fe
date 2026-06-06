import { useController, useForm } from "react-hook-form";
import type {
  CreateProdukType,
  UpdateProdukType,
} from "../../../../models/produk.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProdukValidation } from "../../../../validations/produk.validation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ProdukServices } from "../../../../services/produk.service";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../../helpers/helpers";
import { useEffect } from "react";
import axios from "axios";
import type { ErrorResponse } from "../../../../types/response.type";
import useKategoriForChoose from "../../../../hooks/useKategoriForChoose";

const useFormulirProduk = () => {
  // get id
  const { id } = useParams<{ id: string }>();

  // parse id
  const validatedIdParams = parseId(id);

  // navigate
  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  // query detail
  const { data: dataProdukDetail, isLoading: isLoadingProdukDetail } = useQuery(
    {
      queryKey: ["detail-produk", validatedIdParams],
      queryFn: () => ProdukServices.detail({ id: validatedIdParams! }),
      enabled: !!validatedIdParams,
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  // use form
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
  } = useForm<CreateProdukType | UpdateProdukType>({
    resolver: zodResolver(
      validatedIdParams ? ProdukValidation.UPDATE : ProdukValidation.CREATE,
    ),
  });

  useEffect(() => {
    if (dataProdukDetail?.data) {
      reset({
        nama: dataProdukDetail.data.nama,
        kategoriId: dataProdukDetail.data.kategori.id,
        kode: dataProdukDetail.data.kode,
        hargaJual: dataProdukDetail.data.hargaJual,
        hargaBeli: dataProdukDetail.data.hargaBeli,
        isiPerBox: dataProdukDetail.data.isiPerBox,
        stok: dataProdukDetail.data.stok,
        stokMinimum: dataProdukDetail.data.stokMinimum,
        img: undefined,
      });
    }
  }, [dataProdukDetail?.data]);

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

  // stok controller
  const stokController = useController({
    name: "stok",
    control,
  });

  // stok minimum controller
  const stokMinimumController = useController({
    name: "stokMinimum",
    control,
  });

  // isi per box controller
  const isiPerBoxController = useController({
    name: "isiPerBox",
    control,
  });

  // mutation
  const { mutateAsync: mutateProduk, isPending: isPendingMutateProduk } =
    useMutation({
      mutationFn: (data: FormData) => {
        if (dataProdukDetail?.data) {
          return ProdukServices.update({
            id: dataProdukDetail.data.id,
            req: data,
          });
        } else {
          return ProdukServices.create(data);
        }
      },
      onSuccess: () => {
        // set toast
        navigate(currentPathname.split("/").slice(0, -1).join("/"), {
          state: {
            toast: validatedIdParams ? "updated_produk" : "created_produk",
          },
        });
      },
      onError: (err) => {
        if (axios.isAxiosError<ErrorResponse>(err)) {
          if (
            err?.response?.data?.meta?.customField?.includes("produk_kode_key")
          ) {
            setError("kode", {
              message: "Kode Produk sudah digunakan",
            });
          }
        }
      },
    });

  // on submit
  const onSubmit = async (data: CreateProdukType | UpdateProdukType) => {
    try {
      const formdData = new FormData();

      // check img
      if (data.img) {
        formdData.append("img", data.img);
      }

      // check nama
      if (data.nama) {
        formdData.append("nama", data.nama);
      }

      // check kode
      if (data.kode) {
        formdData.append("kode", data.kode);
      }

      // check kategori id
      if (data.kategoriId) {
        formdData.append("kategoriId", data.kategoriId.toString());
      }

      // check harga beli
      if (data.hargaBeli !== undefined) {
        formdData.append("hargaBeli", data.hargaBeli.toString());
      }

      // check harga jual
      if (data.hargaJual !== undefined) {
        formdData.append("hargaJual", data.hargaJual.toString());
      }

      // check stok
      if (!validatedIdParams && data.stok !== undefined) {
        formdData.append("stok", data.stok.toString());
      }

      // check isi perbox
      if (data.isiPerBox !== undefined) {
        formdData.append("isiPerBox", data.isiPerBox.toString());
      }

      // check stok minimum
      if (data.stokMinimum !== undefined) {
        formdData.append("stokMinimum", data.stokMinimum.toString());
      }

      await mutateProduk(formdData);
    } catch (error) {
      console.log(error);
    }
  };

  //   query kategori
  const { dataKategori, isLoadingKategori } = useKategoriForChoose();

  return {
    register,
    errors,
    fileController,
    kategoriController,
    dataKategori,
    isLoadingKategori,
    hargaBeliController,
    hargaJualController,
    onSubmit,
    handleSubmit,
    isPendingMutateProduk,
    isLoadingProdukDetail,
    dataProdukDetail,
    stokController,

    stokMinimumController,
    isiPerBoxController,
  };
};

export default useFormulirProduk;
