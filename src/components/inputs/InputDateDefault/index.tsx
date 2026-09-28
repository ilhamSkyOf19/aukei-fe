import clsx from "clsx";
import type { FieldValues, UseControllerReturn } from "react-hook-form";
import { cn } from "../../../utils/cn";
import ErrorMessage from "../../messages/ErrorMessage";

type Props<T extends FieldValues = any> = {
  label?: string;
  required?: boolean;
  controller: UseControllerReturn<T>;
  placeholder?: string;
  disabled?: boolean;
  xs?: boolean;
  min?: string;
  max?: string;
};

export default function InputDateDefault<T extends FieldValues = any>({
  label,
  required = false,
  controller,
  placeholder,
  disabled = false,
  xs = false,
  min,
  max,
}: Props<T>) {
  const { field, fieldState } = controller;

  return (
    <div
      className={cn(
        "w-full flex flex-col justify-start items-start",
        fieldState.error && "mb-3",
      )}
    >
      {/* label */}
      <div className="w-full text-base-content relative flex flex-row justify-between items-center">
        {label && (
          <div className="flex-2 relative">
            <label htmlFor={field.name} className={cn("capitalize", "text-xs")}>
              {label}
            </label>

            <span className="absolute -top-1 ml-1 text-error">
              {required && "*"}
            </span>
          </div>
        )}
      </div>

      {/* input */}
      <div
        className={clsx(
          "flex flex-row justify-start items-center gap-2",
          "border rounded-xl w-full",
          "transition-all duration-300 ease-in-out",
          "bg-base-100",
          "focus-within:ring-1",
          "focus-within:ring-custom-secondary",
          "focus-within:border-custom-secondary",
          "h-10.5 md:h-9 px-2.5",

          // label spacing
          label && "mt-1.5",

          // normal border
          !fieldState.error && "border-base-content/50",

          // error
          fieldState.error && "border-error",

          // disabled
          disabled &&
            "cursor-not-allowed border-base-content/20 bg-base-200/50",
        )}
      >
        <input
          ref={field.ref}
          name={field.name}
          id={field.name}
          type="date"
          value={field.value ?? ""}
          min={min}
          max={max}
          disabled={disabled}
          onChange={(e) => {
            field.onChange(e.target.value);
          }}
          onBlur={field.onBlur}
          placeholder={placeholder}
          className={cn(
            "w-full",
            "font-medium",
            "text-base-content",
            "h-full",
            "border-none",
            "outline-none",
            "text-xs",
            "bg-transparent",
            "focus:outline-none",
            "focus:ring-0",
            "shadow-none",

            // ukuran text xs
            xs && "text-[0.7rem]",

            // cursor
            !disabled && "cursor-pointer",
            disabled && "cursor-not-allowed",

            // native date picker
            "scheme-light",
            "dark:scheme-dark",
          )}
          autoComplete="off"
        />
      </div>

      {/* error message */}
      <ErrorMessage errorMessage={fieldState.error?.message} />
    </div>
  );
}
