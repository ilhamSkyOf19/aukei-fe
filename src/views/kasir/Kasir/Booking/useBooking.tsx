import { useEffect, useMemo, useRef, useState } from "react";
import type { IPelangganType } from "../../../../models/pelanggan.model";
import type {
  CreateTransactionForRequestType,
  DetailsLocalStorageType,
} from "../../../../models/transaction.model";
import {
  TRANSACTION_STATUS_TYPE,
  type ErrorType,
  type PaymentMethodType,
} from "../../../../types/constant.type";
import type { DataTempoType } from "../../../../models/tempo.model";
import useModalTempo from "../../../../hooks/useModalTempo";
import useModalCalculator from "../../../../hooks/useModalCalculator";
import triggerAnimation from "../../../../hooks/triggerAnimation";
import type { PayloadPenggunaInternalType } from "../../../../models/penggunaInternal.model";
import { useMutation } from "@tanstack/react-query";
import { TransactionServices } from "../../../../services/transaction.service";
import useConfirm from "../../../../hooks/useConfirm";

const useBooking = (params: {
  handleSteps: (value: number) => void;
  handleToast: (value: string) => void;
  kasir?: PayloadPenggunaInternalType | null;
}) => {
  const { handleSteps, handleToast, kasir } = params;

  const [isErrors, setIsErrors] = useState<ErrorType[]>([]);

  const [dataDiBayar, setDataDiBayar] = useState<number>(0);

  const [dataDp, setDataDp] = useState<number | null>(null);

  // state metode pembayaran
  const [metodePembayaran, setMetodePembayaran] =
    useState<PaymentMethodType | null>(() => {
      const metodePembayaran = localStorage.getItem("metode-pembayaran");

      if (metodePembayaran) {
        return JSON.parse(metodePembayaran);
      } else {
        return null;
      }
    });

  // use confirm
  const {
    confirm,
    handleCancel: handleCancelConfirm,
    handleConfirm,
    modalRef: modalConfirmRef,
    data: dataConfirm,
  } = useConfirm<{ title: string; deskripsi: string }>();

  // state open formulir
  const [isOpenFormulirKirimStok, setisOpenFormulirKirimStok] = useState<{
    id: number;
    status: boolean;
  } | null>(null);

  // get pelanggan
  const pelanggan = useMemo<Pick<
    IPelangganType,
    "id" | "nama" | "noWa"
  > | null>(() => {
    const data = localStorage.getItem("pelanggan");

    return data ? JSON.parse(data) : null;
  }, []);

  // get keranjang
  const [dataDetails, setDataDetails] = useState<
    DetailsLocalStorageType[] | null
  >(() => {
    try {
      const details = localStorage.getItem("details");
      return details ? JSON.parse(details) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (dataDetails) {
        localStorage.setItem("details", JSON.stringify(dataDetails));
      } else {
        localStorage.removeItem("details");
      }
    } catch (error) {
      console.error("Gagal menyimpan data ke localStorage:", error);
    }
  }, [dataDetails]);

  const handleSetData = (stok: number) => {
    setDataDetails((prev) => {
      if (!prev || !isOpenFormulirKirimStok) return prev;

      return prev.map((item) =>
        item.produkId === isOpenFormulirKirimStok.id
          ? {
              ...item,
              stokDikirim: stok,
            }
          : item,
      );
    });

    handleToast("update_stok_dikirim");

    // close
    setisOpenFormulirKirimStok(null);
  };

  const handleUbahTransaction = () => {
    // set local storage
    localStorage.setItem("is-update-transaction", "true");
    localStorage.setItem("from-booking", "true");

    handleSteps(1);
  };
  const handleBatalTransaction = () => {
    localStorage.removeItem("details");
    localStorage.removeItem("metode-pembayaran");
    localStorage.removeItem("pelanggan");
    localStorage.removeItem("data-from-keranjang");

    handleToast("cancelled");
    handleSteps(1);
  };

  // state data tempo
  const [dataTempo, setDataTempo] = useState<DataTempoType | null>(() => {
    const tempo = localStorage.getItem("tempo");

    if (tempo) {
      return JSON.parse(tempo);
    } else {
      return null;
    }
  });

  // handle pay
  const handlePay = (value: number) => {
    // set local storage
    localStorage.setItem("di-bayar", JSON.stringify(value));

    // set data di bayar
    setDataDiBayar(value);

    // close modal
    handleCloseModalCalculator();
  };

  // modal calculator
  const {
    handleCloseModalCalculator,
    handleShowModalCalculator,
    modalCalculatorRef,
  } = useModalCalculator({ setIsErrors });
  // modal tempo
  const { handleCloseModalTempo, handleShowModalTempo, modalTempoRef } =
    useModalTempo({ setIsErrors });

  const handleMetodePembayaran = (metode: PaymentMethodType) => {
    if (metodePembayaran === metode) return;
    setMetodePembayaran(metode);

    // set local storage
    localStorage.setItem("metode-pembayaran", JSON.stringify(metode));

    if (metode !== "CASH") localStorage.removeItem("di-bayar");
    if (metode !== "TEMPO") {
      // remove local storage
      localStorage.removeItem("tempo");
      // clear state
      setDataTempo(null);
    }
    setIsErrors((prev) =>
      prev.filter((item) => item !== "METODE_PEMBAYARAN_KOSONG"),
    );
  };

  const transactionSummary = useMemo(() => {
    if (!dataDetails) {
      return {
        // jumlah barang
        totalJumlahBarang: 0,
        totalJumlahBarangDikirim: 0,
        totalJumlahBarangBooking: 0,

        // uang
        totalUangSubTotal: 0,
        totalUangDiskon: 0,
        totalUangTransaksi: 0,
        totalUangBarangDikirim: 0,
        totalUangBarangBooking: 0,

        // rekomendasi
        saranDp: 0,
      };
    }

    let totalJumlahBarang = 0;
    let totalJumlahBarangDikirim = 0;
    let totalJumlahBarangBooking = 0;

    let totalUangSubTotal = 0;
    let totalUangDiskon = 0;
    let totalUangTransaksi = 0;
    let totalUangBarangDikirim = 0;
    let totalUangBarangBooking = 0;

    for (const item of dataDetails) {
      const quantity = item.quantity;
      const stokDikirim = item.stokDikirim ?? 0;
      const stokBooking = quantity - stokDikirim;

      // ===========================
      // Jumlah Barang
      // ===========================
      totalJumlahBarang += quantity;
      totalJumlahBarangDikirim += stokDikirim;
      totalJumlahBarangBooking += stokBooking;

      // ===========================
      // Nilai Uang
      // ===========================
      totalUangSubTotal += quantity * (item.hargaJual - item.diskon);
      totalUangDiskon += item.diskon;
      totalUangTransaksi += quantity * item.hargaJual - item.diskon;

      totalUangBarangDikirim += stokDikirim * item.hargaJual;
      totalUangBarangBooking += stokBooking * item.hargaJual;
    }

    // total uang dp transaksi
    const dpTransaksi = totalUangTransaksi * 0.3;

    let saranDp: number = 0;

    if (totalUangBarangDikirim >= dpTransaksi) {
      saranDp = totalUangBarangDikirim;
    } else {
      saranDp = totalUangBarangDikirim + dpTransaksi;
    }

    return {
      // jumlah
      totalJumlahBarang,
      totalJumlahBarangDikirim,
      totalJumlahBarangBooking,

      // uang
      totalUangSubTotal,
      totalUangDiskon,
      totalUangTransaksi,
      totalUangBarangDikirim,
      totalUangBarangBooking,

      // hasil
      dpTransaksi,
      saranDp,
    };
  }, [dataDetails]);

  const buttonBayarRef = useRef<HTMLButtonElement>(null);
  const buttonAturTempoRef = useRef<HTMLButtonElement>(null);

  const { mutateAsync: mutateTransaction, isPending: isPendingTransaction } =
    useMutation({
      mutationFn: (data: CreateTransactionForRequestType) =>
        TransactionServices.create(data),
      onSuccess: (data) => {
        // clear local storage
        localStorage.removeItem("pelanggan");
        localStorage.removeItem("details");
        localStorage.removeItem("di-bayar");
        localStorage.removeItem("metode-pembayaran");
        localStorage.removeItem("data-from-keranjang");
        localStorage.removeItem("tempo");

        // set local storage
        localStorage.setItem(
          "transaction",
          JSON.stringify({ transactionId: data?.data?.id }),
        );

        // handle toast
        handleToast("created_transaction");

        handleSteps(3);
      },
      onError: (err) => {
        console.log(err);
      },
    });

  // handle transaction
  const handleTransaction = async () => {
    try {
      if (!metodePembayaran) {
        return setIsErrors((prev) => [...prev, "METODE_PEMBAYARAN_KOSONG"]);
      }

      if (!dataDiBayar && metodePembayaran !== "TEMPO") {
        triggerAnimation(buttonBayarRef);
        return setIsErrors((prev) => [...prev, "DATA_DI_BAYAR_KOSONG"]);
      }

      if (metodePembayaran === "TEMPO" && !dataTempo) {
        triggerAnimation(buttonAturTempoRef);
        return setIsErrors((prev) => [...prev, "DATA_TEMPO_KOSONG"]);
      }

      if (!dataDetails || !pelanggan || !kasir) return;

      const dataTransaction: CreateTransactionForRequestType = {
        // ...(dataFromKeranjang && { id: dataFromKeranjang.transactionId }),
        ...(dataTempo && { tempo: dataTempo }),
        status: TRANSACTION_STATUS_TYPE.BOOKING,
        details: dataDetails.map((item) => ({
          diskon: item.diskon,
          hargaJual: item.hargaJual,
          produkId: item.produkId,
          quantity: item.quantity,
          quantityDelivered: item.stokDikirim,
        })),
        diBayar: dataDiBayar,
        kembalian: dataDiBayar - (dataDp ?? 0),
        metodePembayaran: metodePembayaran,
        pelangganId: pelanggan.id,
        kasirId: kasir.id,
      };

      // handle confirm
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

  useEffect(() => {
    if (metodePembayaran === "CASH") {
      // get data di bayar from local storage
      const diBayar = localStorage.getItem("di-bayar");

      if (diBayar) {
        // set data di bayar
        setDataDiBayar(JSON.parse(diBayar));
      } else {
        // set data di bayar
        setDataDiBayar(0);
      }
      return;
    }

    const debounce = setTimeout(() => {
      localStorage.setItem(
        "metode-pembayaran",
        JSON.stringify(metodePembayaran),
      );

      // set data di bayar
      setDataDiBayar(dataDp ?? transactionSummary.saranDp);
    }, 500);

    return () => clearTimeout(debounce);
  }, [metodePembayaran]);

  return {
    pelanggan,
    dataDetails,
    setisOpenFormulirKirimStok,
    handleSetData,
    isOpenFormulirKirimStok,
    handleUbahTransaction,
    handleBatalTransaction,
    metodePembayaran,
    transactionSummary,
    handleMetodePembayaran,
    isErrors,
    buttonAturTempoRef,
    buttonBayarRef,

    modalCalculatorRef,
    handleShowModalCalculator,
    handleCloseModalCalculator,

    modalTempoRef,
    handleShowModalTempo,
    handleCloseModalTempo,

    setDataTempo,

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
