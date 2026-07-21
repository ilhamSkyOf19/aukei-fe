import { useController, useForm, useWatch } from "react-hook-form";
import type { CreateTempoPaymentType } from "../../../../models/tempoPayment.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { TempoPaymentValidations } from "../../../../validations/tempoPayment.validation";
import type { ITempoInstallmentType } from "../../../../models/tempoInstallment.model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TempoPaymentServices } from "../../../../services/tempoPayment.service";
import { useEffect, useRef, useState } from "react";
import type { PaymentMethodType } from "../../../../types/constant.type";
import useModal from "../../../../hooks/useModal";
import useConfirm from "../../../../hooks/useConfirm";

const useCardPembayaran = (params: {
  tempoId: number | null;
  handleResetDataPembayaran: () => void;
  dataPembayaran:
    | (Pick<
        ITempoInstallmentType,
        | "id"
        | "jatuhTempo"
        | "nominal"
        | "tanggalLunas"
        | "cicilanKe"
        | "status"
      > & { diBayar: number })
    | null;
}) => {
  const { dataPembayaran, handleResetDataPembayaran, tempoId } = params;

  // query client
  const queryClient = useQueryClient();

  const buttonCalculatorRef = useRef<HTMLButtonElement | null>(null);

  // state error
  const [isError, setIsError] = useState({
    METODE_PEMBAYARAN: false,
    NOMINAL: false,
    PELANGGAN: false,
  });

  //   modal confirm
  const {
    modalRef: modalConfirmRef,
    confirm: confirmPembayaran,
    handleCancel: handleCancelConfirmPembayaran,
    handleConfirm: handleConfirmPembayaran,
    data: dataConfirm,
  } = useConfirm<{ title: string; deskripsi: string }>();

  //   use confrimr
  const {
    modalRef: modalCalculatorRef,
    handleShowModal: showModalCalculator,
    handleCloseModal: handleCloseModalCalculator,
    dataModal: dataModalCalculator,
  } = useModal<{ nominal: number }>();

  //   state metode pembayaran
  const [metodePembayaran, setMetodePembayaran] = useState<Exclude<
    PaymentMethodType,
    "TEMPO"
  > | null>(null);

  // use form
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setError,
    trigger,
    reset,
  } = useForm<Pick<CreateTempoPaymentType, "nominal" | "keterangan">>({
    resolver: zodResolver(TempoPaymentValidations.PAYMENT),
  });

  // nominal controller
  const nominalController = useController({
    control,
    name: "nominal",
  });

  //   watch nominal
  const watchNominal = useWatch({
    control,
    name: "nominal",
  });

  useEffect(() => {
    const debounce = setTimeout(() => {
      trigger("nominal");
    }, 300);

    return () => clearTimeout(debounce);
  }, [watchNominal, trigger]);

  //   use mutation
  const { mutateAsync: mutatePayment, isPending: isPendingPayment } =
    useMutation({
      mutationFn: (data: CreateTempoPaymentType) =>
        TempoPaymentServices.payment(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["installments-detail", tempoId],
        });

        queryClient.invalidateQueries({
          queryKey: ["riwayat-payment-tempo", tempoId],
        });

        // reset
        handleResetDataPembayaran();

        // reset metode pembayaran
        setMetodePembayaran(null);

        reset();
      },
      onError: (err) => {
        console.log(err);
      },
    });

  // handle submit
  const onSubmit = async (
    data: Pick<CreateTempoPaymentType, "nominal" | "keterangan">,
  ) => {
    try {
      if (!dataPembayaran) return;

      if (!metodePembayaran) {
        return setIsError((prev) => ({
          ...prev,
          METODE_PEMBAYARAN: true,
        }));
      }

      // confirm
      const confirm = await confirmPembayaran({
        title: "Apakah Anda yakin ingin memproses cicilan ini?",
        deskripsi:
          "Pastikan data pembayaran cicilan telah sesuai. Setelah diproses, data akan disimpan.",
      });

      if (!confirm) {
        return;
      }

      await mutatePayment({
        ...data,
        installmentId: dataPembayaran.id,
        metodePembayaran: metodePembayaran,
      });
    } catch (error) {
      console.log(error);
    }
  };

  //   handle metode pembayaran
  const handleMetodePembayaran = (
    metodePembayaran: Exclude<PaymentMethodType, "TEMPO">,
  ) => {
    if (watchNominal === undefined || watchNominal === 0) {
      return setError("nominal", {
        message: "Masukan nominal terlebih dahulu",
      });
    }

    setIsError((prev) => ({
      ...prev,
      METODE_PEMBAYARAN: false,
    }));

    setMetodePembayaran(metodePembayaran);
  };

  //   handle show modal calculator
  const handleShowModalCalculator = () => {
    showModalCalculator(undefined, { nominal: watchNominal });
  };

  return {
    register,
    errors,
    handleSubmit,
    onSubmit,
    nominalController,
    isPendingPayment,
    handleMetodePembayaran,
    metodePembayaran,
    buttonCalculatorRef,
    modalCalculatorRef,
    handleCloseModalCalculator,
    handleShowModalCalculator,
    dataModalCalculator,
    modalConfirmRef,
    handleCancelConfirmPembayaran,
    handleConfirmPembayaran,
    dataConfirm,
    isError,
  };
};

export default useCardPembayaran;
