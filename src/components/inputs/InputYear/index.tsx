import clsx from "clsx";
import {
  type FieldValues,
  type Path,
  type UseFormRegisterReturn,
} from "react-hook-form";

import { cn } from "../../../utils/cn";
import ErrorMessage from "../../messages/ErrorMessage";

type Props<T extends FieldValues = any> = {
  label?: string;
  required?: boolean;
  placeholder?: string;
  register: UseFormRegisterReturn;
  name: Path<T>;
  errorMessage?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  xs?: boolean;
  customHeight?: string;
};

const InputYear = <T extends FieldValues = any>({
  label,
  required,
  placeholder,
  register,
  name,
  errorMessage,
  disabled,
  min = 2000,
  max = 2100,
  xs,
  customHeight,
}: Props<T>) => {
  return (
    <div
      className={cn(
        "w-full flex flex-col justify-start items-start",
        errorMessage && "mb-3",
      )}
    >
      <div className="w-full text-base-content relative flex flex-row justify-between items-center">
        {label && (
          <div className="flex-2 relative">
            <label
              htmlFor={name}
              className="capitalize text-xs text-base-content"
            >
              {label}
            </label>

            {required && <span className="absolute ml-px text-error">*</span>}
          </div>
        )}
      </div>

      <div
        className={clsx(
          "flex flex-row justify-start items-center gap-2 border border-base-content/50 rounded-xl w-full focus-within:ring-1 focus-within:ring-custom-secondary focus-within:border-custom-secondary transition-all duration-300 ease-in-out bg-base-100 px-2.5",
          errorMessage && "border-error",
          label && "mt-2",
          customHeight ?? "h-10.5 md:h-9",
        )}
      >
        <input
          {...register}
          type="number"
          id={name}
          inputMode="numeric"
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          min={min}
          max={max}
          onInvalid={(e) => {
            const input = e.currentTarget;

            if (input.validity.rangeOverflow) {
              input.setCustomValidity(`Maksimal ${max}`);
            } else if (input.validity.rangeUnderflow) {
              input.setCustomValidity(`Minimal ${min}`);
            } else {
              input.setCustomValidity("");
            }
          }}
          step={1}
          className={cn(
            "font-medium rounded-md w-full h-full outline-none text-base-content placeholder:text-base-content/50 placeholder:font-normal bg-transparent",
            "appearance-none",
            "[&::-webkit-inner-spin-button]:appearance-none",
            "[&::-webkit-outer-spin-button]:appearance-none",
            xs ? "lg:text-xs" : "text-xs",
          )}
        />
      </div>

      <ErrorMessage xs={xs} errorMessage={errorMessage} />
    </div>
  );
};

export default InputYear;
