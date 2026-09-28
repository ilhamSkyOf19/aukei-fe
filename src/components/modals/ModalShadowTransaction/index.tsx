import type { FC, RefObject } from "react";
import { HatGlasses } from "lucide-react";
import useModalShadowTransaction from "./useModalShadowTransaction";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import { cn } from "../../../utils/cn";
import InputDateDefault from "../../inputs/InputDateDefault";
import type { CreateShadowTransactionType } from "../../../models/shadowTransaction.model";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonText from "../../ui/button/ButtonText";
import { formatTanggalShort } from "../../../helpers/formatDate";

import { format, subDays, subMonths, subYears } from "date-fns";

export const getDateRangeOptions = () => {
  const today = new Date();

  const endDate = format(today, "yyyy-MM-dd");

  return [
    {
      key: "TODAY",
      label: "Hari Ini",
      startDate: endDate,
      endDate,
    },
    {
      key: "1_WEEK",
      label: "1 Minggu",
      startDate: format(subDays(today, 7), "yyyy-MM-dd"),
      endDate,
    },
    {
      key: "1_MONTH",
      label: "1 Bulan",
      startDate: format(subMonths(today, 1), "yyyy-MM-dd"),
      endDate,
    },
    {
      key: "1_YEAR",
      label: "1 Tahun",
      startDate: format(subYears(today, 1), "yyyy-MM-dd"),
      endDate,
    },
    {
      key: "3_YEAR",
      label: "3 Tahun",
      startDate: format(subYears(today, 3), "yyyy-MM-dd"),
      endDate,
    },
    {
      key: "5_YEAR",
      label: "5 Tahun",
      startDate: format(subYears(today, 5), "yyyy-MM-dd"),
      endDate,
    },
  ];
};

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  shadowFeatureId?: number;
  handleSetToast: (value: string) => void;
};

const ModalAddShadowFeature: FC<Props> = ({
  modalRef,
  handleCloseModal,
  handleSetToast,
  shadowFeatureId,
}) => {
  // call use
  const {
    handleSubmit,
    onSubmit,
    endDateController,
    isPendingAddShadowTransaction,
    startDateController,

    handleSetValue,
    endDateWatch,
    startDateWatch,
  } = useModalShadowTransaction({
    handleCloseModal,
    handleSetToast,
    shadowFeatureId,
  });

  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div className="modal-box w-11/12 lg:w-2/4 max-w-5xl rounded-2xl bg-base-100 dark:border dark:border-base-content/10">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title={`Formulir Kalkulasi Nilai Bayangan`}
              keterangan={`Formulir untuk Mengkalkulasi Nilai Bayangan`}
              withIcon={{
                icon: HatGlasses,
              }}
            />
          </div>

          {/* choose */}
          <div className="w-full grid grid-cols-3 mt-4 gap-2 pb-4 border-b border-base-content/30">
            {getDateRangeOptions().map((item) => (
              <button
                key={item.key}
                disabled={
                  startDateWatch === item.startDate &&
                  endDateWatch === item.endDate
                }
                type="button"
                className="col-span-1 flex flex-col justify-center items-center border rounded-2xl md:rounded-xl h-14 border-custom-primary not-disabled:hover:bg-custom-primary transition-all ease-in-out duration-150 not-disabled:hover:text-text-custom-primary relative text-base-content"
                onClick={() => handleSetValue(item)}
              >
                <span className=" text-xs font-medium mb-2">{item.label}</span>
                <div className="w-full gap-2.5 absolute bottom-0.5 flex flex-row justify-center items-center ">
                  <span className="text-[0.625rem]">
                    {formatTanggalShort(item.startDate)}
                  </span>
                  <span className="text-[0.625rem]">-</span>
                  <span className="text-[0.625rem]">
                    {formatTanggalShort(item.endDate)}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(
              "w-full flex flex-col justify-start items-center mt-4",
            )}
          >
            <div className="w-full flex flex-row justify-start items-start gap-2.5">
              {/* start date */}
              <InputDateDefault<
                Pick<CreateShadowTransactionType, "startDate" | "endDate">
              >
                label={`Tanggal Mulai`}
                placeholder={`Masukan Tanggal Mulai`}
                controller={startDateController}
                required
              />

              {/* end date */}
              <InputDateDefault<
                Pick<CreateShadowTransactionType, "startDate" | "endDate">
              >
                label={`Tanggal Selesai`}
                placeholder={`Masukan Tanggal Selesai`}
                controller={endDateController}
                required
              />
            </div>

            <div className="w-full flex flex-row justify-start items-start">
              <span className="text-[0.7rem] text-base-content">
                * Proses kalkulasi akan membutuhkan waktu.
              </span>
            </div>

            {/* action */}
            <div className="w-full mt-2 flex flex-row justify-end items-center gap-4">
              {/* button close */}
              <ButtonCloseText
                handleClose={() => {
                  handleCloseModal();
                }}
                disabled={isPendingAddShadowTransaction}
              />
              {/* button submit */}
              <ButtonText
                label={`Kalkulasi`}
                isLoading={isPendingAddShadowTransaction}
              />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalAddShadowFeature;
