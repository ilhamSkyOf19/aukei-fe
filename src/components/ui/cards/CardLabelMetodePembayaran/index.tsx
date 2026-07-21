import type { FC } from "react";
import type { PaymentMethodType } from "../../../../types/constant.type";
import { Banknote, CalendarClock, Landmark, QrCode } from "lucide-react";
import { cn } from "../../../../utils/cn";

type Props = {
  metodePembayaran?: PaymentMethodType;
  noLabel?: boolean;
};
const CardLabelMetodePembayaran: FC<Props> = ({
  metodePembayaran,
  noLabel,
}) => {
  return (
    <div className="w-full flex flex-col justify-start items-start gap-1">
      {/* label */}
      {!noLabel && (
        <span className="text-[0.7rem] text-base-content/70 font-medium">
          Metode Pembayaran
        </span>
      )}

      <div className="flex flex-row justify-start items-center gap-2">
        <div
          className={cn(
            "w-7 h-7 flex justify-center items-center rounded-md shrink-0",
            metodePembayaran === "CASH" && "bg-emerald-50",
            metodePembayaran === "TRANSFER" && "bg-blue-50",
            metodePembayaran === "QRIS" && "bg-purple-50",
            metodePembayaran === "TEMPO" && "bg-amber-50",
          )}
        >
          {metodePembayaran === "CASH" && (
            <Banknote className="size-4 text-emerald-500" />
          )}
          {metodePembayaran === "TRANSFER" && (
            <Landmark className="size-4 text-blue-500" />
          )}
          {metodePembayaran === "QRIS" && (
            <QrCode className="size-4 text-purple-500" />
          )}
          {metodePembayaran === "TEMPO" && (
            <CalendarClock className="size-4 text-amber-500" />
          )}
        </div>
        <span className={cn("text-[0.7rem] font-semibold text-base-content")}>
          {metodePembayaran === "CASH" && "Tunai"}
          {metodePembayaran === "QRIS" && "QRIS"}
          {metodePembayaran === "TEMPO" && "Kredit"}
          {metodePembayaran === "TRANSFER" && "Transfer"}
        </span>
      </div>
    </div>
  );
};

export default CardLabelMetodePembayaran;
