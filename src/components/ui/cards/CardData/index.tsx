import type { FC } from "react";
import {
  PAYMENT_METHOD_TYPE,
  TEMPO_STATUS_TYPE,
  type PaymentMethodType,
  type TempoStatusType,
  type TransactionStatusType,
} from "../../../../types/constant.type";
import {
  Banknote,
  CalendarClock,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Dot,
  Landmark,
  PackageOpen,
  QrCode,
} from "lucide-react";
import { cn } from "../../../../utils/cn";
import { formatTanggalLengkap } from "../../../../helpers/formatDate";
import {
  formatNumber,
  formatNumberPhone,
  formatRupiah,
  getJatuhTempoTextColor,
} from "../../../../helpers/helpers";
import StatusTransaction from "../../StatusTransaction";
import type { IPelangganType } from "../../../../models/pelanggan.model";
import { differenceInDays } from "date-fns";

type Props = {
  nomorReferensi?: string;
  tanggal?: Date;
  totalItem?: number;
  metodePembayaran?: PaymentMethodType;
  totalTransaksi?: number;
  status?: TransactionStatusType;
  statusTempo?: TempoStatusType;
  handleRedirectDetail?: () => void;
  pelanggan?: Pick<IPelangganType, "id" | "nama" | "noWa">;
  noMetodePembayaran?: boolean;
  totalTransaksiTempo?: number;
  jatuhTempoTerdekat?: Date;
  tempoIcon?: boolean;
  progresCicilan?: {
    cicilanBelumSelesai?: number;
    jumlahCicilan?: number;
  };
  periode?: number;
};
const CardData: FC<Props> = ({
  nomorReferensi,
  metodePembayaran,
  status,
  tanggal,
  totalItem,
  totalTransaksi,
  statusTempo,
  handleRedirectDetail,
  pelanggan,
  noMetodePembayaran,
  totalTransaksiTempo,
  jatuhTempoTerdekat,
  tempoIcon,
  progresCicilan,
  periode,
}) => {
  const isTempo = metodePembayaran === PAYMENT_METHOD_TYPE.TEMPO;

  const isTempoUnpaid = tempoIcon && statusTempo === TEMPO_STATUS_TYPE.UNPAID;

  const isTempoPartial = tempoIcon && statusTempo === TEMPO_STATUS_TYPE.PARTIAL;

  const isTempoPaid = tempoIcon && statusTempo === TEMPO_STATUS_TYPE.PAID;

  const isTempoOverdue = tempoIcon && statusTempo === TEMPO_STATUS_TYPE.OVERDUE;

  const backgroundClass = cn(
    "w-10 h-10 rounded-full flex items-center justify-center",

    !tempoIcon &&
      metodePembayaran === PAYMENT_METHOD_TYPE.TRANSFER &&
      "bg-blue-100",

    !tempoIcon &&
      metodePembayaran === PAYMENT_METHOD_TYPE.CASH &&
      "bg-emerald-100",

    !tempoIcon &&
      metodePembayaran === PAYMENT_METHOD_TYPE.QRIS &&
      "bg-purple-100",

    !tempoIcon && isTempo && "bg-amber-100",

    isTempoUnpaid && "bg-amber-100",

    isTempoPartial && "bg-emerald-100",

    isTempoPaid && "bg-emerald-100",

    isTempoOverdue && "bg-rose-100",
  );

  return (
    <button
      type="button"
      className="w-full flex flex-row justify-between items-center p-2 rounded-2xl border border-base-content/10 hover:border-emerald-600 hover:bg-emerald-600/10 transition-all duration-150 ease-in-out"
      onClick={handleRedirectDetail}
    >
      <div className="flex flex-row justify-start items-center gap-2.5">
        {/* icon */}
        <div className={backgroundClass}>
          {!tempoIcon && metodePembayaran === PAYMENT_METHOD_TYPE.TRANSFER && (
            <Landmark className="size-5 text-blue-600" />
          )}

          {!tempoIcon && metodePembayaran === PAYMENT_METHOD_TYPE.CASH && (
            <Banknote className="size-5 text-emerald-600" />
          )}

          {!tempoIcon && metodePembayaran === PAYMENT_METHOD_TYPE.QRIS && (
            <QrCode className="size-5 text-purple-600" />
          )}

          {!tempoIcon && metodePembayaran === PAYMENT_METHOD_TYPE.TEMPO && (
            <CalendarClock className="size-5 text-amber-600" />
          )}

          {isTempoUnpaid && <CalendarClock className="size-5 text-amber-600" />}

          {isTempoPartial && (
            <CircleCheck className="size-5 text-emerald-600" />
          )}

          {isTempoPaid && <CircleCheck className="size-5 text-emerald-600" />}

          {isTempoOverdue && <CircleAlert className="size-5 text-rose-600" />}
        </div>

        {/* data */}
        <div className="flex flex-col justify-start items-start gap-0.5">
          {/* kode referensi */}
          <span className="text-[0.625rem] font-semibold text-base-content text-left">
            {nomorReferensi ?? pelanggan?.nama}
          </span>

          {/* date */}
          {tanggal && (
            <span className="text-[0.625rem] text-base-content/80">
              {formatTanggalLengkap(tanggal)}
            </span>
          )}
          {pelanggan && (
            <span className="text-[0.625rem] text-base-content/80">
              {formatNumberPhone(pelanggan.noWa)}
            </span>
          )}

          {/* total item and metode pembayaran */}
          <div className="flex flex-row justify-start items-center">
            {/* total transaksi tempo */}
            {totalTransaksiTempo && (
              <>
                <span className="text-[0.625rem] text-base-content/80">
                  {formatNumber(totalTransaksiTempo.toString())} Transaksi
                </span>

                {/* dot */}
                <Dot className="text-base-content/80" />
              </>
            )}

            {/* total item */}
            {totalItem && (
              <>
                <div className="w-full flex fex-row justify-start items-center gap-1">
                  {/* icon */}
                  <PackageOpen className="size-2.5 text-base-content/80" />

                  {/* value */}
                  <span className="text-[0.625rem] text-base-content/80">
                    {formatNumber(totalItem.toString())} Item
                  </span>
                </div>
                {/* dot */}
                <Dot className="text-base-content/80 -ml-2" />
              </>
            )}

            {jatuhTempoTerdekat && (
              <>
                <span
                  className={cn(
                    "font-medium text-[0.625rem]",
                    getJatuhTempoTextColor(jatuhTempoTerdekat),
                  )}
                >
                  (
                  {formatNumber(
                    differenceInDays(jatuhTempoTerdekat, new Date()),
                  )}{" "}
                  Hari lagi )
                </span>

                {/* dot */}
                <Dot className="text-base-content/80" />

                <span className={cn("font-medium text-[0.625rem]")}>
                  {periode} Minggu
                </span>
              </>
            )}

            {metodePembayaran && !noMetodePembayaran && (
              <span className="text-[0.625rem] capitalize text-base-content/80">
                {metodePembayaran.toLowerCase()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* total */}
      <div className="flex flex-row justify-end items-center gap-2">
        <div className="flex flex-col justify-start items-end gap-2">
          {/* total */}
          {totalTransaksi && (
            <span className="text-xs text-base-content font-semibold">
              {formatRupiah(totalTransaksi)}
            </span>
          )}
          {/* status */}
          <StatusTransaction status={status} statusTempo={statusTempo} />

          {progresCicilan && (
            <span className="text-[0.625rem] text-base-content font-medium">
              {(progresCicilan.jumlahCicilan ?? 0) -
                (progresCicilan.cicilanBelumSelesai ?? 0)}
              {""} / {""}
              {progresCicilan.jumlahCicilan}
            </span>
          )}
        </div>

        {/* icon */}
        <ChevronRight className="size-4 text-base-content" />
      </div>
    </button>
  );
};

export default CardData;
