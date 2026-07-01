import type { ElementType, FC } from "react";
import { PackageX, Plus } from "lucide-react";
import { cn } from "../../../utils/cn";

type Props = {
  title?: string;
  description?: string;
  onAction?: () => void;
  buttonIcon?: boolean;
  buttonText?: boolean;
  iconData?: ElementType;
  labelButtonText?: string;
  xs?: boolean;
  white?: boolean;
};

const DataEmpty: FC<Props> = ({
  title = "Data Tidak Tersedia",
  description = "Belum ada data yang dapat ditampilkan saat ini.",
  onAction,
  iconData: Icon,
  buttonIcon,
  buttonText,
  labelButtonText,
  white,
  xs,
}: Props) => {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
      {/* Icon ring */}
      <div className="relative mb-6">
        <div
          className={cn(
            " rounded-full border-2 border-dashed border-base-300 flex items-center justify-center",
            xs ? "w-20 h-20" : "w-24 h-24",
            !white && "bg-base-200",
          )}
        >
          <div
            className={cn(
              "rounded-full bg-base-100 flex items-center justify-center shadow-inner",
              xs ? "w-14 h-14" : "w-16 h-16",
            )}
          >
            {Icon ? (
              <Icon
                className={cn(" text-base-content", xs ? "size-5" : "size-6")}
              />
            ) : (
              <PackageX
                className={cn(" text-base-content", xs ? "size-5" : "size-6")}
              />
            )}
          </div>
        </div>
      </div>

      {/* Text */}
      <h3
        className={cn(
          "font-semibold mb-1 tracking-tight",
          xs ? "text-xs lg:text-sm" : "text-sm lg:text-base",
          white ? "text-primary-white" : "text-base-content",
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "max-w-xs leading-relaxed",
          xs ? "text-[0.625rem] lg:text-xs" : "text-xs lg:text-sm ",
          white ? "text-primary-white/55" : "text-base-content/55",
        )}
      >
        {description}
      </p>

      {/* Action button */}
      {onAction &&
        ((buttonIcon && (
          <div className="w-full flex flex-row justify-center items-center mt-4">
            <button
              className="rounded-full w-10 h-10 flex justify-center items-center hover-overlay bg-primary-purple"
              onClick={onAction}
            >
              <Plus className="size-5 text-base-content" />
            </button>
          </div>
        )) ||
          (buttonText && (
            <div className="w-full flex flex-row justify-center items-center mt-4">
              <button
                className="btn btn-sm font-medium text-base-content flex justify-center items-center hover-overlay bg-primary-purple"
                onClick={onAction}
              >
                {labelButtonText || "Tambah"}
              </button>
            </div>
          )))}
    </div>
  );
};

export default DataEmpty;
