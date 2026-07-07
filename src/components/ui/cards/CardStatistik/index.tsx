import { ArrowDown, ArrowUp, CircleAlert, type LucideIcon } from "lucide-react";
import { cn } from "../../../../utils/cn";
import type { FC } from "react";

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
  };
  isLoading?: boolean;
  withAlert?: string;
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
}) => {
  return (
    <div className="grid-cols-1 flex gap-2 flex-col justify-start items-start border border-base-content/10 rounded-lg p-2">
      <div className=" flex flex-row justify-start items-start gap-2.5">
        {/* icon */}
        <div className="flex-1 flex flex-row justify-start items-center">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex flex-row justify-center items-center",
              icon.bgColor,
            )}
          >
            <icon.icon className={cn("size-5", icon.iconColor)} />
          </div>
        </div>

        {/* label */}
        <div className="flex-7 flex flex-col justify-start items-start gap-0.5">
          <div className="flex flex-row justify-start items-center gap-0.5">
            <span className="text-xs font-semibold text-base-content/50">
              {label}
            </span>

            {withAlert && (
              <div className="tooltip z-30 tooltip-custom" data-tip={withAlert}>
                <button type="button">
                  <CircleAlert className="size-3 text-base-content/50" />
                </button>
              </div>
            )}
          </div>

          {/* caption */}
          {caption && (
            <span className="text-[0.625rem] font-medium text-base-content/50">
              {caption}
            </span>
          )}

          {isLoading ? (
            <div className="w-20 h-3 md:w-30 md:h-4 skeleton"></div>
          ) : (
            <>
              <span
                className={cn(
                  "text-xs md:text-sm font-semibold md:mt-1",
                  minus ? "text-error" : "text-base-content",
                )}
              >
                {value}
              </span>

              {detail && (
                <div className="hidden md:flex flex-row gap-1 justify-start items-center">
                  {/* icon */}
                  {detail.down && (
                    <ArrowDown
                      className={cn(
                        "size-3",
                        detail.reverseColor
                          ? "text-emerald-400"
                          : "text-rose-400",
                      )}
                    />
                  )}
                  {detail.up && (
                    <ArrowUp
                      className={cn(
                        "size-3",
                        detail.reverseColor
                          ? "text-rose-400"
                          : "text-emerald-400",
                      )}
                    />
                  )}

                  {/* value */}
                  <span
                    className={cn(
                      "md:text-[0.7rem] font-semibold",
                      detail.down
                        ? detail.reverseColor
                          ? "text-emerald-400"
                          : "text-rose-400"
                        : detail.reverseColor
                          ? "text-rose-400"
                          : "text-emerald-400",
                    )}
                  >
                    {detail.up || detail.down}%
                  </span>

                  {/* label */}
                  <span className=" md:text-[0.7rem] font-medium text-base-content/80">
                    dari periode lalu
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {detail && (
        <div className="flex flex-row gap-1 justify-start items-start md:hidden">
          {isLoading ? (
            <div className="w-30 h-4 skeleton" />
          ) : (
            <>
              {/* icon */}
              {detail.down && (
                <ArrowDown className="size-3.5 md:size-4 text-rose-400" />
              )}
              {detail.up && (
                <ArrowUp className="size-3.5 md:size-4 text-emerald-400" />
              )}

              {/* value */}
              <span
                className={cn(
                  "text-[0.625rem] md:text-xs font-semibold",
                  detail.down ? "text-rose-400" : "text-emerald-400",
                )}
              >
                {detail.up || detail.down}%
              </span>

              {/* label */}
              <span className="text-[0.625rem] md:text-xs font-medium text-base-content/80">
                dari periode lalu
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CardStatistik;
