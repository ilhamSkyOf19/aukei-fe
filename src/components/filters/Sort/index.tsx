import { type FC } from "react";
import DropDown from "../../inputs/DropDown";
import { cn } from "../../../utils/cn";

type Props = {
  setSort: (value: string) => void;
  customWidth?: string;
};
const FilterSort: FC<Props> = ({ setSort, customWidth }) => {
  return (
    <div
      className={cn(
        "flex flex-row justify-start items-center",
        customWidth ? customWidth : "w-40",
      )}
    >
      <DropDown
        handleChange={(e) => setSort(e.target.value)}
        listChoose={[
          { value: "asc", label: "Terlama" },
          { value: "desc", label: "Terbaru" },
        ]}
        placeholder="Urutkan"
      />
    </div>
  );
};

export default FilterSort;
