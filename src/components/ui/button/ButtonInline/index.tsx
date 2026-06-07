import { PencilLineIcon } from "lucide-react";
import type { FC } from "react";

type Props = {
  handleKeyUpdate: () => void;
};

const ButtonInline: FC<Props> = ({ handleKeyUpdate }) => {
  return (
    <div className="tooltip hidden lg:block" data-tip="ubah">
      <button type="button" onClick={handleKeyUpdate}>
        <PencilLineIcon className="size-4 text-info" />
      </button>
    </div>
  );
};

export default ButtonInline;
