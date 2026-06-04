import { type FC } from "react";
import DropDown from "../../inputs/DropDown";
import useKategoriForChoose from "../../../hooks/useKategoriForChoose";

type Props = {
  setKategori: (value: string) => void;
};
const FilterKategori: FC<Props> = ({ setKategori }) => {
  //   query kategori
  const { dataKategori, isLoadingKategori } = useKategoriForChoose();

  return (
    <div className="w-auto flex flex-row justify-start items-center">
      <DropDown
        handleChange={(e) => setKategori(e.target.value)}
        listChoose={[
          ...(dataKategori?.data?.map((item) => ({
            label: item.nama,
            value: item.id.toString(),
          })) ?? []),
          {
            label: "Semua",
            value: "semua",
          },
        ]}
        placeholder="Kategori"
        isLoading={isLoadingKategori}
        fontWeight="lg:font-medium"
      />
    </div>
  );
};

export default FilterKategori;
