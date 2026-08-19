import { type FC, type RefObject } from "react";
import { cn } from "../../../utils/cn";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import InputTextNonIcon from "../../inputs/InputTextNonIcon";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import { Tag } from "lucide-react";
import ButtonText from "../../ui/button/ButtonText";
import type { UpdateJenisKeluarType } from "../../../models/jenisKeluar.model";
import useFormulirjenisKeluar from "../../../hooks/useFormulirJenisKeluar";
type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  dataUpdate?: UpdateJenisKeluarType;
  handleSetToast: (value: string) => void;
};
const ModalFormulirJenisKeluar: FC<Props> = ({
  modalRef,
  handleCloseModal,
  dataUpdate,
  handleSetToast,
}) => {
  const {
    errors,
    register,
    onSubmit,
    handleSubmit,
    reset,
    isPendingMutateJenisKeluar,
    isDirty,
  } = useFormulirjenisKeluar({
    dataUpdate,
    handleCloseModal,
    handleSetToast,
  });

  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div className="modal-box w-11/12 md:w-2/3 lg:w-2/5 max-w-5xl bg-base-200  rounded-2xl dark:border dark:border-base-content/10">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title="Formulir Jenis Keluar"
              keterangan={`Formulir untuk ${dataUpdate ? "ubah" : "tambah"} Jenis Keluar`}
              withIcon={{
                icon: Tag,
              }}
            />
          </div>

          {/* form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(
              "w-full flex flex-col justify-start items-center mt-4",
            )}
          >
            {/* nama */}
            <InputTextNonIcon
              register={register(`nama`)}
              label={`Jenis Keluar`}
              max={100}
              name="nama"
              required={true}
              placeholder={`Masukan jenis keluar`}
              errorMessage={errors.nama?.message}
            />

            {/* action */}
            <div className="w-full mt-6 flex flex-row justify-end items-center gap-4">
              {/* button close */}
              <ButtonCloseText
                disabled={isPendingMutateJenisKeluar}
                handleClose={() => {
                  handleCloseModal();
                  reset();
                }}
              />
              {/* button submit */}
              <ButtonText
                label={`Simpan`}
                disable={!isDirty || isPendingMutateJenisKeluar}
                isLoading={isPendingMutateJenisKeluar}
              />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalFormulirJenisKeluar;
