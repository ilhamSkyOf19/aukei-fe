import { type FC } from "react";
import { cn } from "../../../utils/cn";

type Props = {
  toast: boolean;
  isAnimationOut: boolean;
  label: string;
  color: "error" | "info" | "success" | "warning" | "neutral";
};
const Toast: FC<Props> = ({ toast, isAnimationOut, label, color }) => {
  return (
    <>
      {toast && (
        <div className="toast toast-top toast-end z-50">
          <div
            className={cn(
              "alert transition duration-300 ease-in-out",
              isAnimationOut && "translate-x-full opacity-0",
              color === "error" && "alert-error",
              color === "info" && "alert-info",
              color === "success" && "alert-success",
              color === "warning" && "alert-warning",
              color === "neutral" && "alert-vertical",
            )}
          >
            <span>{label}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Toast;
