import { SendHorizonal } from "lucide-react";
import { type FC } from "react";
import { cn } from "../../../../utils/cn";

type Props = {
  handleSend: () => void;
  isLoading?: boolean;
  tooltipPosition?: "left" | "right";
  label?: string;
  disabled?: boolean;
};
const ButtonSendMessageTable: FC<Props> = ({
  handleSend,
  isLoading,
  tooltipPosition,
  label,
  disabled,
}) => {
  return (
    <div
      className={cn(
        !label && "tooltip",
        tooltipPosition === "left" && "tooltip-left",
        tooltipPosition === "right" && "tooltip-right",
      )}
      data-tip="kirim pesan"
    >
      <button
        type="button"
        disabled={disabled || isLoading}
        className="text-[0.625rem] font-medium px-2 py-1.5 bg-emerald-600 rounded-md flex flex-row justify-start items-center gap-1 hover-overlay text-primary-white"
        onClick={() => handleSend()}
      >
        {isLoading ? (
          <div className="loading loading-super-xs" />
        ) : (
          <>
            <SendHorizonal className="size-3" />
            {label && <span>{label}</span>}
          </>
        )}
      </button>
    </div>
  );
};

export default ButtonSendMessageTable;
