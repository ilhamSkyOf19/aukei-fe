import { ChevronRight, Clock, Eye } from "lucide-react";
import { type FC } from "react";
import { formatTimeAgo } from "../../../../helpers/helpers";
import { returBarangNotification } from "../../../../types/constant.type";
import { cn } from "../../../../utils/cn";
import ButtonWithIcon from "../../button/ButtonWithIcon";
import type { ResponseRiwayatPengajuanReturnForHighlightType } from "../../../../models/riwayatPengajuanReturBarang.model";

type Props = {
  data: ResponseRiwayatPengajuanReturnForHighlightType;
  handleRedirectPengajuanReturBarangDetail: (params: {
    pelangganId?: number;
    transactionId?: number;
    returBarangId?: number;
  }) => void;
  large?: boolean;
  windowSize?: "sm" | "md" | "lg";
};
const CardNotifikasiPengajuanReturBarang: FC<Props> = ({
  data: {
    author,
    updatedAt,
    status,
    pelangganId,
    transactionId,
    returnTransactionId,
    keterangan,
  },
  handleRedirectPengajuanReturBarangDetail,
  large,
  windowSize,
}) => {
  const Icon = returBarangNotification[status].icon;

  return (
    <div
      className={cn(
        "w-full border border-base-content/10 rounded-2xl md:rounded-xl flex flex-row justify-between items-center p-0 duration-150 ease-in-out bg-base-100",
        large
          ? "hover:bg-custom-primary/30 hover:border-custom-secondary shadow-xs"
          : "hover:bg-base-300",
      )}
    >
      {large && windowSize !== "sm" ? (
        <div className="w-full h-full p-2.5 flex flex-row justify-between items-center gap-2.5">
          <div className="flex-3 lg:flex-6 w-full flex flex-row justify-start items-center gap-4">
            {/* icon */}
            <div
              className={cn(
                "w-11 h-11 shrink-0 rounded-full flex flex-col justify-center items-center",
                returBarangNotification[status].bg,
              )}
            >
              <Icon
                className={cn("size-4", returBarangNotification[status].color)}
              />
            </div>

            <div className="flex flex-col justify-start items-start">
              <div className="flex flex-col justify-start items-start gap-0.5">
                <div className="flex gap-2.5 flex-row justify-start items-center">
                  <span
                    className={cn(
                      "status",
                      returBarangNotification[status].bullet,
                    )}
                  />

                  <span className="text-[0.7rem] font-medium text-base-content">
                    {returBarangNotification[status].title}
                  </span>
                </div>

                {/* status */}
                <div className="flex text-left flex-col lg:flex-row justify-start items-start gap-1.5">
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
                  className={cn("text-[0.625rem] font-medium", "text-rose-500")}
                >
                  Retur Barang
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-row justify-end items-center">
            <ButtonWithIcon
              icon={Eye}
              label="Lihat Detail"
              handleBtn={() =>
                handleRedirectPengajuanReturBarangDetail({
                  pelangganId,
                  transactionId,
                  returBarangId: returnTransactionId,
                })
              }
            />
          </div>
        </div>
      ) : (
        ((large && windowSize === "sm") || !large) && (
          <button
            type="button"
            className="w-full h-full p-2.5 flex flex-row justify-between items-center gap-2.5"
            onClick={() =>
              handleRedirectPengajuanReturBarangDetail({
                pelangganId,
                transactionId,
                returBarangId: returnTransactionId,
              })
            }
          >
            <div className="w-full flex flex-row justify-start items-center gap-4">
              {/* icon */}
              <div
                className={cn(
                  "w-11 h-11 shrink-0 hidden rounded-full md:flex flex-col justify-center items-center",
                  returBarangNotification[status].bg,
                )}
              >
                <Icon
                  className={cn(
                    "size-4",
                    returBarangNotification[status].color,
                  )}
                />
              </div>

              <div className="flex flex-col justify-start items-start">
                <div className="flex flex-col justify-start items-start gap-0.5">
                  <div className="flex gap-2.5 flex-row justify-start items-center">
                    <span
                      className={cn(
                        "status",
                        returBarangNotification[status].bullet,
                      )}
                    />

                    <span className="text-[0.7rem] font-medium text-base-content">
                      {returBarangNotification[status].title}
                    </span>
                  </div>

                  {/* status */}
                  <div className="flex text-left flex-col md:flex-row justify-start items-start gap-1.5">
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
                      "text-rose-500",
                    )}
                  >
                    Retur Barang
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-start items-center">
              <ChevronRight className="size-5 text-base-content" />
            </div>
          </button>
        )
      )}
    </div>
  );
};

export default CardNotifikasiPengajuanReturBarang;
