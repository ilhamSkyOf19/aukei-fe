import { type FC } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../../utils/cn";
import useLogin from "./useLogin";
import InputTextWithIcon from "../../../components/inputs/InputTextWithIcon";
import InputPasswordWithIcon from "../../../components/inputs/InputPasswordWithIcon";
import ButtonTheme from "../../../components/ui/button/ButtonTheme";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";

const Login: FC = () => {
  // call use
  const { errors, handleSubmit, isPendingLogin, onSubmit, register } =
    useLogin();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4 lg:flex-row">
      {/* button dark mode */}
      <div className="absolute top-2 hover:scale-105 transition-all duration-300 ease-in-out right-2 w-12 h-12 bg-base-100 rounded-full flex justify-center items-center shadow-sm border border-transparent dark:border-base-content/10">
        <ButtonTheme />
      </div>

      {/* header */}
      <div className="w-full py-4 flex flex-row justify-center items-center gap-4 lg:flex-col">
        {/* title */}
        <div className=" w-40 h-40 lg:w-60 lg:h-60 rounded-full bg-custom-secondary flex justify-center items-center hover:scale-101 transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-custom-primary/50">
          {/* big title */}
          <h1 className="text-3xl lg:text-5xl font-bold">
            <span className="text-primary-white">AU</span>
            <span className="text-custom-primary">KEI</span>
          </h1>
        </div>
      </div>

      {/* from */}
      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-full flex flex-col justify-start items-center lg:border lg:border-base-content/10 lg:w-md lg:card lg:shadow-xl lg:py-14 lg:px-8">
          {/* header */}
          <div className="w-full flex flex-col justify-start items-start">
            <h2 className="text-lg font-semibold text-base-content lg:text-2xl">
              Selamat Datang,
            </h2>

            <h2 className="text-xs lg:text-sm text-base-content">
              Masuk ke akun Anda untuk melanjutkan
            </h2>
          </div>

          {/* input field */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col justify-start items-start mt-5 lg:mt-6"
          >
            <div
              className={cn(
                "w-full flex flex-col justify-start items-start",
                errors.identifier || errors.password
                  ? "gap-6"
                  : "gap-1 lg:gap-2",
              )}
            >
              {/* input indentifier */}
              <InputTextWithIcon
                register={register("identifier")}
                name="identifier"
                placeholder="Masukan username"
                maxLength={100}
                minLength={0}
                errorMessage={errors.identifier?.message}
              />

              {/* input password */}
              <InputPasswordWithIcon
                register={register("password")}
                name="password"
                placeholder="Masukan password"
                maxLength={100}
                minLength={0}
                errorMessage={errors.password?.message}
              />
            </div>

            {/* button submit */}
            <div className="w-full mt-1 lg:mt-4 flex flex-col justify-center items-center gap-4">
              {/* forget password */}
              <Link
                to={"/forget-password"}
                type="button"
                className="text-xs text-base-content hover:text-custom-primary transition-colors duration-300 ease-in-out"
              >
                Lupa Password?
              </Link>

              <ButtonWithIcon
                typeButton="submit"
                customWidth="w-full"
                customHeight="h-10.5 md:h-10"
                bgColor="bg-custom-secondary"
                textColor="text-custom-primary"
                label="Log In"
                isLoading={isPendingLogin}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
