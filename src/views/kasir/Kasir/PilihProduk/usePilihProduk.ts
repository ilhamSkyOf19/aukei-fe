import type {
  DetailsForCreate,
  ResponseTransaksiDraftType, // TODO: pastikan type ini memang diexport dari models/transaction.model
} from "../../../../models/transaction.model";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ResponseProdukForKasirType } from "../../../../models/produk.model";
import { useAlertAnimation } from "../../../../hooks/useAlert";
import useModal from "../../../../hooks/useModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { ErrorResponse } from "../../../../types/response.type";
import { useLocation, useNavigate } from "react-router-dom";
import { KeranjangServices } from "../../../../services/keranjang.service";
import { useAuthStore } from "../../../../stores/authStore";
import useConfirm from "../../../../hooks/useConfirm";
import { useStepStore } from "../../../../stores/stepStore";
import { TransactionServices } from "../../../../services/transaction.service";
import { PelangganServices } from "../../../../services/pelanggan.service";
import { useCartStore } from "../../../../stores/useCartStore";
import { useTransactionComplate } from "../../../../stores/useTransactionComplate";
import useCancelUpdateTransactionComplate from "../../../../hooks/useCancelTransactionUpdateComplate";
import useDeleteTransactionDetailOld from "../../../../hooks/useDeleteTransactionDetailOld";
import useUpdateMetodePembayaran from "../../../../hooks/useUpdateMetodePembayaran";
import { PAYMENT_METHOD_TYPE } from "../../../../types/constant.type";
import { LOCAL_STORAGE_KEYS } from "../../../../utils/localStorageKeys";

type IsErrorsType = "pelanggan" | "details";

// DETAILS, PELANGGAN, DATA_FROM_KERANJANG sudah DIHAPUS dari sini.
// Alasan: produk & pelanggan sekarang selalu diambil live dari query
// "transaksi-draft" (server = source of truth), jadi tidak perlu lagi
// disimpan manual ke localStorage untuk "dibawa" ke step berikutnya.

