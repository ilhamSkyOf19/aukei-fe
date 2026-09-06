import { useController, useForm, useWatch } from "react-hook-form";
import type {
  DetailsForCreate,
  TambahProdukDetailForReqeustType,
} from "../../../models/transaction.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionValidation } from "../../../validations/transaction.validation";
import type { ResponseProdukForKasirType } from "../../../models/produk.model";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TransactionServices } from "../../../services/transaction.service";

const useModalTransaksi = (params: {
  handleCloseModal: () => void;
  data?: Pick<DetailsForCreate, "produkId" | "hargaJual" | "quantity"> &
    Omit<ResponseProdukForKasirType, "id" | "kategori"> & {
      diskon?: number;
      detailId?: number;
    };
}) => {
  const { handleCloseModal, data } = params;

  // state sub total
  const [subTotal, setSubTotal] = useState<number>(0);

  // state total diskon
  const [totalDiskon, setTotalDiskon] = useState<number>(0);

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
        diskon: (data.diskon ?? 0) / data.quantity,
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
      const totalDiskon = (diskon ?? data?.diskon ?? 0) * quantity;

      const total = hargaJual * (quantity ?? data?.quantity ?? 0) - totalDiskon;

      // set total diskon
      setTotalDiskon(totalDiskon);

      setSubTotal(total);
    }, 100);

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

  // query client
  const queryClient = useQueryClient();

  // mutate pilih produk
  const { mutateAsync: handleTambahProduk, isPending: isPendingTambahProduk } =
    useMutation({
      mutationFn: (req: TambahProdukDetailForReqeustType) => {
        if (data?.detailId) {
          return TransactionServices.updateProduk({
            detailId: data?.detailId ?? 0,
            data: {
              diskon: req.detail.diskon,
              hargaJual: req.detail.hargaJual,
              qty: req.detail.quantity,
            },
          });
        } else {
          return TransactionServices.tambahProduk(req);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["transaksi-draft"] });
      },
      onError: (err) => {
        console.log(err);
      },
    });

  //   on submit
  const onSubmit = async (req: DetailsForCreate) => {
    if (req) {
      await handleTambahProduk({
        detail: {
          produkId: req.produkId,
          diskon: (req?.diskon ?? 0) * req.quantity,
          hargaJual: req.hargaJual,
          quantity: req.quantity,
        },
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
    totalDiskon,
    isPendingTambahProduk,
    hargaJual,
  };
};

export default useModalTransaksi;
