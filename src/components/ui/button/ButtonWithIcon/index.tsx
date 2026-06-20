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
  customClass?: string;
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
  customClass,
}) => {
  // navigation
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={cn(
        "flex justify-center h-10.5 md:h-9 items-center hover-overlay rounded-md px-3 gap-2",
        bgColor ? bgColor : "bg-custom-primary",
        customWidth ? customWidth : "w-auto",
        customClass,
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
          <div className={cn("loading loading-sm text-primary-white")} />
        </div>
      ) : (
        <>
          {Icon ? (
            <Icon
              className={cn(
                "size-4",
                textColor ? textColor : "text-custom-secondary",
              )}
            />
          ) : (
            <Plus
              className={cn(
                "size-5",
                textColor ? textColor : "text-custom-secondary",
              )}
            />
          )}

          <span
            className={cn(
              "font-medium text-xs",
              textColor ? textColor : "text-custom-secondary",
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
