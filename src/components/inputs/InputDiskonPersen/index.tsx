import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { type FieldValues, type UseControllerReturn } from "react-hook-form";

import { cn } from "../../../utils/cn";
import ErrorMessage from "../../messages/ErrorMessage";

type Props<T extends FieldValues = any> = {
  label?: string;
  required?: boolean;
  placeholder?: string;
  controller: UseControllerReturn<T>;
  disabled?: boolean;
  max?: number;
  xs?: boolean;
  name?: string;
  onBlur?: () => void;
  customHeight?: string;
};

const formatDiskon = (value: number | string): string => {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) return "";

  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: false,
  }).format(numberValue);
};

const InputDiskonPersen = <T extends FieldValues = any>({
  label,
  required,
  placeholder,
  controller,
  disabled,
  max,
  xs,
  name,
  onBlur,
  customHeight,
}: Props<T>) => {
  const { field, fieldState } = controller;

  const [displayValue, setDisplayValue] = useState("");
  const isFocusedRef = useRef(false);

  useEffect(() => {
    if (isFocusedRef.current) return;

    if (field.value !== undefined && field.value !== null) {
      setDisplayValue(formatDiskon(field.value));
    } else {
      setDisplayValue("");
    }
  }, [field.value]);

  return (
    <div
      className={cn(
        "w-full flex flex-col justify-start items-start",
        fieldState.error && "mb-3",
      )}
    >
      <div className="w-full text-base-content relative flex flex-row justify-between items-center">
        {label && (
          <div className="flex-2 relative">
            <label
              htmlFor={name ?? field.name}
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
          fieldState.error && "border-error",
          label && "mt-2",
          customHeight ?? "h-10.5 md:h-9",
        )}
      >
        <input
          ref={field.ref}
          name={field.name}
          type="text"
          inputMode="decimal"
          id={name ?? field.name}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          value={displayValue}
          onFocus={() => {
            isFocusedRef.current = true;
          }}
          onBlur={() => {
            isFocusedRef.current = false;

            setDisplayValue(
              field.value !== undefined && field.value !== null
                ? formatDiskon(field.value)
                : "",
            );

            field.onBlur();
            onBlur?.();
          }}
          className={cn(
            "font-medium rounded-md w-full h-full outline-none text-base-content placeholder:text-base-content/50 placeholder:font-normal bg-transparent",
            xs ? "lg:text-xs" : "text-xs",
          )}
          onChange={(e) => {
            const rawValue = e.target.value;

            if (rawValue.trim() === "") {
              setDisplayValue("");
              field.onChange(0);
              return;
            }

            // Mendukung koma maupun titik sebagai desimal.
            const normalized = rawValue.replace(",", ".");

            // Mengizinkan input desimal yang belum selesai diketik.
            if (!/^\d*\.?\d*$/.test(normalized)) return;

            setDisplayValue(rawValue);

            let numberValue = Number(normalized);

            if (!Number.isFinite(numberValue)) return;

            if (max !== undefined && numberValue > max) {
              numberValue = max;
              setDisplayValue(formatDiskon(max));
            }

            // Simpan nilai asli tanpa pembulatan.
            field.onChange(numberValue);
          }}
        />
      </div>

      <ErrorMessage xs={xs} errorMessage={fieldState.error?.message} />
    </div>
  );
};

export default InputDiskonPersen;
