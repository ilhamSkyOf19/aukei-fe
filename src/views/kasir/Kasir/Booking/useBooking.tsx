import { useEffect, useMemo, useRef, useState } from "react";
import type { IPelangganType } from "../../../../models/pelanggan.model";
import type {
  CreateTransactionForRequestType,
  DetailsLocalStorageType,
} from "../../../../models/transaction.model";
import {
  PAYMENT_METHOD_TYPE,
  TRANSACTION_STATUS_TYPE,
  type ErrorType,
  type PaymentMethodType,
} from "../../../../types/constant.type";
import useModalCalculator from "../../../../hooks/useModalCalculator";
import triggerAnimation from "../../../../hooks/triggerAnimation";
import type { PayloadPenggunaInternalType } from "../../../../models/penggunaInternal.model";
import { useMutation } from "@tanstack/react-query";
import { TransactionServices } from "../../../../services/transaction.service";
import useConfirm from "../../../../hooks/useConfirm";

// Key localStorage yang digunakan pada flow booking
const LOCAL_STORAGE_KEYS = {
  METODE_PEMBAYARAN: "metode-pembayaran",
  DETAILS: "details",
  PELANGGAN: "pelanggan",
  DATA_FROM_KERANJANG: "data-from-keranjang",
  DI_BAYAR: "di-bayar",
  TRANSACTION: "transaction",
  TEMPO: "tempo",
  IS_UPDATE_TRANSACTION: "is-update-transaction",
  FROM_BOOKING: "from-booking",
} as const;

// Persentase minimal DP yang disarankan dari total transaksi
const MINIMAL_DP_PERCENTAGE = 0.3;

// Delay debounce saat menyimpan metode pembayaran non-CASH ke localStorage
const METODE_PEMBAYARAN_SYNC_DEBOUNCE_MS = 500;

// Ambil dan parse data JSON dari localStorage, return null jika tidak ada/invalid
const getLocalStorageJSON = <T,>(key: string): T | null => {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : null;
  } catch {
    return null;
  }
};

