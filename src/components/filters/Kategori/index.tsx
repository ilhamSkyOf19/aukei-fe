import { type FC } from "react";
import DropDown from "../../inputs/DropDown";

type Props = {
  setKategori: (value: string) => void;
};
const FilterKategori: FC<Props> = ({ setKategori }) => {
  return (
    <div className="w-auto flex flex-row justify-start items-center">
      <DropDown
        handleChange={(e) => setKategori(e.target.value)}
        listChoose={[
          { value: "1", label: "Plafon" },
          { value: "2", label: "Paving" },
        ]}
        placeholder="Kategori"
      />
    </div>
  );
};

export default FilterKategori;
