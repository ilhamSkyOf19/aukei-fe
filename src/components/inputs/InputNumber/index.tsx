import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { type FieldValues, type UseControllerReturn } from "react-hook-form";

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
  name?: string;
  onBlur?: () => void;
};

const InputNumber = <T extends FieldValues = any>({
  label,
  required,
  placeholder,
  controller,
  disabled,
  max,
  xs,
  name,
  onBlur,
}: Props<T>) => {
  const { field, fieldState } = controller;

  const [displayValue, setDisplayValue] = useState("");

  // Menandai bahwa user sedang mengosongkan input.
  const isClearingRef = useRef(false);

  useEffect(() => {
    // Kalau user baru saja mengosongkan input,
    // jangan kembalikan value lama dari field.value.
    if (isClearingRef.current) {
      if (
        field.value !== undefined &&
        field.value !== null &&
        field.value !== 0
      ) {
        return;
      }

      return;
    }

    if (field.value !== undefined && field.value !== null) {
      setDisplayValue(formatNumber(String(field.value)));
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
          "flex flex-row justify-start items-center gap-2 border border-base-content/50 rounded-xl w-full focus-within:ring-1 focus-within:ring-custom-secondary focus-within:border-custom-secondary transition-all duration-300 ease-in-out bg-base-100 px-2.5 h-10.5 md:h-9",
          fieldState.error && "border-error",
          label && "mt-2",
        )}
      >
        <input
          type="text"
          id={name}
          inputMode="numeric"
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          value={displayValue}
          onBlur={() => onBlur?.()}
          className={cn(
            "font-medium rounded-md w-full h-full outline-none text-base-content placeholder:text-base-content/50 placeholder:font-normal bg-transparent",
            xs ? "lg:text-xs" : "text-xs",
          )}
          onChange={(e) => {
            const rawValue = e.target.value.trim();

            // User menghapus seluruh isi input
            if (rawValue === "") {
              isClearingRef.current = true;

              setDisplayValue("");

              // Nilai form menjadi 0
              field.onChange(0);

              return;
            }

            // User mulai mengetik kembali
            isClearingRef.current = false;

            const unformatted = unformatNumber(rawValue);
            let numberValue = Number(unformatted);

            if (Number.isNaN(numberValue)) {
              setDisplayValue("");
              field.onChange(0);
              return;
            }

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
