import type { FC, RefObject } from "react";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import { cn } from "../../../utils/cn";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import { UserRound } from "lucide-react";
import ButtonText from "../../ui/button/ButtonText";
import useModalUpdateDataPengguna from "./useModalUpdateDataPengguna";
import InputTextNonIcon from "../../inputs/InputTextNonIcon";
import InputEmailNonIcon from "../../inputs/InputEmailNonIcon";
import AlertLabel from "../../messages/AlertLabel";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  handleSetToast: (value: string) => void;
};

const ModalUpdateDataPengguna: FC<Props> = ({
  modalRef,
  handleCloseModal,
  handleSetToast,
}) => {
  // call use
  const {
    errors,
    handleSubmit,
    onSubmit,
    register,
    isPendingMutateUpdateDataPengguna,
  } = useModalUpdateDataPengguna({ handleCloseModal, handleSetToast });

  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div className="modal-box lg:w-2/5 max-w-5xl rounded-xl bg-base-200 dark:border dark:border-base-content/10">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title={`Formulir Ubah Data Anda`}
              keterangan={`Formulir untuk mengubah nama atau email Anda`}
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
            {/* username */}
            <InputTextNonIcon
              name="username"
              label="Username (opsional)"
              placeholder="Masukkan Username"
              register={register("username")}
              errorMessage={errors?.username?.message}
            />

            {/* nama */}
            <InputTextNonIcon
              name="nama"
              label="Nama (opsional)"
              placeholder="Masukkan Nama"
              register={register("nama")}
              errorMessage={errors?.nama?.message}
            />

            <InputEmailNonIcon
              name="email"
              label="Email (opsional)"
              placeholder="Masukkan Email"
              register={register("email")}
              errorMessage={errors?.email?.message}
            />

            {/* alert label */}
            <div className="w-full mt-2.5">
              <AlertLabel message="Username dan Email dapat digunakan untuk login." />
            </div>

            {/* action */}
            <div className="w-full mt-6 flex flex-row justify-end items-center gap-4">
              {/* button close */}
              <ButtonCloseText
                handleClose={() => {
                  handleCloseModal();
                }}
                disabled={isPendingMutateUpdateDataPengguna}
              />
              {/* button submit */}
              <ButtonText
                label={`Simpan`}
                isLoading={isPendingMutateUpdateDataPengguna}
              />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalUpdateDataPengguna;
