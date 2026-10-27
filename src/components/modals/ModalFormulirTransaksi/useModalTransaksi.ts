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
import axios from "axios";
import type { ErrorResponse } from "../../../types/response.type";

type DiskonType = "PERCENT" | "RP";

const useModalTransaksi = (params: {
  handleCloseModal: () => void;
  data?: Pick<DetailsForCreate, "produkId" | "hargaJual" | "quantity"> &
    Omit<ResponseProdukForKasirType, "id" | "kategori"> & {
      diskon?: number;
      detailId?: number;
    } & {
      transactionId?: number;
    };
  handleSetAlert: (data: string) => void;
}) => {
  const { handleCloseModal, data, handleSetAlert } = params;

  // state sub total
  const [subTotal, setSubTotal] = useState<number>(0);

  // state total diskon
  const [totalDiskon, setTotalDiskon] = useState<number>(0);

  // state total diskon persen
  const [totalDiskonPersen, setTotalDiskonPersen] = useState<number>(0);

  // use form
  const { control, handleSubmit, reset, setValue } = useForm<DetailsForCreate>({
    resolver: zodResolver(TransactionValidation.DETAILS),
  });

  const [diskonType, setDiskonType] = useState<DiskonType>(() => {
    const value = localStorage.getItem("diskon-type");

    return value === "PERCENT" || value === "RP" ? value : "RP";
  });

  // set default value
  useEffect(() => {
    if (!data) return;

    const harga = Number(data.hargaJual ?? 0);
    const qty = Number(data.quantity ?? 0);
    const totalDiskonData = Number(data.diskon ?? 0);

    // Diskon per unit, karena diskon yang disimpan adalah total diskon
    const diskonPerUnit = qty > 0 ? totalDiskonData / qty : 0;

    // Hitung persentase diskon
    const diskonPersen = harga > 0 ? (diskonPerUnit / harga) * 100 : 0;

    // Reset nilai form
    reset({
      produkId: data.produkId,
      hargaJual: harga,
      quantity: qty,
      diskon: diskonPerUnit,
      diskonPersen,
    });

    // Hitung ulang total transaksi
    const totalHarga = harga * qty;
    const subtotal = totalHarga - totalDiskonData;
    const totalDiskonPersen =
      totalHarga > 0
        ? Number(((totalDiskonData / totalHarga) * 100).toFixed(2))
        : 0;

    // Pertahankan dan perbarui state
    setSubTotal(subtotal);
    setTotalDiskon(totalDiskonData);
    setTotalDiskonPersen(totalDiskonPersen);
  }, [data, reset]);

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

  const diskonPersen = useWatch({
    control,
    name: "diskonPersen",
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      const harga = Number(hargaJual ?? 0);
      const qty = Number(quantity ?? 0);
      const nominalDiskon = Number(diskon ?? 0);

      const totalDiskonBaru = nominalDiskon * qty;
      const totalHarga = harga * qty;
      const subtotal = totalHarga - totalDiskonBaru;

      const totalDiskonPersenBaru =
        totalHarga > 0
          ? Number(((totalDiskonBaru / totalHarga) * 100).toFixed(2))
          : 0;

      setTotalDiskon(totalDiskonBaru);
      setSubTotal(subtotal);
      setTotalDiskonPersen(totalDiskonPersenBaru);
    }, 100);

    return () => clearTimeout(timeout);
  }, [hargaJual, quantity, diskon]);

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

  // diskon persen controller
  const diskonPersenController = useController({
    control,
    name: "diskonPersen",
  });

  useEffect(() => {
    const harga = Number(hargaJual ?? 0);

    if (diskonType === "PERCENT") {
      const persen = Number(diskonPersen ?? 0);
      const nominal = harga > 0 ? (persen / 100) * harga : 0;

      if (Number(diskon ?? 0) !== nominal) {
        setValue("diskon", nominal);
      }
    } else {
      const nominal = Number(diskon ?? 0);
      const persen = harga > 0 ? Math.trunc((nominal / harga) * 100) : 0;

      if (Number(diskonPersen ?? 0) !== persen) {
        setValue("diskonPersen", persen);
      }
    }
  }, [diskonType, diskon, diskonPersen, hargaJual, setValue]);

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
        } else if (data?.transactionId) {
          return TransactionServices.tambahProdukByTransactionId({
            transactionId: data?.transactionId,
            data: req,
          });
        } else {
          return TransactionServices.tambahProduk(req);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["transaksi-draft"] });
      },
      onError: (err) => {
        if (axios.isAxiosError<ErrorResponse>(err)) {
          if (
            err.response?.data.meta.message.includes("stok tidak mencukupi")
          ) {
            handleSetAlert("stock_not_enough");
          }
        }
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

  const handleDiskonType = (value: DiskonType) => {
    const harga = Number(hargaJual ?? 0);

    if (value === diskonType) return;

    if (value === "PERCENT") {
      const nominal = Number(diskon ?? 0);
      const persen = harga > 0 ? (nominal / harga) * 100 : 0;

      setValue("diskonPersen", persen);
    } else {
      const persen = Number(diskonPersen ?? 0);
      const nominal = (persen / 100) * harga;

      setValue("diskon", nominal);
    }

    localStorage.setItem("diskon-type", value);
    setDiskonType(value);
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
    handleDiskonType,
    diskonPersenController,
    diskonType,
    totalDiskonPersen,
  };
};

export default useModalTransaksi;
