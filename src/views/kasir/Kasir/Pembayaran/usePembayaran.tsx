import { useEffect, useRef, useState } from "react";
import type { PaymentMethodType } from "../../../../types/constant.type";
import type { IPelangganType } from "../../../../models/pelanggan.model";
import useModal from "../../../../hooks/useModal";
import { useMutation } from "@tanstack/react-query";
import type { CreateTransactionForRequestType } from "../../../../models/transaction.model";
import { TransactionServices } from "../../../../services/transaction.service";
import { useAuthStore } from "../../../../stores/authStore";
import useConfirm from "../../../../hooks/useConfirm";
import triggerAnimation from "../../../../hooks/triggerAnimation";
import useIsModeKasirStore from "../../../../stores/iseModaKasirStore";
import type { DataTempoType } from "../../../../models/tempo.model";

type ErrorType =
  | "METODE_PEMBAYARAN_KOSONG"
  | "DATA_DI_BAYAR_KOSONG"
  | "DATA_TEMPO_KOSONG";

const usePembayaran = (params: {
  handleSteps: (value: number) => void;
  handleToast: (value: string) => void;
}) => {
  const { handleSteps, handleToast } = params;

  // is mode kasir
  const isModeKasir = useIsModeKasirStore((state) => state.isModeKasir);

  const kasir = useAuthStore((state) => state.pengguna);

  const [isErrors, setIsErrors] = useState<ErrorType[]>([]);

  // state dibayar
  const [dataDiBayar, setDataDiBayar] = useState<number>(0);

  const buttonBayarRef = useRef<HTMLButtonElement>(null);
  const buttonAturTempoRef = useRef<HTMLButtonElement>(null);

  // state metode is metode pembayaran
  const [metodePembayaran, setMetodePembayaran] =
    useState<PaymentMethodType | null>(() => {
      const metodePembayaran = localStorage.getItem("metode-pembayaran");

      if (metodePembayaran) {
        return JSON.parse(metodePembayaran);
      } else {
        return null;
      }
    });

  // state data details
  const [dataDetails] = useState<
    | {
        produkId: number;
        quantity: number;
        hargaJual: number;
        diskon: number;
        img: string;
        nama: string;
        kode: string;
      }[]
    | null
  >(() => {
    const details = localStorage.getItem("details");

    if (details) {
      return JSON.parse(details);
    } else {
      return null;
    }
  });

  // state data tempo
  const [dataTempo, setDataTempo] = useState<DataTempoType | null>(() => {
    const tempo = localStorage.getItem("tempo");

    if (tempo) {
      return JSON.parse(tempo);
    } else {
      return null;
    }
  });

  //   state data pelanggan
  const [pelanggan, _setPelanggan] = useState<Pick<
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

  // state data from keranjang
  const [dataFromKeranjang, _setDataFromKeranjang] = useState<{
    transactionId: number;
  } | null>(() => {
    const dataFromKeranjang = localStorage.getItem("data-from-keranjang");

    if (dataFromKeranjang) {
      return JSON.parse(dataFromKeranjang);
    } else {
      return null;
    }
  });

  // total diskon
  const totalDiskon = dataDetails?.reduce((a, b) => a + b.diskon, 0) ?? 0;

  // sub total
  const subTotalBeforeDiskon =
    dataDetails?.reduce((a, b) => a + b.hargaJual * b.quantity, 0) ?? 0;

  // total
  const totalAfterDiskon =
    dataDetails?.reduce(
      (a, b) => a + (b.hargaJual * b.quantity - b.diskon),
      0,
    ) ?? 0;

  //   handle metode pembayaran
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

  //   use modal calculator
  const {
    modalRef: modalCalculatorRef,
    handleShowModal: showModalCalculator,
    handleCloseModal: handleCloseModalCalculator,
  } = useModal();

  // use modal tempo
  const {
    modalRef: modalTempoRef,
    handleShowModal: showModalTempo,
    handleCloseModal: handleCloseModalTempo,
  } = useModal();

  // handle show modal calculator
  const handleShowModalCalculator = () => {
    // clear error
    setIsErrors((prev) =>
      prev.filter((item) => item !== "DATA_DI_BAYAR_KOSONG"),
    );
    showModalCalculator();
  };

  // handle show modal tempo
  const handleShowModalTempo = () => {
    // clear error
    setIsErrors((prev) => prev.filter((item) => item !== "DATA_TEMPO_KOSONG"));
    showModalTempo();
  };

  // use confirm
  const {
    confirm,
    handleCancel,
    handleConfirm,
    modalRef: modalConfirmRef,
  } = useConfirm();

  // handle pay
  const handlePay = (value: number) => {
    // set local storage
    localStorage.setItem("di-bayar", JSON.stringify(value));

    // set data di bayar
    setDataDiBayar(value);

    // close modal
    handleCloseModalCalculator();
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
      setDataDiBayar(totalAfterDiskon);
    }, 500);

    return () => clearTimeout(debounce);
  }, [metodePembayaran]);

  // mutation
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
        ...(dataFromKeranjang && { id: dataFromKeranjang.transactionId }),
        ...(dataTempo && { tempo: dataTempo }),
        details: dataDetails.map((item) => ({
          diskon: item.diskon,
          hargaJual: item.hargaJual,
          produkId: item.produkId,
          quantity: item.quantity,
        })),
        diBayar: dataDiBayar,
        metodePembayaran: metodePembayaran,
        pelangganId: pelanggan.id,
        kasirId: kasir.id,
      };

      // handle confirm
      const isConfirm = await confirm();

      if (!isConfirm) {
        return;
      }

      await mutateTransaction(dataTransaction);
    } catch (error) {
      console.log(error);
    }
  };

  // handle ubah transaction
  const handleUbahTransaction = () => {
    // set local storage
    localStorage.setItem("is-update-transaction", "true");

    handleSteps(1);
  };

  // handle batal transaction
  const handleBatalTransaction = () => {
    localStorage.removeItem("details");
    localStorage.removeItem("metode-pembayaran");
    localStorage.removeItem("pelanggan");
    localStorage.removeItem("data-from-keranjang");
    handleSteps(1);
  };

  // return
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
    isModeKasir,
    dataTempo,
    buttonAturTempoRef,
    modalTempoRef,
    handleShowModalTempo,
    handleCloseModalTempo,
    handleSetDataTempo: setDataTempo,
  };
};

export default usePembayaran;
