import type { FC, RefObject } from "react";
import { HatGlasses } from "lucide-react";
import type { ResponseShadowFeatureType } from "../../../../models/shadowFeature.model";
import useModalAddShadowFeature from "./useModalAddShadowFeature";
import TitleModalFormulir from "../../../ui/TitleModalFormulir";
import { cn } from "../../../../utils/cn";
import InputTextNonIcon from "../../../inputs/InputTextNonIcon";
import ButtonCloseText from "../../../ui/button/ButtonCloseText";
import ButtonText from "../../../ui/button/ButtonText";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  data?: ResponseShadowFeatureType;
  id?: number;
  handleSetToast: (value: string) => void;
  handleShowModalChoose: () => void;
};

const ModalAddShadowFeature: FC<Props> = ({
  modalRef,
  handleCloseModal,
  data,
  id,
  handleSetToast,
  handleShowModalChoose,
}) => {
  // call use
  const {
    errors,
    handleSubmit,
    onSubmit,
    register,
    isDirty,
    isPendingAddShadowFeature,
  } = useModalAddShadowFeature({
    id,
    data,
    handleCloseModal,
    handleSetToast,
    handleShowModalChoose,
  });

  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div className="modal-box w-11/12 lg:w-2/5 max-w-5xl rounded-2xl bg-base-100 dark:border dark:border-base-content/10">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title={`Formulir ${id ? "Ubah" : "Tambah"} Nilai Bayangan`}
              keterangan={`Formulir untuk ${id ? "mengubah" : "menambah"} Nilai Bayangan`}
              withIcon={{
                icon: HatGlasses,
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
              label={`Nama Nilai (opsional)`}
              max={100}
              name="nama"
              placeholder={`Masukan nama nilai`}
              errorMessage={errors.nama?.message}
            />

            {/* action */}
            <div className="w-full mt-2 flex flex-row justify-end items-center gap-4">
              {/* button close */}
              <ButtonCloseText
                handleClose={() => {
                  handleCloseModal();
                  handleShowModalChoose();
                }}
                disabled={isPendingAddShadowFeature}
              />
              {/* button submit */}
              <ButtonText
                label={`Simpan`}
                isLoading={isPendingAddShadowFeature}
                disable={id ? !isDirty : false}
              />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalAddShadowFeature;
