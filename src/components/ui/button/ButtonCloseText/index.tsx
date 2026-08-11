import { type FC } from "react";
import { cn } from "../../../../utils/cn";

type Props = {
  handleClose: () => void;
  disabled?: boolean;
  label?: string;
};
const ButtonCloseText: FC<Props> = ({ handleClose, disabled, label }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "h-10.5 md:h-9 rounded-xl border border-base-content/10 bg-base-100 shadow-xs px-4 text-xs md:text-[0.7rem] font-medium text-base-content",
        !disabled && "hover-overlay",
      )}
      onClick={() => handleClose()}
    >
      {label || "Tutup"}
    </button>
  );
};

export default ButtonCloseText;
