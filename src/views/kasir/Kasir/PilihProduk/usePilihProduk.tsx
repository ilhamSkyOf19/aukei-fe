import type {
  DetailsForCreate,
  DetailsLocalStorageType,
  ProdukDetailItem,
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
import { useStepStore } from "../../../../stores/stepStore";

type IsErrorsType = "pelanggan" | "details";

// Key localStorage yang digunakan pada flow pilih produk/keranjang
const LOCAL_STORAGE_KEYS = {
  FROM_BOOKING: "from-booking",
  IS_UPDATE_TRANSACTION: "is-update-transaction",
  IS_UPDATE_KERANJANG: "is-update-keranjang",
  PELANGGAN: "pelanggan",
  DETAILS: "details",
  DATA_FROM_KERANJANG: "data-from-keranjang",
  METODE_PEMBAYARAN: "metode-pembayaran",
} as const;

const usePilihProduk = (props: { handleToast: (value: string) => void }) => {
  const { handleToast } = props;

  const { setStep: handleSteps, step } = useStepStore((state) => state);

  const pengguna = useAuthStore((state) => state.pengguna);

  // Mode kasir aktif atau tidak
  const isModeKasir = useIsModeKasirStore((state) => state.isModeKasir);

  // Ambil keranjangId dari search params
  const { keranjangId } = useParams<{ keranjangId: string }>();

  // Parse keranjangId ke number
  const keranjangIdParse = parseId(keranjangId);

  const navigate = useNavigate();

  // Pathname saat ini, dipakai untuk navigate dengan state toast
  const currentPathname = useLocation().pathname;

  // Field form yang sedang error (pelanggan/details)
  const [isErrorsFormState, setIsErrorsFormState] = useState<IsErrorsType[]>(
    [],
  );

  // Flag apakah transaksi ini berasal dari flow booking
  const fromBooking = useMemo<boolean>(() => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEYS.FROM_BOOKING);

    return data ? JSON.parse(data) : null;
  }, []);

  // Modal formulir tambah/edit transaksi produk
  const {
    modalRef: modalFormulirTransaksiRef,
    handleShowModal: showModalFormulirTransaksi,
    handleCloseModal: handleCloseModalFormulirTransaksi,
    dataModal: dataModalFormulirTransaksi,
    idModal: idModalUpdateTransaksi,
  } = useModal<
    Pick<DetailsForCreate, "produkId" | "hargaJual" | "quantity"> &
      Omit<ResponseProdukForKasirType, "id" | "kategori"> & {
        diskon?: number;
      }
  >();

  // Modal konfirmasi umum (misal konfirmasi ubah ke booking)
  const {
    confirm,
    handleConfirm,
    handleCancel: handleCancelConfirm,
    data: dataConfirm,
    modalRef: modalConfirmRef,
  } = useConfirm<{ title: string; deskripsi: string }>();

  // Daftar produk yang dipilih beserta detail harga, diskon, qty, dsb
  const [produkDetails, setProdukDetails] = useState<ProdukDetailItem[]>([]);

  // Buka modal formulir transaksi untuk produk baru; jika produk sudah ada, cukup tambah quantity
  const handleShowModalFormulirTransaksi = (
    params: Pick<DetailsForCreate, "produkId" | "hargaJual" | "quantity"> &
      Omit<ResponseProdukForKasirType, "id" | "kategori"> & {
        diskon?: number;
      },
  ) => {
    const checkExistingProduk = handleAddQuantityForExistingProduk(
      params.produkId,
    );

    if (checkExistingProduk) return;

    showModalFormulirTransaksi(undefined, params);
  };

  // Buka modal formulir transaksi untuk mengubah produk yang sudah ada di daftar
  const handleShowModalFormulirTransaksiForUpdate = (produkId: number) => {
    const findProduk = produkDetails.find((item) => item.id === produkId);

    if (!findProduk) return;

    showModalFormulirTransaksi(findProduk.id, {
      produkId: findProduk.id,
      quantity: findProduk.quantity,
      hargaJual: findProduk.hargaJual,
      img: findProduk.img,
      kode: findProduk.kode,
      nama: findProduk.nama,
      stok: findProduk.stok,
      diskon: findProduk.diskon,
    });
  };

  // Flag apakah sedang dalam mode update transaksi (diinisialisasi dari localStorage)
  const [isUpdateTransaction, setIsUpdateTransaction] = useState<boolean>(
    () => {
      const isUpdateTransaction = localStorage.getItem(
        LOCAL_STORAGE_KEYS.IS_UPDATE_TRANSACTION,
      );
      if (isUpdateTransaction) {
        // Pastikan flag update keranjang tidak aktif bersamaan
        localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_UPDATE_KERANJANG);
        return JSON.parse(isUpdateTransaction);
      } else {
        return false;
      }
    },
  );

  // Data keranjang yang sedang diupdate (jika ada), diinisialisasi dari localStorage
  const [isUpdateKeranjang, _setIsUpdateKeranjang] = useState<{
    pelangganId: number;
  } | null>(() => {
    const isUpdateKeranjang = localStorage.getItem(
      LOCAL_STORAGE_KEYS.IS_UPDATE_KERANJANG,
    );
    if (isUpdateKeranjang) {
      // Pastikan flag update transaction tidak aktif bersamaan
      localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_UPDATE_TRANSACTION);
      return JSON.parse(isUpdateKeranjang);
    } else {
      return null;
    }
  });

  // Data pelanggan yang dipilih, diinisialisasi dari localStorage
  const [pelanggan, setPelanggan] = useState<Pick<
    IPelangganType,
    "id" | "nama" | "noWa"
  > | null>(() => {
    const pelanggan = localStorage.getItem(LOCAL_STORAGE_KEYS.PELANGGAN);
    if (pelanggan) {
      return JSON.parse(pelanggan);
    } else {
      return null;
    }
  });

  // Set pelanggan terpilih dan bersihkan error/relasi data keranjang lama
  const handleSetPelanggan = (
    params: Pick<IPelangganType, "id" | "nama" | "noWa">,
  ) => {
    if (pelanggan?.id === params.id) return;

    // Bersihkan error pelanggan jika sebelumnya ada
    if (isErrorsFormState.includes("pelanggan")) handleClearErrors("pelanggan");
    setPelanggan(params);

    // Pelanggan baru dipilih manual, hapus relasi data dari keranjang sebelumnya
    localStorage.removeItem(LOCAL_STORAGE_KEYS.DATA_FROM_KERANJANG);
  };

  // Hapus salah satu field dari daftar error form
  const handleClearErrors = (field: "pelanggan" | "details") => {
    setIsErrorsFormState((prev) => prev.filter((item) => item !== field));
  };

  // Alert animasi (misal: pelanggan kosong, transaksi kosong)
  const { alert, handleSetAlert } = useAlertAnimation();

  // Modal pilih pelanggan
  const {
    modalRef: modalChoosePelangganRef,
    handleShowModal: handleShowModalChoosePelanggan,
    handleCloseModal: handleCloseModalChoosePelanggan,
  } = useModal();

  // Validasi bahwa pelanggan sudah dipilih dan minimal ada 1 produk;
  // set error state & alert yang sesuai jika tidak valid
  const validatePelangganDanDetails = (): boolean => {
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

    return true;
  };

  // Tambah produk baru ke daftar, atau update produk yang sudah ada (misal ubah qty/diskon)
  const handleAddDetails = (produk: ProdukDetailItem) => {
    // Produk ditambahkan/diubah, bersihkan error "details"
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

      // Jika produk belum ada di daftar, tambahkan sebagai item baru
      if (index === -1) {
        return [...prev, newItem];
      }

      // Jika sudah ada, update item yang bersangkutan
      const updated = [...prev];
      updated[index] = newItem;

      return updated;
    });
  };

  // Jika produk sudah ada di daftar, tambahkan quantity-nya sebanyak 1; return true jika berhasil
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

  // Ganti seluruh daftar produk sekaligus (misal saat load data update transaksi/keranjang)
  const handleAppendMany = (produkList: ProdukDetailItem[]) => {
    setProdukDetails(produkList);
  };

  // Validasi form, lalu simpan detail produk & pelanggan ke localStorage untuk step berikutnya
  const handleLocalStorage = () => {
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

    localStorage.setItem(LOCAL_STORAGE_KEYS.DETAILS, JSON.stringify(data));
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.PELANGGAN,
      JSON.stringify(pelanggan),
    );

    // Data sudah disimpan sebagai transaksi baru dari form ini, bukan mode update
    localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_UPDATE_TRANSACTION);

    // remove from booking
    localStorage.removeItem(LOCAL_STORAGE_KEYS.FROM_BOOKING);

    return true;
  };

  // handle booking
  const handleRedirectBooking = () => {
    const canNext = handleLocalStorage();

    if (!canNext) return;

    // Transaksi jadi booking, metode pembayaran lama tidak relevan lagi
    localStorage.removeItem(LOCAL_STORAGE_KEYS.METODE_PEMBAYARAN);

    return handleSteps(4);
  };

  // Lanjut ke step berikutnya: simpan data, cek stok, dan arahkan ke step yang sesuai
  const handleStepsNext = async (toPembayaran?: boolean) => {
    if (!validatePelangganDanDetails()) return;

    // Cek apakah ada produk dengan stok habis
    const insufficientStock = produkDetails.some(
      (produk) => produk.quantity > produk.stok,
    );

    if (insufficientStock && (!fromBooking || toPembayaran)) {
      // Tawarkan konversi ke booking jika stok tidak mencukupi
      const isConfirm = await confirm({
        title: "Stok Tidak Mencukupi",
        deskripsi:
          "Stok produk tidak mencukupi. Apakah Anda ingin mengubah transaksi ini menjadi Booking?",
      });

      if (!isConfirm) {
        return;
      }

      // remove metode pembayaran
      localStorage.removeItem(LOCAL_STORAGE_KEYS.METODE_PEMBAYARAN);
      // Jika user memilih konversi ke booking, arahkan ke step booking

      // handle local storage
      handleLocalStorage();

      // handle steps
      return handleSteps(4);
    }

    // handle local storage
    handleLocalStorage();

    if (isUpdateTransaction || isUpdateKeranjang || fromBooking)
      navigate(currentPathname, {
        state: {
          toast: "updated_transaction",
        },
      });

    if (fromBooking) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.FROM_BOOKING);
      handleSteps(toPembayaran ? 2 : 4);
    } else {
      handleSteps(2);
    }
  };

  // Batalkan mode update transaksi dan kembali ke step sebelumnya (booking atau normal)
  const handleBatalkanUpdateTransaction = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_UPDATE_TRANSACTION);

    if (fromBooking) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.FROM_BOOKING);
      handleSteps(4);
    } else {
      handleSteps(2);
    }
  };

  // Kosongkan seluruh daftar produk
  const handleRemoveAllDetails = () => {
    setProdukDetails([]);
  };

  // Mutation untuk membuat atau mengupdate keranjang, tergantung ada tidaknya keranjangId
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
        handleRemoveAllDetails();
        setPelanggan(null);

        // Jika ini update keranjang, arahkan kembali ke halaman keranjang pelanggan tsb
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

        // Jika ini update transaksi, bersihkan seluruh state terkait transaksi lama
        if (isUpdateTransaction) {
          localStorage.removeItem(LOCAL_STORAGE_KEYS.DETAILS);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_UPDATE_TRANSACTION);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.METODE_PEMBAYARAN);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.PELANGGAN);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.FROM_BOOKING);

          setIsUpdateTransaction(false);
        }

        handleToast("simpan_keranjang");
      },
      onError: (error) => {
        // Tampilkan alert khusus jika keranjang untuk pelanggan ini sudah ada
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

  // Hapus satu produk dari daftar berdasarkan id
  const removeDetails = (id: number) => {
    setProdukDetails((prev) => prev.filter((item) => item.id !== id));
  };

  // Validasi form, lalu simpan produk terpilih sebagai keranjang baru
  const handleSimpanKeranjang = async () => {
    try {
      if (!validatePelangganDanDetails()) return;

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

  // Batalkan proses simpan keranjang (mode update) dan kembali ke halaman keranjang pelanggan
  const handleBatalkanSimpanKeranjang = () => {
    console.log(isUpdateKeranjang?.pelangganId);

    localStorage.removeItem(LOCAL_STORAGE_KEYS.DETAILS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.PELANGGAN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_UPDATE_KERANJANG);

    navigate(
      `/dashboard/keranjang?pelangganId=${isUpdateKeranjang?.pelangganId}`,
    );
  };

  // Validasi form, lalu simpan perubahan pada keranjang yang sedang diupdate
  const handleSimpanPerubahanKeranjang = async () => {
    try {
      if (!validatePelangganDanDetails()) return false;

      const dataDetails: DetailsForCreate[] = produkDetails.map((item) => ({
        diskon: item.diskon,
        hargaJual: item.hargaJual,
        produkId: item.id,
        quantity: item.quantity,
      }));

      // Bersihkan data form sebelum submit perubahan keranjang
      localStorage.removeItem(LOCAL_STORAGE_KEYS.DETAILS);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.PELANGGAN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_UPDATE_KERANJANG);

      await mutateKeranjang({
        details: dataDetails,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Ekspos state & handler yang dibutuhkan oleh komponen UI pilih produk
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
    step,

    handleRedirectBooking,

    fromBooking,
  };
};

export default usePilihProduk;
