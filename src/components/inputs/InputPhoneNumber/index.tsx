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
  name: string;
};

export default function InputPhoneNumber<T extends FieldValues = any>({
  label,
  required,
  placeholder,
  controller,
  disabled,
  xs,
  handleClearError,
  name,
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
      <div className="flex-2 relative">
        <label htmlFor={name} className={cn("capitalize", "text-xs")}>
          {label}
        </label>

        <span className="absolute -top-1 ml-1 text-error">
          {required && "*"}
        </span>
      </div>

      <div
        className={cn(
          "flex flex-row justify-start items-center gap-2 border border-base-content/50 rounded-xl w-full",
          "h-10.5 md:h-9 px-2.5 focus-within:ring-1 focus-within:ring-custom-secondary focus-within:border-custom-secondary transition-all duration-300 ease-in-out bg-base-100",
          fieldState.error && "border-error",
          label && "mt-1.5",
        )}
      >
        <input
          id={name}
          type="text"
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={cn(
            "h-full w-full text-xs border-none bg-transparent outline-none font-medium text-base-content placeholder:font-normal",
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
