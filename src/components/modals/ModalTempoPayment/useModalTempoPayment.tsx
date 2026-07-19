import { useEffect, useMemo } from "react";
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

  // use form
  const { control, setValue, reset } = useForm<CreateTempoType>({
    resolver: zodResolver(TempoValidations.CREATE),
  });

  // set uang muka
  useEffect(() => {
    if (!booking) return;

    reset({
      uangMuka: dp ?? 0,
    });
  }, [booking, total, reset]);

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
  const dataTempo: CreateInstallmentType[] = useMemo<
    CreateInstallmentType[]
  >(() => {
    if (!periodeWatch || finalTotal.sisa <= 0 || !debouncedjumlahCicilan) {
      return [];
    }

    const nominal = Math.floor(finalTotal.sisa / debouncedjumlahCicilan);

    return Array.from({ length: debouncedjumlahCicilan }, (_, index) => ({
      cicilanKe: index + 1,
      jatuhTempo: addDaysHandler({
        days: (index + 1) * periodeWatch,
        date: new Date(startDateWatch ?? new Date()),
      }),
      nominal,
    }));
  }, [finalTotal, periodeWatch, debouncedjumlahCicilan, startDateWatch]);

  // is empty
  const isEmpty: boolean = useMemo(() => {
    if (!dataTempo || !jumlahCicilanWatch || !debouncedjumlahCicilan)
      return true;
    else return false;
  }, [dataTempo, jumlahCicilanWatch, debouncedjumlahCicilan]);

  // handle local storage
  const handleSimpan = () => {
    if (isEmpty) return;

    const finalData: DataTempoType = {
      jumlahCicilan: debouncedjumlahCicilan,
      periode: periodeWatch,
      uangMuka: debouncedUangMuka ?? 0,
      installments: dataTempo,
    };

    localStorage.setItem("tempo", JSON.stringify(finalData));

    console.log(finalData);

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
  };
};

export default useModalTempoPayment;
