import { type FC } from "react";
import clsx from "clsx";
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
  rows: number;
  xs?: boolean;
};

const InputTextAreaNonIcon: FC<Props> = ({
  label,
  name,
  placeholder,
  required,
  errorMessage,
  register,
  max,
  rows,
  xs,
}) => {
  return (
    <div
      className={cn(
        "w-full flex flex-col justify-start items-start",
        errorMessage && "mb-3",
      )}
    >
      {/* label */}
      <div className="w-full text-base relative flex flex-row justify-between items-center">
        {label && (
          <div className="flex-2 relative">
            <label
              htmlFor={name}
              className="capitalize text-xs lg:text-sm text-base-content"
            >
              {label}
            </label>

            <span className="absolute -top-1 ml-1 text-error">
              {required && "*"}
            </span>
          </div>
        )}
      </div>

      <div
        className={clsx(
          "mt-2 flex flex-row justify-start items-center gap-2 border rounded-md w-full transition-all duration-300 ease-in-out bg-base-100 focus-within:ring-1",
          errorMessage
            ? "border-error focus-within:ring-error"
            : "border-base-content/40 focus-within:ring-base-content",
        )}
      >
        <textarea
          {...register}
          name={name}
          id={name}
          placeholder={placeholder}
          className={cn(
            "w-full font-medium h-full text-base-content border-none outline-none  px-3 py-2 placeholder:text-base-content/50",
            xs ? "text-[0.625rem] lg:text-xs " : "text-xs lg:text-sm ",
          )}
          maxLength={max}
          onChange={(e) => {
            // set value
            register.onChange(e);
          }}
          rows={rows}
        />
      </div>

      {/* error message */}
      <ErrorMessage errorMessage={errorMessage} />
    </div>
  );
};

export default InputTextAreaNonIcon;
