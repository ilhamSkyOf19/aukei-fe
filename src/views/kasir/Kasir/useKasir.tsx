import { zodResolver } from "@hookform/resolvers/zod";
import {
  useController,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { TransactionValidation } from "../../../validations/transaction.validation";
import type {
  CreateTransactionForRequestType,
  DetailsForCreate,
  UpdateTransactionForRequestType,
} from "../../../models/transaction.model";
import { useEffect, useState } from "react";
import type {
  IProduk,
  ProdukResponseType,
  ResponseProdukForKasirType,
} from "../../../models/produk.model";

const useKasir = () => {
  // state steps
  const [step, setStep] = useState<number>(1);

  // handle steps next
  const handleStepsNext = () => setStep((prev) => prev + 1);

  // get id
  const params = useParams<{ id: string }>();

  // parse id
  const validatedId = parseId(params.id);

  //   state img details
  const [produkDetails, setProdukDetails] = useState<
    (Pick<
      ResponseProdukForKasirType,
      | "nama"
      | "img"
      | "hargaJual"
      | "kode"
      | "hargaJualTerakhirTransaksi"
      | "id"
    > & { subTotal: number; diskon: number })[]
  >([]);

  // use form
  const {
    handleSubmit,
    formState: { errors },
    control,
    getValues,
    setValue,
  } = useForm<
    UpdateTransactionForRequestType | CreateTransactionForRequestType
  >({
    resolver: zodResolver(
      validatedId ? TransactionValidation.UPDATE : TransactionValidation.CREATE,
    ),
  });

  const details = useWatch({
    control,
    name: "details",
  });

  // update details
  useEffect(() => {
    console.log(details);
    setProdukDetails((prev) =>
      prev.map((item, index) => {
        const newSubTotal =
          (details?.[index]?.hargaJual ?? 0) *
          (details?.[index]?.quantity ?? 1);
        const newDiskon = details?.[index]?.diskon ?? 0;

        // jika keduanya tidak berubah
        if (item.subTotal === newSubTotal && item.diskon === newDiskon) {
          return item;
        }

        return {
          ...item,
          subTotal: newSubTotal,
          diskon: newDiskon,
        };
      }),
    );
  }, [details]);

  //   controll metode pembayaran
  const metodePembayaranController = useController({
    control,
    name: "metodePembayaran",
  });

  //   controll details
  const {
    fields: fieldsDetails,
    append,
    remove: removeDetails,
  } = useFieldArray({
    control,
    name: "details",
  });

  //   handle append
  const handleAppend = (
    produk: Pick<DetailsForCreate, "hargaJual" | "produkId" | "quantity"> &
      Omit<ResponseProdukForKasirType, "id">,
  ) => {
    const details = getValues("details");

    // check existing
    const existingIndex = details?.findIndex(
      (item) => item.produkId === produk.produkId,
    );

    // console.log(existingIndex);

    if (existingIndex !== -1) {
      const currentQty = details?.[existingIndex ?? 0].quantity ?? 1;

      setValue(`details.${existingIndex ?? 0}.quantity`, currentQty + 1, {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }

    // jika belum ada produk sama
    append({
      produkId: produk.produkId,
      hargaJual: produk.hargaJual,
      diskon: 0,
      quantity: produk.quantity,
    });

    // set state
    setProdukDetails((prev) => [
      ...prev,
      {
        nama: produk.nama,
        kode: produk.kode,
        img: produk.img,
        id: produk.produkId,
        hargaJual: produk.hargaJual,
        hargaJualTerakhirTransaksi: produk.hargaJualTerakhirTransaksi,
        subTotal: produk.hargaJual * produk.quantity,
        diskon: 0,
      },
    ]);
  };

  return {
    errors,
    metodePembayaranController,
    fieldsDetails,
    removeDetails,
    handleAppend,
    produkDetails,
    control,
    step,
    handleStepsNext,
  };
};

export default useKasir;
