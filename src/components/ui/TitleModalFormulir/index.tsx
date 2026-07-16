import { type FC } from "react";
import { cn } from "../../../utils/cn";
import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  keterangan: string;
  textWhite?: boolean;
  withIcon?: {
    icon: LucideIcon;
  };
};
const TitleModalFormulir: FC<Props> = ({
  keterangan,
  title,
  textWhite,
  withIcon,
}) => {
  return (
    <div className="w-full flex flex-row justify-start items-center gap-4">
      {/* icon */}
      {withIcon && (
        <div className="w-12 md:w-14 h-12 bg-custom-primary/50 flex rounded-lg flex-row justify-center items-center shrink-0">
          <withIcon.icon className="text-custom-secondary size-5 lg:size-6" />
        </div>
      )}
      <div className="w-full flex flex-col justify-start items-start">
        <h1
          className={cn(
            `font-semibold text-base lg:text-lg`,
            textWhite ? "text-white" : "text-base-content",
          )}
        >
          {title}
        </h1>

        <p
          className={cn(
            "text-xs font-medium",
            textWhite ? "text-white" : "text-base-content/50",
          )}
        >
          {keterangan}
        </p>
      </div>
    </div>
  );
};

export default TitleModalFormulir;
