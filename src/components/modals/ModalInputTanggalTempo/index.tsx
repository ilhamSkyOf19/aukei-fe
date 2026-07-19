import { type RefObject } from "react";
import { cn } from "../../../utils/cn";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import { InputDate } from "../../inputs/InputDate";
import type { FieldValues, UseControllerReturn } from "react-hook-form";
import ButtonText from "../../ui/button/ButtonText";
import TitleModalFormulir from "../../ui/TitleModalFormulir";

type Props<T extends FieldValues> = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleReset: () => void;
  handleCloseModal: () => void;
  useControll: UseControllerReturn<T>;
};

const ModalInputTanggalTempo = <T extends FieldValues>({
  modalRef,
  handleCloseModal,
  useControll,
  handleReset,
}: Props<T>) => {
  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div className="modal-box w-auto max-w-5xl max-h-[90vh] bg-base-200 dark:border dark:border-base-content/10 scrollbar-thin">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title={"Atur Tanggal Mulai Cicilan"}
              keterangan={"Silahkan atur tanggal untuk memulai cicilan kredit"}
            />
          </div>

          {/* form */}
          <div
            className={cn(
              "w-full flex flex-col justify-start items-center mt-4",
            )}
          >
            {/* nama */}
            <InputDate controller={useControll} xs noTime={{ endTime: true }} />

            {/* action */}
            <div className="w-full mt-6 flex flex-row justify-end items-center gap-4">
              {/* button close */}
              <ButtonCloseText
                handleClose={() => {
                  handleCloseModal();
                  handleReset();
                }}
              />

              <ButtonText
                bgColor="bg-custom-primary"
                label="Simpan"
                handleClick={() => {
                  handleCloseModal();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default ModalInputTanggalTempo;
