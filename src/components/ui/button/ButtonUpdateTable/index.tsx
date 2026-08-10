import { Pencil } from "lucide-react";
import type { FC } from "react";
import { cn } from "../../../../utils/cn";

type Props = {
  handleShowModalFormulir?: () => void;
  customDataTip?: string;
  noTip?: boolean;
  handleClick?: () => void;
};
const ButtonUpdateTable: FC<Props> = ({
  handleShowModalFormulir,
  customDataTip,
  noTip,
  handleClick,
}) => {
  return (
    <div
      className="tooltip z-10"
      data-tip={!noTip ? (customDataTip ?? "ubah") : ""}
    >
      <button
        type="button"
        className={cn(
          "bg-info w-6 h-6 rounded-md flex flex-row justify-center items-center hover-overlay",
        )}
        onClick={() => {
          handleShowModalFormulir?.();
          handleClick?.();
        }}
      >
        <Pencil className="size-3 text-primary-white" />
      </button>
    </div>
  );
};

export default ButtonUpdateTable;
