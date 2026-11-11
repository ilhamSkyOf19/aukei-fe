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
  label?: string;
  customHeight?: string;
  customWidth?: string;
  noButton?: boolean;
};

const InputQty = <T extends FieldValues = any>({
  required,
  controller,
  label,
  customHeight,
  customWidth,
  noButton = false,
}: Props<T>) => {
  const { field, fieldState } = controller;

  const inputRef = useRef<HTMLInputElement>(null);

  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    const value = field.value;

    if (value !== undefined && value !== null) {
      setDisplayValue(formatNumber(String(value)));
    } else {
      setDisplayValue("0");
    }
  }, [field.value]);

  useEffect(() => {
    const input = inputRef.current;

    if (!input) return;

    input.focus();
    input.select();
  }, []);

  const handlePlus = () => {
    const currentValue = Number(field.value) || 0;

    field.onChange(currentValue + 1);
  };

  const handleMin = () => {
    const currentValue = Number(field.value) || 0;

    field.onChange(Math.max(currentValue - 1, 0));
  };

  const handleChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");

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

  const handleBlur = () => {
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

      <div
        className={clsx(
          "flex flex-row justify-between items-center gap-2 border border-base-content/20 rounded-md focus-within:ring-1 focus-within:ring-base-content focus-within:border-base-content transition-all duration-300 ease-in-out bg-base-100 mt-2 overflow-hidden",
          fieldState.error && "border-error",
          customHeight ?? "h-full",
          customWidth ?? "w-30",
        )}
      >
        {!noButton && (
          <button
            type="button"
            className="w-full h-full flex flex-row justify-center items-center bg-error hover-overlay"
            onClick={handleMin}
          >
            <Minus className="size-4 text-primary-white" />
          </button>
        )}

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
          onClick={(e) => e.currentTarget.select()}
          onFocus={(e) => e.currentTarget.select()}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          className={cn(
            "font-medium text-sm rounded-md w-full h-full text-center outline-none text-base-content placeholder:text-base-content/50 placeholder:font-light bg-transparent",
            noButton && "px-3",
          )}
        />

        {!noButton && (
          <button
            type="button"
            className="w-full h-full flex flex-row justify-center items-center bg-success hover-overlay"
            onClick={handlePlus}
          >
            <Plus className="size-4 text-primary-white" />
          </button>
        )}
      </div>

      <ErrorMessage errorMessage={fieldState.error?.message} />
    </div>
  );
};

export default InputQty;
