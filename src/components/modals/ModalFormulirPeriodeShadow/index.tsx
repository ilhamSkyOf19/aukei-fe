import type { FC, RefObject } from "react";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import { cn } from "../../../utils/cn";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import { UserRound } from "lucide-react";
import ButtonText from "../../ui/button/ButtonText";
import useModalFormulirPeriodeShadow from "./useModalFormulirPeriodeShadow";
import type {
  CreatePeriodeShadowRequestType,
  ResponsePeriodeShadowType,
  UpdatePeriodeShadowRequestType,
} from "../../../models/periodeShadow.model";
import InputYear from "../../inputs/InputYear";
import InputPrice from "../../inputs/InputPrice";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  data?: ResponsePeriodeShadowType;
  id?: number;
  handleSetToast: (value: string) => void;
};

const ModalFormulirPeriodeShadow: FC<Props> = ({
  modalRef,
  handleCloseModal,
  data,
  id,
  handleSetToast,
}) => {
  // call use
  const {
    errors,
    handleSubmit,
    isDirty,
    isPendingPeriodeShadow,
    onSubmit,
    register,
    useNilaiController,
  } = useModalFormulirPeriodeShadow({
    handleCloseModal,
    handleSetToast,
    data,
    id,
  });

  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div className="modal-box w-11/12 lg:w-2/5 max-w-5xl rounded-2xl bg-base-100 dark:border dark:border-base-content/10">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title={`Formulir ${id ? "Ubah" : "Tambah"} Periode Bayangan`}
              keterangan={`Formulir untuk ${id ? "mengubah" : "menambah"} Periode Bayangan`}
              withIcon={{
                icon: UserRound,
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
            {/* periode */}
            <InputYear
              register={register(`tahun`, { valueAsNumber: true })}
              label={`Periode Tahun`}
              max={2100}
              name="tahun"
              required={true}
              placeholder={`Masukan periode tahun`}
              errorMessage={errors.tahun?.message}
            />

            {/* nilai */}
            <InputPrice<
              UpdatePeriodeShadowRequestType | CreatePeriodeShadowRequestType
            >
              controller={useNilaiController}
              label={`Nilai`}
              name="nilai"
              required={true}
              placeholder={`Masukan nilai`}
            />

            {/* action */}
            <div className="w-full mt-2 flex flex-row justify-end items-center gap-4">
              {/* button close */}
              <ButtonCloseText
                handleClose={() => {
                  handleCloseModal();
                }}
                disabled={isPendingPeriodeShadow}
              />
              {/* button submit */}
              <ButtonText
                label={`Simpan`}
                isLoading={isPendingPeriodeShadow}
                disable={id ? !isDirty : false}
              />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalFormulirPeriodeShadow;
