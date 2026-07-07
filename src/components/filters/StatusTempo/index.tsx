import { type FC } from "react";
import DropDown from "../../inputs/DropDown";
import { cn } from "../../../utils/cn";

type Props = {
  setStatusTempo: (value: string) => void;
  customWidth?: string;
  value?: string;
};
const StatusTempo: FC<Props> = ({ setStatusTempo, customWidth, value }) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 justify-start items-start",
        customWidth ? customWidth : "w-40",
      )}
    >
      <span className="text-xs text-base-content/80 font-medium">
        Status Tempo
      </span>
      <DropDown
        handleChange={(e) => setStatusTempo(e.target.value)}
        listChoose={[
          { value: "unpaid", label: "Belum Lunas" },
          { value: "paid", label: "Lunas" },
          { value: "overdue", label: "Terlambat" },
          { value: "semua", label: "Semua" },
        ]}
        placeholder="Status Tempo"
        value={value || "semua"}
      />
    </div>
  );
};

export default StatusTempo;
