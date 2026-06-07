import { type LucideIcon } from "lucide-react";
import type { FC } from "react";
import { cn } from "../../../../utils/cn";

type Props = {
  label: string;
  icon: LucideIcon;
  handleClick: () => void;
  color?: string;
};
const LabelButtonDropDownWithIcon: FC<Props> = ({
  handleClick,
  icon: Icon,
  label,
  color,
}) => {
  return (
    <button
      type="button"
      className={cn(
        "flex flex-row justify-start items-center gap-3",
        color ? color : "text-base-content",
      )}
      onClick={handleClick}
    >
      <Icon className="size-3.5" />
      <span className="font-medium text-[0.625rem] lg:text-xs">{label}</span>
    </button>
  );
};

export default LabelButtonDropDownWithIcon;
