import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { FieldValues, UseControllerReturn } from "react-hook-form";

import { cn } from "../../../utils/cn";
import ErrorMessage from "../../messages/ErrorMessage";
import { formatNumber } from "../../../helpers/helpers";
import { Minus, Plus } from "lucide-react";

type Props<T extends FieldValues = any> = {
  required?: boolean;
  controller: UseControllerReturn<T>;
  label: string;
};

const InputQty = <T extends FieldValues = any>({
  required,
  controller,
  label,
}: Props<T>) => {
  const { field, fieldState } = controller;

  const inputRef = useRef<HTMLInputElement>(null);

  const [displayValue, setDisplayValue] = useState("");

  // =========================
  // SYNC VALUE
  // =========================

  useEffect(() => {
    const value = field.value;

    if (value !== undefined && value !== null) {
      setDisplayValue(formatNumber(String(value)));
    } else {
      setDisplayValue("0");
    }
  }, [field.value]);

  // =========================
  // AUTO FOCUS & SELECT
  // =========================

  useEffect(() => {
    const input = inputRef.current;

    if (!input) return;

    // Fokus dan blok seluruh angka
    input.focus();
    input.select();
  }, []);

  // =========================
  // HANDLE PLUS
  // =========================

  const handlePlus = () => {
    const currentValue = Number(field.value) || 0;

    field.onChange(currentValue + 1);
  };

  // =========================
  // HANDLE MINUS
  // =========================

  const handleMin = () => {
    const currentValue = Number(field.value) || 0;

    field.onChange(Math.max(currentValue - 1, 0));
  };

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");

    // Izinkan input kosong saat mengetik
    if (!numericValue) {
      setDisplayValue("");
      field.onChange(0);
      return;
    }

    const qty = Number(numericValue);

    if (!Number.isSafeInteger(qty)) return;

    setDisplayValue(formatNumber(String(qty)));

    field.onChange(qty);
  };

  // =========================
  // HANDLE BLUR
  // =========================

  const handleBlur = () => {
    // Kembalikan angka 0 jika input kosong
    if (!displayValue) {
      setDisplayValue("0");
      field.onChange(0);
    }

    field.onBlur();
  };

  return (
    <div
      className={cn(
        "w-full flex flex-col justify-start items-start h-18",
        fieldState.error && "mb-3",
      )}
    >
      {/* LABEL */}
      {label && (
        <div className="flex-2 relative">
          <label
            htmlFor="quantity"
            className="capitalize text-xs text-base-content"
          >
            {label}
          </label>

          <span className="absolute -top-1 ml-1 text-error">
            {required && "*"}
          </span>
        </div>
      )}

      {/* INPUT CONTAINER */}
      <div
        className={clsx(
          "flex flex-row justify-between items-center gap-2 border border-base-content/20 rounded-md w-30 focus-within:ring-1 focus-within:ring-base-content focus-within:border-base-content transition-all duration-300 ease-in-out bg-base-100 h-full mt-2 overflow-hidden",
          fieldState.error && "border-error",
        )}
      >
        {/* BUTTON MINUS */}
        <button
          type="button"
          className="w-full h-full flex flex-row justify-center items-center bg-error hover-overlay"
          onClick={handleMin}
        >
          <Minus className="size-4 text-primary-white" />
        </button>

        {/* INPUT QUANTITY */}
        <input
          ref={(element) => {
            inputRef.current = element;
            field.ref(element);
          }}
          type="text"
          id="quantity"
          inputMode="numeric"
          autoComplete="off"
          value={displayValue}
          required={required}
          onFocus={(e) => {
            e.target.select();
          }}
          onChange={(e) => {
            handleChange(e.target.value);
          }}
          onBlur={handleBlur}
          className={cn(
            "font-medium text-sm rounded-md w-full h-full text-center outline-none text-base-content placeholder:text-base-content/50 placeholder:font-light bg-transparent",
          )}
        />

        {/* BUTTON PLUS */}
        <button
          type="button"
          className="w-full h-full flex flex-row justify-center items-center bg-success hover-overlay"
          onClick={handlePlus}
        >
          <Plus className="size-4 text-primary-white" />
        </button>
      </div>

      {/* ERROR MESSAGE */}
      <ErrorMessage errorMessage={fieldState.error?.message} />
    </div>
  );
};

export default InputQty;
