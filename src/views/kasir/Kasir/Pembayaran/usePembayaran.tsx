import { useEffect, useMemo, useRef, useState } from "react";
import {
  PAYMENT_METHOD_TYPE,
  type ErrorType,
  type PaymentMethodType,
} from "../../../../types/constant.type";
import type { IPelangganType } from "../../../../models/pelanggan.model";
import { useMutation } from "@tanstack/react-query";
import type {
  CreateTransactionForRequestType,
  DetailsLocalStorageType,
} from "../../../../models/transaction.model";
import { TransactionServices } from "../../../../services/transaction.service";
import useConfirm from "../../../../hooks/useConfirm";
import triggerAnimation from "../../../../hooks/triggerAnimation";
import type { DataTempoType } from "../../../../models/tempo.model";
import type { PayloadPenggunaInternalType } from "../../../../models/penggunaInternal.model";
import useModalCalculator from "../../../../hooks/useModalCalculator";
import useModalTempo from "../../../../hooks/useModalTempo";
import { LOCAL_STORAGE_KEYS } from "../../../../utils/localStorageKeys";
import { getLocalStorageJSON } from "../../../../helpers/helpers";
import { useStepStore } from "../../../../stores/stepStore";

// Delay debounce saat menyimpan metode pembayaran non-CASH ke localStorage
const METODE_PEMBAYARAN_SYNC_DEBOUNCE_MS = 500;

// Ambil dan parse data JSON dari localStorage, return null jika tidak ada/invalid

// Simpan data ke localStorage dalam bentuk JSON string
const setLocalStorageJSON = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Hapus seluruh data transaksi (details, metode, pelanggan, keranjang, tempo) dari localStorage
const clearTransactionLocalStorage = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.DETAILS);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.METODE_PEMBAYARAN);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.PELANGGAN);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.DATA_FROM_KERANJANG);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.TEMPO);
};

// Susun payload transaksi yang akan dikirim ke API dari data-data pembayaran saat ini
const buildTransactionPayload = ({
  dataDetails,
  dataDiBayar,
  dataFromKeranjang,
  dataTempo,
  kasir,
  metodePembayaran,
  pelanggan,
  totalAfterDiskon,
}: {
  dataDetails: DetailsLocalStorageType[];
  dataDiBayar: number;
  dataFromKeranjang: { transactionId: number } | null;
  dataTempo: DataTempoType | null;
  kasir: PayloadPenggunaInternalType;
  metodePembayaran: PaymentMethodType;
  pelanggan: Pick<IPelangganType, "id" | "nama" | "noWa">;
  totalAfterDiskon: number;
}): CreateTransactionForRequestType => {
  // Jika metode TEMPO, nominal dibayar diambil dari uang muka, bukan dataDiBayar
  const diBayar =
    metodePembayaran === PAYMENT_METHOD_TYPE.TEMPO
      ? dataTempo?.metodePembayaranUangDp === PAYMENT_METHOD_TYPE.CASH
        ? dataTempo?.diBayar
        : (dataTempo?.uangMuka ?? 0)
      : dataDiBayar;

  // kembalian
  const kembalian =
    metodePembayaran === PAYMENT_METHOD_TYPE.TEMPO &&
    dataTempo?.metodePembayaranUangDp === PAYMENT_METHOD_TYPE.CASH
      ? dataTempo.kembalian
      : dataDiBayar - totalAfterDiskon;

  return {
    // Sertakan id transaksi jika transaksi berasal dari keranjang (update transaksi)
    ...(dataFromKeranjang && { id: dataFromKeranjang.transactionId }),
    // Sertakan detail tempo jika metode pembayaran menggunakan tempo/cicilan
    ...(dataTempo && {
      tempo: {
        jumlahCicilan: dataTempo.jumlahCicilan,
        periode: dataTempo.periode,
        uangMuka: dataTempo.uangMuka,
        installments: dataTempo.installments,
      },
      metodePembayaranUangDp: dataTempo.metodePembayaranUangDp,
    }),
    details: dataDetails.map((item) => ({
      diskon: item.diskon,
      hargaJual: item.hargaJual,
      produkId: item.produkId,
      quantity: item.quantity,
    })),
    diBayar: diBayar ?? 0,
    kembalian: kembalian ?? 0,
    metodePembayaran,
    pelangganId: pelanggan.id,
    kasirId: kasir.id,
  };
};

