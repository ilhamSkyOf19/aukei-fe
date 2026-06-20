import { useEffect, useState, type FC } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "../../../utils/cn";
import ErrorMessage from "../../messages/ErrorMessage";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  name: string;
  placeholder: string;
  label?: string;
  required?: boolean;
  errorMessage?: string;
  register: UseFormRegisterReturn;
  max?: number;
  defaultValue?: string;
  xs?: boolean;
  withCaption?: string;
  captionSize?: string;
};

const InputPasswordNonIcon: FC<Props> = ({
  label,
  name,
  placeholder,
  required,
  errorMessage,
  register,
  max,
  defaultValue,
  xs,
  withCaption,
  captionSize,
}) => {
  // state show password
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // simpan sebagai number | null
  const [isValue, setIsValue] = useState<string>("");

  // set default value
  useEffect(() => {
    if (defaultValue) {
      setIsValue(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div
      className={cn(
        "w-full flex flex-col justify-start items-start",
        errorMessage && "mb-3",
      )}
    >
      {/* label */}
      <div className="w-full text-base-content relative flex flex-row justify-between items-center">
        {label && (
          <>
            <div className="flex-2 relative">
              <label
                htmlFor={name}
                className={cn(
                  "capitalize",
                  xs ? "text-xs" : "text-xs lg:text-sm",
                )}
              >
                {label}
              </label>

              <span className="absolute -top-1 ml-1 text-error">
                {required && "*"}
              </span>
            </div>

            {/* MAX BERDASARKAN NILAI ANGKA */}
            {max && (
              <span className="text-[0.625rem] lg:text-xs">
                {isValue.length} / {max}
              </span>
            )}
          </>
        )}
      </div>
      <div
        className={cn(
          "flex flex-row justify-start items-center gap-2 border border-base-content/50 rounded-md w-full focus-within:ring-1 focus-within:ring-base-content focus-within:border-base-content transition-all duration-300 ease-in-out bg-base-100 ",
          xs ? "h-7 lg:h-8 px-2.5" : "h-9 lg:h-10 px-3",
          errorMessage && "border-error",
          label && "mt-2",
        )}
      >
        {/* input */}
        <input
          {...register}
          type={showPassword ? "text" : "password"}
          id={name}
          placeholder={placeholder}
          className="w-full font-medium h-full bg-transparent outline-none text-sm placeholder:text-sm placeholder:text-gray-400  placeholder:font-light lg:text-sm lg:placeholder:text-sm"
          autoComplete="off"
          minLength={6}
          maxLength={max || 100}
        />

        {/* eye */}
        <div className="h-full flex flex-row justify-center items-center">
          {showPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <Eye className="w-5 h-5 pointer-events-none" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <EyeOff className="w-5 h-5 pointer-events-none" />
            </button>
          )}
        </div>
      </div>

      {/* caption */}
      {withCaption && (
        <div className="w-full text-xs mt-1.5">
          <span
            className={cn(
              "text-base-content/80",
              captionSize ? captionSize : "text-xs",
            )}
          >
            {withCaption}
          </span>
        </div>
      )}

      {/* error message */}
      <ErrorMessage xs={xs} errorMessage={errorMessage} />
    </div>
  );
};

export default InputPasswordNonIcon;
