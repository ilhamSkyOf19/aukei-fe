import { Trash2 } from "lucide-react";
import type { FC } from "react";

type Props = {
  handleShowModalDelete: () => void;
  customDataTip?: string;
  disabled?: boolean;
};
const ButtonDeleteTable: FC<Props> = ({
  handleShowModalDelete,
  customDataTip,
  disabled,
}) => {
  return (
    <div className="tooltip z-10" data-tip={customDataTip ?? "hapus"}>
      {/* update */}
      <button
        type="button"
        disabled={disabled}
        className="w-7 h-7 bg-error rounded-md flex flex-row justify-center items-center hover-overlay"
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        onClick={() => handleShowModalDelete()}
      >
        <Trash2 className="size-3.5 text-primary-white" />
      </button>
    </div>
  );
};

export default ButtonDeleteTable;
