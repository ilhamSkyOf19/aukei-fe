import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { TransactionValidation } from "../../../../validations/transaction.validation";
import type {
  CreateTransactionForKeranjangType,
  DetailsForCreate,
  DetailsLocalStorageType,
} from "../../../../models/transaction.model";
import { useEffect, useState } from "react";
import type { ResponseProdukForKasirType } from "../../../../models/produk.model";
import type { IPelangganType } from "../../../../models/pelanggan.model";
import { useAlertAnimation } from "../../../../hooks/useAlert";
import useModal from "../../../../hooks/useModal";
import { useMutation } from "@tanstack/react-query";
import { TransactionServices } from "../../../../services/transaction.service";
import axios from "axios";
import type { ErrorResponse } from "../../../../types/response.type";

const useProduk = (props: {
  handleSteps: (value: number) => void;
  handleToast: (value: string) => void;
  step: number;
}) => {
  const { handleSteps, step, handleToast } = props;

  // state error
  const [isErrorsFormState, setIsErrorsFormState] = useState<string[]>([]);

  // is update
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  // set is update
  useEffect(() => {
    const isUpdate = localStorage.getItem("isUpdateTransaction");

    if (isUpdate) {
      const isUpdateParse: boolean = JSON.parse(isUpdate);
      setIsUpdate(isUpdateParse);
    }
  }, [step]);

  // state pelanggan
  const [pelanggan, setPelanggan] = useState<Pick<
    IPelangganType,
    "id" | "nama" | "noWa"
  > | null>(null);

  // check local storage
  useEffect(() => {
    const pelanggan = localStorage.getItem("pelanggan");
    if (pelanggan) {
      const pelangganParse: Pick<IPelangganType, "id" | "nama" | "noWa"> =
        JSON.parse(pelanggan);
      setPelanggan(pelangganParse);
    }
  }, [step]);

  // handle set pelanggan
  const handleSetPelanggan = (
    params: Pick<IPelangganType, "id" | "nama" | "noWa">,
  ) => {
    if (pelanggan?.id === params.id) return;

    // clear error if existing
    if (isErrorsFormState.includes("pelanggan")) handleClearErrors("pelanggan");
    setPelanggan(params);
  };

  // handle clear errors
  const handleClearErrors = (field: "pelanggan" | "details") => {
    setIsErrorsFormState((prev) => prev.filter((item) => item !== field));
  };

  // use alert
  const { alert, handleSetAlert } = useAlertAnimation();

  //   use modal pelanggan
  const {
    modalRef: modalChoosePelangganRef,
    handleShowModal: handleShowModalChoosePelanggan,
    handleCloseModal: handleCloseModalChoosePelanggan,
  } = useModal();

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
  const { control, getValues, setValue } = useForm<{
    details: DetailsForCreate[];
  }>({
    resolver: zodResolver(TransactionValidation.CREATE),
  });

  const details = useWatch({
    control,
    name: "details",
  });

  // update details
  useEffect(() => {
    if (step !== 1 || !details) return;

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
  }, [details, step]);

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
      Omit<ResponseProdukForKasirType, "id"> & { diskon?: number },
  ) => {
    // clear erros if existing
    if (isErrorsFormState.includes("details")) handleClearErrors("details");

    const details = getValues("details");

    // check existing
    const existingIndex = details?.findIndex(
      (item) => item.produkId === produk.produkId,
    );

    // console.log(existingIndex);

    if (existingIndex !== undefined && existingIndex !== -1) {
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
      diskon: produk.diskon ?? 0,
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

  // handle local storage
  const handleLocalStorage = () => {
    const details = getValues("details");

    // check
    if (details?.length === 0 || !pelanggan) {
      if (details?.length === 0 && !pelanggan) {
        setIsErrorsFormState(["pelanggan", "details"]);
      }

      if (!pelanggan) {
        handleSetAlert("pelanggan_kosong");
        setIsErrorsFormState((prev) => [...prev, "pelanggan"]);
        return false;
      }

      if (details?.length === 0) {
        handleSetAlert("transaksi_kosong");
        setIsErrorsFormState((prev) => [...prev, "details"]);
        return false;
      }
    }

    // data
    const data: DetailsLocalStorageType[] | null =
      details?.map((item, index) => ({
        nama: produkDetails[index].nama,
        kode: produkDetails[index].kode,
        img: produkDetails[index].img,
        diskon: item.diskon,
        hargaJual: item.hargaJual,
        produkId: item.produkId,
        quantity: item.quantity,
      })) ?? null;

    // set details
    localStorage.setItem("details", JSON.stringify(data));

    // set pelanggan
    localStorage.setItem("pelanggan", JSON.stringify(pelanggan));

    // check is update
    if (isUpdate) {
      localStorage.removeItem("isUpdateTransaction");
    }

    return true;
  };

  // handle steps next
  const handleStepsNext = () => {
    const canNext = handleLocalStorage();

    if (!canNext) return;

    handleSteps(2);
  };

  // handle remove all
  const handleRemoveAll = () => {
    removeDetails();
    setProdukDetails([]);
  };

  // handle mutation simpan keranjang
  const {
    mutateAsync: mutateSimpanKeranjang,
    isPending: isPendingSimpanKeranjang,
  } = useMutation({
    mutationFn: (req: CreateTransactionForKeranjangType) => {
      return TransactionServices.createForKeranjang(req);
    },
    onSuccess: () => {
      // set state
      handleRemoveAll();

      // set pelanggan
      setPelanggan(null);

      handleToast("simpan_keranjang");
    },
    onError: (error) => {
      if (axios.isAxiosError<ErrorResponse>(error)) {
        if (error.response?.data?.meta?.statusCode === 400) {
          handleSetAlert("existing_keranjang");
        }
      }
    },
  });

  // handle simpan keranjang
  const handleSimpanKeranjang = async () => {
    try {
      const details = getValues("details");

      // check
      if (details?.length === 0 || !pelanggan) {
        if (details?.length === 0 && !pelanggan) {
          setIsErrorsFormState(["pelanggan", "details"]);
        }

        if (!pelanggan) {
          handleSetAlert("pelanggan_kosong");
          setIsErrorsFormState((prev) => [...prev, "pelanggan"]);
          return false;
        }

        if (details?.length === 0) {
          handleSetAlert("transaksi_kosong");
          setIsErrorsFormState((prev) => [...prev, "details"]);
          return false;
        }
      }

      const dataDetails: DetailsForCreate[] = details.map((item) => ({
        diskon: item.diskon,
        hargaJual: item.hargaJual,
        produkId: item.produkId,
        quantity: item.quantity,
      }));

      await mutateSimpanKeranjang({
        details: dataDetails,
        pelangganId: pelanggan?.id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    fieldsDetails,
    removeDetails,
    handleAppend,
    produkDetails,
    control,
    handleStepsNext,
    handleRemoveAll,
    pelanggan,
    handleSetPelanggan,
    isErrorsFormState,
    modalChoosePelangganRef,
    handleShowModalChoosePelanggan,
    handleCloseModalChoosePelanggan,
    alert,
    isUpdate,
    handleSimpanKeranjang,
    isPendingSimpanKeranjang,
  };
};

export default useProduk;
