import { LockKeyholeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import useForgetPassword from "../../../hooks/useForgetPassword";
import InputEmailWithIcon from "../../../components/inputs/InputEmailWithIcon";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";

const ForgetPassword = () => {
  // call use
  const { errors, register, handleSubmit, isPendingSendCode, onSubmit } =
    useForgetPassword();
  return (
    <div className="w-full px-4 h-screen flex flex-col justify-center items-center">
      {/* card */}
      <div className="card bg-base-100 shadow-sm dark:border dark:border-base-content/10 px-8 py-8 flex flex-col justify-start items-center w-full md:w-md gap-4">
        {/* icon */}
        <div className="w-25 h-25 bg-custom-secondary flex flex-row justify-center items-center rounded-full bg-primary-purple/10">
          <LockKeyholeIcon className="size-10 text-custom-primary" />
        </div>

        {/* title */}
        <div className="w-full flex flex-col justify-start items-center gap-2">
          <p className="text-xl font-semibold text-base-content">
            Lupa Password?
          </p>
          <p className="text-base-content/80 text-center text-xs">
            Masukkan alamat email Anda dan kami akan mengirimkan kode aktivasi
            untuk melakukan reset password
          </p>
        </div>

        {/* form email */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col justify-start items-center gap-6"
        >
          {/* email */}
          <InputEmailWithIcon
            register={register("email")}
            name="email"
            placeholder="Masuk alamat email anda"
            errorMessage={errors.email?.message}
          />

          {/* button send */}
          <ButtonWithIcon
            typeButton="submit"
            label="Kirim Kode Aktivasi"
            customWidth="w-full"
            isLoading={isPendingSendCode}
          />
        </form>

        {/* backlogin */}
        <div className="w-full flex flex-row justify-start items-center gap-3 mt-2">
          <div className="w-1/2 h-px bg-base-content/20" />
          <span className="text-sm text-base-content/70">atau</span>
          <div className="w-1/2 h-px bg-base-content/20" />
        </div>

        {/* button back to login */}

        <div className="w-full flex flex-row justify-center items-center gap-1.5 my-4">
          <span className="text-sm text-base-content/80">Kembali ke </span>
          <Link
            to={"/login"}
            type="button"
            className="text-sm font-semibold text-custom-secondary"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
