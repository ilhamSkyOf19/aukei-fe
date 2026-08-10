import { Trash2 } from "lucide-react";
import type { FC } from "react";
import { cn } from "../../../../utils/cn";

type Props = {
  handleShowModalDelete: () => void;
  customDataTip?: string;
  disabled?: boolean;
  noTip?: boolean;
};
const ButtonDeleteTable: FC<Props> = ({
  handleShowModalDelete,
  customDataTip,
  disabled,
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
          "w-6 h-6 bg-error rounded-md flex flex-row justify-center items-center disabled:opacity-50",
          !disabled && "hover-overlay",
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
