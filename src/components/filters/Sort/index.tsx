import { type FC } from "react";
import DropDown from "../../inputs/DropDown";
import { cn } from "../../../utils/cn";

type Props = {
  setSort: (value: string) => void;
  customWidth?: string;
  value?: string;
  noLabel?: boolean;
};
const FilterSort: FC<Props> = ({ setSort, customWidth, value, noLabel }) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 justify-start items-start",
        customWidth ? customWidth : "w-40",
      )}
    >
      {!noLabel && (
        <span className="text-xs text-base-content/80 font-medium">
          Urutkan
        </span>
      )}
      <DropDown
        handleChange={(e) => setSort(e.target.value)}
        listChoose={[
          { value: "asc", label: "Terlama" },
          { value: "desc", label: "Terbaru" },
        ]}
        placeholder="Urutkan"
        value={value || "asc"}
      />
    </div>
  );
};

export default FilterSort;
