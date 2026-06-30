import { useEffect, useState } from "react";
import type { FieldValues, UseControllerReturn } from "react-hook-form";
import { cn } from "../../../utils/cn";
import ErrorMessage from "../../messages/ErrorMessage";
import { formatNumberPhoneWithDash } from "../../../helpers/helpers";

type Props<T extends FieldValues = any> = {
  label?: string;
  required?: boolean;
  placeholder?: string;
  controller: UseControllerReturn<T>;
  disabled?: boolean;
  xs?: boolean;
  handleClearError?: () => void;
};

export default function InputPhoneNumber<T extends FieldValues = any>({
  label,
  required,
  placeholder,
  controller,
  disabled,
  xs,
  handleClearError,
}: Props<T>) {
  const { field, fieldState } = controller;

  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (field.value !== undefined && field.value !== null) {
      setDisplayValue(formatNumberPhoneWithDash(String(field.value)));
      handleClearError?.();
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
            const raw = unformatPhoneNumber(e.target.value);

            setDisplayValue(formatNumberPhoneWithDash(raw));

            field.onChange(raw === "" ? null : raw);
          }}
          onBlur={field.onBlur}
          maxLength={18}
        />
      </div>

      <ErrorMessage xs={xs} errorMessage={fieldState.error?.message} />
    </div>
  );
}

function unformatPhoneNumber(value: string) {
  return value.replace(/\D/g, "");
}
