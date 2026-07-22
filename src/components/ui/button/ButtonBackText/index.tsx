import { ArrowLeft } from "lucide-react";
import { type FC } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  label?: string;
  link?: string;
  handleClick?: () => void;
};

const ButtonBackText: FC<Props> = ({ label, link, handleClick }) => {
  // navigate
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="py-2 text-base-content rounded-xl flex flex-row justify-start items-center gap-2 bg-base-100 shadow-xs border border-base-content/10 px-2.5 hover-overlay shrink-0"
      onClick={() => {
        if (handleClick) {
          handleClick();
        } else if (link) {
          navigate(link);
        } else {
          navigate(-1);
        }
      }}
    >
      <ArrowLeft className="size-4" />
      <span className="text-xs">{label || "Kembali"}</span>
    </button>
  );
};

export default ButtonBackText;
