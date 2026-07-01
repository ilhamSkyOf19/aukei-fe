import { type FC } from "react";
import { cn } from "../../../utils/cn";

type Props = {
  title: string;
  keterangan: string;
  textWhite?: boolean;
};
const TitleModalFormulir: FC<Props> = ({ keterangan, title, textWhite }) => {
  return (
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
  );
};

export default TitleModalFormulir;
