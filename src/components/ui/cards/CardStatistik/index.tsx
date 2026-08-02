import { ArrowDown, ArrowUp, CircleAlert, type LucideIcon } from "lucide-react";
import { cn } from "../../../../utils/cn";
import type { FC } from "react";
import type { TempoStatusType } from "../../../../types/constant.type";
import StatusTransaction from "../../StatusTransaction";

// card statistik
type Props = {
  label: string;
  value: string;
  minus?: boolean;
  icon: {
    icon: LucideIcon;
    iconColor: string;
    bgColor: string;
  };
  caption?: string;
  detail?: {
    reverseColor?: boolean;
    up?: number;
    down?: number;
    same?: number;
  };
  isLoading?: boolean;
  withAlert?: string;
  statusTempo?: TempoStatusType;
  customColSpan?: string;
};
const CardStatistik: FC<Props> = ({
  icon,
  label,
  value,
  caption,
  detail,
  isLoading,
  withAlert,
  minus,
  statusTempo,
  customColSpan,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col py-2.5 justify-center items-start p-2.5 rounded-2xl md:rounded-xl border border-base-content/10 gap-2.5 relative",
        customColSpan ?? "col-span-1",
        isLoading && "skeleton h-24",
      )}
    >
      {/* status transaction */}
      {statusTempo && (
        <div className="absolute top-1 right-2">
          <StatusTransaction statusTempo={statusTempo} />
        </div>
      )}

      <div className=" flex flex-row justify-start items-start md:items-center gap-2.5">
        {/* icon */}
        <div className="flex-1 flex flex-row justify-start items-center">
          <div
            className={cn(
              "w-9 h-9 md:w-14 md:h-14 flex justify-center items-center rounded-full",
              icon.bgColor,
            )}
          >
            <icon.icon className={cn("size-4 md:size-6", icon.iconColor)} />
          </div>
        </div>
        {/* label */}
        <div className="flex-7 flex flex-col justify-start items-start gap-0.5">
          <div className="w-full flex flex-col justify-start items-start gap-0.5">
            <div className="flex flex-row justify-start items-center gap-2.5">
              <span className="text-[0.625rem] font-medium text-base-content/70">
                {label}
              </span>

              {withAlert && (
                <div
                  className="tooltip z-5 tooltip-custom"
                  data-tip={withAlert}
                >
                  <button type="button">
                    <CircleAlert className="size-3 text-base-content/50 hover:text-base-content transition-all duration-150 ease-in-out" />
                  </button>
                </div>
              )}
            </div>

            <span
              className={cn(
                "text-xs md:text-sm font-semibold",
                minus ? "text-error" : "text-base-content",
              )}
            >
              {value ?? 0}
            </span>
          </div>

          {/* for not mobile */}
          {detail && (
            <div className="hidden md:flex flex-row gap-1 justify-start items-center mt-1.5">
              {/* icon */}
              {detail.down !== undefined && (
                <ArrowDown
                  className={cn(
                    "size-3",
                    detail.reverseColor ? "text-emerald-500" : "text-rose-500",
                  )}
                />
              )}
              {detail.up !== undefined && (
                <ArrowUp
                  className={cn(
                    "size-3",
                    detail.reverseColor ? "text-rose-500" : "text-emerald-500",
                  )}
                />
              )}

              {detail.same !== undefined && (
                <ArrowUp
                  className={cn(
                    "size-3",
                    detail.reverseColor ? "text-rose-500" : "text-emerald-500",
                  )}
                />
              )}

              {/* value */}
              <span
                className={cn(
                  "text-[0.625rem] font-medium",
                  detail.down
                    ? detail.reverseColor
                      ? "text-emerald-400"
                      : "text-rose-400"
                    : detail.reverseColor
                      ? "text-rose-400"
                      : "text-emerald-400",
                )}
              >
                {detail.up || detail.down || detail.same}%
              </span>

              {/* label */}
              <span className="text-[0.625rem] font-medium text-base-content/70">
                dari periode lalu
              </span>
            </div>
          )}

          {/* caption */}
          {caption && (
            <div className="hidden md:flex flex-row gap-1 justify-start items-center mt-1.5">
              <span className="text-[0.625rem] font-medium text-base-content/70">
                {caption}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* for mobile */}
      {detail && (
        <div className="flex md:hidden flex-row gap-1 justify-start items-center">
          {/* icon */}
          {detail.down !== undefined && (
            <ArrowDown
              className={cn(
                "size-3",
                detail.reverseColor ? "text-emerald-500" : "text-rose-500",
              )}
            />
          )}
          {detail.up !== undefined && (
            <ArrowUp
              className={cn(
                "size-3",
                detail.reverseColor ? "text-rose-500" : "text-emerald-500",
              )}
            />
          )}

          {detail.same !== undefined && (
            <ArrowUp
              className={cn(
                "size-3",
                detail.reverseColor ? "text-rose-500" : "text-emerald-500",
              )}
            />
          )}

          {/* value */}
          <span
            className={cn(
              "text-[0.625rem] font-medium",
              detail.down
                ? detail.reverseColor
                  ? "text-emerald-400"
                  : "text-rose-400"
                : detail.reverseColor
                  ? "text-rose-400"
                  : "text-emerald-400",
            )}
          >
            {detail.up || detail.down || detail.same}%
          </span>

          {/* label */}
          <span className="text-[0.625rem] font-medium text-base-content/70">
            dari periode lalu
          </span>
        </div>
      )}

      {caption && (
        <div className="flex md:hidden flex-row gap-1 justify-start items-center">
          <span className="text-[0.625rem] font-medium text-base-content/70">
            {caption}
          </span>
        </div>
      )}
    </div>
  );
};

export default CardStatistik;
