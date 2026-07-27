import { useEffect, useState } from "react";
import type { FieldValues, UseControllerReturn } from "react-hook-form";
import { cn } from "../../../utils/cn";
import ErrorMessage from "../../messages/ErrorMessage";
import {
  formatNumber,
  maxValue,
  unformatRupiah,
} from "../../../helpers/helpers";

type Props<T extends FieldValues = any> = {
  label?: string;
  required?: boolean;
  placeholder?: string;
  controller: UseControllerReturn<T>;
  disabled?: boolean;
  xs?: boolean;
  caption?: string;
  max?: number;
  name?: string;
};

export default function InputPrice<T extends FieldValues = any>({
  label,
  required,
  placeholder,
  controller,
  disabled,
  xs,
  caption,
  max,
  name,
}: Props<T>) {
  const { field, fieldState } = controller;

  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (field.value !== undefined && field.value !== null) {
      setDisplayValue(formatNumber(String(field.value)));
    } else {
      setDisplayValue("");
    }
  }, [field.value]);

  return (
    <div className={cn("w-full", fieldState.error && "mb-3")}>
      {label && (
        <div className="flex-2 relative">
          <label
            htmlFor={name}
            className={cn("capitalize text-base-content", "text-xs")}
          >
            {label}
          </label>

          <span className="absolute -top-1 ml-1 text-error">
            {required && "*"}
          </span>
        </div>
      )}

      <div
        className={cn(
          "flex flex-row justify-start items-center gap-2 border border-base-content/50 rounded-xl w-full",
          "focus-within:ring-1 focus-within:ring-custom-secondary focus-within:border-custom-secondary transition-all duration-300 ease-in-out bg-base-100 h-10.5 lg:h-9 px-2.5 ",
          fieldState.error && "border-error",
          label && "mt-2",
        )}
      >
        <span className="text-xs text-base-content/80 font-medium">Rp</span>

        <input
          type="text"
          id={name}
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={cn(
            "h-full w-full border-none bg-transparent outline-none font-medium text-base-content placeholder:font-normal",
            xs ? "text-[0.7rem]" : "text-xs",
          )}
          onChange={(e) => {
            const raw = unformatRupiah(e.target.value);

            const value = maxValue(raw, max ?? 10000000);

            setDisplayValue(formatNumber(value));

            field.onChange(value === "" ? null : Number(value));
          }}
          onBlur={field.onBlur}
        />
      </div>

      {caption && (
        <div className="w-full text-xs mt-1.5">
          <span className={cn("text-base-content/80 text-[0.625rem]")}>
            {caption}
          </span>
        </div>
      )}

      <ErrorMessage xs={xs} errorMessage={fieldState.error?.message} />
    </div>
  );
}
