import { AlertCircle, type LucideIcon } from "lucide-react";
import { type FC, type RefObject } from "react";
import { cn } from "../../../utils/cn";
import ButtonText from "../../ui/button/ButtonText";
type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal?: () => void;
  handleConfirm?: () => void;
  bigTitle: string;
  smallTitle: string;
  icon?: LucideIcon;
  iconColor?: string;
  labelNext?: string;
  isLoading?: boolean;
};
const ModalAlert: FC<Props> = ({
  handleCloseModal,
  modalRef,
  bigTitle,
  smallTitle,
  handleConfirm,
  icon: Icon,
  iconColor,
  labelNext,
  isLoading,
}) => {
  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box w-120 bg-base-200 dark:border dark:border-base-content/10">
        {/* icon alert */}
        <div className="w-full flex justify-center mb-4">
          {Icon && <Icon className={cn("size-20", iconColor)} />}
          {!Icon && <AlertCircle className="size-20 text-error" />}
        </div>
        <h3 className="font-bold text-base lg:text-lg text-center mb-4 text-base-content">
          {bigTitle}
        </h3>

        {/* content */}
        <p className="text-sm lg:text-sm text-center text-base-content">
          {smallTitle}
        </p>

        <div className="w-full flex flex-row justify-end items-end gap-2 mt-8">
          {/* button close */}
          {handleCloseModal && (
            <ButtonText label={"Batal"} handleClick={handleCloseModal} />
          )}

          {handleConfirm && (
            <ButtonText
              label={labelNext ?? "Lanjutkan"}
              bgColor="bg-custom-primary"
              textColor="text-custom-secondary"
              handleClick={handleConfirm}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </dialog>
  );
};

export default ModalAlert;
