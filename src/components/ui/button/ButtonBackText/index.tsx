import { ArrowLeft } from "lucide-react";
import { type FC } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  label?: string;
  link?: string;
};

const ButtonBackText: FC<Props> = ({ label, link }) => {
  // navigate
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="py-1 text-base-content/50 hover:text-base-content rounded-sm flex flex-row justify-start items-center gap-2 transition-color duration-300 ease-in-out"
      onClick={() => {
        if (link) {
          navigate(link);
        } else {
          navigate(-1);
        }
      }}
    >
      <ArrowLeft className="size-5" />
      <span className="text-sm hidden lg:block">{label || "Kembali"}</span>
    </button>
  );
};

export default ButtonBackText;
