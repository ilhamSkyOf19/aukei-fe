import { memo, type FC } from "react";
import { cn } from "../../../utils/cn";

type Props = {
  errorMessage?: string;
  xs?: boolean;
};
const ErrorMessage: FC<Props> = ({ errorMessage, xs }) => {
  return (
    <div className="w-full h-4">
      <span
        className={cn(
          "text-error transition-opacity duration-200 ease-in-out",
          errorMessage ? "opacity-100" : "opacity-0",
          xs
            ? "text-[0.625rem] lg:text-[0.625rem]"
            : "text-[0.7rem] lg:text-xs",
        )}
      >
        {errorMessage}
      </span>
    </div>
  );
};

export default memo(ErrorMessage);
