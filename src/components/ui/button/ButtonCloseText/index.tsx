import { type FC } from "react";

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
      className="h-10.5 md:h-10 rounded-xl hover-overlay border border-base-content/10 bg-base-100 shadow-xs px-4 text-xs font-medium text-base-content"
      onClick={() => handleClose()}
    >
      {label || "Tutup"}
    </button>
  );
};

export default ButtonCloseText;
