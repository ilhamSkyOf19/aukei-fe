import { useEffect, useMemo, useRef, useState } from "react";
import type { IPelangganType } from "../../../../models/pelanggan.model";
import type { CreateTransactionForRequestType } from "../../../../models/transaction.model";
import {
  PAYMENT_METHOD_TYPE,
  TRANSACTION_STATUS_TYPE,
  type ErrorType,
  type PaymentMethodType,
} from "../../../../types/constant.type";
import useModalCalculator from "../../../../hooks/useModalCalculator";
import triggerAnimation from "../../../../hooks/triggerAnimation";
import type { PayloadPenggunaInternalType } from "../../../../models/penggunaInternal.model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TransactionServices } from "../../../../services/transaction.service";
import useConfirm from "../../../../hooks/useConfirm";
import { LOCAL_STORAGE_KEYS } from "../../../../utils/localStorageKeys";
import { getLocalStorageJSON } from "../../../../helpers/helpers";
import { useStepStore } from "../../../../stores/stepStore";
import type { ITransactionDetailType } from "../../../../models/transactionDetail.model";

// Persentase minimal DP yang disarankan dari total transaksi
const MINIMAL_DP_PERCENTAGE = 0.3;

// Simpan data ke localStorage dalam bentuk JSON string
const setLocalStorageJSON = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const useBooking = (params: {
  handleToast: (value: string) => void;
  kasir?: PayloadPenggunaInternalType | null;
}) => {
  const { handleToast, kasir } = params;

  const { setStep: handleSteps } = useStepStore((state) => state);

  const queryClient = useQueryClient();

  // ==================== DRAFT TRANSAKSI (SUMBER DATA UTAMA) ====================
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

  // Daftar error validasi yang sedang aktif
  const [isErrors, setIsErrors] = useState<ErrorType[]>([]);

  // Nominal uang yang dibayarkan
  const [dataDiBayar, setDataDiBayar] = useState<number>(0);

  // nominla custom dp
  const [dataCustomDp, setDataCustomDp] = useState<number>(0);

  // handle set data dibayar
  const handleSetCustomDp = (value: number) => {
    setDataCustomDp(value);
  };

  // Metode pembayaran terpilih, diambil dari draft transaksi server
  const metodePembayaran = useMemo<PaymentMethodType | null>(() => {
    return dataTransaksi?.data?.metodePembayaran ?? null;
  }, [dataTransaksi]);

  // Nilai DP yang tersimpan di server (tempo.uangMuka pada draft transaksi)
  const dataDp = useMemo<number | null>(() => {
    if (dataCustomDp) {
      return dataCustomDp;
    } else {
      return dataTransaksi?.data?.tempo?.uangMuka ?? null;
    }
  }, [dataTransaksi, dataCustomDp]);

  // Nilai ongkir yang tersimpan di draft transaksi server
  const dataOngkir = useMemo<number>(() => {
    return dataTransaksi?.data?.ongkir ?? 0;
  }, [dataTransaksi]);

  // Modal konfirmasi sebelum transaksi booking diproses
  const {
    confirm,
    handleCancel: handleCancelConfirm,
    handleConfirm,
    modalRef: modalConfirmRef,
    data: dataConfirm,
  } = useConfirm<{ title: string; deskripsi: string }>();

  // Data pelanggan, diambil dari draft transaksi server
  const pelanggan = useMemo<Pick<
    IPelangganType,
    "id" | "nama" | "noWa"
  > | null>(() => {
    return dataTransaksi?.data?.pelanggan ?? null;
  }, [dataTransaksi?.data?.pelanggan]);

  const dataDetails = useMemo<
    | (Omit<
        ITransactionDetailType,
        "createdAt" | "updatedAt" | "hpp" | "laba"
      > & {
        hargaJualTerakhir: number;
        stokTersisa: number;
      })[]
    | undefined
  >(() => {
    return dataTransaksi?.data?.details;
  }, [dataTransaksi?.data?.details]);

  // Tandai transaksi booking ini akan diubah, lalu kembali ke step pilih produk
  const handleUbahTransaction = () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.IS_UPDATE_TRANSACTION, "true");
    localStorage.setItem(LOCAL_STORAGE_KEYS.FROM_BOOKING, "true");

    handleSteps(1);
  };

  // Batalkan transaksi booking: kembali ke step 1
  const handleBatalTransaction = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.DI_BAYAR);

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

  // ==================== MUTATION: UPDATE METODE PEMBAYARAN ====================
  const {
    mutateAsync: updateMetodePembayaran,
    isPending: isPendingUpdateMetodePembayaran,
  } = useMutation({
    mutationFn: (data: {
      transactionId: number;
      metodePembayaran: PaymentMethodType;
    }) =>
      TransactionServices.updateMetodePembayaran({
        transactionId: data.transactionId,
        data: { metodePembayaran: data.metodePembayaran },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaksi-draft"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // Ubah metode pembayaran & push langsung ke server (draft transaksi)
  const handleMetodePembayaran = async (metode: PaymentMethodType) => {
    if (metodePembayaran === metode || !dataTransaksi?.data?.id) return;

    await updateMetodePembayaran({
      transactionId: dataTransaksi.data.id,
      metodePembayaran: metode,
    });

    if (metode !== "CASH") {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.DI_BAYAR);
    }

    setIsErrors((prev) =>
      prev.filter((item) => item !== "METODE_PEMBAYARAN_KOSONG"),
    );
  };

  // Ringkasan transaksi: total qty, subtotal, diskon, ongkir, total transaksi, dan saran DP (30%)
  const transactionSummary = useMemo(() => {
    if (!dataDetails) {
      return {
        totalQuantity: 0,
        totalUangSubTotal: 0,
        totalUangDiskon: 0,
        totalOngkir: dataOngkir,
        totalUangTransaksi: dataOngkir,
        saranDp: dataOngkir * MINIMAL_DP_PERCENTAGE,
      };
    }

    let totalQuantity = 0;

    let totalUangSubTotal = 0;
    let totalUangDiskon = 0;
    // Ongkir menjadi basis awal, sama seperti pola totalAfterDiskon di usePembayaran
    let totalUangTransaksi = dataOngkir;

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
      totalOngkir: dataOngkir,
      totalUangTransaksi,
      saranDp,
    };
  }, [dataDetails, dataOngkir]);

  // Ref tombol Bayar, dipakai untuk trigger animasi saat validasi gagal
  const buttonBayarRef = useRef<HTMLButtonElement>(null);

  // Mutation untuk membuat transaksi booking baru ke server
  const { mutateAsync: mutateTransaction, isPending: isPendingTransaction } =
    useMutation({
      mutationFn: (data: CreateTransactionForRequestType) =>
        TransactionServices.create(data),
      onSuccess: (data) => {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.DI_BAYAR);

        queryClient.invalidateQueries({ queryKey: ["transaksi-draft"] });

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
    if (!metodePembayaran) {
      setIsErrors((prev) => [...prev, "METODE_PEMBAYARAN_KOSONG"]);
      return false;
    }

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
      if (!dataDetails || !pelanggan || !kasir || !metodePembayaran) return;

      // DP yang dipakai: nilai yang sudah tersimpan di server (input manual, sudah
      // memperhitungkan ongkir lewat transactionSummary.saranDp), jika belum ada
      // input sama sekali pakai saran DP otomatis
      const nilaiDp = dataDp ?? transactionSummary.saranDp;

      const dataTransaction: CreateTransactionForRequestType = {
        id: dataTransaksi?.data?.id,
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
          produkId: item.produk.id,
          quantity: item.quantity,
        })),
        diBayar: dataDiBayar,
        kembalian:
          metodePembayaran === PAYMENT_METHOD_TYPE.CASH
            ? Math.max(0, dataDiBayar - nilaiDp)
            : 0,
        metodePembayaran,
        pelangganId: pelanggan.id,
        kasirId: kasir.id,
      };

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

  // Sinkronkan dataDiBayar setiap kali metode pembayaran / DP / saranDp berubah:
  // - CASH: ambil nominal dari localStorage (input manual)
  // - non-CASH: otomatis set sebesar DP (nilai server / saran, yang sudah mencakup ongkir)
  useEffect(() => {
    if (metodePembayaran === "CASH") {
      const diBayar = getLocalStorageJSON<number>(LOCAL_STORAGE_KEYS.DI_BAYAR);
      setDataDiBayar(diBayar ?? 0);
      return;
    }

    setDataDiBayar(dataDiBayar ?? dataDp ?? transactionSummary.saranDp);
  }, [metodePembayaran, dataDp, dataDiBayar, transactionSummary.saranDp]);

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

    handleSetCustomDp,

    dataDp,

    dataOngkir,

    isLoadingTransaksi,
    isRefetchingTransaksi,

    isPendingUpdateMetodePembayaran,
  };
};

export default useBooking;
