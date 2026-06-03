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
      className="btn btn-sm lg:btn-md font-medium"
      onClick={() => handleClose()}
    >
      {label || "Tutup"}
    </button>
  );
};

export default ButtonCloseText;
