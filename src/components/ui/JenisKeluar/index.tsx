import type { FC } from "react";
import { cn } from "../../../utils/cn";

type Props = {
  jenisKeluar: string;
};
const JenisKeluar: FC<Props> = ({ jenisKeluar }) => {
  return (
    <div className="flex flex-row justify-start items-center">
      <p
        className={cn(
          "text-xs rounded-md uppercase font-medium px-2 py-1",
          jenisKeluar.toLowerCase() === "rusak" ||
            jenisKeluar.toLowerCase() === "hilang"
            ? "text-rose-600 bg-rose-100"
            : jenisKeluar === "kadaluwarsa"
              ? "text-amber-600 bg-amber-100"
              : "text-base-content bg-gray-200",
        )}
      >
        {jenisKeluar}
      </p>
    </div>
  );
};

export default JenisKeluar;
