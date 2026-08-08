import {
  BanknoteIcon,
  CalendarClock,
  Landmark,
  QrCode,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../../../../utils/cn";
import StatusTransaction from "../../../../components/ui/StatusTransaction";
import StatusPelanggan from "../../../../components/StatusPelanggan";
import type { FC } from "react";
import type {
  PaymentMethodType,
  ReturnStatus,
  RoleInternalType,
  TempoStatusType,
  TransactionStatusType,
} from "../../../../types/constant.type";
import RoleLabel from "../../RoleLabel";
import StatusReturBarang from "../../StatusReturBarang";

type Props = {
  label: string;
  icon: {
    largeIcon?: LucideIcon;
    metodePembayaran?: PaymentMethodType | null;
    smallIcon?: LucideIcon;
    bgColor?: string;
    textColor?: string;
  };
  largeValue: {
    value?: string | null;
    textColor?: string;
  };
  smallValue?: string | null;
  customWidth?: string;
  isActive?: boolean;
  role?: RoleInternalType;
  statusTransaction?: TransactionStatusType | null;
  statusTempo?: TempoStatusType | null;
  statusRetur?: ReturnStatus;
};
const CardStatistikLarge: FC<Props> = ({
  icon,
  label,
  largeValue,
  smallValue,
  customWidth,
  isActive,
  statusTransaction,
  statusTempo,
  statusRetur,
  role,
}) => {
  return (
    <div
      className={cn(
        "flex flex-row justify-start items-center p-2.5 rounded-2xl md:rounded-xl border border-base-content/10 h-24 gap-4 relative",
        customWidth ?? "w-full",
      )}
    >
      {/* is active */}
      {isActive && (
        <div className="absolute top-2 right-2">
          <StatusPelanggan isActive={isActive} />
        </div>
      )}

      {role && (
        <div className="absolute top-2 right-2">
          <RoleLabel role={role} />
        </div>
      )}

      {(statusTransaction || statusTempo) && (
        <div className="absolute top-1 right-2">
          <StatusTransaction
            statusTempo={statusTempo ?? undefined}
            status={statusTransaction ?? undefined}
          />
        </div>
      )}

      {statusRetur && (
        <div className="absolute top-1 right-2">
          <StatusReturBarang status={statusRetur ?? undefined} />
        </div>
      )}
      {/* icon */}
      {icon.largeIcon && (
        <div
          className={cn(
            "w-14 h-14 shrink-0 flex justify-center items-center rounded-full",
            icon.bgColor,
          )}
        >
          <icon.largeIcon className={cn("size-6", icon.textColor)} />
        </div>
      )}

      {/* cash */}
      {icon.metodePembayaran === "CASH" && (
        <div
          className={cn(
            "w-14 h-14 flex justify-center items-center rounded-full",
            "bg-emerald-50 dark:bg-emerald-100",
          )}
        >
          <BanknoteIcon className={cn("size-6", "text-emerald-600")} />
        </div>
      )}

      {/* transfer */}
      {icon.metodePembayaran === "TRANSFER" && (
        <div
          className={cn(
            "w-14 h-14 flex justify-center items-center rounded-full",
            "bg-blue-50 dark:bg-blue-100",
          )}
        >
          <Landmark className={cn("size-6", "text-blue-600")} />
        </div>
      )}

      {/* qris */}
      {icon.metodePembayaran === "QRIS" && (
        <div
          className={cn(
            "w-14 h-14 flex justify-center items-center rounded-full",
            "bg-purple-50 dark:bg-purple-100",
          )}
        >
          <QrCode className={cn("size-6", "text-purple-600")} />
        </div>
      )}

      {/* tempo */}
      {icon.metodePembayaran === "TEMPO" && (
        <div
          className={cn(
            "w-14 h-14 flex justify-center items-center rounded-full",
            "bg-amber-50 dark:bg-amber-100",
          )}
        >
          <CalendarClock className={cn("size-6", "text-amber-600")} />
        </div>
      )}

      {/* value */}
      <div className="flex flex-col justify-start items-start gap-2.5">
        <div className="flex flex-col justify-start items-start gap-0.5">
          <span className="text-[0.625rem] font-medium text-base-content/70">
            {label}
          </span>
          <span
            className={cn(
              "text-sm font-semibold text-base-content",
              largeValue.textColor,
            )}
          >
            {largeValue.value}
          </span>
        </div>

        <div className="flex flex-row justify-start items-center gap-1.5">
          {/* small icon */}
          {icon.smallIcon && (
            <icon.smallIcon className={"size-3 text-base-content/70"} />
          )}

          <span className="text-[0.7rem] font-medium text-base-content/70">
            {smallValue}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardStatistikLarge;
