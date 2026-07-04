import {
  Banknote,
  BanknoteArrowDown,
  CalendarClock,
  ChevronRight,
  Clock3,
  Dot,
  Landmark,
  Package,
  PackageOpen,
  QrCode,
  Receipt,
  ShoppingBag,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import InputSearch from "../../../components/inputs/InputSearch";
import type { FC } from "react";
import { cn } from "../../../utils/cn";
import {
  formatNumber,
  formatRupiah,
  formatRupiahShort,
} from "../../../helpers/helpers";
import RangeDateLarge from "../../../components/filters/RangeDateLarge";
import FilterSort from "../../../components/filters/Sort";
import MetodePembayaran from "../../../components/filters/MetodePembayaran";
import StatusTempo from "../../../components/filters/StatusTempo";
import useTransaksi from "./useTransaksi";
import { format } from "date-fns";
import { formatTanggalLengkap } from "../../../helpers/formatDate";
import {
  PAYMENT_METHOD_TYPE,
  TEMPO_STATUS_TYPE,
  TRANSACTION_STATUS_TYPE,
  type PaymentMethodType,
  type TempoStatusType,
  type TransactionStatusType,
} from "../../../types/constant.type";
import PaginationAndLimit from "../../../components/filters/PaginationAndLimit";

const Transaksi = () => {
  const { metodePembayaran, handleSetMetodePembayaran, setTempo } =
    useTransaksi();

  return (
    <div className="w-full mb-30 flex flex-col justify-start items-start p-2 gap-2">
      {/* search */}
      <div className="w-full bg-base-100 p-2.5 shadow-sm border border-transparent dark:border-base-content/10 rounded-lg">
        <InputSearch handleSearch={() => {}} />
      </div>

      {/* data */}
      <div className="w-full grid grid-cols-2 bg-base-100 shadow-sm border border-transparent dark:border-base-content/10 rounded-lg p-2.5 gap-2">
        <CardStatistik
          icon={{
            icon: Receipt,
            bgColor: "bg-blue-100",
            iconColor: "text-blue-400",
          }}
          label="Transaksi"
          value={formatNumber("30000")}
        />

        <CardStatistik
          icon={{
            icon: BanknoteArrowDown,
            bgColor: "bg-emerald-100",
            iconColor: "text-emerald-400",
          }}
          label="Omzet"
          value={formatRupiahShort(20342423)}
        />

        <CardStatistik
          icon={{
            icon: Package,
            bgColor: "bg-amber-100",
            iconColor: "text-amber-400",
          }}
          label="Modal"
          value={formatRupiahShort(20342423)}
        />

        <CardStatistik
          icon={{
            icon: TrendingUp,
            bgColor: "bg-green-100",
            iconColor: "text-green-400",
          }}
          label="Laba"
          value={formatRupiahShort(20342423)}
        />

        <CardStatistik
          icon={{
            icon: Clock3,
            bgColor: "bg-red-100",
            iconColor: "text-red-400",
          }}
          label="Piutang"
          value={formatRupiahShort(20342423)}
        />

        <CardStatistik
          icon={{
            icon: ShoppingBag,
            bgColor: "bg-purple-100",
            iconColor: "text-purple-400",
          }}
          label="Item"
          value={formatNumber("30000")}
        />
      </div>

      {/* filter */}
      <div className="w-full grid grid-cols-2 bg-base-100 shadow-sm border border-transparent dark:border-base-content/10 rounded-lg p-2.5 gap-2">
        <div className="col-span-2">
          <RangeDateLarge
            defaultStartDate={format(
              new Date(
                new Date().getFullYear(),
                new Date().getMonth() - 1,
                new Date().getDate(),
              ),
              "yyyy-MM-dd",
            )}
            defaultEndDate={format(new Date(), "yyyy-MM-dd")}
          />
        </div>
        <div className="col-span-1">
          <FilterSort setSort={() => {}} customWidth="w-full" />
        </div>
        <div className="col-span-1">
          <MetodePembayaran
            setMetode={handleSetMetodePembayaran}
            customWidth="w-full"
          />
        </div>
        {metodePembayaran === "tempo" && (
          <div className="col-span-1">
            <StatusTempo setStatusTempo={setTempo} />
          </div>
        )}
      </div>

      {/* data */}
      <div className="w-full flex flex-col justify-start items-start bg-base-100 shadow-sm rounded-lg border border-transparent dark:border-base-content/10 p-2 gap-2">
        {/* card data */}
        <CardData
          kodeReferensi="AU-TS-20260704-0003"
          tanggal={new Date()}
          metodePembayaran="CASH"
          status="COMPLETED"
          totalItem={20}
          totalTransaksi={12000000}
        />
        <CardData
          kodeReferensi="AU-TS-20260704-0003"
          tanggal={new Date()}
          metodePembayaran="QRIS"
          status="COMPLETED"
          totalItem={20}
          totalTransaksi={12000000}
        />
        <CardData
          kodeReferensi="AU-TS-20260704-0003"
          tanggal={new Date()}
          metodePembayaran="TRANSFER"
          status="COMPLETED"
          totalItem={20}
          totalTransaksi={12000000}
        />
        <CardData
          kodeReferensi="AU-TS-20260704-0003"
          tanggal={new Date()}
          metodePembayaran="TEMPO"
          statusTempo="UNPAID"
          totalItem={20}
          totalTransaksi={12000000}
        />
        <CardData
          kodeReferensi="AU-TS-20260704-0003"
          tanggal={new Date()}
          metodePembayaran="TEMPO"
          statusTempo="PAID"
          totalItem={20}
          totalTransaksi={12000000}
        />
        <CardData
          kodeReferensi="AU-TS-20260704-0003"
          tanggal={new Date()}
          metodePembayaran="TEMPO"
          statusTempo="OVERDUE"
          totalItem={20}
          totalTransaksi={12000000}
        />
      </div>

      {/* pagination */}
      <PaginationAndLimit
        currentPage={1}
        setPage={() => {}}
        totalPage={10}
        limit={8}
        setLimit={() => {}}
      />
    </div>
  );
};

// card statistik
type CardStatistikProps = {
  label: string;
  value: string;
  icon: {
    icon: LucideIcon;
    iconColor: string;
    bgColor: string;
  };
};
const CardStatistik: FC<CardStatistikProps> = ({ icon, label, value }) => {
  return (
    <div className="grid-cols-1 flex flex-row justify-start items-center gap-2.5 border border-base-content/10 rounded-lg p-2">
      {/* icon */}
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex flex-row justify-center items-center",
          icon.bgColor,
        )}
      >
        <icon.icon className={cn("size-5", icon.iconColor)} />
      </div>

      {/* label */}
      <div className="flex flex-col justify-start items-start gap-0.5">
        <span className="text-xs font-medium text-base-content/50">
          {label}
        </span>
        <span className="text-xs font-semibold text-base-content">{value}</span>
      </div>
    </div>
  );
};

