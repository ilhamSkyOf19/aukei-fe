import type {
  DetailsForCreate,
  DetailsLocalStorageType,
} from "../../../../models/transaction.model";
import { useState } from "react";
import type { ResponseProdukForKasirType } from "../../../../models/produk.model";
import type { IPelangganType } from "../../../../models/pelanggan.model";
import { useAlertAnimation } from "../../../../hooks/useAlert";
import useModal from "../../../../hooks/useModal";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { ErrorResponse } from "../../../../types/response.type";
import { useNavigate, useParams } from "react-router-dom";
import type {
  CreateKeranjangType,
  UpdateKeranjangType,
} from "../../../../models/keranjang.model";
import { KeranjangServices } from "../../../../services/keranjang.service";
import { parseId } from "../../../../helpers/helpers";

const usePilihProduk = (props: {
  handleSteps: (value: number) => void;
  handleToast: (value: string) => void;
}) => {
  const { handleSteps, handleToast } = props;

  // get search params keranjang id
  const { keranjangId } = useParams<{ keranjangId: string }>();

  // parse
  const keranjangIdParse = parseId(keranjangId);

  // navigate
  const navigate = useNavigate();

  // state error
  const [isErrorsFormState, setIsErrorsFormState] = useState<string[]>([]);

  // use modal add transaksi
  const {
    modalRef: modalFormulirTransaksiRef,
    handleShowModal: showModalFormulirTransaksi,
    handleCloseModal: handleCloseModalFormulirTransaksi,
    dataModal: dataModalFormulirTransaksi,
    idModal: idModalUpdateTransaksi,
  } = useModal<
    Pick<DetailsForCreate, "produkId" | "hargaJual" | "quantity"> &
      Omit<ResponseProdukForKasirType, "id"> & {
        diskon?: number;
      }
  >();

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
      | "stok"
    > & { subTotal: number; diskon: number; quantity: number })[]
  >([]);

  // handle show modal add transaksi
  const handleShowModalFormulirTransaksi = (
    params: Pick<DetailsForCreate, "produkId" | "hargaJual" | "quantity"> &
      Omit<ResponseProdukForKasirType, "id"> & {
        diskon?: number;
      },
  ) => {
    const checkExistingProduk = handleAddQuantityForExistingProduk(
      params.produkId,
    );

    if (checkExistingProduk) return;

    showModalFormulirTransaksi(undefined, params);
  };

  // handle show modal formulir transaksi for update
  const handleShowModalFormulirTransaksiForUpdate = (produkId: number) => {
    // find produk details
    const findProduk = produkDetails.find((item) => item.id === produkId);

    if (!findProduk) return;

    showModalFormulirTransaksi(findProduk.id, {
      ...findProduk,
      produkId: findProduk.id,
    });
  };

  // is update
  const [isUpdate, _setIsUpdate] = useState<boolean>(() => {
    const isUpdate = localStorage.getItem("isUpdateTransaction");
    if (isUpdate) {
      // delete is update keranjang
      localStorage.removeItem("isUpdateKeranjang");
      localStorage.removeItem("isLanjutTransaction");
      return JSON.parse(isUpdate);
    } else {
      return false;
    }
  });

  // is update keranjang
  const [isUpdateKeranjang, _setIsUpdateKeranjang] = useState<{
    pelangganId: number;
  } | null>(() => {
    const isUpdateKeranjang = localStorage.getItem("isUpdateKeranjang");
    if (isUpdateKeranjang) {
      // delete is update transaction
      localStorage.removeItem("isUpdateTransaction");
      localStorage.removeItem("isLanjutTransaction");
      return JSON.parse(isUpdateKeranjang);
    } else {
      return null;
    }
  });

  // state pelanggan
  const [pelanggan, setPelanggan] = useState<Pick<
    IPelangganType,
    "id" | "nama" | "noWa"
  > | null>(() => {
    const pelanggan = localStorage.getItem("pelanggan");
    if (pelanggan) {
      return JSON.parse(pelanggan);
    } else {
      return null;
    }
  });

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

  //   handle append
  const handleAddDetails = (
    produk: Pick<
      ResponseProdukForKasirType,
      | "nama"
      | "img"
      | "hargaJual"
      | "kode"
      | "hargaJualTerakhirTransaksi"
      | "id"
      | "stok"
    > & { subTotal: number; diskon: number; quantity: number },
  ) => {
    setProdukDetails((prev) => {
      const index = prev.findIndex((item) => item.id === produk.id);

      const newItem = {
        nama: produk.nama,
        kode: produk.kode,
        img: produk.img,
        id: produk.id,
        hargaJual: produk.hargaJual,
        hargaJualTerakhirTransaksi: produk.hargaJualTerakhirTransaksi,
        subTotal: produk.hargaJual * produk.quantity,
        diskon: produk.diskon,
        quantity: produk.quantity,
        stok: produk.stok,
      };

      // jika belum ada, tambahkan
      if (index === -1) {
        return [...prev, newItem];
      }

      // jika sudah ada, update
      const updated = [...prev];
      updated[index] = newItem;

      return updated;
    });
  };

  // handle add quantity for existing produk
  const handleAddQuantityForExistingProduk = (produkId: number) => {
    const existingIndex = produkDetails.findIndex(
      (item) => item.id === produkId,
    );

    if (existingIndex !== -1) {
      setProdukDetails((prev) => {
        const updatedDetails = [...prev];
        const existingItem = updatedDetails[existingIndex];
        const newQuantity = existingItem.quantity + 1;
        updatedDetails[existingIndex] = {
          ...existingItem,
          quantity: newQuantity,
          subTotal: existingItem.hargaJual * newQuantity,
        };
        return updatedDetails;
      });

      return true;
    }

    return false;
  };

  const handleAppendMany = (
    produkList: (Pick<
      ResponseProdukForKasirType,
      | "nama"
      | "img"
      | "hargaJual"
      | "kode"
      | "hargaJualTerakhirTransaksi"
      | "id"
      | "stok"
    > & { subTotal: number; diskon: number; quantity: number })[],
  ) => {
    setProdukDetails(produkList);
  };

  // handle local storage
  const handleLocalStorage = () => {
    // check
    if (produkDetails?.length === 0 || !pelanggan) {
      if (produkDetails?.length === 0 && !pelanggan) {
        setIsErrorsFormState(["pelanggan", "details"]);
      }

      if (!pelanggan) {
        handleSetAlert("pelanggan_kosong");
        setIsErrorsFormState((prev) => [...prev, "pelanggan"]);
        return false;
      }

      if (produkDetails?.length === 0) {
        handleSetAlert("transaksi_kosong");
        setIsErrorsFormState((prev) => [...prev, "details"]);
        return false;
      }
    }

    // data
    const data: DetailsLocalStorageType[] | null =
      produkDetails.map((item) => ({
        nama: item.nama,
        kode: item.kode,
        img: item.img,
        diskon: item.diskon,
        hargaJual: item.hargaJual,
        produkId: item.id,
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

  // handle batalkan update transaction
  const handleBatalkanUpdateTransaction = () => {
    handleSteps(2);
  };

  // handle remove all
  const handleRemoveAll = () => {
    setProdukDetails([]);
  };

  // handle mutation simpan keranjang
  const { mutateAsync: mutateKeranjang, isPending: isPendingKeranjang } =
    useMutation({
      mutationFn: (req: CreateKeranjangType | UpdateKeranjangType) => {
        if (keranjangIdParse) {
          return KeranjangServices.update({
            id: keranjangIdParse,
            req: req as UpdateKeranjangType,
          });
        } else {
          return KeranjangServices.create(req as CreateKeranjangType);
        }
      },
      onSuccess: (data) => {
        // set state
        handleRemoveAll();

        // set pelanggan
        setPelanggan(null);

        // check is Update keranjang
        if (isUpdateKeranjang) {
          return navigate(
            `/dashboard/keranjang?pelangganId=${data?.data?.pelanggan?.id}`,
            {
              state: {
                toast: "updated_keranjang",
              },
            },
          );
        }

        handleToast("simpan_keranjang");
      },
      onError: (error) => {
        if (axios.isAxiosError<ErrorResponse>(error)) {
          if (error.response?.data?.meta?.statusCode === 400) {
            if (
              error.response?.data?.meta?.customField?.includes(
                "existing_keranjang",
              )
            ) {
              handleSetAlert("existing_keranjang");
            }
          }
        }
      },
    });

  // remove produk in daftar
  const removeDetails = (id: number) => {
    setProdukDetails((prev) => prev.filter((item) => item.id !== id));
  };

  // handle simpan keranjang
  const handleSimpanKeranjang = async () => {
    try {
      // check
      if (produkDetails?.length === 0 || !pelanggan) {
        if (produkDetails?.length === 0 && !pelanggan) {
          setIsErrorsFormState(["pelanggan", "details"]);
        }

        if (!pelanggan) {
          handleSetAlert("pelanggan_kosong");
          setIsErrorsFormState((prev) => [...prev, "pelanggan"]);
          return false;
        }

        if (produkDetails?.length === 0) {
          handleSetAlert("transaksi_kosong");
          setIsErrorsFormState((prev) => [...prev, "details"]);
          return false;
        }
      }

      const dataDetails: DetailsForCreate[] = produkDetails.map((item) => ({
        diskon: item.diskon,
        hargaJual: item.hargaJual,
        produkId: item.id,
        quantity: item.quantity,
      }));

      await mutateKeranjang({
        details: dataDetails,
        pelangganId: pelanggan?.id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // handle batalkan simpan keranjang
  const handleBatalkanSimpanKeranjang = () => {
    console.log(isUpdateKeranjang?.pelangganId);

    // remove local storage
    localStorage.removeItem("details");
    localStorage.removeItem("pelanggan");
    localStorage.removeItem("isUpdateKeranjang");

    // navigate
    navigate(
      `/dashboard/keranjang?pelangganId=${isUpdateKeranjang?.pelangganId}`,
    );
  };

  // mambuat simpan perubahan keranjang
  const handleSimpanPerubahanKeranjang = async () => {
    try {
      // check
      if (produkDetails?.length === 0 || !pelanggan) {
        if (produkDetails?.length === 0 && !pelanggan) {
          setIsErrorsFormState(["pelanggan", "details"]);
        }

        if (!pelanggan) {
          handleSetAlert("pelanggan_kosong");
          setIsErrorsFormState((prev) => [...prev, "pelanggan"]);
          return false;
        }

        if (produkDetails?.length === 0) {
          handleSetAlert("transaksi_kosong");
          setIsErrorsFormState((prev) => [...prev, "details"]);
          return false;
        }
      }

      const dataDetails: DetailsForCreate[] = produkDetails.map((item) => ({
        diskon: item.diskon,
        hargaJual: item.hargaJual,
        produkId: item.id,
        quantity: item.quantity,
      }));

      // clear local storage
      localStorage.removeItem("details");
      localStorage.removeItem("pelanggan");
      localStorage.removeItem("isUpdateKeranjang");

      await mutateKeranjang({
        details: dataDetails,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleAddDetails,
    produkDetails,
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
    handleSimpanPerubahanKeranjang,
    isPendingKeranjang,
    isUpdateKeranjang,
    handleBatalkanSimpanKeranjang,
    handleBatalkanUpdateTransaction,
    handleAppendMany,
    modalFormulirTransaksiRef,
    handleShowModalFormulirTransaksi,
    handleCloseModalFormulirTransaksi,
    dataModalFormulirTransaksi,
    idModalUpdateTransaksi,
    removeDetails,
    handleShowModalFormulirTransaksiForUpdate,
  };
};

export default usePilihProduk;
