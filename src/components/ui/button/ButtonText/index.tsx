import type { FC } from "react";
import { cn } from "../../../../utils/cn";

type Props = {
  handleClick?: () => void;
  label?: string;
  disable?: boolean;
  isLoading?: boolean;
  bgColor?: string;
  textColor?: string;
  customHeight?: string;
  customWidth?: string;
};

const ButtonText: FC<Props> = ({
  disable,
  label,
  isLoading,
  bgColor,
  textColor,
  handleClick,
  customHeight,
  customWidth,
}) => {
  return (
    <button
      type="button"
      className={cn(
        "rounded-2xl md:rounded-xl px-4 text-xs lg:text-sm font-semibold hover-overlay disabled:opacity-50 shadow-xs",
        bgColor,
        textColor,
        customHeight ? customHeight : "h-10.5 md:h-10",
        customHeight,
        customWidth,
      )}
      disabled={disable || isLoading}
      onClick={() => handleClick?.()}
    >
      {isLoading ? (
        <div className="loading loading-xs" />
      ) : (
        <span className="text-xs md:text-xs lg:text-[0.625rem] xl:text-xs">
          {label || "Simpan"}
        </span>
      )}
    </button>
  );
};

export default ButtonText;
