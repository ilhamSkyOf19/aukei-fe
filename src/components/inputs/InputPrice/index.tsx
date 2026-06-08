import { useEffect, useState } from "react";
import type { FieldValues, UseControllerReturn } from "react-hook-form";
import { cn } from "../../../utils/cn";
import ErrorMessage from "../../messages/ErrorMessage";

type Props<T extends FieldValues = any> = {
  label?: string;
  required?: boolean;
  placeholder?: string;
  controller: UseControllerReturn<T>;
  disabled?: boolean;
  xs?: boolean;
};

export default function InputPrice<T extends FieldValues = any>({
  label,
  required,
  placeholder,
  controller,
  disabled,
  xs,
}: Props<T>) {
  const { field, fieldState } = controller;

  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (field.value !== undefined && field.value !== null) {
      setDisplayValue(formatRupiah(String(field.value)));
    } else {
      setDisplayValue("");
    }
  }, [field.value]);

  return (
    <div className="w-full">
      {label && (
        <label className="text-xs lg:text-sm text-base-content">
          {label}

          {required && <span className="ml-1 text-error">*</span>}
        </label>
      )}

      <div
        className={cn(
          "flex flex-row justify-start items-center gap-2 border border-base-content/50 rounded-md w-full",
          "focus-within:ring-1 focus-within:ring-base-content focus-within:border-base-content transition-all duration-300 ease-in-out bg-base-100",
          xs ? "h-8 px-2" : "h-10 px-3",
          fieldState.error && "border-error",
          label && "mt-2",
        )}
      >
        <span className="text-xs text-base-content/80 font-medium">Rp</span>

        <input
          type="text"
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={cn(
            "h-full w-full border-none bg-transparent outline-none font-medium text-base-content placeholder:font-normal",
            xs ? "text-[0.7rem] lg:text-xs" : "text-xs lg:text-sm",
          )}
          onChange={(e) => {
            const raw = unformatRupiah(e.target.value);

            setDisplayValue(formatRupiah(raw));

            field.onChange(raw === "" ? null : Number(raw));
          }}
          onBlur={field.onBlur}
        />
      </div>

      <ErrorMessage xs={xs} errorMessage={fieldState.error?.message} />
    </div>
  );
}

function formatRupiah(value: string) {
  if (!value) return "";

  return new Intl.NumberFormat("id-ID").format(Number(value));
}

function unformatRupiah(value: string) {
  return value.replace(/\D/g, "");
}