// card data
type CardDataType = {
  kodeReferensi: string;
  tanggal: Date;
  totalItem: number;
  metodePembayaran: PaymentMethodType;
  totalTransaksi: number;
  status?: TransactionStatusType;
  statusTempo?: TempoStatusType;
};
const CardData: FC<CardDataType> = ({
  kodeReferensi,
  metodePembayaran,
  status,
  tanggal,
  totalItem,
  totalTransaksi,
  statusTempo,
}) => {
  return (
    <button
      type="button"
      className="w-full flex flex-row justify-between items-center p-2 rounded-lg border border-base-content/10 hover:border-emerald-600 hover:bg-emerald-600/10 transition-all duration-150 ease-in-out"
    >
      <div className="flex flex-row justify-start items-center gap-2.5">
        {/* icon */}
        <div
          className={cn(
            "w-10 h-10 rounded-full flex flex-row justify-center items-center",
            metodePembayaran === PAYMENT_METHOD_TYPE.TRANSFER && "bg-blue-100",
            metodePembayaran === PAYMENT_METHOD_TYPE.CASH && "bg-emerald-100",
            metodePembayaran === PAYMENT_METHOD_TYPE.QRIS && "bg-purple-100",
            metodePembayaran === PAYMENT_METHOD_TYPE.TEMPO && "bg-amber-100",
          )}
        >
          {metodePembayaran === PAYMENT_METHOD_TYPE.TRANSFER && (
            <Landmark className={cn("size-5", "text-blue-600")} />
          )}
          {metodePembayaran === PAYMENT_METHOD_TYPE.CASH && (
            <Banknote className={cn("size-5", "text-emerald-600")} />
          )}
          {metodePembayaran === PAYMENT_METHOD_TYPE.QRIS && (
            <QrCode className={cn("size-5", "text-purple-600")} />
          )}
          {metodePembayaran === PAYMENT_METHOD_TYPE.TEMPO && (
            <CalendarClock className={cn("size-5", "text-amber-600")} />
          )}
        </div>

        {/* data */}
        <div className="flex flex-col justify-start items-start gap-0.5">
          {/* kode referensi */}
          <span className="text-[0.625rem] font-semibold text-base-content">
            {kodeReferensi}
          </span>

          {/* date */}
          <span className="text-[0.625rem] text-base-content/80">
            {formatTanggalLengkap(tanggal)}
          </span>

          {/* total item and metode pembayaran */}
          <div className="flex flex-row justify-start items-center">
            {/* total item */}
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

            <span className="text-[0.625rem] capitalize text-base-content/80">
              {metodePembayaran.toLowerCase()}
            </span>
          </div>
        </div>
      </div>

      {/* total */}
      <div className="flex flex-row justify-end items-center gap-2">
        <div className="flex flex-col justify-start items-end gap-2">
          {/* total */}
          <span className="text-xs text-base-content font-semibold">
            {formatRupiah(totalTransaksi)}
          </span>

          {/* status */}
          <span
            className={cn(
              "px-2 py-0.5 rounded-md text-[0.625rem]",
              status === TRANSACTION_STATUS_TYPE.COMPLETED &&
                "bg-green-100 text-green-600",
              statusTempo === TEMPO_STATUS_TYPE.UNPAID &&
                "bg-amber-100 text-amber-600",
              statusTempo === TEMPO_STATUS_TYPE.PAID &&
                "bg-green-100 text-green-600",
              statusTempo === TEMPO_STATUS_TYPE.OVERDUE &&
                "bg-red-100 text-red-600",
            )}
          >
            {status === TRANSACTION_STATUS_TYPE.COMPLETED && "Lunas"}
            {statusTempo === TEMPO_STATUS_TYPE.UNPAID && "Belum Lunas"}
            {statusTempo === TEMPO_STATUS_TYPE.PAID && "Lunas"}
            {statusTempo === TEMPO_STATUS_TYPE.OVERDUE && "Terlambat"}
          </span>
        </div>

        {/* icon */}
        <ChevronRight className="size-4 text-base-content" />
      </div>
    </button>
  );
};

export default Transaksi;
