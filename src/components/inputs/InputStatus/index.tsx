import type { FC } from "react";
import { cn } from "../../../utils/cn";
import ErrorMessage from "../../messages/ErrorMessage";

type Props = {
  label?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  required?: boolean;
  disabled?: boolean;
  errorMessage?: string;
};

const InputStatus: FC<Props> = ({
  label,
  value,
  onChange,
  required,
  disabled,
  errorMessage,
}) => {
  return (
    <div className="w-full flex flex-col">
      {/* label */}
      {label && (
        <div className="flex items-center">
          <label className="text-xs lg:text-sm font-medium text-base-content">
            {label}
          </label>

          {required && <span className="ml-1 text-error">*</span>}
        </div>
      )}

      {/* radio group */}
      <div
        className={cn(
          "mt-2 flex h-11 items-center justify-between rounded-md px-3 gap-4",
          disabled && "cursor-not-allowed opacity-70",
        )}
      >
        {/* tidak aktif */}
        <label
          htmlFor="status-false"
          className="flex cursor-pointer items-center gap-2"
        >
          <input
            id="status-false"
            disabled={disabled}
            onChange={() => onChange(false)}
            type="radio"
            name="radio-2"
            className="radio radio-md radio-error"
            defaultChecked={value === false}
          />

          <span className="text-xs text-base-content">Tidak Aktif</span>
        </label>

        {/* aktif */}
        <label
          htmlFor="status-true"
          className="flex cursor-pointer items-center gap-2"
        >
          <input
            id="status-true"
            disabled={disabled}
            onChange={() => onChange(true)}
            type="radio"
            name="radio-2"
            className="radio radio-md radio-success"
            defaultChecked={value === true}
          />

          <span className="text-xs text-base-content">Aktif</span>
        </label>
      </div>

      <ErrorMessage errorMessage={errorMessage} />
    </div>
  );
};

export default InputStatus;
