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
        "flex flex-col gap-1.5 justify-start items-start",
        customWidth ? customWidth : "w-auto",
      )}
    >
      <span className="text-xs text-base-content/80 font-medium">Kategori</span>
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
        defaultValue="semua"
      />
    </div>
  );
};

export default FilterKategori;
