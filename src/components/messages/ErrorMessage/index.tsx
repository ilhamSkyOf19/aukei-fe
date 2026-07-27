import { memo, type FC } from "react";
import { cn } from "../../../utils/cn";

type Props = {
  errorMessage?: string;
};
const ErrorMessage: FC<Props> = ({ errorMessage }) => {
  return (
    <div className="w-full h-2.5">
      <span
        className={cn(
          "text-[0.7rem] text-error transition-opacity duration-200 ease-in-out",
          errorMessage ? "opacity-100" : "opacity-0",
        )}
      >
        {errorMessage}
      </span>
    </div>
  );
};

export default memo(ErrorMessage);
