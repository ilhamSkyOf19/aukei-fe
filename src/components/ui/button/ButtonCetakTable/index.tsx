import { Printer } from "lucide-react";
import { type FC } from "react";
import { cn } from "../../../../utils/cn";

type Props = {
  handleCetak: () => void;
  tooltipPosition?: "left" | "right";
  classHidden?: string;
  isLoading?: boolean;
};
const ButtonCetakTable: FC<Props> = ({
  handleCetak,
  tooltipPosition,
  classHidden,
  isLoading,
}) => {
  return (
    <div
      className={cn(
        "tooltip",
        tooltipPosition === "left" && "tooltip-left",
        tooltipPosition === "right" && "tooltip-right",
        classHidden ?? "flex",
      )}
      data-tip="cetak"
    >
      <button
        type="button"
        disabled={isLoading}
        className="text-[0.625rem] font-medium px-2 py-1.5 bg-info rounded-md flex flex-row justify-start items-center gap-1 hover-overlay text-primary-white"
        onClick={() => handleCetak()}
      >
        {isLoading ? (
          <div className="loading loading-super-xs" />
        ) : (
          <Printer className="size-3" />
        )}
      </button>
    </div>
  );
};

export default ButtonCetakTable;
