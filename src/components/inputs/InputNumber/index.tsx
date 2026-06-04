import { useEffect, useState, type FC } from "react";
import clsx from "clsx";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "../../../utils/cn";
import ErrorMessage from "../../messages/ErrorMessage";
import { formatNumber, unformatNumber } from "../../../helpers/helpers";

type Props = {
  name: string;
  placeholder: string;
  label?: string;
  required?: boolean;
  errorMessage?: string;
  register: UseFormRegisterReturn;
  max?: number;
  defaultValue?: number;
  xs?: boolean;
};

const InputNumber: FC<Props> = ({
  label,
  name,
  placeholder,
  required,
  errorMessage,
  register,
  max,
  defaultValue,
  xs,
}) => {
  // simpan sebagai number | null
  const [isValue, setIsValue] = useState<number | "">("");

  const [displayValue, setDisplayValue] = useState("");

  // set default value
  useEffect(() => {
    if (defaultValue) {
      setDisplayValue(new Intl.NumberFormat("id-ID").format(defaultValue));

      setIsValue(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div
      className={cn(
        "w-full flex flex-col justify-start items-start",
        errorMessage && "mb-3",
      )}
    >
      {/* label */}
      <div className="w-full text-base-content relative flex flex-row justify-between items-center">
        {label && (
          <div className="flex-2 relative">
            <label
              htmlFor={name}
              className="capitalize text-xs lg:text-sm text-base-content"
            >
              {label}
            </label>

            <span className="absolute -top-1 ml-1 text-error">
              {required && "*"}
            </span>
          </div>
        )}

        {/* MAX BERDASARKAN NILAI ANGKA */}
        {max && (
          <span className="text-xs text-base-content">
            {formatNumber(isValue.toString()) || 0} /{" "}
            {formatNumber(max.toString())}
          </span>
        )}
      </div>

      <div
        className={clsx(
          "flex flex-row justify-start items-center gap-2 border border-base-content/50 rounded-md w-full focus-within:ring-1 focus-within:ring-base-content focus-within:border-base-content transition-all duration-300 ease-in-out bg-base-100 px-3",
          xs ? "lg:h-8" : "h-9 lg:h-10",
          errorMessage && "border-error",
          label && "mt-2",
        )}
      >
        <input
          {...register}
          type="text"
          name={name}
          id={name}
          inputMode="numeric"
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            "font-medium rounded-md w-full h-full outline-none text-base-content placeholder:text-base-content/50 placeholder:font-light lg:text-sm bg-transparent",
            xs ? "lg:text-xs" : "text-xs lg:text-sm",
          )}
          value={displayValue}
          onChange={(e) => {
            const rawValue = unformatNumber(e.target.value);

            if (!rawValue) {
              setDisplayValue("");
              setIsValue("");

              register.onChange({
                target: {
                  name,
                  value: "",
                },
              });

              return;
            }

            let numberValue = Number(rawValue);

            if (max) {
              if (numberValue > max) {
                numberValue = max;
              }
            }

            setDisplayValue(formatNumber(String(numberValue)));

            setIsValue(numberValue);

            register.onChange({
              target: {
                name,
                value: numberValue,
              },
            });
          }}
        />
      </div>

      {/* error message */}
      <ErrorMessage errorMessage={errorMessage} />
    </div>
  );
};

export default InputNumber;
