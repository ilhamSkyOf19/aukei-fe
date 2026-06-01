import { UserRound } from "lucide-react";
import { type FC } from "react";
import { type UseFormRegisterReturn } from "react-hook-form";
import ErrorMessage from "../../messages/ErrorMessage";

// Props
type Props = {
  register: UseFormRegisterReturn;
  errorMessage?: string;
  name: string;
  minLength?: number;
  maxLength?: number;
  placeholder: string;
};
const InputFieldWithIconText: FC<Props> = ({
  name,
  register,
  errorMessage,
  minLength,
  maxLength,
  placeholder,
}) => {
  return (
    <div className="w-full flex flex-col justify-start items-start">
      <div className="h-11 px-3 flex flex-row justify-start items-center gap-2 border border-primary-black/40 rounded-md w-full focus-within:ring-1 focus-within:ring-primary-purple focus-within:border-primary-purple transition-all duration-300 ease-in-out ">
        {/* icon */}
        <label htmlFor={name}>
          <UserRound className="w-4 h-4" />
        </label>

        {/* input */}
        <input
          {...register}
          type="text"
          id={name}
          placeholder={placeholder}
          className="w-full h-full bg-transparent outline-none text-sm placeholder:text-sm placeholder:text-gray-400 placeholder:font-light lg:text-sm lg:placeholder:text-sm"
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

export default InputFieldWithIconText;
