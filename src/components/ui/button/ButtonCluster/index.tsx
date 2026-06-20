import type { FC } from "react";
import { cn } from "../../../../utils/cn";

type Props = {
  isActive: boolean;
  label: string;
  handleActive: (active: any) => void;
};
const ButtonCluster: FC<Props> = ({ isActive, label, handleActive }) => {
  return (
    <button
      type="button"
      className={cn(
        "w-30 shrink-0 md:flex-1 flex flex-row justify-center items-center h-full relative rounded-md",
        isActive
          ? "bg-custom-secondary text-primary-white transition-all duration-200 ease-in-out"
          : "text-base-content before:content-[''] before:absolute before:h-0.5 before:w-full before:bg-custom-secondary/50 before:bottom-0 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100 group",
      )}
      onClick={() => handleActive(label)}
    >
      <span className=" font-semibold text-xs lg:text-sm  group-hover:text-custom-secondary">
        {label}
      </span>
    </button>
  );
};

export default ButtonCluster;
