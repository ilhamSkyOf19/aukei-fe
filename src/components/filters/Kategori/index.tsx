import { type FC } from "react";
import DropDown from "../../inputs/DropDown";
import useKategoriForChoose from "../../../hooks/useKategoriForChoose";
import { cn } from "../../../utils/cn";

type Props = {
  setKategori: (value: string) => void;
  customWidth?: string;
};
const FilterKategori: FC<Props> = ({ setKategori, customWidth }) => {
  //   query kategori
  const { dataKategori, isLoadingKategori } = useKategoriForChoose();

  return (
    <div
      className={cn(
        "flex flex-row justify-start items-center",
        customWidth ? customWidth : "w-auto",
      )}
    >
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
