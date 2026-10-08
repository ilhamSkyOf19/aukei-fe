import type { FC, RefObject } from "react";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import { cn } from "../../../utils/cn";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import { UserRound } from "lucide-react";
import ButtonText from "../../ui/button/ButtonText";
import InputPasswordNonIcon from "../../inputs/InputPasswordNonIcon";
import useModalUpdatePassword from "./useModalUpdatePassword";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
};

const ModalFormulirUpdatePassword: FC<Props> = ({
  modalRef,
  handleCloseModal,
}) => {
  // call use
  const {
    errors,
    handleSubmit,
    onSubmit,
    register,
    isPendingMutateUpdatePassword,
  } = useModalUpdatePassword({ handleCloseModal });

  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div className="modal-box lg:w-2/5 max-w-5xl rounded-xl bg-base-200 dark:border dark:border-base-content/10">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title={`Formulir Ubah Password`}
              keterangan={`Formulir untuk mengubah Password`}
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
            {/* phone number */}
            <InputPasswordNonIcon
              name="password"
              label="Password"
              placeholder="Masukkan Password"
              register={register("password")}
              errorMessage={errors?.password?.message}
              required
            />

            <InputPasswordNonIcon
              name="ConfirmPassword"
              label="Password"
              placeholder="Masukkan Konfirmasi Password"
              register={register("confirmPassword")}
              errorMessage={errors?.confirmPassword?.message}
              required
            />

            {/* action */}
            <div className="w-full mt-6 flex flex-row justify-end items-center gap-4">
              {/* button close */}
              <ButtonCloseText
                handleClose={() => {
                  handleCloseModal();
                }}
                disabled={isPendingMutateUpdatePassword}
              />
              {/* button submit */}
              <ButtonText
                label={`Simpan`}
                isLoading={isPendingMutateUpdatePassword}
              />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalFormulirUpdatePassword;
