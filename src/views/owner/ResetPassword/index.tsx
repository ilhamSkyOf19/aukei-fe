import { cn } from "../../../utils/cn";
import { UserRound } from "lucide-react";
import TitleModalFormulir from "../../../components/ui/TitleModalFormulir";
import InputPasswordNonIcon from "../../../components/inputs/InputPasswordNonIcon";
import ButtonText from "../../../components/ui/button/ButtonText";
import ButtonCloseText from "../../../components/ui/button/ButtonCloseText";
import useResetPassword from "../../../hooks/useResetPassword";

const ResetPassword = () => {
  // call use
  const {
    errors,
    handleSubmit,
    onSubmit,
    register,
    isPendingMutateUpdatePassword,
    navigate,
  } = useResetPassword();

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="card shadow-md p-6 lg:w-2/5 max-w-5xl rounded-xl bg-base-200 dark:border dark:border-base-content/10">
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
              {/* button submit */}
              <ButtonCloseText
                label={`Kembali Login`}
                handleClose={() => navigate("/login")}
              />
              <ButtonText
                label={`Simpan`}
                isLoading={isPendingMutateUpdatePassword}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
