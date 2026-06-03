import { ArrowLeft } from "lucide-react";
import { type FC } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  label?: string;
};

const ButtonBackText: FC<Props> = ({ label }) => {
  // navigate
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="p-0.5 flex flex-row justify-start items-center gap-2"
      onClick={() => navigate(-1)}
    >
      <ArrowLeft className="size-6" />
      <span className="text-sm text-base-content hidden lg:block">
        {label || "Kembali"}
      </span>
    </button>
  );
};

export default ButtonBackText;
