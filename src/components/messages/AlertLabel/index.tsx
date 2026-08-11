import { AlertCircle } from "lucide-react";
import type { FC } from "react";
import { cn } from "../../../utils/cn";

type Props = {
  message: string;
  warning?: boolean;
  isLoading?: boolean;
};
const AlertLabel: FC<Props> = ({ message, warning, isLoading }) => {
  return isLoading ? (
    <div className="w-full h-12 skeleton bg-base-200 rounded-2xl md:rounded-xl border border-base-content/10" />
  ) : (
    <div
      className={cn(
        "w-full gap-2.5 flex flex-row justify-start items-center p-2.5 rounded-2xl md:rounded-xl border ",
        warning
          ? "border-rose-600 bg-red-600/5"
          : "border-blue-600 bg-blue-600/5",
      )}
    >
      <AlertCircle
        className={cn(
          "md:size-6 lg:size-4 shrink-0",
          warning ? "text-rose-600" : "text-blue-600",
        )}
      />
      <span className="text-[0.7rem] text-base-content">{message}</span>
    </div>
  );
};

export default AlertLabel;
