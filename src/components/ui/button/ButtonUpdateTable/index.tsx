import { Pencil } from "lucide-react";
import type { FC } from "react";

type Props = {
  handleShowModalFormulir: () => void;
  customDataTip?: string;
};
const ButtonUpdateTable: FC<Props> = ({
  handleShowModalFormulir,
  customDataTip,
}) => {
  return (
    <div className="tooltip z-10" data-tip={customDataTip ?? "ubah"}>
      <button
        type="button"
        className="w-7 h-7 bg-info rounded-md flex flex-row justify-center items-center hover-overlay"
        onClick={() => handleShowModalFormulir()}
      >
        <Pencil className="size-3.5 text-primary-white" />
      </button>
    </div>
  );
};

export default ButtonUpdateTable;
