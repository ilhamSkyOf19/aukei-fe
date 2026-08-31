import type {
  DetailsForCreate,
  ResponseTransaksiDraftType, // TODO: pastikan type ini memang diexport dari models/transaction.model
} from "../../../../models/transaction.model";
import { useMemo, useState } from "react";
import type { ResponseProdukForKasirType } from "../../../../models/produk.model";
import { useAlertAnimation } from "../../../../hooks/useAlert";
import useModal from "../../../../hooks/useModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { ErrorResponse } from "../../../../types/response.type";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type {
  CreateKeranjangType,
  UpdateKeranjangType,
} from "../../../../models/keranjang.model";
import { KeranjangServices } from "../../../../services/keranjang.service";
import { parseId } from "../../../../helpers/helpers";
import { useAuthStore } from "../../../../stores/authStore";
import useConfirm from "../../../../hooks/useConfirm";
import { useStepStore } from "../../../../stores/stepStore";
import { TransactionServices } from "../../../../services/transaction.service";

type IsErrorsType = "pelanggan" | "details";

// DETAILS, PELANGGAN, DATA_FROM_KERANJANG sudah DIHAPUS dari sini.
// Alasan: produk & pelanggan sekarang selalu diambil live dari query
// "transaksi-draft" (server = source of truth), jadi tidak perlu lagi
// disimpan manual ke localStorage untuk "dibawa" ke step berikutnya.
const LOCAL_STORAGE_KEYS = {
  FROM_BOOKING: "from-booking",
  IS_UPDATE_TRANSACTION: "is-update-transaction",
  IS_UPDATE_KERANJANG: "is-update-keranjang",
  METODE_PEMBAYARAN: "metode-pembayaran",
} as const;

