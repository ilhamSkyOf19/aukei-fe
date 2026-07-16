import type { FC } from "react";
import { cn } from "../../../../utils/cn";

type Props = {
  isActive: boolean;
  label: string;
  handleActive: (active: any) => void;
  customWidth?: string;
};
const ButtonCluster: FC<Props> = ({
  isActive,
  label,
  handleActive,
  customWidth,
}) => {
  return (
    <button
      type="button"
      className={cn(
        "shrink-0 md:flex-1 flex flex-row border transition-all duration-200 ease-in-out border-transparent justify-center items-center h-full relative rounded-2xl md:rounded-xl",
        customWidth ? customWidth : "w-30",
        isActive
          ? "bg-custom-secondary text-primary-white"
          : "text-base-content border hover:border-custom-secondary group",
      )}
      onClick={() => handleActive(label)}
    >
      <span className=" font-semibold text-xs  group-hover:text-custom-secondary">
        {label}
      </span>
    </button>
  );
};

export default ButtonCluster;
