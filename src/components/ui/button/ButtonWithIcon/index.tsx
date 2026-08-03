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
  ref?: RefObject<HTMLButtonElement | null>;
  classHidden?: string;
  typeButton?: "submit";
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
}) => {
  const navigate = useNavigate();

  return (
    <button
      ref={ref}
      type={typeButton ?? "button"}
      disabled={disabled ?? isLoading}
      className={cn(
        "flex-row shrink-0 justify-center items-center rounded-xl px-3 gap-2 h-10.5 md:h-9",
        classHidden ?? "flex",
        customWidth ?? "w-auto",
        bgColor ?? "bg-custom-primary",
        (disabled ?? isLoading) ? "opacity-50" : "hover-overlay",
      )}
      style={{ cursor: (disabled ?? isLoading) ? "not-allowed" : "pointer" }}
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
                "size-4.5 md:size-3.5",
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
    </button>
  );
};

export default ButtonWithIcon;