const usePilihProduk = (props: { handleToast: (value: string) => void }) => {
  const { handleToast } = props;

  const { setStep: handleSteps, step } = useStepStore((state) => state);

  const pengguna = useAuthStore((state) => state.pengguna);

  const queryClient = useQueryClient();

  // Ambil keranjangId dari search params
  const { keranjangId } = useParams<{ keranjangId: string }>();
  const keranjangIdParse = parseId(keranjangId);

  const navigate = useNavigate();
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
        detailId?: number;
        hargaModalRataRata: number;
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

  // ================= SUMBER DATA UTAMA =================
  // "produkDetails" dan "pelanggan" TIDAK lagi jadi state lokal
  // (useState + setter) karena setiap perubahan (tambah/hapus produk,
  // ganti pelanggan) sudah langsung hit API dan bikin data di DB
  // up to date. Keduanya sekarang diturunkan langsung dari query ini,
  // supaya otomatis sinkron begitu query di-refetch/invalidate.
  const {
    data: dataTransaksi,
    isLoading: isLoadingTransaksi,
    isRefetching: isRefetchingTransaksi,
  } = useQuery({
    queryKey: ["transaksi-draft"],
    queryFn: () => TransactionServices.findTransaksiDraft(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  // TODO: cek lagi struktur response asli dari service Anda.
  // Kalau axios response-nya dibungkus dua kali (mis. { data: { data: ... } }),
  // ganti jadi `dataTransaksi?.data?.data`.
  const transaksiDraft: ResponseTransaksiDraftType | undefined | null =
    dataTransaksi?.data;

  const produkDetails = useMemo(
    () => transaksiDraft?.details ?? [],
    [transaksiDraft],
  );

  const pelanggan = useMemo(
    () => transaksiDraft?.pelanggan ?? null,
    [transaksiDraft],
  );

  // Alert animasi (misal: pelanggan kosong, transaksi kosong)
  const { alert, handleSetAlert } = useAlertAnimation();

  // Modal pilih pelanggan
  const {
    modalRef: modalChoosePelangganRef,
    handleShowModal: handleShowModalChoosePelanggan,
    handleCloseModal: handleCloseModalChoosePelanggan,
  } = useModal();

  // Validasi bahwa pelanggan sudah dipilih dan minimal ada 1 produk
  const validatePelangganDanDetails = (): boolean => {
    if (produkDetails.length === 0 || !pelanggan) {
      if (produkDetails.length === 0 && !pelanggan) {
        setIsErrorsFormState(["pelanggan", "details"]);
      }

      if (!pelanggan) {
        handleSetAlert("pelanggan_kosong");
        setIsErrorsFormState((prev) => [...prev, "pelanggan"]);
        return false;
      }

      if (produkDetails.length === 0) {
        handleSetAlert("transaksi_kosong");
        setIsErrorsFormState((prev) => [...prev, "details"]);
        return false;
      }
    }

    return true;
  };

  // Buka modal update untuk detail yang sudah ada di draft transaksi.
  // Catatan bentuk data: pada ResponseTransaksiDraftType, `id` = id baris
  // detail transaksi, BUKAN id produk. Id produk ada di `item.produk.id`.
  const handleShowModalFormulirTransaksiForUpdate = (transactionId: number) => {
    const findDetail = produkDetails.find((item) => item.id === transactionId);

    if (!findDetail) return;

    showModalFormulirTransaksi(findDetail.id, {
      detailId: findDetail.id,
      produkId: findDetail.produk.id,
      quantity: findDetail.quantity,
      hargaJual: findDetail.hargaJual,
      img: findDetail.produk.img,
      kode: findDetail.produk.kode,
      nama: findDetail.produk.nama,
      hargaModalRataRata: findDetail.produk.hargaModalRataRata,
      // TODO: `stok` tidak ada di ResponseTransaksiDraftType (hanya ada di
      // ResponseProdukForKasirType). Kalau modal butuh nilai stok terkini,
      // ambil dari data produk asli (mis. dari daftar produk kasir), bukan
      // dari draft transaksi ini.
      stok: 0,
      diskon: findDetail.diskon,
    });
  };

  // Buka modal formulir transaksi untuk produk baru.
  // Increment quantity untuk produk yang sudah ada di draft SEKARANG
  // dilakukan lewat API (di dalam modal / mutation-nya sendiri), bukan
  // lewat state lokal lagi. Di sini kita hanya mengarahkan ke mode
  // "update" kalau produknya sudah ada di draft.
  const handleShowModalFormulirTransaksi = (
    params: Pick<DetailsForCreate, "produkId" | "hargaJual" | "quantity"> &
      Omit<ResponseProdukForKasirType, "id" | "kategori"> & {
        diskon?: number;
        detailId?: number;
        hargaModalRataRata: number;
      },
  ) => {
    const existingDetail = produkDetails.find(
      (item) => item.produk.id === params.produkId,
    );

    if (existingDetail) {
      handleShowModalFormulirTransaksiForUpdate(params.produkId);
      return;
    }

    showModalFormulirTransaksi(undefined, params);
  };

  // Flag apakah sedang dalam mode update transaksi
  const [isUpdateTransaction, setIsUpdateTransaction] = useState<boolean>(
    () => {
      const isUpdateTransaction = localStorage.getItem(
        LOCAL_STORAGE_KEYS.IS_UPDATE_TRANSACTION,
      );
      if (isUpdateTransaction) {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_UPDATE_KERANJANG);
        return JSON.parse(isUpdateTransaction);
      } else {
        return false;
      }
    },
  );

  // Data keranjang yang sedang diupdate (jika ada)
  const [isUpdateKeranjang] = useState<{
    pelangganId: number;
  } | null>(() => {
    const isUpdateKeranjang = localStorage.getItem(
      LOCAL_STORAGE_KEYS.IS_UPDATE_KERANJANG,
    );
    if (isUpdateKeranjang) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_UPDATE_TRANSACTION);
      return JSON.parse(isUpdateKeranjang);
    } else {
      return null;
    }
  });

  // Lanjut ke step berikutnya
  const handleStepsNext = async (toPembayaran?: boolean) => {
    if (!validatePelangganDanDetails()) return;

    // TODO: pengecekan stok tidak mencukupi sebelumnya pakai
    // `produk.quantity > produk.stok`, tapi field `stok` tidak tersedia
    // lagi di ResponseTransaksiDraftType. Validasi stok sebaiknya
    // dilakukan di sisi API saat tambah produk (yang sekarang sudah
    // langsung hit API), atau backend menambahkan flag semacam
    // `hasInsufficientStock` di response transaksi draft.
    const insufficientStock = false;

    if (insufficientStock && (!fromBooking || toPembayaran)) {
      const isConfirm = await confirm({
        title: "Stok Tidak Mencukupi",
        deskripsi:
          "Stok produk tidak mencukupi. Apakah Anda ingin mengubah transaksi ini menjadi Booking?",
      });

      if (!isConfirm) {
        return;
      }

      localStorage.removeItem(LOCAL_STORAGE_KEYS.METODE_PEMBAYARAN);
      return handleSteps(4);
    }

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

  // handle booking
  const handleRedirectBooking = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.METODE_PEMBAYARAN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_UPDATE_TRANSACTION);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.FROM_BOOKING);
    return handleSteps(4);
  };

  // Batalkan mode update transaksi dan kembali ke step sebelumnya
  const handleBatalkanUpdateTransaction = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_UPDATE_TRANSACTION);

    if (fromBooking) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.FROM_BOOKING);
      handleSteps(4);
    } else {
      handleSteps(2);
    }
  };

  // Mutation untuk membuat atau mengupdate keranjang
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
        // Data draft di server sudah berubah (dikonsumsi jadi keranjang),
        // jadi cukup invalidate query supaya UI ikut ter-refresh —
        // tidak perlu lagi `handleRemoveAllDetails()` / `setPelanggan(null)`.
        queryClient.invalidateQueries({ queryKey: ["transaksi-draft"] });

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

        if (isUpdateTransaction) {
          localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_UPDATE_TRANSACTION);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.METODE_PEMBAYARAN);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.FROM_BOOKING);
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

  // Hapus satu produk dari draft transaksi.
  // TODO: ganti `TransactionServices.removeDetailDraft` dengan nama method
  // service yang sebenarnya Anda pakai untuk hapus 1 baris detail transaksi.
  const {
    mutateAsync: mutateRemoveDetail,
    isPending: isPendingRemoveDetail,
    variables: variablesRemoveDetail,
  } = useMutation({
    mutationFn: (detailId: number) =>
      TransactionServices.removeProdukDetails({ detailId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaksi-draft"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const removeDetails = async (id: number) => {
    try {
      await mutateRemoveDetail(id);
    } catch (error) {
      console.log(error);
    }
  };

  // Validasi form, lalu simpan produk terpilih sebagai keranjang baru
  const handleSimpanKeranjang = async () => {
    try {
      if (!validatePelangganDanDetails()) return;

      const dataDetails: DetailsForCreate[] = produkDetails.map((item) => ({
        diskon: item.diskon,
        hargaJual: item.hargaJual,
        produkId: item.produk.id,
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

  // Batalkan proses simpan keranjang (mode update)
  const handleBatalkanSimpanKeranjang = () => {
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
        produkId: item.produk.id,
        quantity: item.quantity,
      }));

      localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_UPDATE_KERANJANG);

      await mutateKeranjang({
        details: dataDetails,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // mutate delete all
  const { mutateAsync: mutateRemoveAll, isPending: isPendingRemoveAll } =
    useMutation({
      mutationFn: (data: { transactionId: number }) =>
        TransactionServices.removeAllProdukDetails(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["transaksi-draft"] });
      },
      onError: (err) => {
        console.log(err);
      },
    });

  // handle remove all
  const handleRemoveAll = async () => {
    try {
      // check id
      if (!dataTransaksi?.data?.id) return;

      await mutateRemoveAll({ transactionId: dataTransaksi.data.id });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    produkDetails,
    handleStepsNext,
    pelanggan,
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
    modalFormulirTransaksiRef,
    handleShowModalFormulirTransaksi,
    handleCloseModalFormulirTransaksi,
    dataModalFormulirTransaksi,
    idModalUpdateTransaksi,
    removeDetails,
    isPendingRemoveDetail,
    handleShowModalFormulirTransaksiForUpdate,
    pengguna,

    modalConfirmRef,
    handleCancelConfirm,
    dataConfirm,
    handleConfirm,
    step,

    handleRedirectBooking,

    fromBooking,

    // query state, berguna untuk loading indicator di UI
    isLoadingTransaksi,
    isRefetchingTransaksi,
    variablesRemoveDetail,

    handleRemoveAll,
    isPendingRemoveAll,
  };
};

export default usePilihProduk;
