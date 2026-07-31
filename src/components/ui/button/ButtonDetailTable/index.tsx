import { Eye } from "lucide-react";
import type { FC } from "react";

type Props = {
  handleRedirect: () => void;
  customDataTip?: string;
};
const ButtonDetailTable: FC<Props> = ({ handleRedirect, customDataTip }) => {
  return (
    <div className="tooltip z-2" data-tip={customDataTip ?? "detail"}>
      {/* detail transaksi */}
      <button
        type="button"
        className="w-7 h-7 bg-custom-primary rounded-md flex flex-row justify-center items-center hover-overlay"
        onClick={() => handleRedirect()}
      >
        <Eye className="size-3.5 text-custom-secondary" />
      </button>
    </div>
  );
};

export default ButtonDetailTable;
