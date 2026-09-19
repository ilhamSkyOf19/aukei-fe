import { PencilLineIcon } from "lucide-react";
import type { FC } from "react";
import { cn } from "../../../../utils/cn";

type Props = {
  handleKeyUpdate: () => void;
  customHidden?: string;
  disabled?: boolean;
};

const ButtonInline: FC<Props> = ({
  handleKeyUpdate,
  customHidden,
  disabled,
}) => {
  return (
    <div
      className={cn("tooltip", customHidden ? customHidden : "hidden lg:block")}
      data-tip={disabled ? "tidak dapat diubah" : "ubah"}
    >
      <button disabled={disabled} type="button" onClick={handleKeyUpdate}>
        <PencilLineIcon className="size-4 text-info" />
      </button>
    </div>
  );
};

export default ButtonInline;
