import type { ElementType, FC } from "react";
import { PackageX, Plus } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
  onAction?: () => void;
  buttonIcon?: boolean;
  buttonText?: boolean;
  iconData?: ElementType;
  labelButtonText?: string;
};

const DataEmpty: FC<Props> = ({
  title = "Data Tidak Tersedia",
  description = "Belum ada data yang dapat ditampilkan saat ini.",
  onAction,
  iconData: Icon,
  buttonIcon,
  buttonText,
  labelButtonText,
}: Props) => {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
      {/* Icon ring */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-base-200 border-2 border-dashed border-base-300 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-base-100 flex items-center justify-center shadow-inner">
            {Icon ? (
              <Icon className="size-6 text-base-content" />
            ) : (
              <PackageX className="size-6 text-base-content" />
            )}
          </div>
        </div>
      </div>

      {/* Text */}
      <h3 className="text-sm lg:text-base font-semibold text-base-content mb-1 tracking-tight">
        {title}
      </h3>
      <p className="text-xs lg:text-sm text-base-content/55 max-w-xs leading-relaxed">
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
