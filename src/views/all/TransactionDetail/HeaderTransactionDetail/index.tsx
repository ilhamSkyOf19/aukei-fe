import {
  Calendar,
  CreditCard,
  IdCard,
  Phone,
  ReceiptText,
  UserRound,
} from "lucide-react";
import type { FC } from "react";
import type {
  PaymentMethodType,
  TempoStatusType,
  TransactionStatusType,
} from "../../../../types/constant.type";
import type { IPenggunaInternalType } from "../../../../models/penggunaInternal.model";
import type { IPelangganType } from "../../../../models/pelanggan.model";
import { formatTanggalLengkap } from "../../../../helpers/formatDate";
import { formatNumberPhone } from "../../../../helpers/helpers";
import CardStatistikLarge from "../../../../components/ui/cards/CardStatistikLarge";

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
  statusTempo?: TempoStatusType | null;
};
const HeaderTransactionDetail: FC<Props> = ({
  kasir,
  pelanggan,
  nomorTransaksi,
  metodePembayaran,
  tanggalTransaksi,
  statusTransaction,
  statusTempo,
}) => {
  return (
    <div className="w-full bg-base-100 rounded-2xl md:rounded-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-2.5 gap-2.5 flex-wrap border border-transparent dark:border-base-content/10 shadow-sm">
      {/* nomor transaksi */}
      <CardStatistikLarge
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
        statusTempo={statusTempo}
      />

      {/* data kasir */}
      <CardStatistikLarge
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
      <CardStatistikLarge
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
      <CardStatistikLarge
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

export default HeaderTransactionDetail;