const usePilihProduk = () => {
  const { setStep: handleSteps, step } = useStepStore((state) => state);

  const pengguna = useAuthStore((state) => state.pengguna);

  const queryClient = useQueryClient();

  // form aktif
  const [formActive, setFormActive] = useState<boolean>(false);

  const navigate = useNavigate();
  const currentPathname = useLocation().pathname;

  // Field form yang sedang error (pelanggan/details)
  const [isErrorsFormState, setIsErrorsFormState] = useState<IsErrorsType[]>(
    [],
  );

  // use update metode pembayaran
  const { isPendingUpdateMetodePembayaran, updateMetodePembayaran } =
    useUpdateMetodePembayaran();

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
        hargaJualOld?: number;
      } & {
        transactionId?: number;
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

  // get cart
  const {
    next: isNextTransaction,
    update: isUpdateKeranjang,
    resetCart,
    transactionId: transactionIdFromCart,
  } = useCartStore((state) => state);

  // get update transaction complate
  const {
    transactionId: transactionIdFromTransactionComplate,
    update: isUpdateTransaksiComplate,
    resetUpdate: resetUpdateTransaksiComplate,
  } = useTransactionComplate((state) => state);

  const {
    data: dataTransaksi,
    isLoading: isLoadingTransaksi,
    isRefetching: isRefetchingTransaksi,
  } = useQuery({
    queryKey: ["transaksi-draft"],
    queryFn: () => {
      if (transactionIdFromCart !== null) {
        return TransactionServices.findTransaksiDraftCartById({
          id: transactionIdFromCart,
        });
      } else if (transactionIdFromTransactionComplate !== null) {
        return TransactionServices.findTransaksiComplateById({
          id: transactionIdFromTransactionComplate,
        });
      } else {
        return TransactionServices.findTransaksiDraft();
      }
    },
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
      hargaJualOld: findDetail.hargaJualOld,
      hargaJual: findDetail.hargaJual,
      img: findDetail.produk.img,
      kode: findDetail.produk.kode,
      nama: findDetail.produk.nama,
      hargaModalRataRata: findDetail.produk.hargaModalRataRata,
      hargaPpn: findDetail.produk.hargaPpn,
      hargaJualTerakhirTransaksi: findDetail.hargaJualTerakhir,
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

    showModalFormulirTransaksi(undefined, {
      ...params,
      transactionId:
        transactionIdFromTransactionComplate ??
        transactionIdFromCart ??
        undefined,
    });
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

    if (insufficientStock && toPembayaran) {
      const isConfirm = await confirm({
        title: "Stok Tidak Mencukupi",
        deskripsi:
          "Stok produk tidak mencukupi. Apakah Anda ingin mengubah transaksi ini menjadi Booking?",
      });

      if (!isConfirm) {
        return;
      }

      return handleSteps(4);
    }

    if (isUpdateTransaction || isUpdateKeranjang)
      navigate(currentPathname, {
        state: {
          toast: "updated_transaction",
        },
      });

    // update di bayar
    localStorage.setItem(LOCAL_STORAGE_KEYS.DI_BAYAR, "0");

    handleSteps(2);
  };

  // handle booking
  const handleRedirectBooking = async () => {
    // localStorage.removeItem(LOCAL_STORAGE_KEYS.METODE_PEMBAYARAN);
    // localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_UPDATE_TRANSACTION);

    if (!dataTransaksi?.data?.id) return;

    // update metode pembayaran
    if (dataTransaksi?.data?.metodePembayaran !== PAYMENT_METHOD_TYPE.CASH) {
      await updateMetodePembayaran({
        transactionId: dataTransaksi?.data?.id,
        metodePembayaran: PAYMENT_METHOD_TYPE.CASH,
      });
    }

    // update di bayar
    localStorage.setItem(LOCAL_STORAGE_KEYS.DI_BAYAR, "0");

    return handleSteps(4);
  };

  // Batalkan mode update transaksi dan kembali ke step sebelumnya
  const handleBatalkanUpdateTransaction = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_UPDATE_TRANSACTION);

    handleSteps(2);
  };

  // Mutation untuk membuat atau mengupdate keranjang
  const { mutateAsync: mutateKeranjang, isPending: isPendingKeranjang } =
    useMutation({
      mutationFn: () => KeranjangServices.create(),
      onSuccess: (data) => {
        // Data draft di server sudah berubah (dikonsumsi jadi keranjang),
        // jadi cukup invalidate query supaya UI ikut ter-refresh —
        // tidak perlu lagi `handleRemoveAllDetails()` / `setPelanggan(null)`.
        queryClient.invalidateQueries({ queryKey: ["transaksi-draft"] });

        if (isUpdateTransaction) {
          localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_UPDATE_TRANSACTION);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.METODE_PEMBAYARAN);
          setIsUpdateTransaction(false);
        }

        navigate(`/dashboard/keranjang?keranjangId=${data?.data?.id}`, {
          state: {
            toast: "simpan_keranjang",
          },
        });
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
      await mutateKeranjang();
    } catch (error) {
      console.log(error);
    }
  };

  // Batalkan proses simpan keranjang (mode update)
  const handleBackKeranjang = () => {
    // reset
    resetCart();
    // navigate
    navigate(`/dashboard/keranjang?keranjangId=${transactionIdFromCart}`);
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
  const hasTriggeredRef = useRef<boolean>(false);

  const { data: dataPelangganTanpaNama } = useQuery({
    queryKey: ["pelanggan-tanpa-nama"],
    queryFn: () => PelangganServices.findByTanpaNama(),
    enabled: dataTransaksi?.data === null,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const {
    mutateAsync: handlePilihPelanggan,
    isPending: isPendingPilihPelanggan,
  } = useMutation({
    mutationFn: (data: { pelangganId: number }) =>
      TransactionServices.pilihPelanggan(data),
    onSuccess: () => {
      handleCloseModalChoosePelanggan();
      queryClient.invalidateQueries({ queryKey: ["transaksi-draft"] });
    },
    onError: (err) => {
      console.log(err);
      hasTriggeredRef.current = false; // izinkan retry kalau gagal
    },
  });

  useEffect(() => {
    const pelangganId = dataPelangganTanpaNama?.data?.id;

    // belum ada data / masih loading -> jangan lanjut
    if (!pelangganId) return;

    // sudah pernah dipanggil / sedang berjalan -> jangan panggil lagi
    if (hasTriggeredRef.current || isPendingPilihPelanggan) return;

    hasTriggeredRef.current = true;

    handlePilihPelanggan({ pelangganId });
  }, [dataPelangganTanpaNama, isPendingPilihPelanggan, handlePilihPelanggan]);

  // get use cancel update transaction complate
  const {
    handleCancelUpdate,
    isPendingCancelUpdate: isPendingCancelUpdateTransactionComplete,
  } = useCancelUpdateTransactionComplate({
    linkBack:
      step === 4
        ? "/dashboard/kasir"
        : `/dashboard/riwayat-transaksi/${transactionIdFromTransactionComplate}`,
    onSuccess: () => resetUpdateTransaksiComplate(),
  });

  // handle cancel update transaction
  const handleCancelUpdateTransactionComplete = async () => {
    try {
      // check id
      if (transactionIdFromTransactionComplate === null) return;

      const isConfirm: boolean = await confirm({
        title: "Peringatan",
        deskripsi:
          "Apakah anda yakin ingin keluar dari ubah produk ini, semua data yang belum disimpan akan hilang?",
      });

      if (!isConfirm) {
        return;
      }

      await handleCancelUpdate(transactionIdFromTransactionComplate);
    } catch (error) {
      console.log(error);
    }
  };

  // handle simpan
  const {
    handleDeleteTransactionDetailOld,
    isPendingDeleteTransactiondetailOld:
      isPendingSimpanPerubahanTransactionComplete,
  } = useDeleteTransactionDetailOld({
    link:
      step === 4
        ? "/dashboard/kasir"
        : `/dashboard/riwayat-transaksi/${transactionIdFromTransactionComplate}`,
    toast: "updated_transaction",
  });

  const handleSimpanPerubahanTransactionComplete = async () => {
    // check id
    if (transactionIdFromTransactionComplate === null) return;

    await handleDeleteTransactionDetailOld(
      transactionIdFromTransactionComplate,
    );

    resetUpdateTransaksiComplate();
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
    handleSetAlert,
    isUpdateTransaction,
    handleSimpanKeranjang,
    isPendingKeranjang,
    isUpdateKeranjang,
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

    isPendingUpdateMetodePembayaran,

    handleRedirectBooking,

    // query state, berguna untuk loading indicator di UI
    isLoadingTransaksi: isLoadingTransaksi || isPendingPilihPelanggan,
    isRefetchingTransaksi,
    variablesRemoveDetail,

    handleRemoveAll,
    isPendingRemoveAll,

    formActive,
    setFormActive,

    dataTransaksi,

    isNextTransaction,

    handleBackKeranjang,

    transactionIdFromCart,

    isUpdateTransaksiComplate,

    handleCancelUpdateTransactionComplete,
    isPendingCancelUpdateTransactionComplete,

    handleSimpanPerubahanTransactionComplete,
    isPendingSimpanPerubahanTransactionComplete,

    transactionIdFromTransactionComplate,
  };
};

export default usePilihProduk;
