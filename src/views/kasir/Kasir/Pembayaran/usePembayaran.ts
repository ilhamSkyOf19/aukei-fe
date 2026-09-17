import { useEffect, useMemo, useRef, useState } from "react";
import {
  PAYMENT_METHOD_TYPE,
  type ErrorType,
  type PaymentMethodType,
} from "../../../../types/constant.type";
import type { IPelangganType } from "../../../../models/pelanggan.model";
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  CreateTransactionForRequestType,
  DetailsType,
} from "../../../../models/transaction.model";
import { TransactionServices } from "../../../../services/transaction.service";
import useConfirm from "../../../../hooks/useConfirm";
import triggerAnimation from "../../../../hooks/triggerAnimation";
import type { PayloadPenggunaInternalType } from "../../../../models/penggunaInternal.model";
import useModalCalculator from "../../../../hooks/useModalCalculator";
import useModalTempo from "../../../../hooks/useModalTempo";
import { LOCAL_STORAGE_KEYS } from "../../../../utils/localStorageKeys";
import { getLocalStorageJSON } from "../../../../helpers/helpers";
import { useStepStore } from "../../../../stores/stepStore";
import { useCartStore } from "../../../../stores/useCartStore";
import useUpdateMetodePembayaran from "../../../../hooks/useUpdateMetodePembayaran";

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
  localStorage.removeItem(LOCAL_STORAGE_KEYS.TEMPO);
};

