import { Banknote, Percent, TicketPercent } from "lucide-react";
import { type FC, type RefObject } from "react";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import useModalChooseViewDiskon from "./useModalChooseViewDiskon";
import { cn } from "../../../utils/cn";
import ButtonText from "../../ui/button/ButtonText";
type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  handleSetAlert: (value: string) => void;
  handleSetToast: (value: string) => void;
  type: "PRINT" | "DOWNLOAD";
  dataDownload?: { id: number; namaPelanggan: string; tanggal: Date };
};
const ModalChooseViewDiskon: FC<Props> = ({
  handleCloseModal,
  modalRef,
  handleSetAlert,
  type,
  handleSetToast,
  dataDownload,
}) => {
  const { isLoading, diskonType, handleAction, setDiskonType } =
    useModalChooseViewDiskon({
      handleSetAlert,
      handleCloseModal,
      type,
      handleSetToast,
      dataDownload,
    });

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box w-11/12 lg:w-120 rounded-2xl md:rounded-xl bg-base-200 dark:border dark:border-base-content/10">
        {/* icon alert */}
        <div className="w-full flex justify-center mb-4">
          <TicketPercent className="size-20 text-error -rotate-45" />
        </div>
        <h3 className="font-bold text-base lg:text-lg text-center mb-4 text-base-content">
          Pilih tampilan diskon
        </h3>

        {/* content */}
        <p className="text-sm lg:text-sm text-center text-base-content">
          Silakan pilih tampilan diskon yang ingin digunakan: persentase (%)
          atau nominal rupiah (Rp).
        </p>

        <div className="mt-4 w-full flex flex-row justify-center items-center gap-2.5">
          <button
            type="button"
            className={cn(
              "flex border  flex-row justify-center items-center gap-2 px-2.5 h-10.5 md:h-9 rounded-2xl md:rounded-xl",
              diskonType === "RUPIAH"
                ? "bg-custom-primary text-text-custom-secondary border-custom-primary"
                : "border-base-content/30 hover:bg-base-content/10 transition-all duration-150 ease-in-out",
            )}
            onClick={() => {
              if (diskonType !== "RUPIAH") setDiskonType("RUPIAH");
            }}
          >
            <Banknote className="size-4" />
            <span className="text-xs">Rupiah</span>
          </button>

          <button
            type="button"
            className={cn(
              "border flex flex-row justify-center items-center gap-2 px-2.5 h-10.5 md:h-9 rounded-2xl md:rounded-xl",
              diskonType === "PERSEN"
                ? "bg-custom-primary text-text-custom-secondary border-custom-primary"
                : "border-base-content/30 hover:bg-base-content/10 transition-all duration-150 ease-in-out",
            )}
            onClick={() => {
              if (diskonType !== "PERSEN") setDiskonType("PERSEN");
            }}
          >
            <Percent className="size-4" />
            <span className="text-xs">Persentase</span>
          </button>
        </div>

        <div className="w-full flex flex-row justify-end items-end gap-2 mt-4">
          {/* button close */}
          <ButtonCloseText
            disabled={isLoading}
            label={"Batal"}
            handleClose={handleCloseModal}
          />

          {/* button cetak */}
          <ButtonText label={"Cetak"} handleClick={() => handleAction()} />
        </div>
      </div>
    </dialog>
  );
};

export default ModalChooseViewDiskon;
