import { type FC } from "react";
import { cn } from "../../utils/cn";

type Props = {
  isActive?: boolean | null;
};
const StatusPelanggan: FC<Props> = ({ isActive }) => {
  return (
    <p
      className={cn(
        "px-2 py-0.5  font-medium text-[0.625rem] rounded-md flex justify-center items-center",
        isActive
          ? "bg-emerald-100 text-emerald-600"
          : "bg-rose-100 text-rose-400",
      )}
    >
      {isActive ? "Aktif" : "Tidak Aktif"}
    </p>
  );
};

export default StatusPelanggan;
