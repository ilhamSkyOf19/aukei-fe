import type { LucideIcon } from "lucide-react";
import { type FC } from "react";
import { cn } from "../../../../utils/cn";

type Props = {
  icon: LucideIcon;
  label: string;
  handleClick: () => void;
  textColor?: string;
  iconColor?: string;
  buttonColor?: string;
};
const ButtonActionWithIcon: FC<Props> = ({
  handleClick,
  icon: Icon,
  label,
  iconColor,
  textColor,
  buttonColor,
}) => {
  return (
    <button
      type="button"
      className={cn(
        "btn btn-sm lg:btn-md hover-overlay flex flex-row justify-start items-center gap-1.5",
        buttonColor,
      )}
      onClick={() => {
        handleClick();
      }}
    >
      {/* icon */}
      <Icon
        className={cn("size-4", iconColor ? iconColor : "text-base-content")}
      />

      {/* label */}
      <span
        className={cn(
          "text-xs lg:text-sm",
          textColor ? textColor : "text-base-content",
        )}
      >
        {label}
      </span>
    </button>
  );
};

export default ButtonActionWithIcon;
