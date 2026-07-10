import "react-day-picker/style.css";

import { DayPicker } from "react-day-picker";
import { cn } from "../../../utils/cn";
import { id } from "date-fns/locale";
import DropDown from "../../inputs/DropDown";
import listDateRange from "../../../utils/listDateRange";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonSubmit from "../../ui/button/ButtonSubmit";
import { type FC } from "react";
import { formatTanggalPanjang } from "../../../helpers/formatDate";
import useRangeDate from "../../../hooks/useRangeDate";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

// props
type Props = {
  customWidth?: string;
  defaultStartDate?: string;
  defaultEndDate?: string;
  listDate?: { label: string; value: string }[];
  noLabel?: boolean;
};

const RangeDate: FC<Props> = ({
  customWidth,
  defaultStartDate = format(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      new Date().getDate(),
    ),
    "yyyy-MM-dd",
  ),
  defaultEndDate = format(new Date(), "yyyy-MM-dd"),
  noLabel,
  listDate,
}) => {
  // use hook
  const {
    closeModalDate,
    handleApply,
    handleOnChangeDropDown,
    searchParams,
    modalDateRef,
    selected,
    setSelected,
  } = useRangeDate({
    listDate: listDate ?? listDateRange,
    defaultStartDate,
    defaultEndDate,
  });

  return (
    <div
      className={cn(
        "flex  justify-start items-start",
        noLabel ? "flex-row gap-2" : "flex-col gap-1.5",
        customWidth ? customWidth : "w-60",
      )}
    >
      {/* icon */}
      {noLabel && (
        <CalendarDays className="size-9 md:size-8 text-base-content" />
      )}

      <div className="flex w-full flex-col justify-start items-start gap-1.5">
        {!noLabel && (
          <span className="text-xs text-base-content/80 font-medium">
            Urutkan
          </span>
        )}
        <div className={cn("flex w-full flex-row justify-start items-center")}>
          <DropDown
            customWidth="w-full"
            handleChange={(e) => {
              handleOnChangeDropDown(e.target.value);
            }}
            listChoose={listDate ?? listDateRange}
            placeholder="Filter Tanggal"
            listBtn={[
              {
                handleClick: () => handleOnChangeDropDown("aturTanggal"),
                label: "Kustom Tanggal",
                value: "aturTanggal",
              },
            ]}
            defaultValue={"aturTanggal"}
          />
        </div>

        {searchParams.get("start-date") && searchParams.get("end-date") && (
          <span className="text-xs font-medium text-base-content">
            {formatTanggalPanjang(searchParams.get("start-date")!)}
            {" - "}
            {formatTanggalPanjang(searchParams.get("end-date")!)}
          </span>
        )}
      </div>

      <dialog ref={modalDateRef} id="my_modal_1" className="modal">
        <div
          className={cn(
            "modal-box bg-base-200 w-11/12 lg:w-140 dark:border dark:border-base-content/10",
          )}
        >
          <div className="w-full flex flex-col justify-start items-start">
            <h2 className="text-sm lg:text-base font-semibold text-base-content">
              Silahkan Pilih Tanggal
            </h2>
          </div>

          <div className="w-full flex flex-row justify-center items-center mt-6">
            <div className="scale-100 origin-top-center">
              <DayPicker
                mode="range"
                locale={id}
                selected={selected}
                onSelect={setSelected}
              />
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 justify-start items-start mt-6">
            <p className="text-xs font-medium">Pilihan Tanggal : </p>

            <span className="text-xs lg:text-sm font-medium">
              {formatTanggalPanjang(selected?.from ?? new Date())} -{" "}
              {formatTanggalPanjang(selected?.to ?? new Date())}
            </span>
          </div>

          {/* close modal */}
          <div className="w-full flex flex-row justify-end gap-2 items-end mt-8">
            {/* button reset */}
            <ButtonCloseText
              handleClose={() => {
                handleOnChangeDropDown("reset");
                closeModalDate();
              }}
              label="Reset"
            />

            <ButtonCloseText handleClose={closeModalDate} />

            {/* handle apply */}
            <ButtonSubmit
              label="Terapkan"
              typeButton
              handleClick={handleApply}
              disable={
                !selected?.from ||
                !selected?.to ||
                selected.from.getTime() === selected.to.getTime()
              }
            />
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default RangeDate;
