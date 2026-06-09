import "react-day-picker/style.css";

import { DayPicker, type DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "../../../utils/cn";
import { id } from "date-fns/locale";
import { useSearchParams } from "react-router-dom";
import useModal from "../../../hooks/useModal";
import DropDown from "../../inputs/DropDown";
import listDateRange from "../../../utils/listDateRange";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonSubmit from "../../ui/button/ButtonSubmit";
import { useState, type FC } from "react";
import { formatTanggalPanjang } from "../../../helpers/formatDate";

const RangeDate: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selected, setSelected] = useState<DateRange | undefined>();

  const setRangeDate = (reset: boolean, startDate: string, endDate: string) => {
    // mode URL (behavior lama)
    const params = new URLSearchParams(searchParams);

    if (reset) {
      params.delete("startDate");
      params.delete("endDate");
    }

    if (startDate) {
      params.set("startDate", startDate);
    }

    if (endDate) {
      params.set("endDate", endDate);
    }

    setSearchParams(params.toString());
  };

  //   use modal
  const {
    modalRef: modalDateRef,
    handleShowModal: handleShowModalDate,
    handleCloseModal: closeModalDate,
  } = useModal();

  //   handle range date
  const handleOnChangeDropDown = (value: string) => {
    if (value === "aturTanggal") {
      handleShowModalDate();
      return;
    }

    if (value === "reset") {
      setRangeDate(true, "", "");
      selected && setSelected(undefined);
      return;
    }

    const range = JSON.parse(value) as {
      startDate: string;
      endDate: string;
    };

    if (range) {
      setRangeDate(false, range.startDate, range.endDate);
      selected && setSelected(undefined);
    }
  };

  //   handle apply
  const handleApply = () => {
    if (selected?.from && selected?.to) {
      const startDate = format(selected.from, "yyyy-MM-dd");
      const endDate = format(selected.to, "yyyy-MM-dd");
      setRangeDate(false, startDate, endDate);

      closeModalDate();
    }
  };

  const handleCloseModalDete = () => {
    setSelected({
      from: searchParams.get("startDate")
        ? new Date(searchParams.get("startDate") ?? "")
        : undefined,
      to: searchParams.get("endDate")
        ? new Date(searchParams.get("endDate") ?? "")
        : undefined,
    });

    closeModalDate();
  };

  return (
    <div className="flex flex-col justify-start items-col gap-2">
      <div className="w-60 flex flex-row justify-start items-center ">
        <DropDown
          customWidth="w-full"
          handleChange={(e) => {
            handleOnChangeDropDown(e.target.value);
          }}
          listChoose={listDateRange}
          placeholder="Filter Tanggal"
          listBtn={[
            {
              handleClick: () => handleShowModalDate(),
              label: "Kustom Tanggal",
              value: "",
            },
          ]}
        />
      </div>

      {/* show date */}
      {searchParams.get("startDate") && searchParams.get("endDate") && (
        <div className="flex flex-row justify-start items-center">
          <span className="text-xs font-medium">
            {formatTanggalPanjang(searchParams.get("startDate") ?? "")} -{" "}
            {formatTanggalPanjang(searchParams.get("endDate") ?? "")}
          </span>
        </div>
      )}

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
                handleCloseModalDete();
              }}
              label="Reset"
            />

            <ButtonCloseText handleClose={handleCloseModalDete} />

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
