import { useEffect, useRef, useState } from "react";
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
  undefined?: boolean;
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
  undefined: allowUndefined = false,
}: Props<T>) {
  const { field, fieldState } = controller;

  const inputRef = useRef<HTMLInputElement>(null);

  const [displayValue, setDisplayValue] = useState("");

  // =========================
  // SYNC VALUE
  // =========================

  useEffect(() => {
    if (field.value !== undefined && field.value !== null) {
      setDisplayValue(formatNumber(String(field.value)));
    } else {
      setDisplayValue("");
    }
  }, [field.value]);

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;

    // Posisi cursor sebelum value diformat
    const cursorPosition = input.selectionStart ?? 0;

    // Value yang berada sebelum cursor
    const valueBeforeCursor = input.value.slice(0, cursorPosition);

    /**
     * Jumlah digit sebelum cursor.
     *
     * Contoh:
     *
     * 10.000
     *    ↑
     *
     * valueBeforeCursor = "10."
     * numericBeforeCursor = "10"
     */
    const numericBeforeCursor = unformatRupiah(valueBeforeCursor);

    // Ambil angka tanpa format
    const raw = unformatRupiah(input.value);

    // Terapkan batas maximum
    const value = maxValue(raw, max ?? 100000000000);

    // Format kembali
    const formattedValue = formatNumber(value);

    setDisplayValue(formattedValue);

    // =========================
    // UPDATE REACT HOOK FORM
    // =========================

    if (allowUndefined && Number(value) === 0) {
      field.onChange(undefined);
    } else {
      field.onChange(value === "" ? null : Number(value));
    }

    // =========================
    // RESTORE CURSOR
    // =========================

    /**
     * Hitung kembali posisi cursor berdasarkan
     * jumlah digit sebelum cursor.
     *
     * Ini penting karena "." adalah karakter
     * tambahan yang dibuat oleh formatter.
     */
    let newCursorPosition = 0;
    let digitCount = 0;

    for (let i = 0; i < formattedValue.length; i++) {
      if (/\d/.test(formattedValue[i])) {
        digitCount++;

        if (digitCount === numericBeforeCursor.length) {
          newCursorPosition = i + 1;
          break;
        }
      }
    }

    /**
     * Kalau cursor berada di posisi paling awal.
     */
    if (numericBeforeCursor.length === 0) {
      newCursorPosition = 0;
    }

    /**
     * React perlu selesai melakukan render
     * sebelum posisi cursor dikembalikan.
     */
    requestAnimationFrame(() => {
      const currentInput = inputRef.current;

      if (!currentInput) return;

      currentInput.setSelectionRange(newCursorPosition, newCursorPosition);
    });
  };

  // =========================
  // RENDER
  // =========================

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
          "focus-within:ring-1 focus-within:ring-custom-secondary focus-within:border-custom-secondary transition-all duration-300 ease-in-out bg-base-100 h-10.5 lg:h-9 px-2.5",
          fieldState.error && "border-error",
          label && "mt-2",
        )}
      >
        <span className="text-xs text-base-content/80 font-medium">Rp</span>

        <input
          ref={(element) => {
            inputRef.current = element;
            field.ref(element);
          }}
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
          style={{
            cursor: disabled ? "not-allowed" : "text",
          }}
          onChange={handleChange}
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
