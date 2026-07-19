import type { LucideIcon } from "lucide-react";
import type { FC } from "react";
import { cn } from "../../../../utils/cn";

type CardMetodePembayaranProps = {
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

const CardMetodePembayaran: FC<CardMetodePembayaranProps> = ({
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
        "w-full flex flex-row justify-between items-center rounded-xl shadow-sm p-3 border  transition-all duration-150 ease-in-out",
        isActive
          ? "border-emerald-600 bg-emerald-600/10"
          : isError
            ? "border-rose-600 bg-rose-600/10"
            : "border-transparent hover:border-emerald-600",
      )}
      onClick={handleClick}
    >
      {/* content */}
      <div className="flex-2 flex flex-row justify-start items-center gap-4">
        {/* icon */}
        <div
          className={cn(
            "w-10 h-10 shrink-0 rounded-full flex flex-row justify-center items-center",
            bgColor,
          )}
        >
          <Icon className={cn("size-5", iconColor)} />
        </div>

        {/* label */}
        <div className="flex flex-col justify-start items-start gap-1">
          <span className="text-xs font-medium text-base-content text-left">
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
            "w-6 h-6 rounded-full border flex flex-col justify-center items-center",
            isActive ? "border-emerald-600" : "border-base-content",
          )}
        >
          <div
            className={cn(
              "w-3 h-3 bg-emerald-600 rounded-full transition-all duration-150 ease-in-out",
              isActive ? "animate-radio-active" : "opacity-0 scale-0",
            )}
          />
        </div>
      </div>
    </button>
  );
};

export default CardMetodePembayaran;
