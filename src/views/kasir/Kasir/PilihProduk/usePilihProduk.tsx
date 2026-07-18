import type {
  DetailsForCreate,
  DetailsLocalStorageType,
} from "../../../../models/transaction.model";
import { useMemo, useState } from "react";
import type { ResponseProdukForKasirType } from "../../../../models/produk.model";
import type { IPelangganType } from "../../../../models/pelanggan.model";
import { useAlertAnimation } from "../../../../hooks/useAlert";
import useModal from "../../../../hooks/useModal";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { ErrorResponse } from "../../../../types/response.type";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type {
  CreateKeranjangType,
  UpdateKeranjangType,
} from "../../../../models/keranjang.model";
import { KeranjangServices } from "../../../../services/keranjang.service";
import { parseId } from "../../../../helpers/helpers";
import useIsModeKasirStore from "../../../../stores/iseModaKasirStore";
import { useAuthStore } from "../../../../stores/authStore";
import useConfirm from "../../../../hooks/useConfirm";

type IsErrorsType = "pelanggan" | "details";

const usePilihProduk = (props: {
  handleSteps: (value: number) => void;
  handleToast: (value: string) => void;
}) => {
  const { handleSteps, handleToast } = props;

  const pengguna = useAuthStore((state) => state.pengguna);

  // get is mode kasir
  const isModeKasir = useIsModeKasirStore((state) => state.isModeKasir);

  // get search params keranjang id
  const { keranjangId } = useParams<{ keranjangId: string }>();

  // parse
  const keranjangIdParse = parseId(keranjangId);

  // navigate
  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  // state error
  const [isErrorsFormState, setIsErrorsFormState] = useState<IsErrorsType[]>(
    [],
  );

  const fromBooking = useMemo<boolean>(() => {
    const data = localStorage.getItem("from-booking");

    return data ? JSON.parse(data) : null;
  }, []);

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

  // use confirm
  const {
    confirm,
    handleConfirm,
    handleCancel: handleCancelConfirm,
    data: dataConfirm,
    modalRef: modalConfirmRef,
  } = useConfirm<{ title: string; deskripsi: string }>();

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
  const [isUpdateTransaction, setIsUpdateTransaction] = useState<boolean>(
    () => {
      const isUpdateTransaction = localStorage.getItem("is-update-transaction");
      if (isUpdateTransaction) {
        // delete is update keranjang
        localStorage.removeItem("is-update-keranjang");
        return JSON.parse(isUpdateTransaction);
      } else {
        return false;
      }
    },
  );

  // is update keranjang
  const [isUpdateKeranjang, _setIsUpdateKeranjang] = useState<{
    pelangganId: number;
  } | null>(() => {
    const isUpdateKeranjang = localStorage.getItem("is-update-keranjang");
    if (isUpdateKeranjang) {
      // delete is update transaction
      localStorage.removeItem("is-update-transaction");
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

    // clear local storage data from keranjang
    localStorage.removeItem("data-from-keranjang");
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
    // clear errors
    setIsErrorsFormState((prev) => prev.filter((item) => item !== "details"));

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
        stokTersedia: item.stok,
      })) ?? null;

    // set details
    localStorage.setItem("details", JSON.stringify(data));

    // set pelanggan
    localStorage.setItem("pelanggan", JSON.stringify(pelanggan));

    // check is update
    localStorage.removeItem("is-update-transaction");

    return true;
  };

  // handle steps next
  const handleStepsNext = async () => {
    const canNext = handleLocalStorage();

    if (!canNext) return;

    // cek stok produk yang di pilih
    const insufficientStock = produkDetails.some((produk) => produk.stok === 0);

    if (insufficientStock && !fromBooking) {
      // handle confirm
      const isConfirm = await confirm({
        title: "Stok Tidak Mencukupi",
        deskripsi:
          "Stok produk tidak mencukupi. Apakah Anda ingin mengubah transaksi ini menjadi Booking?",
      });

      if (!isConfirm) {
        return;
      }

      // clear metode pembayaran
      localStorage.removeItem("metode-pembayaran");

      // handle redirect
      return handleSteps(4);
    }

    if (isUpdateTransaction)
      navigate(currentPathname, {
        state: {
          toast: "updated_transaction",
        },
      });

    if (fromBooking) {
      localStorage.removeItem("from-booking");
      handleSteps(4);
    } else {
      handleSteps(2);
    }
  };

  // handle batalkan update transaction
  const handleBatalkanUpdateTransaction = () => {
    // remove is update transaction
    localStorage.removeItem("is-update-transaction");

    if (fromBooking) {
      localStorage.removeItem("from-booking");
      handleSteps(4);
    } else {
      handleSteps(2);
    }
  };

  // handle remove all
  const handleRemoveAllDetails = () => {
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
        handleRemoveAllDetails();

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

        // check is update transaction
        if (isUpdateTransaction) {
          localStorage.removeItem("details");
          localStorage.removeItem("is-update-transaction");
          localStorage.removeItem("metode-pembayaran");
          localStorage.removeItem("pelanggan");
          localStorage.removeItem("from-booking");

          setIsUpdateTransaction(false);
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
    localStorage.removeItem("is-update-keranjang");

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
      localStorage.removeItem("is-update-keranjang");

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
    handleRemoveAllDetails,
    pelanggan,
    handleSetPelanggan,
    isErrorsFormState,
    modalChoosePelangganRef,
    handleShowModalChoosePelanggan,
    handleCloseModalChoosePelanggan,
    alert,
    isUpdateTransaction,
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
    isModeKasir,
    pengguna,

    modalConfirmRef,
    handleCancelConfirm,
    dataConfirm,
    handleConfirm,
  };
};

export default usePilihProduk;
