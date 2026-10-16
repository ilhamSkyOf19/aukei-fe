import OtpInput from "react-otp-input";
import { MailCheckIcon, SendHorizonal } from "lucide-react";
import { Link } from "react-router-dom";
import useActivationCode from "./useActivationCode";
import { ENV_CONFIG } from "../../../types/env.types";
import { cn } from "../../../utils/cn";
import Resend from "./Resend";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import ButtonTheme from "../../../components/ui/button/ButtonTheme";

const ActivationCode = () => {
  // call use
  const {
    handleSubmit,
    isPendingSendCode,
    codeController,
    onSubmit,
    email,
    windowSize,
  } = useActivationCode();

  // code controller
  const { field: fieldCode, fieldState: fieldStateCode } = codeController;

  return (
    <div className="w-full px-4 h-screen flex flex-col justify-center items-center bg-base-100">
      <div className="absolute top-2 hover:scale-105 transition-all duration-300 ease-in-out right-2 w-12 h-12 bg-base-100 rounded-full flex justify-center items-center shadow-sm border border-transparent dark:border-base-content/10">
        <ButtonTheme />
      </div>

      {/* card */}
      <div className="card bg-base-100 shadow-sm dark:border dark:border-base-content/10 px-8 py-8 flex flex-col justify-start items-center w-full md:w-lg gap-4">
        <div className="w-25 h-25 flex flex-row justify-center items-center rounded-full bg-custom-secondary">
          <MailCheckIcon className="size-10 text-custom-primary" />
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          {/* title */}
          <h3 className="text-base-content text-2xl font-semibold">
            Verify Code
          </h3>

          <div className="w-full flex flex-col justify-start items-center mt-2">
            {/* description */}
            <p className="text-base-content text-xs text-center">
              Mohon masukkan kode aktivasi yang telah kami kirimkan ke email
            </p>

            {/* email */}
            <p className="text-custom-secondary text-sm font-semibold">
              {email || "-"}
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 w-full flex flex-col justify-start items-center"
          >
            <div className="w-full flex flex-col justify-center items-center gap-2 my-2">
              <div className="w-full flex-wrap flex flex-row justify-center items-center">
                {email ? (
                  <OtpInput
                    value={fieldCode.value}
                    onChange={fieldCode.onChange}
                    numInputs={ENV_CONFIG.CODE_ACTIVATION_LENGTH}
                    shouldAutoFocus
                    inputType="number"
                    inputStyle={{
                      width: windowSize === "sm" ? "45px" : "60px",
                      height: "45px",
                      borderRadius: "10px",
                      textAlign: "center",
                      fontSize: "18px",
                      fontWeight: "700",
                    }}
                    renderSeparator={() => <span className="mx-2"></span>}
                    renderInput={(props, index) => (
                      <input
                        {...props}
                        key={index}
                        className={cn(
                          "rounded-md border outline-none transition-all duration-300 ease-in-out bg-base-100 text-base-content",
                          fieldStateCode.error
                            ? "border-error"
                            : "border-base-content hover:border-custom-secondary focus:border-custom-secondary focus:ring-2 focus:ring-custom-secondary",
                        )}
                      />
                    )}
                  />
                ) : (
                  <div className="w-full flex flex-row justify-center items-center gap-2">
                    {Array.from(
                      { length: ENV_CONFIG.CODE_ACTIVATION_LENGTH },
                      (_, i) => (
                        <div
                          key={i}
                          className="w-18 h-12 bg-base-300 rounded-lg opacity-50 cursor-not-allowed"
                        />
                      ),
                    )}
                  </div>
                )}
              </div>

              {/* error message */}
              <p
                className={cn(
                  "text-xs text-red-500 transition-opacity duration-300 ease-in-out h-4",
                  fieldStateCode.error ? "opacity-100" : "opacity-0",
                )}
              >
                {fieldStateCode.error?.message}
              </p>
            </div>

            {/* resend */}
            <div className="w-full flex flex-col justify-center items-center">
              {email && <Resend />}
            </div>
            {/* verify */}
            <div className="w-full flex flex-row justify-center items-center">
              <ButtonWithIcon
                icon={SendHorizonal}
                typeButton="submit"
                customWidth="w-full"
                customHeight="h-12"
                disabled={!email}
                label="Kirim Kode"
                isLoading={isPendingSendCode}
              />
            </div>
          </form>
        </div>

        {/* back login */}
        <div className="w-full flex flex-row justify-center items-center gap-1.5 my-1">
          <span className="text-xs text-base-content/80">Kembali ke </span>
          <Link
            to={"/login"}
            type="button"
            className="text-xs font-semibold text-custom-secondary"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ActivationCode;
