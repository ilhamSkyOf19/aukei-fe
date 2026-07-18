import { type FC } from "react";
import { cn } from "../../../utils/cn";
import { UserRound } from "lucide-react";
import { formatNumberPhone } from "../../../helpers/helpers";
import type { IPelangganType } from "../../../models/pelanggan.model";
import type { PayloadPenggunaInternalType } from "../../../models/penggunaInternal.model";
import Avatar from "../Avatar";

type Props = {
  pelanggan?: Pick<IPelangganType, "id" | "noWa" | "nama"> | null;
  kasir?: PayloadPenggunaInternalType | null;
  rowSpanCustom?: string;
  colSpanCustom?: string;
};
const HeaderPelangganForKasir: FC<Props> = ({
  kasir,
  pelanggan,
  colSpanCustom,
  rowSpanCustom,
}) => {
  return (
    <div
      className={cn(
        "w-full flex flex-row justify-between items-center border rounded-xl p-2.5 border-transparent bg-base-100 shadow-sm dark:border-base-content/10 h-15",
        rowSpanCustom,
        colSpanCustom,
      )}
    >
      <div className="w-full flex flex-row justify-between items-center">
        {/* pelanggan */}
        {pelanggan !== null ? (
          <div className="flex flex-row justify-start items-center gap-6">
            <div className="flex flex-row justify-start items-center gap-2">
              <Avatar nama={pelanggan?.nama ?? ""} index={pelanggan?.id} sm />
              <div className="flex flex-col justify-start items-start gap-1">
                {/* name */}
                <span className="text-base-content font-semibold text-sm">
                  {pelanggan?.nama}
                </span>
                {/* no telp */}
                <span className="text-base-content/80 font-medium text-xs">
                  {formatNumberPhone(pelanggan?.noWa ?? "")}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <span className="text-xs text-base-content">
            Pelanggan tidak tersedia
          </span>
        )}

        {/* kasir */}
        <div
          className={cn(
            "flex flex-row justify-start items-center gap-2 h-10 min-w-28 px-2 rounded-xl border transition-all duration-300 ease-in-out border-base-content/10",
          )}
        >
          <div
            className={cn(
              "w-7 h-7 dark:border-base-content/10 rounded-lg flex justify-center items-center bg-base-300 border border-transparent",
            )}
          >
            <UserRound className={cn("size-4 text-base-content")} />
          </div>
          <div className="flex flex-col justify-start items-start">
            <span
              className={cn("text-[0.625rem] font-medium text-base-content/50")}
            >
              Kasir
            </span>
            <span className={cn("text-xs font-medium text-base-content")}>
              {kasir?.nama}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderPelangganForKasir;
