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
import { useToastAnimation } from "../../../hooks/useToast";
import useModal from "../../../hooks/useModal";
import useDeleteProduk from "../../../hooks/useDeleteProduk";
import axios from "axios";
import type { ErrorResponse } from "../../../types/response.type";

const useProdukDetail = () => {
  // state key update
  const [keyUpdate, setKeyUpdate] = useState<string>("");

  // query client
  const queryClient = useQueryClient();

  // current pathname
  const currentPathname = useLocation().pathname;

  // toast
  const { toast, handleSetToast } = useToastAnimation();

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

  // handle redirect formulir
  const handleRedirectFormulir = () => {
    navigate(`${currentPathname}/ubah`);
  };

  // use form
  const {
    register,
    control,
    formState: { errors },
    reset,
    handleSubmit,
    setError,
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

  // img controller
  const imgController = useController({
    name: "img",
    control,
  });

  // controller isi per box
  const isiPerBoxController = useController({
    name: "isiPerBox",
    control,
  });

  // controller stok minimum
  const stokMinimumController = useController({
    name: "stokMinimum",
    control,
  });

  // reset
  useEffect(() => {
    if (!keyUpdate || !dataProduk?.data) return;

    switch (keyUpdate) {
      case "nama":
        reset({ nama: dataProduk.data.nama });
        break;

      case "kode":
        reset({ kode: dataProduk.data.kode });
        break;

      case "kategoriId":
        reset({ kategoriId: dataProduk.data.kategori.id });
        break;

      case "hargaJual":
        reset({ hargaJual: dataProduk.data.hargaJual });
        break;

      case "hargaBeli":
        reset({ hargaBeli: dataProduk.data.hargaBeli });
        break;

      case "isiPerBox":
        reset({ isiPerBox: dataProduk.data.isiPerBox });
        break;

      case "stokMinimum":
        reset({ stokMinimum: dataProduk.data.stokMinimum });
        break;
    }
  }, [keyUpdate, dataProduk, reset]);

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

        // handle toast
        handleSetToast("updated_produk");
      },
      onError: (err) => {
        if (axios.isAxiosError<ErrorResponse>(err)) {
          if (err?.response?.data?.meta?.statusCode === 409) {
            if (
              err?.response?.data?.meta?.customField?.includes(
                "produk_kode_key",
              )
            ) {
              setError("kode", {
                message: "Kode Produk sudah digunakan pada produk lain",
              });
            }
          }
        }
      },
    });

  // handle update
  const onSubmit = async (data: UpdateProdukType) => {
    try {
      const hasValue = Object.values(data).some((value) => value !== undefined);

      if (!hasValue) return;

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

      // check isi per box
      if (data.isiPerBox) {
        formData.append("isiPerBox", data.isiPerBox.toString());
      }

      // check stok minimum
      if (data.stokMinimum) {
        formData.append("stokMinimum", data.stokMinimum.toString());
      }

      // check img
      if (data.img) {
        formData.append("img", data.img);
      }

      await mutateUpdateProduk(formData);
    } catch (error) {
      console.log(error);
    }
  };

  // use modal delete
  const {
    modalRef: modalDeleteRef,
    handleShowModal: handleShowModalDelete,
    handleCloseModal: handleCloseModalDelete,
  } = useModal();

  // mutate delete
  const { handleDeleteProduk, isPendingDeleteProduk } = useDeleteProduk({
    handleCloseModal: handleCloseModalDelete,
    validatedIdParams,
    redirectPathname: currentPathname.split("/").slice(0, -1).join("/"),
  });

  return {
    handleRedirectFormulir,
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
    imgController,
    toast,
    handleDeleteProduk,
    isPendingDeleteProduk,
    modalDeleteRef,
    handleShowModalDelete,
    handleCloseModalDelete,
    isiPerBoxController,
    stokMinimumController,
  };
};

export default useProdukDetail;
