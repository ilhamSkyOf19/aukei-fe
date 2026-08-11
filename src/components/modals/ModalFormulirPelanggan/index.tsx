import type { FC, RefObject } from "react";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import { cn } from "../../../utils/cn";
import InputTextNonIcon from "../../inputs/InputTextNonIcon";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import useModalFormulirPelanggan from "./useModalFormulirPelanggan";
import type {
  CreatePelangganType,
  ResponsePelangganType,
  UpdatePelangganType,
} from "../../../models/pelanggan.model";
import InputPhoneNumber from "../../inputs/InputPhoneNumber";
import { UserRound } from "lucide-react";
import AlertLabel from "../../messages/AlertLabel";
import ButtonText from "../../ui/button/ButtonText";

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
      <div className="modal-box lg:w-2/5 max-w-5xl rounded-xl bg-base-200 dark:border dark:border-base-content/10">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title={`Formulir ${id ? "Ubah" : "Tambah"} Pelanggan`}
              keterangan={`Formulir untuk ${id ? "mengubah" : "menambah"} Pelanggan`}
              withIcon={{
                icon: UserRound,
              }}
            />
          </div>

          {/* form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(
              "w-full flex flex-col justify-start items-center mt-2.5",
            )}
          >
            {/* nama */}
            <InputTextNonIcon
              register={register(`nama`)}
              label={`Nama Pelanggan`}
              max={100}
              name="nama"
              required={true}
              placeholder={`Masukan nama pelanggan`}
              errorMessage={errors.nama?.message}
            />

            {/* phone number */}
            <InputPhoneNumber<UpdatePelangganType | CreatePelangganType>
              controller={noWaController}
              placeholder="Masukan no whatsapp aktif"
              label="No Whatsapp"
              required
              name="noWa"
              handleClearError={handleClearErrorNoWa}
            />

            {/* alert */}
            <div className={cn("w-full", errors?.noWa && "mt-4")}>
              <AlertLabel message="Pastikan nomor whatsapp yang dimasukkan adalah nomor aktif" />
            </div>

            {/* action */}
            <div className="w-full mt-6 flex flex-row justify-end items-center gap-4">
              {/* button close */}
              <ButtonCloseText
                handleClose={() => {
                  handleCloseModal();
                }}
                disabled={isPendingMutatePelanggan}
              />
              {/* button submit */}
              <ButtonText
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
