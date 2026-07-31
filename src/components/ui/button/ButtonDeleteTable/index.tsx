import { Trash2 } from "lucide-react";
import type { FC } from "react";
import { cn } from "../../../../utils/cn";

type Props = {
  handleShowModalDelete: () => void;
  customDataTip?: string;
  disabled?: boolean;
  xs?: boolean;
  noTip?: boolean;
};
const ButtonDeleteTable: FC<Props> = ({
  handleShowModalDelete,
  customDataTip,
  disabled,
  xs,
  noTip,
}) => {
  return (
    <div
      className="tooltip z-2"
      data-tip={!noTip ? (customDataTip ?? "hapus") : ""}
    >
      {/* update */}
      <button
        type="button"
        disabled={disabled}
        className={cn(
          " bg-error rounded-md flex flex-row justify-center items-center disabled:opacity-50",
          !disabled && "hover-overlay",
          xs ? "w-6 h-6" : "w-6 h-6",
        )}
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        onClick={() => handleShowModalDelete()}
      >
        <Trash2 className="size-3 text-primary-white" />
      </button>
    </div>
  );
};

export default ButtonDeleteTable;
