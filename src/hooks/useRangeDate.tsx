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

  useEffect(() => {
    if (isControlled) return;

    const hasStart = searchParams.has("start-date");
    const hasEnd = searchParams.has("end-date");

    if (hasStart && hasEnd) return;

    const params = new URLSearchParams(searchParams);

    params.set("start-date", defaultStartDate);
    params.set("end-date", defaultEndDate);

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

  useEffect(() => {
    if (!startDate || !endDate) {
      setSelected(undefined);
      return;
    }

    setSelected({
      from: new Date(startDate),
      to: new Date(endDate),
    });
  }, [startDate, endDate]);

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

    setSearchParams(params, {
      replace: true,
    });
  };

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

    setSearchParams(params, {
      replace: true,
    });
  };

  const handleOnChangeDropDown = (value: string) => {
    if (value === "aturTanggal") {
      handleShowModalDate();
      return;
    }

    if (value === "reset") {
      setSelected({
        from: new Date(defaultStartDate),
        to: new Date(defaultEndDate),
      });

      resetRangeDate();
      return;
    }

    const range = JSON.parse(value) as RangeDateState;

    setRangeDate(range.startDate, range.endDate);
  };

  const handleApply = () => {
    if (!selected?.from || !selected?.to) return;

    setRangeDate(
      format(selected.from, "yyyy-MM-dd"),
      format(selected.to, "yyyy-MM-dd"),
    );

    closeModalDate();
  };

  const selectedOption = useMemo(() => {
    if (!startDate || !endDate) return "";

    const found = listDate.find((item) => {
      if (item.value === "reset") return false;

      const range = JSON.parse(item.value) as RangeDateState;

      return range.startDate === startDate && range.endDate === endDate;
    });

    return found?.value ?? "aturTanggal";
  }, [listDate, startDate, endDate]);

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
