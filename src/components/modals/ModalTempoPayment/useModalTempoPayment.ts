import { useEffect, useMemo, useState } from "react";
import { useController, useForm, useWatch } from "react-hook-form";
import type {
  CreateTempoForRequestType,
  CreateTempoType,
  DataTempoType,
} from "../../../models/tempo.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { TempoValidations } from "../../../validations/tempo.validation";
import { addDaysHandler } from "../../../helpers/helpers";
import type { CreateInstallmentType } from "../../../models/tempoInstallment.model";
import useDebounce from "../../../hooks/useDebounce";
import { useLocation, useNavigate } from "react-router-dom";
import useModal from "../../../hooks/useModal";
import {
  INSTALLMENT_STATUS_TYPE,
  PAYMENT_METHOD_TYPE,
  type ErrorType,
  type PaymentMethodType,
} from "../../../types/constant.type";
import { differenceInCalendarDays } from "date-fns";
import useModalCalculator from "../../../hooks/useModalCalculator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TempoService } from "../../../services/tempo.service";

const useModalTempoPayment = (params: {
  transactionId: number;
  data: {
    total: number;
    dp?: number;
  };
  handleCloseModal: () => void;
  booking?: boolean;
}) => {
  const {
    transactionId,
    data: { total, dp },
    handleCloseModal,
    booking,
  } = params;

  // ==========================
  // NAVIGATE
  // ==========================

  const navigate = useNavigate();

  const currentPathname = useLocation().pathname;

  // ==========================
  // QUERY CLIENT
  // ==========================

  const queryClient = useQueryClient();

  // ==========================
  // MODAL INPUT TANGGAL
  // ==========================

  const {
    modalRef: modalInputTanggalRef,
    handleShowModal: handleShowModalInputTanggal,
    handleCloseModal: handleCLoseModalInputTanggal,
  } = useModal();

  // ==========================
  // ERROR
  // ==========================

  const [isErrors, setIsErrors] = useState<ErrorType[]>([]);

  const addError = (error: ErrorType) => {
    setIsErrors((prev) => [...prev, error]);
  };

  // ==========================
  // PEMBAYARAN UANG MUKA CASH
  // ==========================

  const [pembayaranUangMukaCash, setPembayaranUangMukaCash] =
    useState<number>(0);

  // ==========================
  // FORM
  // ==========================

  const {
    control,
    setValue,
    reset,
    setError,
    formState: { errors },
    clearErrors,
  } = useForm<CreateTempoType>({
    resolver: zodResolver(TempoValidations.CREATE),
  });

  // ==========================
  // SET DP BOOKING
  // ==========================

  useEffect(() => {
    if (!booking) return;

    reset({
      uangMuka: dp ?? 0,
    });
  }, [booking, dp, reset]);

  // ==========================
  // METODE PEMBAYARAN DP
  // ==========================

  const metodePembayaranUangMukaController = useController({
    control,
    name: "metodePembayaranUangDp",
  });

  // ==========================
  // UANG MUKA
  // ==========================

  const uangMukaController = useController({
    control,
    name: "uangMuka",
  });

  // ==========================
  // PERIODE
  // ==========================

  const periodeController = useController({
    control,
    name: "periode",
  });

  // ==========================
  // JUMLAH CICILAN
  // ==========================

  const jumlahCicilanController = useController({
    control,
    name: "jumlahCicilan",
  });

  // ==========================
  // START DATE
  // ==========================

  const startDateController = useController({
    control,
    name: "startDate",
  });

  // ==========================
  // WATCH
  // ==========================

  const periodeWatch = useWatch({
    control,
    name: "periode",
  });

  const startDateWatch = useWatch({
    control,
    name: "startDate",
  });

  const uangMukaWatch = useWatch({
    control,
    name: "uangMuka",
  });

  const jumlahCicilanWatch = useWatch({
    control,
    name: "jumlahCicilan",
  });

  const metodePembayaranUangUangMukaWatch = useWatch({
    control,
    name: "metodePembayaranUangDp",
  });

  // ==========================
  // CLEAR ERROR METODE DP
  // ==========================

  useEffect(() => {
    if (errors.metodePembayaranUangDp) {
      clearErrors("metodePembayaranUangDp");
    }
  }, [
    metodePembayaranUangUangMukaWatch,
    errors.metodePembayaranUangDp,
    clearErrors,
  ]);

  // ==========================
  // DEBOUNCE
  // ==========================

  const debouncedUangMuka = useDebounce(uangMukaWatch, 300);

  const debouncedjumlahCicilan = useDebounce(jumlahCicilanWatch, 300);

  // ==========================
  // TOTAL FINAL
  // ==========================

  const finalTotal = useMemo(() => {
    const uangMuka = debouncedUangMuka ?? 0;

    const finalUangMuka = uangMuka > total ? total : uangMuka;

    const sisa = total - finalUangMuka;

    return {
      totalTagihan: total,
      sisa,
    };
  }, [total, debouncedUangMuka]);

  // ==========================
  // DATA TEMPO
  // ==========================

  const dataTempo: CreateInstallmentType[] = useMemo(() => {
    if (!periodeWatch || finalTotal.sisa <= 0 || !debouncedjumlahCicilan) {
      return [];
    }

    const nominalDasar = Math.floor(finalTotal.sisa / debouncedjumlahCicilan);

    const sisa = finalTotal.sisa - nominalDasar * debouncedjumlahCicilan;

    return Array.from(
      {
        length: debouncedjumlahCicilan,
      },
      (_, index) => {
        const jatuhTempo = addDaysHandler({
          days: (index + 1) * periodeWatch,
          date: new Date(startDateWatch ?? new Date()),
        });

        return {
          status:
            differenceInCalendarDays(new Date(), jatuhTempo) > 0
              ? INSTALLMENT_STATUS_TYPE.OVERDUE
              : INSTALLMENT_STATUS_TYPE.UNPAID,

          cicilanKe: index + 1,

          jatuhTempo,

          nominal:
            index === debouncedjumlahCicilan - 1
              ? nominalDasar + sisa
              : nominalDasar,
        };
      },
    );
  }, [finalTotal.sisa, periodeWatch, debouncedjumlahCicilan, startDateWatch]);

  // ==========================
  // CHECK EMPTY
  // ==========================

  const isEmpty = useMemo(() => {
    if (!dataTempo || !jumlahCicilanWatch || !debouncedjumlahCicilan) {
      return true;
    }

    return false;
  }, [dataTempo, jumlahCicilanWatch, debouncedjumlahCicilan]);

  // ==========================
  // CREATE TEMPO MUTATION
  // ==========================

  const { mutateAsync: mutateCreateTempo, isPending: isPendingCreateTempo } =
    useMutation({
      mutationFn: (data: CreateTempoForRequestType) =>
        TempoService.create(data),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["transaksi-draft"],
        });

        // ==========================
        // TOAST
        // ==========================

        navigate(currentPathname, {
          state: {
            toast: "set_tempo",
          },
        });

        handleCloseModal();
      },

      onError: (error) => {
        console.error("Gagal membuat tempo:", error);
      },
    });

  // ==========================
  // SIMPAN TEMPO
  // ==========================

  const handleSimpan = async () => {
    if (isEmpty || isPendingCreateTempo) {
      return;
    }

    // ==========================
    // CHECK PEMBAYARAN CASH
    // ==========================

    if (metodePembayaranUangUangMukaWatch === PAYMENT_METHOD_TYPE.CASH) {
      if (pembayaranUangMukaCash === null || pembayaranUangMukaCash === 0) {
        addError("DATA_DI_BAYAR_KOSONG");
        return;
      }
    }

    // ==========================
    // CHECK METODE PEMBAYARAN DP
    // ==========================

    if (debouncedUangMuka > 0 && !metodePembayaranUangUangMukaWatch) {
      setError("metodePembayaranUangDp", {
        message: "Metode pembayaran uang muka harus diisi",
      });

      return;
    }

    // ==========================
    // DATA TEMPO UNTUK LOCAL STATE
    // ==========================

    try {
      // ==========================
      // CREATE / OVERWRITE TEMPO
      // ==========================

      await mutateCreateTempo({
        transactionId,

        periode: periodeWatch,

        jumlahCicilan: debouncedjumlahCicilan,

        uangMuka: debouncedUangMuka ?? 0,

        installments: dataTempo,

        paymentUangMuka: {
          dibayar:
            metodePembayaranUangUangMukaWatch === PAYMENT_METHOD_TYPE.CASH
              ? pembayaranUangMukaCash
              : debouncedUangMuka,
          kembalian:
            metodePembayaranUangUangMukaWatch === PAYMENT_METHOD_TYPE.CASH
              ? pembayaranUangMukaCash - debouncedUangMuka
              : 0,
          metodePaymentUangMuka: metodePembayaranUangUangMukaWatch as Exclude<
            PaymentMethodType,
            "TEMPO"
          >,
        },
      });
    } catch (error) {
      console.error("Gagal menyimpan tempo:", error);
    }
  };

  // ==========================
  // MODAL CALCULATOR
  // ==========================

  const {
    handleCloseModalCalculator,
    handleShowModalCalculator: showModalCalculator,
    modalCalculatorRef,
  } = useModalCalculator({
    setIsErrors,
  });

  // ==========================
  // SHOW CALCULATOR
  // ==========================

  const handleShowModalCalculator = () => {
    handleCloseModal();

    showModalCalculator();
  };

  // ==========================
  // HANDLE PAY
  // ==========================

  const handlePay = (amount: number) => {
    setPembayaranUangMukaCash(amount);

    handleCloseModalCalculator();
  };

  // ==========================
  // RESET CASH PAYMENT
  // ==========================

  useEffect(() => {
    if (metodePembayaranUangUangMukaWatch !== PAYMENT_METHOD_TYPE.CASH) {
      setPembayaranUangMukaCash(0);
    }
  }, [metodePembayaranUangUangMukaWatch]);

  // ==========================
  // RETURN
  // ==========================

  return {
    dataTempo,

    jumlahCicilanController,

    uangMukaController,

    periodeController,

    finalTotal,

    handleSimpan,

    isEmpty,

    startDateController,

    setValue,

    modalInputTanggalRef,

    handleShowModalInputTanggal,

    handleCLoseModalInputTanggal,

    metodePembayaranUangMukaController,

    metodePembayaranUangUangMukaWatch,

    debouncedUangMuka,

    errors,

    startDateWatch,

    handleShowModalCalculator,

    modalCalculatorRef,

    handleCloseModalCalculator,

    isErrors,

    handlePay,

    pembayaranUangMukaCash,

    isPendingCreateTempo,
  };
};

export default useModalTempoPayment;
