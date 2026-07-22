import {
  BanknoteIcon,
  Calendar,
  CalendarClock,
  CreditCard,
  IdCard,
  Landmark,
  Phone,
  QrCode,
  ReceiptText,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../../../../utils/cn";
import StatusTransaction from "../../../../components/ui/StatusTransaction";
import StatusPelanggan from "../../../../components/StatusPelanggan";
import type { FC } from "react";
import type {
  PaymentMethodType,
  TransactionStatusType,
} from "../../../../types/constant.type";
import type { IPenggunaInternalType } from "../../../../models/penggunaInternal.model";
import type { IPelangganType } from "../../../../models/pelanggan.model";
import { formatTanggalLengkap } from "../../../../helpers/formatDate";
import { formatNumberPhone } from "../../../../helpers/helpers";

type Props = {
  nomorTransaksi?: string | null;
  metodePembayaran?: PaymentMethodType | null;
  kasir?: Pick<
    IPenggunaInternalType,
    "id" | "nama" | "username" | "isActive"
  > | null;
  pelanggan?: Pick<IPelangganType, "id" | "noWa" | "nama" | "isActive"> | null;
  tanggalTransaksi?: Date | null;
  statusTransaction?: TransactionStatusType | null;
};
const HeaderTransactionDetail: FC<Props> = ({
  kasir,
  pelanggan,
  nomorTransaksi,
  metodePembayaran,
  tanggalTransaksi,
  statusTransaction,
}) => {
  return (
    <div className="w-full bg-base-100 rounded-2xl md:rounded-xl grid grid-cols-4 p-2.5 gap-2.5 flex-wrap border border-transparent dark:border-base-content/10 shadow-sm">
      {/* nomor transaksi */}
      <CardLarge
        icon={{
          largeIcon: ReceiptText,
          bgColor: "bg-emerald-50 dark:bg-emerald-100",
          textColor: "text-emerald-600",
          smallIcon: Calendar,
        }}
        label="Nomor Transaksi"
        largeValue={{
          value: nomorTransaksi,
          textColor: "text-info",
        }}
        smallValue={formatTanggalLengkap(tanggalTransaksi ?? new Date())}
        customWidth="col-span-1"
        statusTransaction={statusTransaction}
      />

      {/* data kasir */}
      <CardLarge
        icon={{
          largeIcon: UserRound,
          bgColor: "bg-purple-50 dark:bg-purple-100",
          textColor: "text-purple-600",
          smallIcon: IdCard,
        }}
        label="Kasir"
        largeValue={{
          value: kasir?.nama,
        }}
        smallValue={kasir?.username}
        customWidth="col-span-1"
        isActive={kasir?.isActive}
      />

      {/* data pelanggan */}
      <CardLarge
        icon={{
          largeIcon: UserRound,
          bgColor: "bg-blue-50 dark:bg-blue-100",
          textColor: "text-blue-600",
          smallIcon: Phone,
        }}
        label="Pelanggan"
        largeValue={{
          value: pelanggan?.nama,
        }}
        smallValue={formatNumberPhone(pelanggan?.noWa ?? "")}
        customWidth="col-span-1"
        isActive={pelanggan?.isActive}
      />

      {/* metode pembayaran*/}
      <CardLarge
        icon={{
          metodePembayaran: metodePembayaran,
          smallIcon: CreditCard,
        }}
        label="Metode Pembayaran"
        largeValue={{
          value: metodePembayaran,
        }}
        smallValue={"Metode Pembayaran"}
        customWidth="col-span-1"
      />
    </div>
  );
};

// card large
type CardLargeProps = {
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
  statusTransaction?: TransactionStatusType | null;
};
const CardLarge: FC<CardLargeProps> = ({
  icon,
  label,
  largeValue,
  smallValue,
  customWidth,
  isActive,
  statusTransaction,
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

      {statusTransaction && (
        <div className="absolute top-1 right-2">
          <StatusTransaction status={statusTransaction} />
        </div>
      )}
      {/* icon */}
      {icon.largeIcon && (
        <div
          className={cn(
            "w-14 h-14 flex justify-center items-center rounded-full",
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
            "w-16 h-16 flex justify-center items-center rounded-full",
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
            "w-16 h-16 flex justify-center items-center rounded-full",
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
            "w-16 h-16 flex justify-center items-center rounded-full",
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
            "w-16 h-16 flex justify-center items-center rounded-full",
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

          <span className="text-[0.625rem] font-medium text-base-content/70">
            {smallValue}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeaderTransactionDetail;
