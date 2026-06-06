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
  size?: "xs";
  customWidth?: string;
};
const ButtonWithIcon: FC<Props> = ({
  bgColor,
  label,
  textColor,
  link,
  handleBtn,
  isLoading,
  icon: Icon,
  size,
  customWidth,
}) => {
  // navigation
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={cn(
        "flex justify-center items-center hover-overlay rounded-md px-3 gap-2",
        bgColor ? bgColor : "bg-custom-primary",
        size === "xs" ? "h-9" : "h-8 lg:h-8.5",
        customWidth ? customWidth : "w-auto",
      )}
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
              "loading text-primary-white",
              size ? "loading-xs" : "loading-sm",
            )}
          />
        </div>
      ) : (
        <>
          {Icon ? (
            <Icon
              className={cn(
                "lg size-4",
                textColor ? textColor : "text-custom-secondary",
              )}
            />
          ) : (
            <Plus
              className={cn(
                "lg",
                size ? "size-4" : "size-4.5 lg:size-5",
                textColor ? textColor : "text-custom-secondary",
              )}
            />
          )}

          <span
            className={cn(
              "font-medium",
              textColor ? textColor : "text-custom-secondary",
              size ? "text-xs" : "text-[0.625rem] lg:text-xs",
            )}
          >
            {label ? label : "Tambah"}
          </span>
        </>
      )}
    </button>
  );
};

export default ButtonWithIcon;
