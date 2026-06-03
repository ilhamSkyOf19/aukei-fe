import { type FC } from "react";
import { cn } from "../../../utils/cn";

type Props = {
  alert: boolean;
  isAnimationOut: boolean;
  label: string;
};
const Alert: FC<Props> = ({ alert, isAnimationOut, label }) => {
  return (
    <>
      {alert && (
        <div
          className={cn(
            "alert w-11/12 alert-warning fixed top-4 lg:top-2 right-4 z-50  transition duration-300 ease-in-out",
            isAnimationOut && "translate-x-full opacity-0",
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="text-xs lg:text-sm">{label}</span>
        </div>
      )}
    </>
  );
};

export default Alert;