// Simpan data ke localStorage dalam bentuk JSON string
const setLocalStorageJSON = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const useBooking = (params: {
  handleSteps: (value: number) => void;
  handleToast: (value: string) => void;
  kasir?: PayloadPenggunaInternalType | null;
}) => {
  const { handleSteps, handleToast, kasir } = params;

  // Daftar error validasi yang sedang aktif
  const [isErrors, setIsErrors] = useState<ErrorType[]>([]);

  // Nominal uang yang dibayarkan
  const [dataDiBayar, setDataDiBayar] = useState<number>(0);

  // Nominal DP yang diinput manual oleh user (jika null, pakai saran DP otomatis)
  const [dataDp, setDataDp] = useState<number | null>(null);

  // Metode pembayaran terpilih, diinisialisasi dari localStorage
  const [metodePembayaran, setMetodePembayaran] =
    useState<PaymentMethodType | null>(() =>
      getLocalStorageJSON<PaymentMethodType>(
        LOCAL_STORAGE_KEYS.METODE_PEMBAYARAN,
      ),
    );

  // Modal konfirmasi sebelum transaksi booking diproses
  const {
    confirm,
    handleCancel: handleCancelConfirm,
    handleConfirm,
    modalRef: modalConfirmRef,
    data: dataConfirm,
  } = useConfirm<{ title: string; deskripsi: string }>();

  // Data pelanggan, diambil sekali dari localStorage
  const pelanggan = useMemo<Pick<
    IPelangganType,
    "id" | "nama" | "noWa"
  > | null>(
    () =>
      getLocalStorageJSON<Pick<IPelangganType, "id" | "nama" | "noWa">>(
        LOCAL_STORAGE_KEYS.PELANGGAN,
      ),
    [],
  );

  // Detail item transaksi, diambil sekali dari localStorage
  const dataDetails = useMemo<DetailsLocalStorageType[] | null>(
    () =>
      getLocalStorageJSON<DetailsLocalStorageType[]>(
        LOCAL_STORAGE_KEYS.DETAILS,
      ),
    [],
  );

  // Sinkronkan ulang dataDetails ke localStorage setiap kali berubah (misal setelah diedit di step lain)
  useEffect(() => {
    try {
      if (dataDetails) {
        setLocalStorageJSON(LOCAL_STORAGE_KEYS.DETAILS, dataDetails);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.DETAILS);
      }
    } catch (error) {
      console.error("Gagal menyimpan data ke localStorage:", error);
    }
  }, [dataDetails]);

  // Tandai transaksi booking ini akan diubah, lalu kembali ke step pilih produk
  const handleUbahTransaction = () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.IS_UPDATE_TRANSACTION, "true");
    localStorage.setItem(LOCAL_STORAGE_KEYS.FROM_BOOKING, "true");

    handleSteps(1);
  };

  // Batalkan transaksi booking: bersihkan data terkait dan kembali ke step 1
  const handleBatalTransaction = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.DETAILS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.METODE_PEMBAYARAN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.PELANGGAN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.DATA_FROM_KERANJANG);

    handleToast("cancelled");
    handleSteps(1);
  };

  // Simpan nominal yang dibayarkan (dari modal kalkulator) ke state & localStorage
  const handlePay = (value: number) => {
    setLocalStorageJSON(LOCAL_STORAGE_KEYS.DI_BAYAR, value);
    setDataDiBayar(value);
    handleCloseModalCalculator();
  };

  // Modal kalkulator untuk input nominal dibayar
  const {
    handleCloseModalCalculator,
    handleShowModalCalculator,
    modalCalculatorRef,
  } = useModalCalculator({ setIsErrors });

  // Ubah metode pembayaran dan sinkronkan ke localStorage
  const handleMetodePembayaran = (metode: PaymentMethodType) => {
    if (metodePembayaran === metode) return;
    setMetodePembayaran(metode);

    setLocalStorageJSON(LOCAL_STORAGE_KEYS.METODE_PEMBAYARAN, metode);

    // Hapus nominal dibayar jika metode bukan CASH
    if (metode !== "CASH") localStorage.removeItem(LOCAL_STORAGE_KEYS.DI_BAYAR);
  };

  // Ringkasan transaksi: total qty, subtotal, diskon, total transaksi, dan saran DP (30%)
  const transactionSummary = useMemo(() => {
    if (!dataDetails) {
      return {
        totalQuantity: 0,
        totalUangSubTotal: 0,
        totalUangDiskon: 0,
        totalUangTransaksi: 0,
        saranDp: 0,
      };
    }

    let totalQuantity = 0;

    let totalUangSubTotal = 0;
    let totalUangDiskon = 0;
    let totalUangTransaksi = 0;

    for (const item of dataDetails) {
      const quantity = item.quantity;

      totalQuantity += quantity;

      totalUangSubTotal += quantity * (item.hargaJual - item.diskon);
      totalUangDiskon += item.diskon;
      totalUangTransaksi += quantity * item.hargaJual - item.diskon;
    }

    const saranDp = totalUangTransaksi * MINIMAL_DP_PERCENTAGE;

    return {
      totalQuantity,
      totalUangSubTotal,
      totalUangDiskon,
      totalUangTransaksi,
      saranDp,
    };
  }, [dataDetails]);

  // Ref tombol Bayar, dipakai untuk trigger animasi saat validasi gagal
  const buttonBayarRef = useRef<HTMLButtonElement>(null);

  // Mutation untuk membuat transaksi booking baru ke server
  const { mutateAsync: mutateTransaction, isPending: isPendingTransaction } =
    useMutation({
      mutationFn: (data: CreateTransactionForRequestType) =>
        TransactionServices.create(data),
      onSuccess: (data) => {
        // Bersihkan seluruh data booking di localStorage setelah transaksi berhasil
        localStorage.removeItem(LOCAL_STORAGE_KEYS.PELANGGAN);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.DETAILS);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.DI_BAYAR);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.METODE_PEMBAYARAN);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.DATA_FROM_KERANJANG);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.TEMPO);

        // Simpan id transaksi yang baru dibuat untuk digunakan step selanjutnya
        setLocalStorageJSON(LOCAL_STORAGE_KEYS.TRANSACTION, {
          transactionId: data?.data?.id,
        });

        handleToast("created_transaction");
        handleSteps(3);
      },
      onError: (err) => {
        console.log(err);
      },
    });

  // Validasi form booking sebelum transaksi dikirim; return false + set error jika tidak valid
  const validateBeforeTransaction = (): boolean => {
    // Metode pembayaran wajib dipilih
    if (!metodePembayaran) {
      setIsErrors((prev) => [...prev, "METODE_PEMBAYARAN_KOSONG"]);
      return false;
    }

    // Nominal dibayar wajib diisi untuk metode selain TEMPO
    if (!dataDiBayar && metodePembayaran !== "TEMPO") {
      triggerAnimation(buttonBayarRef);
      setIsErrors((prev) => [...prev, "DATA_DI_BAYAR_KOSONG"]);
      return false;
    }

    return true;
  };

  // Proses transaksi booking: validasi -> susun payload -> konfirmasi -> kirim ke server
  const handleTransaction = async () => {
    try {
      if (!validateBeforeTransaction()) return;
      if (!dataDetails || !pelanggan || !kasir) return;

      // DP yang dipakai: input manual jika ada, jika tidak pakai saran DP otomatis
      const nilaiDp = dataDp ?? transactionSummary.saranDp;

      const dataTransaction: CreateTransactionForRequestType = {
        // Sertakan detail tempo (DP) jika metode pembayaran TEMPO
        ...(metodePembayaran === PAYMENT_METHOD_TYPE.TEMPO && {
          tempo: {
            jumlahCicilan: 0,
            periode: 0,
            uangMuka: nilaiDp,
          },
        }),
        status: TRANSACTION_STATUS_TYPE.BOOKING,
        details: dataDetails.map((item) => ({
          diskon: item.diskon,
          hargaJual: item.hargaJual,
          produkId: item.produkId,
          quantity: item.quantity,
        })),
        diBayar: dataDiBayar,
        kembalian: dataDiBayar - nilaiDp,
        metodePembayaran: metodePembayaran,
        pelangganId: pelanggan.id,
        kasirId: kasir.id,
      };

      // Minta konfirmasi user sebelum transaksi booking benar-benar dikirim
      const isConfirm = await confirm({
        title: "Apakah Anda yakin ingin memproses transaksi ini?",
        deskripsi:
          "Pastikan data transaksi telah sesuai. Setelah diproses, transaksi akan disimpan dan siap untuk dicetak.",
      });

      if (!isConfirm) {
        return;
      }

      await mutateTransaction(dataTransaction);
    } catch (error) {
      console.log(error);
    }
  };

  // Sinkronkan dataDiBayar setiap kali metode pembayaran berubah:
  // - CASH: ambil nominal dari localStorage (input manual)
  // - non-CASH: otomatis set sebesar DP (manual/saran) dengan debounce
  useEffect(() => {
    if (metodePembayaran === "CASH") {
      const diBayar = getLocalStorageJSON<number>(LOCAL_STORAGE_KEYS.DI_BAYAR);
      setDataDiBayar(diBayar ?? 0);
      return;
    }

    const debounce = setTimeout(() => {
      setLocalStorageJSON(
        LOCAL_STORAGE_KEYS.METODE_PEMBAYARAN,
        metodePembayaran,
      );
      setDataDiBayar(dataDp ?? transactionSummary.saranDp);
    }, METODE_PEMBAYARAN_SYNC_DEBOUNCE_MS);

    return () => clearTimeout(debounce);
  }, [metodePembayaran]);

  // Ekspos state & handler yang dibutuhkan oleh komponen UI booking
  return {
    pelanggan,
    dataDetails,
    handleUbahTransaction,
    handleBatalTransaction,
    metodePembayaran,
    transactionSummary,
    handleMetodePembayaran,
    isErrors,
    buttonBayarRef,

    modalCalculatorRef,
    handleShowModalCalculator,
    handleCloseModalCalculator,

    handlePay,

    handleTransaction,

    modalConfirmRef,
    handleCancel: handleCancelConfirm,
    handleConfirm,
    dataConfirm,

    isPendingTransaction,

    dataDiBayar,

    setDataDp,

    dataDp,
  };
};

export default useBooking;
