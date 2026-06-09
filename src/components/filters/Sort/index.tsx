import { type FC } from "react";
import DropDown from "../../inputs/DropDown";

type Props = {
  setSort: (value: string) => void;
};
const FilterSort: FC<Props> = ({ setSort }) => {
  return (
    <div className="w-40 flex flex-row justify-start items-center">
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
