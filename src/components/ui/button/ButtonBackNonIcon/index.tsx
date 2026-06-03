import { type FC } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  disabled?: boolean;
  label?: string;
};
const ButtonBackNonIcon: FC<Props> = ({ disabled, label }) => {
  // navigate
  const navigate = useNavigate();

  return (
    <button
      type="button"
      disabled={disabled}
      className="btn btn-sm lg:btn-md font-medium"
      onClick={() => navigate(-1)}
    >
      {label || "Kembali"}
    </button>
  );
};

export default ButtonBackNonIcon;
