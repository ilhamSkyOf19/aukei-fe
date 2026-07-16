import { Pencil } from "lucide-react";
import type { FC } from "react";
import { cn } from "../../../../utils/cn";

type Props = {
  handleShowModalFormulir: () => void;
  customDataTip?: string;
  xs?: boolean;
};
const ButtonUpdateTable: FC<Props> = ({
  handleShowModalFormulir,
  customDataTip,
  xs,
}) => {
  return (
    <div className="tooltip z-10" data-tip={customDataTip ?? "ubah"}>
      <button
        type="button"
        className={cn(
          "bg-info rounded-md flex flex-row justify-center items-center hover-overlay",
          xs ? "w-6 h-6" : "w-7 h-7",
        )}
        onClick={() => handleShowModalFormulir()}
      >
        <Pencil className="size-3.5 text-primary-white" />
      </button>
    </div>
  );
};

export default ButtonUpdateTable;
