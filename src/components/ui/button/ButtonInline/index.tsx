import { PencilLineIcon } from "lucide-react";
import type { FC } from "react";
import { cn } from "../../../../utils/cn";

type Props = {
  handleKeyUpdate: () => void;
  customHidden?: string;
};

const ButtonInline: FC<Props> = ({ handleKeyUpdate, customHidden }) => {
  return (
    <div
      className={cn("tooltip", customHidden ? customHidden : "hidden lg:block")}
      data-tip="ubah"
    >
      <button type="button" onClick={handleKeyUpdate}>
        <PencilLineIcon className="size-4 text-info" />
      </button>
    </div>
  );
};

export default ButtonInline;
