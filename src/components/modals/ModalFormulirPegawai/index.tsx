import type { FC, RefObject } from "react";
import type {
  CreatePegawaiForRequestType,
  ResponsePegawaiType,
  UpdatePegawaiForRequestType,
} from "../../../models/pegawai.model";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import { cn } from "../../../utils/cn";
import InputTextNonIcon from "../../inputs/InputTextNonIcon";
import InputChoose from "../../inputs/InputChoose";
import useModalFormulirPegawai from "./useModalFormulirPegawai";
import InputPasswordNonIcon from "../../inputs/InputPasswordNonIcon";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonSubmit from "../../ui/button/ButtonSubmit";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  data?: ResponsePegawaiType;
  id?: number;
};

const ModalFormulirPegawai: FC<Props> = ({
  modalRef,
  handleCloseModal,
  data,
  id,
}) => {
  // call use
  const {
    errors,
    handleSubmit,
    isPendingMutatePegawai,
    onSubmit,
    register,
    roleController,
    isDirty,
  } = useModalFormulirPegawai({ id, data, handleCloseModal });

  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div className="modal-box w-11/12 lg:w-2/5 max-w-5xl bg-base-200 dark:border dark:border-base-content/10">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title="Formulir Pegawai"
              keterangan={`Formulir untuk ${id ? "mengubah" : "menambah"} Pegawai`}
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

            {/* username */}
            <InputTextNonIcon
              register={register(`username`)}
              label={`Username`}
              max={100}
              name="username"
              required={true}
              placeholder={`Masukan username`}
              errorMessage={errors.username?.message}
              defaultValue={data?.username}
            />

            {/* role */}
            <InputChoose<
              UpdatePegawaiForRequestType | CreatePegawaiForRequestType
            >
              chooseList={[
                {
                  label: "Kasir",
                  value: "KASIR",
                },
              ]}
              controller={roleController}
              placeholder="Pilih role"
              label="Role"
              required
            />

            {/* password */}
            <InputPasswordNonIcon
              register={register("password")}
              name="password"
              label="Password"
              placeholder="Masukan password"
              errorMessage={errors.password?.message}
              required
            />

            {/* confirm password */}
            <InputPasswordNonIcon
              register={register("confirmPassword")}
              name="confirmPassword"
              label="Konfirmasi Password"
              placeholder="Masukan konfirmasi password"
              errorMessage={errors.confirmPassword?.message}
              required
            />

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
                isLoading={isPendingMutatePegawai}
                disable={id ? !isDirty : false}
              />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalFormulirPegawai;
