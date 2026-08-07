import clsx from "clsx";

import { cn } from "../../../utils/cn";
import { formatNumber } from "../../../helpers/helpers";

type Props = {
  label?: string;
  required?: boolean;
  placeholder?: string;
  value?: number;
  disabled?: boolean;
  readOnly?: boolean;
  xs?: boolean;
  name?: string;
};

const InputNumberReadOnly = ({
  label,
  required,
  placeholder,
  value,
  disabled,
  xs,
  name,
}: Props) => {
  return (
    <div className={cn("w-full flex flex-col justify-start items-start")}>
      {/* Label */}
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
          "flex flex-row justify-start items-center gap-2 border border-base-300 rounded-xl w-full px-2.5 h-10.5 md:h-9 bg-base-300",
          label && "mt-2",
        )}
      >
        <input
          id={name}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder={placeholder}
          disabled={disabled}
          readOnly={true}
          value={value == null ? "" : formatNumber(String(value))}
          className={cn(
            "w-full h-full bg-transparent outline-none placeholder:text-base-content/50",
            xs ? "lg:text-xs" : "text-xs",
          )}
          style={{ cursor: "not-allowed" }}
        />
      </div>
    </div>
  );
};

export default InputNumberReadOnly;
