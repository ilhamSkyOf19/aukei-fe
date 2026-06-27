import { useEffect, useState } from "react";
import clsx from "clsx";
import type { FieldValues, UseControllerReturn } from "react-hook-form";

import { cn } from "../../../utils/cn";
import ErrorMessage from "../../messages/ErrorMessage";
import { formatNumber, unformatNumber } from "../../../helpers/helpers";

type Props<T extends FieldValues = any> = {
  required?: boolean;
  controller: UseControllerReturn<T>;
};

const InputNumberInTable = <T extends FieldValues = any>({
  required,
  controller,
}: Props<T>) => {
  const { field, fieldState } = controller;

  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (field.value !== undefined && field.value !== null) {
      setDisplayValue(formatNumber(String(field.value)));
    } else {
      setDisplayValue("0");
    }
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col justify-start items-start w-17 h-10",
        fieldState.error && "mb-3",
      )}
    >
      <div
        className={clsx(
          "flex flex-row justify-start items-center gap-2 border border-base-content/20 rounded-md w-full focus-within:ring-1 focus-within:ring-base-content focus-within:border-base-content transition-all duration-300 ease-in-out bg-base-100 px-1.5 h-full",
          fieldState.error && "border-error",
        )}
      >
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={displayValue}
          required={required}
          className={cn(
            "font-medium text-[0.7rem] rounded-md w-full h-full text-end outline-none text-base-content bg-transparent",
          )}
          onChange={(e) => {
            const raw = unformatNumber(e.target.value);

            if (!raw) {
              setDisplayValue("");
              return;
            }

            setDisplayValue(formatNumber(raw));
          }}
          onBlur={(e) => {
            const raw = unformatNumber(e.target.value);

            const value = raw ? Number(raw) : 0;

            field.onChange(value);

            setDisplayValue(formatNumber(String(value)));

            field.onBlur();
          }}
        />
      </div>

      <ErrorMessage errorMessage={fieldState.error?.message} />
    </div>
  );
};

export default InputNumberInTable;
