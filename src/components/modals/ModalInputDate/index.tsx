import { type RefObject } from "react";
import { cn } from "../../../utils/cn";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import { InputDate } from "../../inputs/InputDate";
import type {
  FieldValues,
  UseControllerReturn,
  UseFormHandleSubmit,
} from "react-hook-form";
import { Calendar } from "lucide-react";
import ButtonText from "../../ui/button/ButtonText";
type Props<T extends FieldValues> = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleSubmit: UseFormHandleSubmit<T>;
  onSubmit: (data: T) => Promise<void>;
  handleCloseModal: () => void;
  useControll: UseControllerReturn<T>;
  isPending?: boolean;
  bigTitle: string;
  smallTitle: string;
};

const ModalInputDate = <T extends FieldValues>({
  modalRef,
  handleCloseModal,
  handleSubmit,
  onSubmit,
  useControll,
  isPending,
  bigTitle,
  smallTitle,
}: Props<T>) => {
  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div className="modal-box w-11/12 lg:w-2/6 max-w-5xl max-h-[95vh] bg-base-200 dark:border dark:border-base-content/10 scrollbar-thin rounded-2xl md:rounded-xl">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              withIcon={{ icon: Calendar }}
              title={bigTitle}
              keterangan={smallTitle}
            />
          </div>

          {/* form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(
              "w-full flex flex-col justify-start items-center mt-4 gap-4",
            )}
          >
            {/* nama */}
            <InputDate controller={useControll} label="Tanggal Masuk" />

            {/* action */}
            <div className="w-full flex flex-row justify-end items-center gap-4">
              {/* button close */}
              <ButtonCloseText
                handleClose={() => {
                  handleCloseModal();
                }}
              />
              {/* button submit */}
              <ButtonText label={`Simpan`} isLoading={isPending} />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalInputDate;
