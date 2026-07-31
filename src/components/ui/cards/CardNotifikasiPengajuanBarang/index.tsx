import { ChevronRight, Clock } from "lucide-react";
import { type FC } from "react";
import { formatTimeAgo } from "../../../../helpers/helpers";
import { inventoryNotification } from "../../../../types/constant.type";
import { cn } from "../../../../utils/cn";
import type { ResponsePengajuanBarangType } from "../../../../models/pengajuanBarang.model";

type Props = {
  data: Pick<
    ResponsePengajuanBarangType,
    | "author"
    | "barangKeluarId"
    | "barangMasukId"
    | "updatedAt"
    | "keterangan"
    | "status"
    | "id"
  >;
  handleRedirectPengajuanBarangDetail: (params: {
    barangMasukId?: number;
    barangKeluarId?: number;
  }) => void;
};
const CardNotifikasiPengajuanBarang: FC<Props> = ({
  data: {
    author,
    updatedAt,
    keterangan,
    status,
    barangKeluarId,
    barangMasukId,
  },
  handleRedirectPengajuanBarangDetail,
}) => {
  const Icon = inventoryNotification[status].icon;

  // SESUAIKAN DATA NYA

  return (
    <div className="w-full border border-base-content/10 rounded-2xl md:rounded-xl flex flex-row justify-between items-center p-0 hover:bg-base-300 duration-150 ease-in-out">
      <button
        type="button"
        className="w-full h-full p-2.5 flex flex-row justify-between items-center gap-2.5"
        onClick={() =>
          handleRedirectPengajuanBarangDetail({
            barangMasukId: barangMasukId ?? undefined,
            barangKeluarId: barangKeluarId ?? undefined,
          })
        }
      >
        <div className="w-full flex flex-row justify-start items-center gap-4">
          {/* icon */}
          <div
            className={cn(
              "w-11 h-11 shrink-0 rounded-full flex flex-col justify-center items-center",
              inventoryNotification[status].bg,
            )}
          >
            <Icon
              className={cn("size-4", inventoryNotification[status].color)}
            />
          </div>

          <div className="flex flex-col justify-start items-start">
            <div className="flex flex-col justify-start items-start gap-0.5">
              <div className="flex gap-2.5 flex-row justify-start items-center">
                <span
                  className={cn("status", inventoryNotification[status].bullet)}
                />

                <span className="text-[0.7rem] font-medium text-base-content">
                  {inventoryNotification[status].title}
                </span>
              </div>

              {/* status */}
              <div className="flex text-left flex-row justify-start items-start gap-1.5">
                {/* nama */}
                <span className="text-[0.625rem] shrink-0 font-medium text-base-content">
                  {author.nama}
                </span>
                {/* keterangan */}
                <span className="text-[0.625rem] text-base-content">
                  {keterangan}
                </span>
              </div>
            </div>

            <div className="w-full flex flex-row justify-start items-center gap-2 mt-2">
              <div className="flex flex-row justify-start items-center gap-2 pr-4 border-r border-base-content/30">
                <Clock className="size-3 text-base-content/70" />
                <span className="text-[0.625rem] text-base-content/70">
                  {formatTimeAgo(updatedAt)}
                </span>
              </div>
              <span
                className={cn(
                  "text-[0.625rem] font-medium",
                  barangMasukId ? "text-emerald-500" : "text-rose-500",
                )}
              >
                {barangMasukId ? "Barang Masuk" : "Barang Keluar"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-start items-center">
          <ChevronRight className="size-5 text-base-content" />
        </div>
      </button>
    </div>
  );
};

export default CardNotifikasiPengajuanBarang;
