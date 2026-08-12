import { Download } from "lucide-react";
import { type FC } from "react";
import { cn } from "../../../../utils/cn";

type Props = {
  handleDownload: () => void;
  isLoading?: boolean;
  tooltipPosition?: "left" | "right";
  label?: string;
};
const ButtonDownloadTable: FC<Props> = ({
  handleDownload,
  isLoading,
  tooltipPosition,
  label,
}) => {
  return (
    <div
      className={cn(
        !label && "tooltip",
        tooltipPosition === "left" && "tooltip-left",
        tooltipPosition === "right" && "tooltip-right",
      )}
      data-tip="download"
    >
      <button
        type="button"
        className="text-[0.625rem] font-medium px-2 py-1.5 bg-gray-400 rounded-md flex flex-row justify-start items-center gap-1 hover-overlay text-primary-white"
        onClick={() => handleDownload()}
      >
        {isLoading ? (
          <div className="loading loading-super-xs" />
        ) : (
          <>
            <Download className="size-3" />
            {label && <span>{label}</span>}
          </>
        )}
      </button>
    </div>
  );
};

export default ButtonDownloadTable;
