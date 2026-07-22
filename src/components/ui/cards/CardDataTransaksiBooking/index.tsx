import type { FC } from "react";
import { type TransactionStatusType } from "../../../../types/constant.type";
import { CalendarClock, ChevronRight, Dot } from "lucide-react";
import { cn } from "../../../../utils/cn";
import { formatNumber, formatNumberPhone } from "../../../../helpers/helpers";
import StatusTransaction from "../../StatusTransaction";
import type { IPelangganType } from "../../../../models/pelanggan.model";

type Props = {
  handleRedirectDetail?: () => void;
  pelanggan?: Pick<IPelangganType, "id" | "nama" | "noWa">;
  totalTransaksi?: number;
  totalItemBooking?: number;
  status?: TransactionStatusType;
};
const CardDataTransaksiBooking: FC<Props> = ({
  status,
  totalTransaksi,
  handleRedirectDetail,
  pelanggan,
  totalItemBooking,
}) => {
  return (
    <button
      type="button"
      className="w-full flex flex-row justify-between items-center p-2 rounded-2xl border border-base-content/10 hover:border-emerald-600 hover:bg-emerald-600/10 transition-all duration-150 ease-in-out"
      onClick={handleRedirectDetail}
    >
      <div className="flex flex-row justify-start items-center gap-2.5">
        {/* icon */}
        <div
          className={cn(
            "w-10 h-10 rounded-full flex flex-row justify-center items-center bg-amber-50",
          )}
        >
          <CalendarClock className={cn("size-5", "text-amber-600")} />
        </div>

        {/* data */}
        <div className="flex flex-col justify-start items-start gap-0.5">
          {/* kode referensi */}
          <span className="text-[0.625rem] font-semibold text-base-content text-left">
            {pelanggan?.nama}
          </span>

          <span className="text-[0.625rem] text-base-content/80">
            {formatNumberPhone(pelanggan?.noWa ?? "")}
          </span>

          {/* total item and metode pembayaran */}
          <div className="flex flex-row justify-start items-center">
            <span className="text-[0.625rem] text-base-content/80">
              {formatNumber(totalTransaksi ?? 0)} Transaksi
            </span>

            {/* dot */}
            <Dot className="text-base-content/80" />

            <span className="text-[0.625rem] text-base-content/80">
              {formatNumber(totalItemBooking ?? 0)} Item
            </span>
          </div>
        </div>
      </div>

      {/* total */}
      <div className="flex flex-row justify-end items-center gap-2">
        <div className="flex flex-col justify-start items-end gap-2">
          {/* status */}
          <StatusTransaction status={status} />
        </div>

        {/* icon */}
        <ChevronRight className="size-4 text-base-content" />
      </div>
    </button>
  );
};

export default CardDataTransaksiBooking;
