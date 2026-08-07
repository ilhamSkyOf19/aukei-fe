import { type FC } from "react";
import DropDown from "../../inputs/DropDown";
import { cn } from "../../../utils/cn";

type Props = {
  setMetode: (value: string) => void;
  customWidth?: string;
  value?: string;
  notTempo?: boolean;
};
const MetodePembayaran: FC<Props> = ({
  setMetode,
  customWidth,
  value,
  notTempo,
}) => {
  const listMetode: { value: string; label: string }[] = [
    { value: "cash", label: "Tunai" },
    { value: "transfer", label: "Transfer" },
    { value: "qris", label: "QRIS" },
    { value: "tempo", label: "Tempo" },
    { value: "semua", label: "Semua" },
  ];
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 justify-start items-start",
        customWidth ? customWidth : "w-40",
      )}
    >
      <span className="text-xs text-base-content/80 font-medium">Metode</span>
      <DropDown
        handleChange={(e) => setMetode(e.target.value)}
        listChoose={
          notTempo
            ? listMetode.filter((item) => item.value !== "tempo")
            : listMetode
        }
        placeholder="Metode"
        value={value || "semua"}
      />
    </div>
  );
};

export default MetodePembayaran;
