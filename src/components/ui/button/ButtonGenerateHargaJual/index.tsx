import { RefreshCcw } from "lucide-react";
import type { FC } from "react";
import { cn } from "../../../../utils/cn";

type Props = {
  handleShowModalGenerateHargaJual: () => void;
  customDataTip?: string;
  disabled?: boolean;
  xs?: boolean;
  noTip?: boolean;
};
const ButtonGenerateHargaJual: FC<Props> = ({
  handleShowModalGenerateHargaJual,
  customDataTip,
  disabled,
  xs,
  noTip,
}) => {
  return (
    <div
      className="tooltip z-2"
      data-tip={!noTip ? (customDataTip ?? "kalkulasi harga jual") : ""}
    >
      {/* update */}
      <button
        type="button"
        disabled={disabled}
        className={cn(
          "bg-info rounded-md flex flex-row justify-center items-center disabled:opacity-50",
          !disabled && "hover-overlay",
          xs ? "w-6 h-6" : "w-7 h-7",
        )}
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        onClick={() => handleShowModalGenerateHargaJual()}
      >
        <RefreshCcw className="size-3 text-primary-white" />
      </button>
    </div>
  );
};

export default ButtonGenerateHargaJual;
