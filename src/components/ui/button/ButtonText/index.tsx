import type { FC } from "react";
import { cn } from "../../../../utils/cn";

type Props = {
  label?: string;
  disable?: boolean;
  isLoading?: boolean;
  typeButton?: boolean;
  handleClick?: () => void;
  customWidth?: string;
  bgColor?: string;
  textColor?: string;
};

const ButtonText: FC<Props> = ({
  disable,
  typeButton,
  label,
  isLoading,
  handleClick,
  customWidth,
  bgColor,
  textColor,
}) => {
  return (
    <button
      type={typeButton ? "button" : "submit"}
      className={cn(
        "h-10.5 md:h-9 text-xs px-4 font-semibold  disabled:opacity-50 rounded-xl shadow-sm",
        customWidth ?? "w-auto",
        bgColor ?? " bg-custom-primary",
        textColor ?? "text-custom-secondary ",
        !disable && "hover-overlay",
      )}
      disabled={disable || isLoading}
      style={{ cursor: disable ? "not-allowed" : "pointer" }}
      onClick={() => handleClick?.()}
    >
      {isLoading ? (
        <div className="loading loading-xs" />
      ) : (
        <span className="text-xs md:text-[0.7rem]">{label || "Simpan"}</span>
      )}
    </button>
  );
};

export default ButtonText;
