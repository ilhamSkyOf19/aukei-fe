import type { LucideIcon } from "lucide-react";
import type { FC } from "react";
import { cn } from "../../../../utils/cn";

type CardMetodePembayaranSmallProps = {
  bgColor: string;
  iconColor: string;
  icon: LucideIcon;
  label: string;
  description: string;
  isActive: boolean;
  handleClick: () => void;
  isError?: boolean;
  noDeskripsi?: boolean;
};

const CardMetodePembayaranSmall: FC<CardMetodePembayaranSmallProps> = ({
  icon: Icon,
  bgColor,
  iconColor,
  label,
  description,
  isActive,
  handleClick,
  isError,
  noDeskripsi,
}) => {
  return (
    <button
      type="button"
      className={cn(
        "w-full flex flex-row justify-between items-center rounded-xl shadow-sm p-1.5 border  transition-all duration-150 ease-in-out",
        isActive
          ? "border-emerald-600 bg-emerald-600/10"
          : isError
            ? "border-rose-600 bg-rose-600/10"
            : "border-transparent hover:border-emerald-600",
      )}
      onClick={handleClick}
    >
      {/* content */}
      <div className="flex-2 flex flex-row justify-start items-center gap-2">
        {/* icon */}
        <div
          className={cn(
            "w-8 h-8 shrink-0 rounded-full flex flex-row justify-center items-center",
            bgColor,
          )}
        >
          <Icon className={cn("size-4", iconColor)} />
        </div>

        {/* label */}
        <div className="flex flex-col justify-start items-start gap-1">
          <span className="text-[0.625rem] font-medium text-base-content text-left">
            {label}
          </span>
          {!noDeskripsi && (
            <span className="text-[0.625rem] font-medium text-base-content/50 text-left">
              {description}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-row justify-end items-center">
        <div
          className={cn(
            "w-4 h-4 rounded-full border flex flex-col justify-center items-center",
            isActive ? "border-emerald-600" : "border-base-content",
          )}
        >
          <div
            className={cn(
              "w-2 h-2 bg-emerald-600 rounded-full transition-all duration-150 ease-in-out",
              isActive ? "animate-radio-active" : "opacity-0 scale-0",
            )}
          />
        </div>
      </div>
    </button>
  );
};

export default CardMetodePembayaranSmall;
