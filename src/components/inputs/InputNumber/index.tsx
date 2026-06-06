import { useEffect, useState } from "react";
import clsx from "clsx";
import type { FieldValues, UseControllerReturn } from "react-hook-form";

import { cn } from "../../../utils/cn";
import ErrorMessage from "../../messages/ErrorMessage";
import { formatNumber, unformatNumber } from "../../../helpers/helpers";

type Props<T extends FieldValues = any> = {
  label?: string;
  required?: boolean;
  placeholder?: string;
  controller: UseControllerReturn<T>;
  disabled?: boolean;
  max?: number;
  defaultValue?: number;
  xs?: boolean;
};

const InputNumber = <T extends FieldValues = any>({
  label,
  required,
  placeholder,
  controller,
  disabled,
  max,
  defaultValue,
  xs,
}: Props<T>) => {
  const { field, fieldState } = controller;

  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    const value = field.value ?? defaultValue;

    if (value !== undefined && value !== null) {
      setDisplayValue(formatNumber(String(value)));
    } else {
      setDisplayValue("");
    }
  }, [field.value, defaultValue]);

  return (
    <div
      className={cn(
        "w-full flex flex-col justify-start items-start",
        fieldState.error && "mb-3",
      )}
    >
      {/* Label */}
      <div className="w-full text-base-content relative flex flex-row justify-between items-center">
        {label && (
          <div className="flex-2 relative">
            <label className="capitalize text-xs lg:text-sm text-base-content">
              {label}
            </label>

            {required && (
              <span className="absolute -top-1 ml-1 text-error">*</span>
            )}
          </div>
        )}

        {/* Max */}
        {max && (
          <span className="text-xs text-base-content">
            {formatNumber(String(field.value ?? 0))} /{" "}
            {formatNumber(String(max))}
          </span>
        )}
      </div>

      <div
        className={clsx(
          "flex flex-row justify-start items-center gap-2 border border-base-content/50 rounded-md w-full focus-within:ring-1 focus-within:ring-base-content focus-within:border-base-content transition-all duration-300 ease-in-out bg-base-100 px-3",
          xs ? "lg:h-8" : "h-9 lg:h-10",
          fieldState.error && "border-error",
          label && "mt-2",
        )}
      >
        <input
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          value={displayValue}
          onBlur={field.onBlur}
          className={cn(
            "font-medium rounded-md w-full h-full outline-none text-base-content placeholder:text-base-content/50 placeholder:font-light bg-transparent",
            xs ? "lg:text-xs" : "text-xs lg:text-sm",
          )}
          onChange={(e) => {
            const rawValue = unformatNumber(e.target.value);

            if (!rawValue) {
              setDisplayValue("");

              field.onChange(undefined);

              return;
            }

            let numberValue = Number(rawValue);

            if (max && numberValue > max) {
              numberValue = max;
            }

            setDisplayValue(formatNumber(String(numberValue)));

            field.onChange(numberValue);
          }}
        />
      </div>

      <ErrorMessage xs={xs} errorMessage={fieldState.error?.message} />
    </div>
  );
};

export default InputNumber;