const usePembayaran = (params: {
  handleToast: (value: string) => void;
  kasir?: PayloadPenggunaInternalType | null;
}) => {
  const { handleToast, kasir } = params;

  const { setStep: handleSteps } = useStepStore((state) => state);

  // Daftar error validasi yang sedang aktif pada form pembayaran
  const [isErrors, setIsErrors] = useState<ErrorType[]>([]);

  // Nominal uang yang dibayarkan oleh pelanggan
  const [dataDiBayar, setDataDiBayar] = useState<number>(0);

  // Ref tombol Bayar & Atur Tempo, dipakai untuk trigger animasi saat validasi gagal
  const buttonBayarRef = useRef<HTMLButtonElement>(null);
  const buttonAturTempoRef = useRef<HTMLButtonElement>(null);

  // Metode pembayaran terpilih, diinisialisasi dari localStorage
  const [metodePembayaran, setMetodePembayaran] =
    useState<PaymentMethodType | null>(() =>
      getLocalStorageJSON<PaymentMethodType>(
        LOCAL_STORAGE_KEYS.METODE_PEMBAYARAN,
      ),
    );

  // Detail item transaksi (produk, harga, qty, diskon) yang diambil sekali dari localStorage
  const dataDetails = useMemo<DetailsLocalStorageType[] | null>(
    () =>
      getLocalStorageJSON<DetailsLocalStorageType[]>(
        LOCAL_STORAGE_KEYS.DETAILS,
      ),
    [],
  );

  // Data tempo (cicilan) jika pelanggan memilih metode pembayaran TEMPO
  const [dataTempo, setDataTempo] = useState<DataTempoType | null>(() =>
    getLocalStorageJSON<DataTempoType>(LOCAL_STORAGE_KEYS.TEMPO),
  );

  // Data pelanggan yang sedang bertransaksi, diambil sekali dari localStorage
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

  // Info transaksi asal (jika pembayaran ini lanjutan dari keranjang), diambil sekali
  const dataFromKeranjang = useMemo<{
    transactionId: number;
  } | null>(
    () =>
      getLocalStorageJSON<{ transactionId: number }>(
        LOCAL_STORAGE_KEYS.DATA_FROM_KERANJANG,
      ),
    [],
  );

  // Total diskon dari seluruh item
  const totalDiskon = dataDetails?.reduce((a, b) => a + b.diskon, 0) ?? 0;

  // Sub total harga sebelum dikurangi diskon
  const subTotalBeforeDiskon =
    dataDetails?.reduce((a, b) => a + b.hargaJual * b.quantity, 0) ?? 0;

  // Total harga setelah dikurangi diskon per item
  const totalAfterDiskon =
    dataDetails?.reduce(
      (a, b) => a + (b.hargaJual * b.quantity - b.diskon),
      0,
    ) ?? 0;

  // Ubah metode pembayaran, sinkronkan ke localStorage, dan bersihkan data terkait metode lama
  const handleMetodePembayaran = (metode: PaymentMethodType) => {
    if (metodePembayaran === metode) return;
    setMetodePembayaran(metode);

    setLocalStorageJSON(LOCAL_STORAGE_KEYS.METODE_PEMBAYARAN, metode);

    // Hapus nominal dibayar jika metode bukan CASH
    if (metode !== "CASH") localStorage.removeItem(LOCAL_STORAGE_KEYS.DI_BAYAR);
    // Hapus data tempo jika metode bukan TEMPO
    if (metode !== "TEMPO") {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.TEMPO);
      setDataTempo(null);
    }
    // Bersihkan error "metode pembayaran kosong" karena sudah dipilih
    setIsErrors((prev) =>
      prev.filter((item) => item !== "METODE_PEMBAYARAN_KOSONG"),
    );
  };

  // Modal kalkulator untuk input nominal dibayar
  const {
    handleCloseModalCalculator,
    handleShowModalCalculator,
    modalCalculatorRef,
  } = useModalCalculator({ setIsErrors });

  // Modal pengaturan tempo/cicilan
  const { handleCloseModalTempo, handleShowModalTempo, modalTempoRef } =
    useModalTempo({ setIsErrors });

  // Modal konfirmasi sebelum transaksi diproses
  const {
    confirm,
    handleCancel,
    handleConfirm,
    modalRef: modalConfirmRef,
  } = useConfirm();

  // Simpan nominal yang dibayarkan (dari modal kalkulator) ke state & localStorage
  const handlePay = (value: number) => {
    setLocalStorageJSON(LOCAL_STORAGE_KEYS.DI_BAYAR, value);
    setDataDiBayar(value);
    handleCloseModalCalculator();
  };

  // Sinkronkan dataDiBayar setiap kali metode pembayaran berubah:
  // - CASH: ambil nominal dari localStorage (input manual)
  // - non-CASH: otomatis set sebesar totalAfterDiskon (dengan debounce)
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
      setDataDiBayar(totalAfterDiskon);
    }, METODE_PEMBAYARAN_SYNC_DEBOUNCE_MS);

    return () => clearTimeout(debounce);
  }, [metodePembayaran]);

  // Mutation untuk membuat transaksi baru ke server
  const { mutateAsync: mutateTransaction, isPending: isPendingTransaction } =
    useMutation({
      mutationFn: (data: CreateTransactionForRequestType) =>
        TransactionServices.create(data),
      onSuccess: (data) => {
        // Bersihkan seluruh data pembayaran di localStorage setelah transaksi berhasil
        clearTransactionLocalStorage();
        localStorage.removeItem(LOCAL_STORAGE_KEYS.DI_BAYAR);

        // Simpan id transaksi yang baru dibuat untuk digunakan step selanjutnya (misal cetak struk)
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

  // Validasi form pembayaran sebelum transaksi dikirim; return false + set error jika tidak valid
  const validateBeforeTransaction = (): boolean => {
    // Metode pembayaran wajib dipilih
    if (!metodePembayaran) {
      setIsErrors((prev) => [...prev, "METODE_PEMBAYARAN_KOSONG"]);
      return false;
    }

    // Nominal dibayar wajib diisi untuk metode selain TEMPO
    if (dataDiBayar === 0 && metodePembayaran !== "TEMPO") {
      triggerAnimation(buttonBayarRef);
      setIsErrors((prev) => [...prev, "DATA_DI_BAYAR_KOSONG"]);
      return false;
    }

    // Data tempo wajib diisi jika metode pembayaran TEMPO
    if (metodePembayaran === "TEMPO" && !dataTempo) {
      triggerAnimation(buttonAturTempoRef);
      setIsErrors((prev) => [...prev, "DATA_TEMPO_KOSONG"]);
      return false;
    }

    return true;
  };

  // Proses transaksi: validasi -> susun payload -> konfirmasi -> kirim ke server
  const handleTransaction = async () => {
    try {
      if (!validateBeforeTransaction()) return;
      if (!dataDetails || !pelanggan || !kasir || !metodePembayaran) return;

      const dataTransaction = buildTransactionPayload({
        dataDetails,
        dataDiBayar,
        dataFromKeranjang,
        dataTempo,
        kasir,
        metodePembayaran,
        pelanggan,
        totalAfterDiskon,
      });

      // Minta konfirmasi user sebelum transaksi benar-benar dikirim
      const isConfirm = await confirm();
      if (!isConfirm) return;

      await mutateTransaction(dataTransaction);
    } catch (error) {
      console.log(error);
    }
  };

  // Tandai transaksi sedang diubah (edit) dan kembali ke step 1
  const handleUbahTransaction = () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.IS_UPDATE_TRANSACTION, "true");
    handleSteps(1);
  };

  // Batalkan transaksi: bersihkan data pembayaran di localStorage dan kembali ke step 1
  const handleBatalTransaction = () => {
    clearTransactionLocalStorage();
    handleSteps(1);
  };

  // Ekspos state & handler yang dibutuhkan oleh komponen UI pembayaran
  return {
    handleUbahTransaction,
    metodePembayaran,
    handleMetodePembayaran,
    dataDetails,
    pelanggan,
    handleShowModalCalculator,
    handleCloseModalCalculator,
    modalCalculatorRef,
    handlePay,
    dataDiBayar,
    subTotalBeforeDiskon,
    totalDiskon,
    totalAfterDiskon,
    handleTransaction,
    isPendingTransaction,
    isErrors,
    modalConfirmRef,
    handleConfirm,
    handleCancel,
    buttonBayarRef,
    handleBatalTransaction,
    dataTempo,
    buttonAturTempoRef,
    modalTempoRef,
    handleShowModalTempo,
    handleCloseModalTempo,
    handleSetDataTempo: setDataTempo,
  };
};

export default usePembayaran;
