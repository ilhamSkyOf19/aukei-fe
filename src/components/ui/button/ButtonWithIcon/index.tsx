import { Plus, type LucideIcon } from "lucide-react";
import { type FC } from "react";
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
  customWidth?: string;
  customHeight?: string;
  customClass?: string;
  customSize?: "lg";
  reverse?: boolean;
  noLabel?: boolean;
  disabled?: boolean;
};
const ButtonWithIcon: FC<Props> = ({
  bgColor,
  label,
  textColor,
  link,
  handleBtn,
  isLoading,
  icon: Icon,
  customWidth,
  customHeight,
  customClass,
  reverse,
  customSize,
  noLabel,
  disabled,
}) => {
  // navigation
  const navigate = useNavigate();

  return (
    <button
      type="button"
      disabled={disabled ?? isLoading}
      className={cn(
        "flex justify-center items-center rounded-md px-3 gap-2",
        bgColor ? bgColor : "bg-custom-primary",
        customWidth ? customWidth : "w-auto",
        customClass,
        customHeight ? customHeight : "h-10.5 lg:h-9 xl:h-9",
        (disabled ?? isLoading) ? "opacity-50" : "hover-overlay",
      )}
      style={{ cursor: (disabled ?? isLoading) ? "not-allowed" : "pointer" }}
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
              "loading",
              customSize ? "loading-md" : "loading-sm",
              textColor ? textColor : "text-custom-secondary",
            )}
          />
        </div>
      ) : (
        <>
          {Icon ? (
            <Icon
              className={cn(
                customSize ? "size-6" : "size-4.5 md:size-3.5 xl:size-4",
                textColor ? textColor : "text-custom-secondary",
                reverse && "order-2",
              )}
            />
          ) : (
            <Plus
              className={cn(
                customSize ? "size-6" : "size-4.5 md:size-4.5 xl:size-5",
                textColor ? textColor : "text-custom-secondary",
                reverse && "order-2",
              )}
            />
          )}

          {!noLabel && (
            <span
              className={cn(
                "font-medium",
                customSize
                  ? "text-sm"
                  : "text-xs md:text-xs lg:text-[0.625rem] xl:text-xs",
                textColor ? textColor : "text-custom-secondary",
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
