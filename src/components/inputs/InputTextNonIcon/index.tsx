import { useEffect, useState, type FC } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "../../../utils/cn";
import ErrorMessage from "../../messages/ErrorMessage";

type Props = {
  name: string;
  placeholder: string;
  label?: string;
  required?: boolean;
  errorMessage?: string;
  register: UseFormRegisterReturn;
  max?: number;
  defaultValue?: string;
  disabled?: boolean;
  xs?: boolean;
  withCaption?: string;
  captionSize?: string;
};

const InputTextNonIcon: FC<Props> = ({
  label,
  name,
  placeholder,
  required,
  errorMessage,
  register,
  max,
  defaultValue,
  disabled,
  xs,
  withCaption,
  captionSize,
}) => {
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
          <div className="flex-2 relative">
            <label htmlFor={name} className="capitalize text-xs lg:text-sm">
              {label}
            </label>

            <span className="absolute -top-1 ml-1 text-error">
              {required && "*"}
            </span>
          </div>
        )}

        {/* MAX BERDASARKAN NILAI ANGKA */}
        {max && (
          <span className="text-[0.625rem] lg:text-xs">
            {isValue.length} / {max}
          </span>
        )}
      </div>
      <div
        className={cn(
          "mt-2 flex flex-row justify-start items-center gap-2 border border-base-content/50 rounded-md w-full focus-within:ring-1 focus-within:ring-base-content focus-within:border-base-content transition-all duration-300 ease-in-out bg-base-100 ",
          xs ? "h-7 lg:h-8 px-1.5" : "h-9 lg:h-10 px-3",
          errorMessage && "border-error",
        )}
      >
        <input
          {...register}
          type={"text"}
          name={name}
          id={name}
          placeholder={placeholder}
          className={cn(
            "w-full font-medium text-base-content h-full border-none outline-none placeholder:text-base-content/50 placeholder:font-light",
            xs
              ? "text-[0.625rem] lg:text-xs placeholder:text-[0.625rem]  lg:placeholder:text-xs"
              : "text-xs lg:text-sm  placeholder:text-xs lg:placeholder:text-sm",
          )}
          {...(disabled && { disabled: true })}
          maxLength={max}
          onChange={(e) => {
            let value = e.target.value;
            // set value
            setIsValue(value);

            // set value
            register.onChange(e);
          }}
          autoComplete="off"
        />
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

export default InputTextNonIcon;
