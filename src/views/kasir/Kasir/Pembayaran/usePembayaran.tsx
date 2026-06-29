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

type ErrorType = "METODE_PEMBAYARAN_KOSONG" | "DATA_DI_BAYAR_KOSONG";

const usePembayaran = (params: {
  handleSteps: (value: number) => void;
  handleToast: (value: string) => void;
}) => {
  const { handleSteps, handleToast } = params;

  const kasir = useAuthStore((state) => state.pengguna);

  const [isErrors, setIsErrors] = useState<ErrorType[]>([]);

  // state dibayar
  const [dataDiBayar, setDataDiBayar] = useState<number>(0);

  const buttonBayarRef = useRef<HTMLButtonElement>(null);

  // state metode is metode pembayaran
  const [metodePembayaran, setMetodePembayaran] =
    useState<PaymentMethodType | null>(null);

  // state data details
  const [dataDetails, setDataDetails] = useState<
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
  >(null);

  //   state data pelanggan
  const [pelanggan, setPelanggan] = useState<Pick<
    IPelangganType,
    "id" | "nama" | "noWa"
  > | null>(null);

  //   get data form localstorage
  useEffect(() => {
    const details = localStorage.getItem("details");
    const pelanggan = localStorage.getItem("pelanggan");
    if (details && pelanggan) {
      setDataDetails(JSON.parse(details));
      setPelanggan(JSON.parse(pelanggan));
    } else {
      handleSteps(1);
    }
  }, []);

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

  // handle show modal calculator
  const handleShowModalCalculator = () => {
    // clear error
    setIsErrors((prev) =>
      prev.filter((item) => item !== "DATA_DI_BAYAR_KOSONG"),
    );
    showModalCalculator();
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
    localStorage.setItem("diBayar", JSON.stringify(value));

    // set data di bayar
    setDataDiBayar(value);

    // close modal
    handleCloseModalCalculator();
  };

  useEffect(() => {
    if (metodePembayaran === "CASH") {
      setDataDiBayar(0);
      return;
    }

    const debounce = setTimeout(() => {
      localStorage.setItem(
        "metodePembayaran",
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
        localStorage.removeItem("diBayar");
        localStorage.removeItem("metodePembayaran");

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

      if (!dataDiBayar) {
        triggerAnimation(buttonBayarRef);
        return setIsErrors((prev) => [...prev, "DATA_DI_BAYAR_KOSONG"]);
      }

      if (!dataDetails || !pelanggan || !kasir) return;

      const dataTransaction: CreateTransactionForRequestType = {
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
    localStorage.setItem("isUpdateTransaction", "true");

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
  };
};

export default usePembayaran;
