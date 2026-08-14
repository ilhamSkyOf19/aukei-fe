import { type LucideIcon } from "lucide-react";
import { type FC, type RefObject } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../../../utils/cn";

type Props = {
  bgColor?: string;
  textColor?: string;
  label?: string;
  link?: string;
  handleBtn?: () => void;
  isLoading?: boolean;
  icon?: LucideIcon;
  reverse?: boolean;
  noLabel?: boolean;
  disabled?: boolean;
  customWidth?: string;
  customHeight?: string;
  ref?: RefObject<HTMLButtonElement | null>;
  classHidden?: string;
  typeButton?: "submit";
  skeleton?: boolean;
};

const ButtonWithIcon: FC<Props> = ({
  bgColor,
  label,
  textColor,
  link,
  handleBtn,
  isLoading,
  icon: Icon,
  reverse,
  noLabel,
  disabled,
  customWidth,
  ref,
  classHidden,
  typeButton,
  skeleton,
  customHeight,
}) => {
  const navigate = useNavigate();

  return (
    <button
      ref={ref}
      type={typeButton ?? "button"}
      disabled={disabled || isLoading || skeleton}
      className={cn(
        "flex-row shrink-0 justify-center items-center rounded-xl px-3 gap-2",
        classHidden ?? "flex",
        customWidth ?? "w-auto",
        disabled || isLoading || skeleton ? "opacity-50" : "hover-overlay",
        skeleton ? "skeleton w-20" : (bgColor ?? "bg-custom-primary"),
        customHeight ?? "h-10.5 md:h-9",
      )}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
      onClick={() => {
        if (handleBtn) {
          handleBtn();
        } else if (link) {
          navigate(link);
        }
      }}
    >
      {!skeleton && (
        <>
          {isLoading ? (
            <div className="w-20">
              <div
                className={cn(
                  "loading loading-sm md:loading-xs",
                  textColor ?? "text-custom-secondary",
                )}
              />
            </div>
          ) : (
            <>
              {Icon && (
                <Icon
                  className={cn(
                    "size-4.5 md:size-3.5 shrink-0",
                    textColor ?? "text-custom-secondary",
                    reverse && "order-2",
                  )}
                />
              )}

              {!noLabel && (
                <span
                  className={cn(
                    "font-medium text-xs md:text-[0.7rem]",
                    textColor ?? "text-custom-secondary",
                    reverse && "order-1",
                  )}
                >
                  {label ? label : "Tambah"}
                </span>
              )}
            </>
          )}
        </>
      )}
    </button>
  );
};

export default ButtonWithIcon;
