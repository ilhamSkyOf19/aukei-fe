import type { FC } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "../../../utils/cn";
import ErrorMessage from "../../messages/ErrorMessage";

type Props = {
  label: string;
  register: UseFormRegisterReturn;
  required?: boolean;
  errorMessage?: string;
  disabled?: boolean;
};

const InputStatus: FC<Props> = ({
  label,
  register,
  required,
  errorMessage,
  disabled,
}) => {
  return (
    <div className={cn("w-full flex flex-col", errorMessage && "mb-3")}>
      {/* Label */}
      <div className="flex items-center">
        <label className="text-xs lg:text-sm font-medium text-base-content">
          {label}
        </label>

        {required && <span className="ml-1 text-error">*</span>}
      </div>

      {/* Radio Group */}
      <div
        className={cn(
          "mt-2 flex h-11 items-center justify-between rounded-md border border-base-content/50 px-3",
          "focus-within:border-primary-purple",
          "focus-within:ring-1 focus-within:ring-primary-purple",
          "transition-all duration-300",
          errorMessage && "border-error",
          disabled && "cursor-not-allowed opacity-70",
        )}
      >
        {/* Tidak Aktif */}
        <label
          htmlFor="status-false"
          className="flex cursor-pointer items-center gap-2"
        >
          <input
            {...register}
            id="status-false"
            type="radio"
            value="false"
            disabled={disabled}
            className="
              radio radio-sm
              bg-rose-100
              border-rose-300
              checked:bg-rose-200
              checked:text-rose-600
              checked:border-rose-600
            "
          />

          <span className="text-xs lg:text-sm">Tidak Aktif</span>
        </label>

        {/* Aktif */}
        <label
          htmlFor="status-true"
          className="flex cursor-pointer items-center gap-2"
        >
          <input
            {...register}
            id="status-true"
            type="radio"
            value="true"
            disabled={disabled}
            className="
              radio radio-sm
              bg-emerald-100
              border-emerald-300
              checked:bg-emerald-200
              checked:text-emerald-600
              checked:border-emerald-600
            "
          />

          <span className="text-xs lg:text-sm">Aktif</span>
        </label>
      </div>

      <ErrorMessage errorMessage={errorMessage} />
    </div>
  );
};

export default InputStatus;
