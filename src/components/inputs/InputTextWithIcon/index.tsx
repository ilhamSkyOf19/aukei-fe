import { UserRound } from "lucide-react";
import { type FC } from "react";
import { type UseFormRegisterReturn } from "react-hook-form";
import ErrorMessage from "../../messages/ErrorMessage";
import { cn } from "../../../utils/cn";

// Props
type Props = {
  register: UseFormRegisterReturn;
  errorMessage?: string;
  name: string;
  minLength?: number;
  maxLength?: number;
  placeholder: string;
};
const InputTextWithIcon: FC<Props> = ({
  name,
  register,
  errorMessage,
  minLength,
  maxLength,
  placeholder,
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
          "h-10.5 px-3 flex flex-row justify-start items-center gap-2 border border-base-content/40 rounded-2xl md:rounded-xl w-full focus-within:ring-1 focus-within:ring-custom-secondary focus-within:border-custom-secondary transition-all duration-300 ease-in-out",
          errorMessage && "border-error",
        )}
      >
        {/* icon */}
        <label htmlFor={name}>
          <UserRound className="size-4 text-base-content" />
        </label>

        {/* input */}
        <input
          {...register}
          type="text"
          id={name}
          placeholder={placeholder}
          className="w-full font-medium h-full bg-transparent outline-none text-sm placeholder:text-sm placeholder:text-gray-400 placeholder:font-light lg:text-sm lg:placeholder:text-sm text-base-content"
          autoComplete="off"
          minLength={minLength || 1}
          maxLength={maxLength || 100}
        />
      </div>
      {/* error message */}
      <ErrorMessage errorMessage={errorMessage} />
    </div>
  );
};

export default InputTextWithIcon;
