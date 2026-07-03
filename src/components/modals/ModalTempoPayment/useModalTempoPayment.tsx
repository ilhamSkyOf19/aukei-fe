import { useMemo } from "react";
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

const useModalTempoPayment = (params: {
  data: { total: number };
  handleCloseModal: () => void;
  handleSetDataTempo: (data: DataTempoType) => void;
}) => {
  const {
    data: { total },
    handleCloseModal,
    handleSetDataTempo,
  } = params;

  // navigate
  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  // use form
  const { control, setValue } = useForm<CreateTempoType>({
    resolver: zodResolver(TempoValidations.CREATE),
  });

  // uang muka controller
  const uangMukaController = useController({
    control,
    name: "uangMuka",
  });

  //   tenor controller
  const tenorController = useController({
    control,
    name: "tenor",
  });

  // jumlah cicilan
  const jumlahCicilanController = useController({
    control,
    name: "jumlahCicilan",
  });

  //   use watch tenor
  const tenorWatch = useWatch({
    control,
    name: "tenor",
  });

  //   use watch uang muka
  const uangMukaWatch = useWatch({
    control,
    name: "uangMuka",
  });

  // use watch jumlah cicilan
  const jumlahCicilanWatch = useWatch({
    control,
    name: "jumlahCicilan",
  });

  // debounce
  const debouncedUangMuka = useDebounce(uangMukaWatch, 300);

  const debouncedJumlahCicilan = useDebounce(jumlahCicilanWatch, 300);

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
    if (!tenorWatch || finalTotal.sisa <= 0 || !debouncedJumlahCicilan) {
      return [];
    }

    const nominal = Math.floor(finalTotal.sisa / debouncedJumlahCicilan);

    return Array.from({ length: debouncedJumlahCicilan }, (_, index) => ({
      cicilanKe: index + 1,
      jatuhTempo: addDaysHandler({
        days: (index + 1) * tenorWatch,
        date: new Date(),
      }),
      nominal,
    }));
  }, [finalTotal, tenorWatch, debouncedJumlahCicilan]);

  // is empty
  const isEmpty: boolean = useMemo(() => {
    if (!dataTempo || !tenorWatch || !debouncedJumlahCicilan) return true;
    else return false;
  }, [dataTempo, tenorWatch, debouncedJumlahCicilan]);

  // handle local storage
  const handleSimpan = () => {
    if (isEmpty) return;

    const finalData: DataTempoType = {
      jumlahCicilan: debouncedJumlahCicilan,
      tenor: tenorWatch,
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
    tenorController,
    uangMukaController,
    jumlahCicilanController,
    finalTotal,
    handleSimpan,
    isEmpty,
  };
};

export default useModalTempoPayment;
