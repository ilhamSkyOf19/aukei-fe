import { useEffect, useState, type FC } from "react";
import clsx from "clsx";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "../../../utils/cn";
import ErrorMessage from "../../messages/ErrorMessage";
import { formatNumber, unformatNumber } from "../../../helpers/helpers";

type Props = {
  name: string;
  placeholder: string;
  label: string;
  required?: boolean;
  errorMessage?: string;
  register: UseFormRegisterReturn;
  max: number;
  defaultValue?: number;
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

        {/* MAX BERDASARKAN NILAI ANGKA */}
        <span className="text-xs text-base-content">
          {formatNumber(isValue.toString()) || 0} /{" "}
          {formatNumber(max.toString())}
        </span>
      </div>

      <div
        className={clsx(
          "mt-2 h-11 flex flex-row justify-start items-center gap-2 border border-base-content/50 rounded-md w-full focus-within:ring-1 focus-within:ring-primary-purple focus-within:border-primary-purple transition-all duration-300 ease-in-out",
          errorMessage && "border-error",
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
          className="px-3 font-medium rounded-md w-full h-full outline-none text-xs text-base-content placeholder:text-base-content/50 placeholder:font-light lg:text-sm bg-base-100"
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

            if (numberValue > max) {
              numberValue = max;
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
