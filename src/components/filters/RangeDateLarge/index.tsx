import "react-day-picker/style.css";

import { cn } from "../../../utils/cn";
import { id } from "date-fns/locale";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonSubmit from "../../ui/button/ButtonSubmit";
import { type FC } from "react";
import { formatTanggalPanjang } from "../../../helpers/formatDate";
import { CalendarDays } from "lucide-react";
import listDateRangeLong from "../../../utils/listDateRangeLong";
import { DayPicker } from "react-day-picker";
import useRangeDate from "../../../hooks/useRangeDate";

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
  // use hook
  const {
    closeModalDate,
    handleApply,
    handleOnChangeDropDown,
    searchParams,
    modalDateRef,
    selected,
    selectedOption,
    setSelected,
  } = useRangeDate({
    listDate: listDateRangeLong,
    defaultStartDate,
    defaultEndDate,
  });

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

          <option
            value="aturTanggal"
            onClick={() => handleOnChangeDropDown("aturTanggal")}
          >
            Kustom Tanggal
          </option>
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
                handleOnChangeDropDown("reset");
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
