import { useEffect, useState } from "react";
import clsx from "clsx";
import type { FieldValues, UseControllerReturn } from "react-hook-form";

import { cn } from "../../../utils/cn";
import ErrorMessage from "../../messages/ErrorMessage";
import { formatNumber } from "../../../helpers/helpers";
import { Minus, Plus } from "lucide-react";

type Props<T extends FieldValues = any> = {
  required?: boolean;
  controller: UseControllerReturn<T>;
};

const InputQtyInTable = <T extends FieldValues = any>({
  required,
  controller,
}: Props<T>) => {
  const { field, fieldState } = controller;

  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    const value = field.value;

    if (value !== undefined && value !== null) {
      setDisplayValue(formatNumber(String(value)));
    } else {
      setDisplayValue("0");
    }
  }, [field.value]);

  //   handle add
  const handlePlus = () => {
    if (field.value === undefined || field.value === null) {
      field.onChange(1);
    } else {
      field.onChange(field.value + 1);
    }
  };

  const handleMin = () => {
    if (
      field.value === undefined ||
      field.value === null ||
      field.value === 0
    ) {
      field.onChange(0);
    } else {
      field.onChange(field.value - 1);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col justify-start items-start w-18 h-10",
        fieldState.error && "mb-3",
      )}
    >
      <div
        className={clsx(
          "flex flex-row justify-between items-center gap-2 border border-base-content/20 rounded-md w-full focus-within:ring-1 focus-within:ring-base-content focus-within:border-base-content transition-all duration-300 ease-in-out bg-base-100 px-1.5 h-full",
          fieldState.error && "border-error",
        )}
      >
        {/* button min */}
        <button
          type="button"
          className="w-full h-full flex flex-row justify-center items-center opacity-50 hover:opacity-100 transition-opacity duration-150 ease-in-out"
          onClick={handleMin}
        >
          <Minus className="size-2 text-base-content" />
        </button>

        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={displayValue}
          onBlur={field.onBlur}
          required={required}
          className={cn(
            "font-medium text-[0.7rem] rounded-md w-full h-full text-center outline-none text-base-content placeholder:text-base-content/50 placeholder:font-light bg-transparent",
          )}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");

            if (!value) {
              setDisplayValue("0");
              field.onChange(0);
              return;
            }

            const qty = Number(value);

            setDisplayValue(formatNumber(String(qty)));
            field.onChange(qty);
          }}
        />

        <button
          type="button"
          className="w-full h-full flex flex-row justify-center items-center opacity-50 hover:opacity-100 transition-opacity duration-150 ease-in-out"
          onClick={handlePlus}
        >
          <Plus className="size-2 text-base-content" />
        </button>
      </div>

      <ErrorMessage errorMessage={fieldState.error?.message} />
    </div>
  );
};

export default InputQtyInTable;
