import { type FC, type ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "../../../utils/cn";
import ErrorMessage from "../../messages/ErrorMessage";

type Props = {
  name: string;
  label: string;
  required?: boolean;
  errorMessage?: string;
  register: UseFormRegisterReturn;
  max?: number;
  disabled?: boolean;
  icon?: ReactNode;
  withCaption?: string;
  captionSize?: string;
};

const InputTextFloating: FC<Props> = ({
  label,
  name,
  required,
  errorMessage,
  register,
  max,
  disabled,
  icon,
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
      <div
        className={cn(
          "relative w-full flex flex-row items-center gap-2 border border-base-content/50 rounded-xl bg-base-100 h-12 px-2.5 transition-all duration-300 ease-in-out",
          "focus-within:ring-1 focus-within:ring-custom-secondary focus-within:border-custom-secondary",
          errorMessage && "border-error",
        )}
      >
        {/* icon (opsional) */}
        {icon && (
          <span className="text-base-content/60 shrink-0 flex items-center justify-center">
            {icon}
          </span>
        )}

        {/* input */}
        <input
          {...register}
          type="text"
          name={name}
          id={name}
          placeholder=" " // wajib ada spasi, jadi trigger untuk :placeholder-shown
          className={cn(
            "peer w-full h-full border-none outline-none bg-transparent font-medium text-base-content text-xs pt-3",
          )}
          {...(disabled && { disabled: true })}
          maxLength={max}
          onChange={(e) => register.onChange(e)}
          autoComplete="off"
        />

        {/* label yang mengambang */}
        <label
          htmlFor={name}
          className={cn(
            "absolute text-base-content/60 capitalize pointer-events-none",
            "transition-all duration-200 ease-in-out",
            icon ? "left-9" : "left-2.5",
            // posisi default: di tengah (belum fokus & masih kosong)
            "top-1/2 -translate-y-1/2 text-xs",
            // posisi saat fokus: naik ke atas
            "peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:text-custom-secondary",
            // posisi saat sudah ada isi (walau tidak fokus): tetap di atas
            "peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-[10px]",
          )}
        >
          {label}
          <span className="ml-1 text-error">{required && "*"}</span>
        </label>
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
      <ErrorMessage errorMessage={errorMessage} />
    </div>
  );
};

export default InputTextFloating;
