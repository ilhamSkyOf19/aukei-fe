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
import ButtonText from "../../ui/button/ButtonText";

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
    modalDateRef,
    selected,
    selectedOption,
    setSelected,
    startDate,
    endDate,
  } = useRangeDate({
    listDate: listDateRangeLong,
    defaultStartDate,
    defaultEndDate,
  });

  return (
    <div
      className={cn(
        "flex flex-row items-center border border-base-content/10 rounded-2xl md:rounded-xl p-2 gap-4",
        customWidth,
      )}
    >
      <CalendarDays className="size-8 shrink-0 text-base-content" />

      <div className="flex flex-col w-full">
        <span className="text-xs text-base-content/80 font-medium">
          Tanggal
        </span>

        <select
          value={selectedOption}
          className="select select-sm mt-1 w-full h-10 shadow-none text-base-content rounded-xl outline-none"
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

        {startDate && endDate && (
          <div className="">
            <span className="text-xs font-medium text-base-content">
              {formatTanggalPanjang(startDate!)}
              {" - "}
              {formatTanggalPanjang(endDate!)}
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
                (startDate ? new Date(startDate!) : new Date())
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

            <ButtonText
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
