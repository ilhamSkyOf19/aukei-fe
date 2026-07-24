import { useEffect, useMemo, useState } from "react";
import { useController, useForm, useWatch } from "react-hook-form";
import type {
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
} from "../../../types/constant.type";
import { differenceInCalendarDays } from "date-fns";
import useModalCalculator from "../../../hooks/useModalCalculator";

const useModalTempoPayment = (params: {
  data: { total: number; dp?: number };
  handleCloseModal: () => void;
  handleSetDataTempo: (data: DataTempoType) => void;
  booking?: boolean;
}) => {
  const {
    data: { total, dp },
    handleCloseModal,
    handleSetDataTempo,
    booking,
  } = params;

  // navigate
  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  // modal input tanggal
  const {
    modalRef: modalInputTanggalRef,
    handleShowModal: handleShowModalInputTanggal,
    handleCloseModal: handleCLoseModalInputTanggal,
  } = useModal();

  const [isErrors, setIsErrors] = useState<ErrorType[]>([]);

  const addError = (error: ErrorType) => {
    setIsErrors((prev) => [...prev, error]);
  };

  // state uang pembayaran
  const [pembayaranUangMukaCash, setPembayaranUangMukaCash] =
    useState<number>(0);

  // use form
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

  // set uang muka
  useEffect(() => {
    if (!booking) return;

    reset({
      uangMuka: dp ?? 0,
    });
  }, [booking, total, reset]);

  // metode pembayaran uang dp controller
  const metodePembayaranUangMukaController = useController({
    control,
    name: "metodePembayaranUangDp",
  });

  // uang muka controller
  const uangMukaController = useController({
    control,
    name: "uangMuka",
  });

  //   periode controller
  const periodeController = useController({
    control,
    name: "periode",
  });

  // jumlahCicilan cicilan
  const jumlahCicilanController = useController({
    control,
    name: "jumlahCicilan",
  });

  // start date
  const startDateController = useController({
    control,
    name: "startDate",
  });

  //   use watch periode
  const periodeWatch = useWatch({
    control,
    name: "periode",
  });

  //   use watch start date
  const startDateWatch = useWatch({
    control,
    name: "startDate",
  });

  //   use watch uang muka
  const uangMukaWatch = useWatch({
    control,
    name: "uangMuka",
  });

  // use watch jumlahCicilan
  const jumlahCicilanWatch = useWatch({
    control,
    name: "jumlahCicilan",
  });

  // uang dp watch
  const metodePembayaranUangUangMukaWatch = useWatch({
    control,
    name: "metodePembayaranUangDp",
  });

  // clear error uang muka
  useEffect(() => {
    if (errors.metodePembayaranUangDp) {
      clearErrors("metodePembayaranUangDp");
    }
  }, [metodePembayaranUangUangMukaWatch]);

  // debounce
  const debouncedUangMuka = useDebounce(uangMukaWatch, 300);

  const debouncedjumlahCicilan = useDebounce(jumlahCicilanWatch, 300);

  // total final
  const finalTotal = useMemo(() => {
    if (debouncedUangMuka > total) setValue("uangMuka", total);

    const sisa = total - (debouncedUangMuka ?? 0);

    return {
      totalTagihan: total,
      sisa,
    };
  }, [total, debouncedUangMuka]);

  // data tempo
  const dataTempo: CreateInstallmentType[] = useMemo(() => {
    if (!periodeWatch || finalTotal.sisa <= 0 || !debouncedjumlahCicilan) {
      return [];
    }

    const nominalDasar = Math.floor(finalTotal.sisa / debouncedjumlahCicilan);

    const sisa = finalTotal.sisa - nominalDasar * debouncedjumlahCicilan;

    return Array.from({ length: debouncedjumlahCicilan }, (_, index) => ({
      status:
        differenceInCalendarDays(
          new Date(),
          addDaysHandler({
            days: (index + 1) * periodeWatch,
            date: new Date(startDateWatch ?? new Date()),
          }),
        ) > 0
          ? INSTALLMENT_STATUS_TYPE.OVERDUE
          : INSTALLMENT_STATUS_TYPE.UNPAID,
      cicilanKe: index + 1,
      jatuhTempo: addDaysHandler({
        days: (index + 1) * periodeWatch,
        date: new Date(startDateWatch ?? new Date()),
      }),
      nominal:
        index === debouncedjumlahCicilan - 1
          ? nominalDasar + sisa
          : nominalDasar,
    }));
  }, [finalTotal.sisa, periodeWatch, debouncedjumlahCicilan, startDateWatch]);

  // is empty
  const isEmpty: boolean = useMemo(() => {
    if (!dataTempo || !jumlahCicilanWatch || !debouncedjumlahCicilan)
      return true;
    else return false;
  }, [dataTempo, jumlahCicilanWatch, debouncedjumlahCicilan]);

  // handle local storage
  const handleSimpan = () => {
    if (isEmpty) return;

    // check pembayaran
    if (metodePembayaranUangUangMukaWatch === PAYMENT_METHOD_TYPE.CASH) {
      if (pembayaranUangMukaCash === null || pembayaranUangMukaCash === 0) {
        addError("DATA_DI_BAYAR_KOSONG");
        return;
      }
    }

    if (debouncedUangMuka > 0 && !metodePembayaranUangUangMukaWatch) {
      setError("metodePembayaranUangDp", {
        message: "Metode pembayaran uang muka harus diisi",
      });
      return;
    }

    const finalData: DataTempoType = {
      jumlahCicilan: debouncedjumlahCicilan,
      periode: periodeWatch,
      uangMuka: debouncedUangMuka ?? 0,
      installments: dataTempo,
      metodePembayaranUangDp: metodePembayaranUangUangMukaWatch,
      kembalian: pembayaranUangMukaCash - debouncedUangMuka,
      diBayar: pembayaranUangMukaCash ?? undefined,
    };

    localStorage.setItem("tempo", JSON.stringify(finalData));

    // handle set data tempo
    handleSetDataTempo(finalData);

    // set toast
    navigate(currentPathname, {
      state: {
        toast: "set_tempo",
      },
    });

    // close modal
    handleCloseModal();
  };

  // use modal calculator
  const {
    handleCloseModalCalculator: handleCloseModalCalculator,
    handleShowModalCalculator: showModalCalculator,
    modalCalculatorRef,
  } = useModalCalculator({ setIsErrors });

  // show modal calculator
  const handleShowModalCalculator = () => {
    handleCloseModal();
    showModalCalculator();
  };

  const handlePay = (amount: number) => {
    setPembayaranUangMukaCash(amount);
    handleCloseModalCalculator();
  };

  useEffect(() => {
    if (metodePembayaranUangUangMukaWatch !== PAYMENT_METHOD_TYPE.CASH) {
      setPembayaranUangMukaCash(0);
    }
  }, [metodePembayaranUangUangMukaWatch]);

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
  };
};

export default useModalTempoPayment;
