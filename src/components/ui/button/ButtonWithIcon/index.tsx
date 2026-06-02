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
};
const ButtonAdd: FC<Props> = ({
  bgColor,
  label,
  textColor,
  link,
  handleBtn,
  isLoading,
  icon: Icon,
  size,
}) => {
  // navigation
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={cn(
        "flex justify-center items-center hover-overlay w-auto rounded-md px-3 gap-2",
        bgColor ? bgColor : "bg-custom-primary",
        size === "xs" ? "h-9" : "h-9.5",
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
                "text-custom-secondary lg",
                size ? "size-4" : "size-5",
              )}
            />
          ) : (
            <Plus
              className={cn(
                "text-custom-secondary lg",
                size ? "size-4" : "size-5",
              )}
            />
          )}

          <span
            className={cn(
              "font-medium",
              textColor ? textColor : "text-custom-secondary",
              size ? "text-xs" : "text-xs",
            )}
          >
            {label ? label : "Tambah"}
          </span>
        </>
      )}
    </button>
  );
};

export default ButtonAdd;
