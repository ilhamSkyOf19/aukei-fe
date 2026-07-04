import "react-day-picker/style.css";

import { format } from "date-fns";
import { cn } from "../../../utils/cn";
import { id } from "date-fns/locale";
import { useSearchParams } from "react-router-dom";
import useModal from "../../../hooks/useModal";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonSubmit from "../../ui/button/ButtonSubmit";
import { useEffect, useMemo, useState, type FC } from "react";
import { formatTanggalPanjang } from "../../../helpers/formatDate";
import { CalendarDays } from "lucide-react";
import listDateRangeLong from "../../../utils/listDateRangeLong";
import { DayPicker, type DateRange } from "react-day-picker";

type Props = {
  customWidth?: string;
  defaultStartDate?: string;
  defaultEndDate?: string;
};

const RangeDateLarge: FC<Props> = ({
  customWidth,
  defaultStartDate,
  defaultEndDate,
}) => {
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
      setSelected(undefined);
      setRangeDate(true, "", "");
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

    const found = listDateRangeLong.find((item) => {
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

  return (
    <div
      className={cn(
        "flex flex-row items-center gap-1.5 border border-base-content/10 rounded-lg p-2",
        customWidth,
      )}
    >
      <CalendarDays className="size-8 shrink-0 text-base-content" />

      <div className="flex flex-col w-full">
        <span className="text-xs text-base-content/80 font-medium ml-2.5">
          Tanggal
        </span>

        <select
          value={selectedOption}
          className="select select-sm w-full h-7 border-none shadow-none text-base-content outline-none"
          onChange={(e) => handleOnChangeDropDown(e.target.value)}
        >
          <option value="" disabled>
            Filter Tanggal
          </option>

          {listDateRangeLong.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}

          <option value="aturTanggal">Kustom Tanggal</option>
        </select>

        {searchParams.get("start-date") && searchParams.get("end-date") && (
          <div className="ml-2.5">
            <span className="text-xs font-medium text-base-content">
              {formatTanggalPanjang(searchParams.get("start-date")!)}
              {" - "}
              {formatTanggalPanjang(searchParams.get("end-date")!)}
            </span>
          </div>
        )}
      </div>

      <dialog ref={modalDateRef} className="modal">
        <div className="modal-box bg-base-200 w-11/12 lg:w-140">
          <h2 className="font-semibold">Silahkan Pilih Tanggal</h2>

          <div className="flex justify-center mt-6">
            <DayPicker
              mode="range"
              locale={id}
              selected={selected}
              onSelect={setSelected}
              defaultMonth={
                selected?.from ??
                (searchParams.get("start-date")
                  ? new Date(searchParams.get("start-date")!)
                  : new Date())
              }
            />
          </div>

          <div className="mt-6">
            <p className="text-xs font-medium">Pilihan Tanggal</p>

            <span className="text-sm font-medium">
              {selected?.from ? formatTanggalPanjang(selected.from) : "-"}
              {" - "}
              {selected?.to ? formatTanggalPanjang(selected.to) : "-"}
            </span>
          </div>

          <div className="flex justify-end gap-2 mt-8">
            <ButtonCloseText
              label="Reset"
              handleClose={() => {
                setSelected(undefined);
                setRangeDate(true, "", "");
                closeModalDate();
              }}
            />

            <ButtonCloseText handleClose={closeModalDate} />

            <ButtonSubmit
              label="Terapkan"
              typeButton
              handleClick={handleApply}
              disable={!selected?.from || !selected?.to}
            />
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default RangeDateLarge;
