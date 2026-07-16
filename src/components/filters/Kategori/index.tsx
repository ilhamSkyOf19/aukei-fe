import { type FC } from "react";
import DropDown from "../../inputs/DropDown";
import useKategoriForChoose from "../../../hooks/useKategoriForChoose";
import { cn } from "../../../utils/cn";
import { Settings2 } from "lucide-react";

type Props = {
  setKategori: (value: string) => void;
  customWidth?: string;
  value?: string;
  noLabel?: boolean;
  withIcon?: boolean;
};
const FilterKategori: FC<Props> = ({
  setKategori,
  customWidth,
  value,
  noLabel,
  withIcon,
}) => {
  //   query kategori
  const { dataKategori, isLoadingKategori } = useKategoriForChoose();

  return (
    <div
      className={cn(
        "flex gap-1.5 justify-start",
        customWidth ? customWidth : "w-auto",
        withIcon ? "flex-row items-center" : "flex-col items-start",
      )}
    >
      {!noLabel && (
        <span className="text-xs text-base-content/80 font-medium">
          Kategori
        </span>
      )}

      {/* with icon */}
      {withIcon && <Settings2 className="size-8 stroke-1 text-base-content" />}
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
        value={value || "semua"}
      />
    </div>
  );
};

export default FilterKategori;
