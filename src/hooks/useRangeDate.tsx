import { useEffect, useMemo, useState } from "react";
import useModal from "./useModal";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useSearchParams } from "react-router-dom";

const useRangeDate = (params: {
  listDate: {
    label: string;
    value: string;
  }[];
  defaultStartDate?: string;
  defaultEndDate?: string;
}) => {
  const { listDate, defaultEndDate, defaultStartDate } = params;

  const [searchParams, setSearchParams] = useSearchParams();

  const [selected, setSelected] = useState<DateRange>();

  // set default date pertama kali
  useEffect(() => {
    if (!defaultStartDate || !defaultEndDate) return;

    const startDate = searchParams.get("start-date");
    const endDate = searchParams.get("end-date");

    if (startDate && endDate) return;

    const params = new URLSearchParams(searchParams);

    params.set("start-date", defaultStartDate);
    params.set("end-date", defaultEndDate);

    setSearchParams(params, {
      replace: true,
    });
  }, [defaultStartDate, defaultEndDate]);

  // sync selected dengan URL
  useEffect(() => {
    const startDate = searchParams.get("start-date");
    const endDate = searchParams.get("end-date");

    if (startDate && endDate) {
      setSelected({
        from: new Date(startDate),
        to: new Date(endDate),
      });
    }
  }, [searchParams]);

  const setRangeDate = (reset: boolean, startDate: string, endDate: string) => {
    const params = new URLSearchParams(searchParams);

    if (reset) {
      params.delete("start-date");
      params.delete("end-date");
    }

    if (startDate) {
      params.set("start-date", startDate);
    }

    if (endDate) {
      params.set("end-date", endDate);
    }

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
      if (!defaultStartDate || !defaultEndDate) {
        setSelected({
          from: new Date(defaultStartDate ?? ""),
          to: new Date(defaultEndDate ?? ""),
        });
      } else {
        setSelected(undefined);
      }
      setRangeDate(true, defaultStartDate ?? "", defaultEndDate ?? "");

      return;
    }

    const range = JSON.parse(value) as {
      startDate: string;
      endDate: string;
    };

    setRangeDate(false, range.startDate, range.endDate);
  };

  const handleApply = () => {
    if (!selected?.from || !selected?.to) return;

    setRangeDate(
      false,
      format(selected.from, "yyyy-MM-dd"),
      format(selected.to, "yyyy-MM-dd"),
    );

    closeModalDate();
  };

  // dropdown value aktif
  const selectedOption = useMemo(() => {
    const startDate = searchParams.get("start-date");
    const endDate = searchParams.get("end-date");

    if (!startDate || !endDate) return "";

    const found = listDate.find((item) => {
      const range = JSON.parse(item.value);

      return range.startDate === startDate && range.endDate === endDate;
    });

    return found?.value ?? "aturTanggal";
  }, [searchParams]);

  // modal
  const {
    modalRef: modalDateRef,
    handleShowModal: handleShowModalDate,
    handleCloseModal: closeModalDate,
  } = useModal();

  return {
    selected,
    setSelected,
    handleOnChangeDropDown,
    handleApply,
    selectedOption,
    modalDateRef,
    closeModalDate,
    searchParams,
    setRangeDate,
  };
};

export default useRangeDate;
