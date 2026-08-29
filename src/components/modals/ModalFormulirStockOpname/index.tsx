import { type FC, type RefObject } from "react";
import { cn } from "../../../utils/cn";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import InputTextAreaNonIcon from "../../inputs/InputTextAreaNonIcon";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import { InputDate } from "../../inputs/InputDate";
import ButtonText from "../../ui/button/ButtonText";
import useFormulirStockOpname from "./useModalFormulirStockOpname";
import { ClipboardCheck } from "lucide-react";
import type { CreateStockOpnameForRequestType } from "../../../models/stockOpname.model";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
};

const ModalFormulirStockOpname: FC<Props> = ({
  modalRef,
  handleCloseModal,
}) => {
  // get configuration formulir
  const {
    errors,
    handleCloseModalWithReset,
    handleSubmit,
    isPendingStockOpname,
    onSubmit,
    register,
    useTanggalOpnameController,
  } = useFormulirStockOpname({ handleCloseModal });

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box w-11/12 lg:w-1/2 max-w-5xl max-h-[90vh] bg-base-200 dark:border dark:border-base-content/10 scrollbar-thin rounded-2xl md:rounded-xl">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title="Formulir Tambah Stok Opname"
              keterangan="Formulir untuk membuat Stok Opname"
              withIcon={{
                icon: ClipboardCheck,
              }}
            />
          </div>

          {/* form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(
              "w-full flex flex-col justify-start items-start mt-4 gap-4",
            )}
          >
            <div className="w-full flex md:flex-row flex-col justify-start items-start gap-4">
              {/* tanggal */}
              <div className="flex-1 md:border-r md:border-base-content/10 md:pr-4">
                <InputDate<CreateStockOpnameForRequestType>
                  controller={useTanggalOpnameController}
                  label="Tanggal Opname"
                />
              </div>

              <div className="md:flex-1 w-full flex flex-col justify-end items-start">
                {/* keterangan */}
                <InputTextAreaNonIcon
                  register={register("keterangan")}
                  label="Keterangan (Opsional)"
                  max={300}
                  name="keterangan"
                  placeholder="Masukkan Keterangan"
                  errorMessage={errors.keterangan?.message}
                  rows={8}
                />

                {/* action */}
                <div className="w-full flex flex-row justify-end items-center gap-2.5">
                  <ButtonCloseText
                    handleClose={handleCloseModalWithReset}
                    disabled={isPendingStockOpname}
                  />

                  <ButtonText label="Simpan" isLoading={isPendingStockOpname} />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalFormulirStockOpname;