// Susun payload transaksi yang akan dikirim ke API dari data-data pembayaran saat ini
const buildTransactionPayload = ({
  dataDetails,
  dataDiBayar,
  dataFromKeranjang,
  kasir,
  metodePembayaran,
  pelanggan,
  totalAfterDiskon,
}: {
  dataDetails: DetailsType[];
  dataDiBayar: number;
  dataFromKeranjang: { transactionId: number } | null;
  kasir: PayloadPenggunaInternalType;
  metodePembayaran: PaymentMethodType;
  pelanggan: Pick<IPelangganType, "id" | "nama" | "noWa">;
  totalAfterDiskon: number;
}): CreateTransactionForRequestType => {
  // kembalian
  const kembalian = dataDiBayar - totalAfterDiskon;

  return {
    // Sertakan id transaksi jika transaksi berasal dari keranjang (update transaksi)
    ...(dataFromKeranjang && { id: dataFromKeranjang.transactionId }),
    // Sertakan detail tempo jika metode pembayaran menggunakan tempo/cicilan
    details: dataDetails.map((item) => ({
      diskon: item.diskon,
      hargaJual: item.hargaJual,
      produkId: item.produkId,
      quantity: item.quantity,
    })),
    diBayar: dataDiBayar ?? 0,
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

  // transaction id from cart
  const {
    transactionId: transactionIdFromCart,
    resetCart,
    resetNext,
  } = useCartStore((state) => state);

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
      } else {
        return TransactionServices.findTransaksiDraft();
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { setStep: handleSteps } = useStepStore((state) => state);

  // Daftar error validasi yang sedang aktif pada form pembayaran
  const [isErrors, setIsErrors] = useState<ErrorType[]>([]);

  // Nominal uang yang dibayarkan oleh pelanggan
  const [dataDiBayar, setDataDiBayar] = useState<number>(0);

  // Ref tombol Bayar & Atur Tempo, dipakai untuk trigger animasi saat validasi gagal
  const buttonBayarRef = useRef<HTMLButtonElement>(null);
  const buttonAturTempoRef = useRef<HTMLButtonElement>(null);

  // Metode pembayaran terpilih, diinisialisasi dari localStorage
  const metodePembayaran = useMemo(() => {
    return dataTransaksi?.data?.metodePembayaran ?? PAYMENT_METHOD_TYPE.CASH;
  }, [dataTransaksi]);

  // Detail item transaksi (produk, harga, qty, diskon) yang diambil sekali dari localStorage
  const dataDetails = useMemo(() => {
    return dataTransaksi?.data?.details;
  }, [dataTransaksi]);

  // Data tempo (cicilan) jika pelanggan memilih metode pembayaran TEMPO
  const dataTempo = useMemo(() => {
    return dataTransaksi?.data?.tempo;
  }, [dataTransaksi]);

  // Data pelanggan yang sedang bertransaksi, diambil sekali dari localStorage
  const pelanggan = useMemo<Pick<
    IPelangganType,
    "id" | "nama" | "noWa"
  > | null>(() => {
    return dataTransaksi?.data?.pelanggan ?? null;
  }, [dataTransaksi]);

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

  // Total diskon, sub total sebelum diskon, dan total quantity dihitung sekaligus
  // dalam satu kali reduce (bukan 3 reduce terpisah) biar cuma 1x looping data
  const { totalDiskon, subTotalBeforeDiskon, totalQuantity } =
    dataDetails?.reduce(
      (acc, item) => {
        acc.totalDiskon += item.diskon;
        acc.subTotalBeforeDiskon += item.hargaJual * item.quantity;
        acc.totalQuantity += item.quantity;
        return acc;
      },
      { totalDiskon: 0, subTotalBeforeDiskon: 0, totalQuantity: 0 },
    ) ?? { totalDiskon: 0, subTotalBeforeDiskon: 0, totalQuantity: 0 };

  // Total produk (jumlah baris/varian item, bukan jumlah quantity)
  const totalProduk = dataDetails?.length ?? 0;

  // Total harga setelah dikurangi diskon per item + ongkir
  const totalAfterDiskon =
    subTotalBeforeDiskon - totalDiskon + (dataTransaksi?.data?.ongkir ?? 0);

  // mutate update metode pembayaran
  const { isPendingUpdateMetodePembayaran, updateMetodePembayaran } =
    useUpdateMetodePembayaran();

  // Ubah metode pembayaran, sinkronkan ke localStorage, dan bersihkan data terkait metode lama
  const handleMetodePembayaran = async (metode: PaymentMethodType) => {
    if (metodePembayaran === metode || !dataTransaksi?.data?.id) return;

    await updateMetodePembayaran({
      transactionId: dataTransaksi?.data?.id,
      metodePembayaran: metode,
    });

    // // Hapus nominal dibayar jika metode bukan CASH
    // if (metode !== "CASH") localStorage.removeItem(LOCAL_STORAGE_KEYS.DI_BAYAR);
    // // Hapus data tempo jika metode bukan TEMPO
    // if (metode !== "TEMPO") {
    //   localStorage.removeItem(LOCAL_STORAGE_KEYS.TEMPO);
    //   setDataTempo(null);
    // }
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
  }, [metodePembayaran, totalAfterDiskon]);

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

        // check
        if (transactionIdFromCart !== null) {
          resetCart();
          resetNext();
        }

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
    if (
      (dataDiBayar === 0 && metodePembayaran !== "TEMPO") ||
      dataDiBayar < totalAfterDiskon
    ) {
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

      const data = buildTransactionPayload({
        dataDetails: dataDetails.map((item) => ({
          diskon: item.diskon,
          hargaJual: item.hargaJual,
          img: item.produk.img,
          nama: item.produk.nama,
          produkId: item.produk.id,
          quantity: item.quantity,
          kode: item.produk.kode,
          stokTersedia: item.stokTersisa,
        })),
        dataDiBayar,
        dataFromKeranjang,
        kasir,
        metodePembayaran,
        pelanggan,
        totalAfterDiskon,
      });

      // Minta konfirmasi user sebelum transaksi benar-benar dikirim
      const isConfirm = await confirm();
      if (!isConfirm) return;

      await mutateTransaction({
        ...data,
        id: dataTransaksi?.data?.id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Ekspos state & handler yang dibutuhkan oleh komponen UI pembayaran
  return {
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
    totalProduk,
    totalQuantity,
    handleTransaction,
    isPendingTransaction,
    isErrors,
    modalConfirmRef,
    handleConfirm,
    handleCancel,
    buttonBayarRef,
    dataTempo,
    buttonAturTempoRef,
    modalTempoRef,
    handleShowModalTempo,
    handleCloseModalTempo,

    dataTransaksi,
    isLoadingTransaksi,
    isRefetchingTransaksi,

    handleSteps,

    isPendingUpdateMetodePembayaran,
  };
};

export default usePembayaran;
