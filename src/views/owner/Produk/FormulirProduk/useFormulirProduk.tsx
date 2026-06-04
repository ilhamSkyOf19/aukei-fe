import { useController, useForm } from "react-hook-form";
import type {
  CreateProdukType,
  UpdateProdukType,
} from "../../../../models/produk.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProdukValidation } from "../../../../validations/produk.validation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { KategoriProdukServices } from "../../../../services/kategoriProduk.service";
import { ProdukServices } from "../../../../services/produk.service";
import { useLocation, useNavigate } from "react-router-dom";

const useFormulirProduk = (dataUpdate?: any) => {
  // navigate
  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  // use form
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
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

  // mutation
  const { mutateAsync: mutateProduk, isPending: isPendingMutateProduk } =
    useMutation({
      mutationFn: (data: FormData) => {
        if (dataUpdate) {
          return ProdukServices.update({
            id: dataUpdate.id,
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
            toast: dataUpdate ? "updated_produk" : "created_produk",
          },
        });
      },
      onError: (error) => {
        console.log(error);
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
      if (data.stok !== undefined) {
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

      console.log(data);

      for (const [key, value] of formdData.entries()) {
        console.log(key, value);
      }

      await mutateProduk(formdData);
    } catch (error) {
      console.log(error);
    }
  };

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
    onSubmit,
    handleSubmit,
    isPendingMutateProduk,
  };
};

export default useFormulirProduk;
