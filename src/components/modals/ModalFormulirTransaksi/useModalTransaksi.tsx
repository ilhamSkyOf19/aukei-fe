import { useController, useForm, useWatch } from "react-hook-form";
import type { DetailsForCreate } from "../../../models/transaction.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionValidation } from "../../../validations/transaction.validation";
import type { ResponseProdukForKasirType } from "../../../models/produk.model";
import { useEffect, useState } from "react";

const useModalTransaksi = (params: {
  handleAppend: (
    data: Pick<
      ResponseProdukForKasirType,
      | "nama"
      | "img"
      | "stok"
      | "hargaJual"
      | "kode"
      | "hargaJualTerakhirTransaksi"
      | "id"
    > & { subTotal: number; diskon: number; quantity: number },
  ) => void;
  handleCloseModal: () => void;
  data?: Pick<DetailsForCreate, "produkId" | "hargaJual" | "quantity"> &
    Omit<ResponseProdukForKasirType, "id"> & {
      diskon?: number;
    };
}) => {
  const { handleAppend, handleCloseModal, data } = params;

  // state sub total
  const [subTotal, setSubTotal] = useState<number>(0);

  // use form
  const { control, handleSubmit, reset } = useForm<DetailsForCreate>({
    resolver: zodResolver(TransactionValidation.DETAILS),
  });

  // set default value
  useEffect(() => {
    if (data) {
      reset({
        produkId: data.produkId,
        hargaJual: data.hargaJual,
        quantity: data.quantity,
        diskon: data.diskon ?? 0,
      });
    }
  }, [data]);

  const hargaJual = useWatch({
    control,
    name: "hargaJual",
  });

  const quantity = useWatch({
    control,
    name: "quantity",
  });

  const diskon = useWatch({
    control,
    name: "diskon",
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      const total =
        (hargaJual ?? data?.hargaJual ?? 0) *
          (quantity ?? data?.quantity ?? 0) -
        (diskon ?? data?.diskon ?? 0);

      setSubTotal(total);
    }, 500);

    return () => clearTimeout(timeout);
  }, [
    hargaJual,
    quantity,
    diskon,
    data?.hargaJual,
    data?.quantity,
    data?.diskon,
  ]);

  // harga controller
  const hargaJualController = useController({
    control,
    name: "hargaJual",
  });

  // diskon controller
  const diskonController = useController({
    control,
    name: "diskon",
  });

  // quantity controller
  const quantityController = useController({
    control,
    name: "quantity",
  });

  //   on submit
  const onSubmit = (req: DetailsForCreate) => {
    if (data) {
      handleAppend({
        id: data.produkId,
        nama: data.nama,
        img: data.img,
        kode: data.kode,
        stok: data.stok,
        subTotal: req.hargaJual * req.quantity - req.diskon,
        hargaJualTerakhirTransaksi: data.hargaJualTerakhirTransaksi,
        hargaJual: req.hargaJual,
        quantity: req.quantity,
        diskon: req.diskon,
      });
    }
    handleCloseModal();
  };

  return {
    hargaJualController,
    diskonController,
    quantityController,
    handleSubmit,
    onSubmit,
    subTotal,
    handleAppend,
    handleCloseModal,
  };
};

export default useModalTransaksi;
