import type { FC } from "react";
import { cn } from "../../../../utils/cn";

type Props = {
  handleClick?: () => void;
  label?: string;
  disable?: boolean;
  isLoading?: boolean;
  bgColor?: string;
  textColor?: string;
};

const ButtonText: FC<Props> = ({
  disable,
  label,
  isLoading,
  bgColor,
  textColor,
  handleClick,
}) => {
  return (
    <button
      type="button"
      className={cn(
        "btn btn-sm lg:btn-md px-4 text-xs lg:text-sm font-semibold hover-overlay disabled:opacity-50",
        bgColor,
        textColor,
      )}
      disabled={disable || isLoading}
      onClick={() => handleClick?.()}
    >
      {isLoading ? (
        <div className="loading loading-xs" />
      ) : (
        <span>{label || "Simpan"}</span>
      )}
    </button>
  );
};

export default ButtonText;
