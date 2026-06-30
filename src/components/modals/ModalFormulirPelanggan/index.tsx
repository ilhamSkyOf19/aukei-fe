import type { FC, RefObject } from "react";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import { cn } from "../../../utils/cn";
import InputTextNonIcon from "../../inputs/InputTextNonIcon";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonSubmit from "../../ui/button/ButtonSubmit";
import useModalFormulirPelanggan from "./useModalFormulirPelanggan";
import type {
  CreatePelangganType,
  ResponsePelangganType,
  UpdatePelangganType,
} from "../../../models/pelanggan.model";
import InputPhoneNumber from "../../inputs/InputPhoneNumber";
import { AlertCircle } from "lucide-react";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  data?: ResponsePelangganType;
  id?: number;
};

const ModalFormulirPelanggan: FC<Props> = ({
  modalRef,
  handleCloseModal,
  data,
  id,
}) => {
  // call use
  const {
    errors,
    handleSubmit,
    onSubmit,
    register,
    isDirty,
    isPendingMutatePelanggan,
    noWaController,
    handleClearErrorNoWa,
  } = useModalFormulirPelanggan({ id, data, handleCloseModal });

  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div className="modal-box lg:w-2/6 max-w-5xl bg-base-200 dark:border dark:border-base-content/10">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title="Formulir Pelanggan"
              keterangan={`Formulir untuk ${id ? "mengubah" : "menambah"} Pelanggan`}
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
              label={`Nama Pegawai`}
              max={100}
              name="nama"
              required={true}
              placeholder={`Masukan nama pegawai`}
              errorMessage={errors.nama?.message}
              defaultValue={data?.nama}
            />

            {/* phone number */}
            <InputPhoneNumber<UpdatePelangganType | CreatePelangganType>
              controller={noWaController}
              placeholder="Masukan no whatsapp aktif"
              label="No Whatsapp"
              required
              handleClearError={handleClearErrorNoWa}
            />

            {/* alert */}
            <div className="w-full gap-2.5 flex flex-row justify-start items-center px-4 py-3 mt-4 rounded-lg bg-blue-600/5 border border-blue-600">
              <AlertCircle className="size-4 text-blue-600" />
              <span className="text-xs">
                Pastikan nomor whatsapp yang dimasukkan adalah nomor aktif
              </span>
            </div>

            {/* action */}
            <div className="w-full mt-6 flex flex-row justify-end items-center gap-4">
              {/* button close */}
              <ButtonCloseText
                handleClose={() => {
                  handleCloseModal();
                }}
              />
              {/* button submit */}
              <ButtonSubmit
                label={`Simpan`}
                isLoading={isPendingMutatePelanggan}
                disable={id ? !isDirty : false}
              />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalFormulirPelanggan;
