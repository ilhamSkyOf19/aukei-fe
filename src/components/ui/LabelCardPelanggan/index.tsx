import type { LucideIcon } from "lucide-react";
import type { FC } from "react";
import { cn } from "../../../utils/cn";
import { formatNumber, formatRupiah } from "../../../helpers/helpers";

type Props = {
  icon: {
    icon: LucideIcon;
    bgColor: string;
    iconColor: string;
  };
  label: string;
  value?: number;
  valueSting?: string;
  valuePrice?: number;
};

// label card pelanggan
const LabelCardPelanggan: FC<Props> = ({
  icon,
  label,
  value,
  valueSting,
  valuePrice,
}) => {
  return (
    <div className="w-full md:flex-1 flex flex-row md:flex-col justify-between md:justify-start items-center md:items-start shrink-0">
      {/* icon and label */}
      <div className="flex-1 flex flex-row justify-start items-center gap-2.5">
        {/* icon */}
        <div
          className={cn(
            "w-8.5 h-8.5 rounded-lg flex justify-center items-center",
            icon.bgColor,
          )}
        >
          <icon.icon className={cn("size-4", icon.iconColor)} />
        </div>

        {/* label */}
        <div className="flex flex-col justify-start items-start gap-1">
          <p className="text-xs font-medium text-base-content">{label}</p>

          <div className="flex-1 md:flex flex-row justify-end items-center hidden">
            <span className="text-xs text-medium text-base-content">
              {value || valueSting || valuePrice ? (
                <>
                  {valueSting && valueSting}
                  {value && formatNumber(value)}
                  {valuePrice && formatNumber(valuePrice)}
                </>
              ) : (
                <span className="text-base-content/50 text-xs italic font-light">
                  Kosong
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* value */}
      <div className="flex-1 flex flex-row justify-end items-center md:hidden">
        <span className="text-xs text-medium text-base-content">
          {value || valueSting || valuePrice ? (
            <>
              {valueSting && valueSting}
              {value && formatNumber(value)}
              {valuePrice && formatRupiah(valuePrice)}
            </>
          ) : (
            <span className="text-base-content/50 text-xs italic font-light">
              Kosong
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default LabelCardPelanggan;
