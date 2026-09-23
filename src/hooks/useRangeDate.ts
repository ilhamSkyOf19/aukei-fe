import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { format } from "date-fns";
import { type DateRange } from "react-day-picker";
import { useSearchParams } from "react-router-dom";
import useModal from "./useModal";

export type RangeDateState = {
  startDate?: string | undefined;
  endDate?: string | undefined;
};

type UseRangeDateProps = {
  listDate: {
    label: string;
    value: string;
  }[];

  defaultStartDate?: string;
  defaultEndDate?: string;

  state?: {
    value?: RangeDateState;
    onChange?: Dispatch<SetStateAction<RangeDateState | undefined>>;
  };
};

const useRangeDate = ({
  listDate,
  defaultEndDate = format(new Date(), "yyyy-MM-dd"),
  defaultStartDate = format(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      new Date().getDate(),
    ),
    "yyyy-MM-dd",
  ),
  state,
}: UseRangeDateProps) => {
  const isControlled = !!state;

  const [searchParams, setSearchParams] = useSearchParams();

  const startDate = isControlled
    ? state?.value?.startDate
    : (searchParams.get("start-date") ?? defaultStartDate);

  const endDate = isControlled
    ? state?.value?.endDate
    : (searchParams.get("end-date") ?? defaultEndDate);

  const [selected, setSelected] = useState<DateRange>();

  /**
   * Set default date ke URL jika belum ada.
   */
  useEffect(() => {
    if (isControlled) return;

    const hasStart = searchParams.has("start-date");
    const hasEnd = searchParams.has("end-date");

    if (hasStart && hasEnd) return;

    const params = new URLSearchParams(searchParams);

    params.set("start-date", defaultStartDate);
    params.set("end-date", defaultEndDate);

    // Pastikan page dimulai dari halaman pertama
    params.set("page", "1");

    setSearchParams(params, {
      replace: true,
    });
  }, [
    isControlled,
    defaultStartDate,
    defaultEndDate,
    searchParams,
    setSearchParams,
  ]);

  /**
   * Sinkronisasi selected DayPicker dengan
   * startDate dan endDate.
   */
  useEffect(() => {
    if (!startDate || !endDate) {
      setSelected(undefined);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    setSelected({
      from: start,
      to: end,
    });
  }, [startDate, endDate]);

  /**
   * Set range tanggal.
   *
   * Setiap kali range tanggal berubah,
   * pagination akan kembali ke page 1.
   */
  const setRangeDate = (startDate?: string, endDate?: string) => {
    if (isControlled && state?.onChange) {
      state.onChange({
        startDate,
        endDate,
      });

      return;
    }

    const params = new URLSearchParams(searchParams);

    if (startDate) {
      params.set("start-date", startDate);
    } else {
      params.delete("start-date");
    }

    if (endDate) {
      params.set("end-date", endDate);
    } else {
      params.delete("end-date");
    }

    // Reset pagination ketika tanggal berubah
    params.set("page", "1");

    setSearchParams(params, {
      replace: true,
    });
  };

  /**
   * Reset ke tanggal default.
   *
   * Pagination juga kembali ke page 1.
   */
  const resetRangeDate = () => {
    if (isControlled && state?.onChange) {
      state.onChange({
        startDate: defaultStartDate,
        endDate: defaultEndDate,
      });

      return;
    }

    const params = new URLSearchParams(searchParams);

    params.set("start-date", defaultStartDate);
    params.set("end-date", defaultEndDate);

    // Reset pagination
    params.set("page", "1");

    setSearchParams(params, {
      replace: true,
    });
  };

  /**
   * Handle dropdown tanggal.
   */
  const handleOnChangeDropDown = (value: string) => {
    /**
     * Buka modal custom tanggal.
     */
    if (value === "aturTanggal") {
      handleShowModalDate();
      return;
    }

    /**
     * Reset tanggal.
     *
     * Tidak perlu setSelected secara manual karena
     * selected akan mengikuti startDate dan endDate
     * melalui useEffect.
     */
    if (value === "reset") {
      resetRangeDate();
      return;
    }

    /**
     * Preset tanggal.
     */
    const range = JSON.parse(value) as RangeDateState;

    setRangeDate(range.startDate, range.endDate);
  };

  /**
   * Apply tanggal dari DayPicker.
   *
   * Jika hanya memilih satu tanggal:
   *
   * from = 16 September
   * to   = undefined
   *
   * maka:
   *
   * startDate = 16 September
   * endDate   = 16 September
   */
  const handleApply = () => {
    if (!selected?.from) return;

    const startDate = format(selected.from, "yyyy-MM-dd");

    const endDate = format(selected.to ?? selected.from, "yyyy-MM-dd");

    setRangeDate(startDate, endDate);

    closeModalDate();
  };

  /**
   * Menentukan option dropdown berdasarkan
   * startDate dan endDate saat ini.
   *
   * Jika kombinasi tanggal tidak ada di listDate,
   * maka dianggap sebagai tanggal custom.
   */
  const selectedOption = useMemo(() => {
    if (!startDate || !endDate) {
      return "";
    }

    const found = listDate.find((item) => {
      if (item.value === "reset") {
        return false;
      }

      try {
        const range = JSON.parse(item.value) as RangeDateState;

        return range.startDate === startDate && range.endDate === endDate;
      } catch {
        return false;
      }
    });

    return found?.value ?? "aturTanggal";
  }, [listDate, startDate, endDate]);

  /**
   * Modal tanggal.
   */
  const {
    modalRef: modalDateRef,
    handleShowModal: handleShowModalDate,
    handleCloseModal: closeModalDate,
  } = useModal();

  return {
    startDate,
    endDate,

    selected,
    setSelected,

    selectedOption,

    handleApply,
    handleOnChangeDropDown,

    setRangeDate,
    resetRangeDate,

    modalDateRef,
    closeModalDate,
  };
};

export default useRangeDate;
