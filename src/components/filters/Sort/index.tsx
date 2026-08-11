import { type FC } from "react";
import DropDown from "../../inputs/DropDown";
import { cn } from "../../../utils/cn";

type Props = {
  setSort: (value: string) => void;
  customWidth?: string;
  value?: string;
  noLabel?: boolean;
  customLabel?: {
    0: string;
    1: string;
  };
  customTitle?: string;
  isLoading?: boolean;
};
const FilterSort: FC<Props> = ({
  setSort,
  customWidth,
  value,
  noLabel,
  customLabel,
  customTitle,
  isLoading,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 justify-start items-start",
        customWidth ? customWidth : "w-40",
        isLoading && "skeleton h-10.5 md:h-8.5",
      )}
    >
      {!isLoading && (
        <>
          {!noLabel && (
            <span className="text-xs text-base-content/80 font-medium">
              {customTitle ?? "Urutkan"}
            </span>
          )}
          <DropDown
            handleChange={(e) => setSort(e.target.value)}
            listChoose={[
              { value: "asc", label: customLabel ? customLabel[0] : "Terlama" },
              {
                value: "desc",
                label: customLabel ? customLabel[1] : "Terbaru",
              },
            ]}
            placeholder="Urutkan"
            value={value}
          />
        </>
      )}
    </div>
  );
};

export default FilterSort;
