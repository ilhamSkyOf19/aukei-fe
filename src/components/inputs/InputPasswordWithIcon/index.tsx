import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useState, type FC } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "../../../utils/cn";
import ErrorMessage from "../../messages/ErrorMessage";

// props
type Props = {
  register: UseFormRegisterReturn;
  errorMessage?: string;
  name: string;
  minLength?: number;
  placeholder: string;
  maxLength?: number;
};

const InputPasswordWithIcon: FC<Props> = ({
  name,
  register,
  errorMessage,
  maxLength,
  minLength,
  placeholder,
}) => {
  // state show password
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <div
      className={cn(
        "w-full flex flex-col justify-start items-start",
        errorMessage && "mb-3",
      )}
    >
      <div className="h-11 px-3 flex flex-row justify-start items-center gap-2 border border-primary-black/40 rounded-md w-full focus-within:ring-1 focus-within:ring-primary-purple focus-within:border-primary-purple transition-all duration-300 ease-in-out ">
        {/* icon */}
        <label htmlFor={name}>
          <KeyRound className="w-4 h-4" />
        </label>

        {/* input */}
        <input
          {...register}
          type={showPassword ? "text" : "password"}
          id={name}
          placeholder={placeholder}
          className="w-full h-full bg-transparent outline-none text-sm placeholder:text-sm placeholder:text-gray-400  placeholder:font-light lg:text-sm lg:placeholder:text-sm"
          autoComplete="off"
          minLength={minLength || 6}
          maxLength={maxLength || 100}
        />

        {/* eye */}
        <div className="h-full flex flex-row justify-center items-center">
          {showPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <Eye className="w-5 h-5 pointer-events-none" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <EyeOff className="w-5 h-5 pointer-events-none" />
            </button>
          )}
        </div>
      </div>

      {/* error message */}
      <ErrorMessage errorMessage={errorMessage} />
    </div>
  );
};

export default InputPasswordWithIcon;
