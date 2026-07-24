import { type FC } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "../../../utils/cn";
import ErrorMessage from "../../messages/ErrorMessage";

type Props = {
  name: string;
  placeholder: string;
  label?: string;
  required?: boolean;
  errorMessage?: string;
  register: UseFormRegisterReturn;
  max?: number;
  disabled?: boolean;
  xs?: boolean;
  withCaption?: string;
  captionSize?: string;
};

const InputTextNonIcon: FC<Props> = ({
  label,
  name,
  placeholder,
  required,
  errorMessage,
  register,
  max,
  disabled,
  xs,
  withCaption,
  captionSize,
}) => {
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
          <>
            <div className="flex-2 relative">
              <label htmlFor={name} className={cn("capitalize", "text-xs")}>
                {label}
              </label>

              <span className="absolute -top-1 ml-1 text-error">
                {required && "*"}
              </span>
            </div>
          </>
        )}
      </div>
      <div
        className={cn(
          "flex flex-row justify-start items-center gap-2 border border-base-content/50 rounded-xl w-full focus-within:ring-1  transition-all duration-300 ease-in-out bg-base-100 focus-within:ring-custom-secondary focus-within:border-custom-secondary h-10.5 md:h-9 px-2.5",
          errorMessage && "border-error",
          label && "mt-1.5",
        )}
      >
        <input
          {...register}
          type={"text"}
          name={name}
          id={name}
          placeholder={placeholder}
          className={cn(
            "w-full font-medium text-base-content h-full border-none outline-none text-xs",
          )}
          {...(disabled && { disabled: true })}
          maxLength={max}
          onChange={(e) => {
            // set value
            register.onChange(e);
          }}
          autoComplete="off"
        />
      </div>

      {/* caption */}
      {withCaption && (
        <div className="w-full text-xs mt-1.5">
          <span
            className={cn(
              "text-base-content/80",
              captionSize ? captionSize : "text-xs",
            )}
          >
            {withCaption}
          </span>
        </div>
      )}

      {/* error message */}
      <ErrorMessage xs={xs} errorMessage={errorMessage} />
    </div>
  );
};

export default InputTextNonIcon;
