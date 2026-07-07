import {
  Banknote,
  BanknoteArrowDown,
  CalendarClock,
  ChartColumn,
  ChevronRight,
  Clock3,
  Dot,
  Eye,
  FileText,
  History,
  Landmark,
  Package,
  PackageMinus,
  PackageOpen,
  PackageX,
  QrCode,
  Receipt,
  Sheet,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import InputSearch from "../../../components/inputs/InputSearch";
import type { FC } from "react";
import { cn } from "../../../utils/cn";
import {
  formatNumber,
  formatNumberK,
  formatNumberPhone,
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
import RangeDate from "../../../components/filters/RangeDate";
import listDateRangeLong from "../../../utils/listDateRangeLong";
import DataEmpty from "../../../components/messages/DataEmpty";
import Avatar from "../../../components/ui/Avatar";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import CardStatistik from "../../../components/ui/cards/CardStatistik";

const Transaksi = () => {
  const {
    metodePembayaran,
    handleSetMetodePembayaran,
    setTempo,
    windowSize,
    handleRedirectDetail,
    isLoadingRingkasanStatistik,
    ringkasanStatistik,
    dataRiwayatTransaksi,
    handleSearch,
    isExistDataRiwayatTransaksi,
    isLoadingRiwayatTransaksi,
    setLimit,
    setPage,
    setSort,
  } = useTransaksi();

  return (
    <div className="w-full mb-30 flex flex-col justify-start items-start p-2 gap-2">
      {/* search */}
      <div className="w-full bg-base-100 p-2.5 shadow-sm border border-transparent dark:border-base-content/10 rounded-lg md:hidden">
        <InputSearch handleSearch={handleSearch} />
      </div>

      {/* filter */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 bg-base-100 shadow-sm border border-transparent dark:border-base-content/10 rounded-lg p-2.5 gap-2 md:gap-12">
        <div className="col-span-1 hidden md:flex">
          <InputSearch handleSearch={handleSearch} withLabel />
        </div>

        <div className="col-span-2 md:hidden">
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

        <div className="col-span-1 hidden md:flex">
          <RangeDate
            defaultStartDate={format(
              new Date(
                new Date().getFullYear(),
                new Date().getMonth() - 1,
                new Date().getDate(),
              ),
              "yyyy-MM-dd",
            )}
            defaultEndDate={format(new Date(), "yyyy-MM-dd")}
            listDate={listDateRangeLong}
            customWidth="w-full"
          />
        </div>

        <div className="col-span-1">
          <FilterSort setSort={setSort} customWidth="w-full" />
        </div>

        <div className="col-span-1 flex flex-row justify-start items-start gap-2">
          <MetodePembayaran
            setMetode={handleSetMetodePembayaran}
            customWidth="w-full"
          />
          {metodePembayaran === "tempo" && (
            <div className="hidden md:flex">
              <StatusTempo setStatusTempo={setTempo} />
            </div>
          )}
        </div>
        {metodePembayaran === "tempo" && (
          <div className="col-span-1 md:hidden">
            <StatusTempo setStatusTempo={setTempo} />
          </div>
        )}
      </div>

      <div className="flex my-2 flex-row justify-end w-full items-center gap-2 md:hidden">
        <ButtonWithIcon
          icon={FileText}
          label="Export PDF"
          bgColor="bg-error"
          textColor="text-primary-white"
          customHeight="h-9"
        />
        <ButtonWithIcon
          icon={Sheet}
          label="Export Excel"
          bgColor="bg-success"
          textColor="text-primary-white"
          customHeight="h-9"
        />
      </div>

      {/* data */}
      <div className="bg-base-100 w-full shadow-sm border border-transparent dark:border-base-content/10 rounded-lg p-2.5 gap-4 flex flex-col justify-start items-start">
        <div className="w-full flex flex-row justify-between items-start">
          {/* title */}
          <h3 className="text-sm font-semibold text-base-content">
            Ringkasan Statistik
          </h3>

          {/* aksi */}
          <div className="flex flex-row justify-end items-center gap-2">
            {/* button detail */}
            <ButtonWithIcon
              icon={Eye}
              label="Lihat Detail"
              customHeight="h-9 md:h-9"
              handleBtn={() => handleRedirectDetail()}
            />
            {/* button export */}
            <div className="md:flex flex-row justify-start items-center gap-2 hidden">
              <ButtonWithIcon
                icon={FileText}
                label="Export PDF"
                bgColor="bg-error"
                textColor="text-primary-white"
              />
              <ButtonWithIcon
                icon={Sheet}
                label="Export Excel"
                bgColor="bg-success"
                textColor="text-primary-white"
              />
            </div>
          </div>
        </div>
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2">
          <CardStatistik
            isLoading={isLoadingRingkasanStatistik}
            icon={{
              icon: Receipt,
              bgColor: "bg-blue-100",
              iconColor: "text-blue-400",
            }}
            label={windowSize === "sm" ? "Transaksi" : "Total Transaksi"}
            value={
              formatNumber(ringkasanStatistik?.data?.totalTransaksi ?? 0) || "0"
            }
            caption={
              windowSize !== "sm"
                ? "Jumlah transaksi berdasarkan tanggal"
                : undefined
            }
          />

          <CardStatistik
            isLoading={isLoadingRingkasanStatistik}
            icon={{
              icon: BanknoteArrowDown,
              bgColor: "bg-emerald-100",
              iconColor: "text-emerald-400",
            }}
            label={windowSize === "sm" ? "Omzet" : "Total Omzet"}
            value={
              windowSize === "sm"
                ? formatRupiahShort(ringkasanStatistik?.data?.totalOmzet ?? 0)
                : formatRupiah(ringkasanStatistik?.data?.totalOmzet ?? 0)
            }
            caption={
              windowSize !== "sm"
                ? "Total omzet dari transaksi penjualan"
                : undefined
            }
          />

          <CardStatistik
            isLoading={isLoadingRingkasanStatistik}
            icon={{
              icon: ChartColumn,
              bgColor: "bg-emerald-100",
              iconColor: "text-emerald-400",
            }}
            label={
              windowSize === "sm" ? "Rata-rata" : "Total Rata-rata transaksi"
            }
            value={
              windowSize === "sm"
                ? formatRupiahShort(
                    ringkasanStatistik?.data?.totalRataRataTransaksi ?? 0,
                  )
                : formatRupiah(
                    ringkasanStatistik?.data?.totalRataRataTransaksi ?? 0,
                  )
            }
            caption={
              windowSize !== "sm"
                ? "Total omzet dari transaksi penjualan"
                : undefined
            }
          />

          <CardStatistik
            isLoading={isLoadingRingkasanStatistik}
            icon={{
              icon: Package,
              bgColor: "bg-amber-100",
              iconColor: "text-amber-400",
            }}
            label={windowSize === "sm" ? "Modal" : "Total Modal"}
            value={
              windowSize === "sm"
                ? formatRupiahShort(ringkasanStatistik?.data?.totalModal ?? 0)
                : formatRupiah(ringkasanStatistik?.data?.totalModal ?? 0)
            }
            caption={
              windowSize !== "sm"
                ? "Total biaya modal untuk transaksi penjualan"
                : undefined
            }
          />

          <CardStatistik
            isLoading={isLoadingRingkasanStatistik}
            icon={{
              icon: Clock3,
              bgColor: "bg-red-100",
              iconColor: "text-red-400",
            }}
            label={windowSize === "sm" ? "Piutang" : "Total Piutang"}
            value={
              windowSize === "sm"
                ? formatRupiahShort(ringkasanStatistik?.data?.totalPiutang ?? 0)
                : formatRupiah(ringkasanStatistik?.data?.totalPiutang ?? 0)
            }
            caption={
              windowSize !== "sm"
                ? "Total nilai piutang yang belum dibayar"
                : undefined
            }
          />

          <CardStatistik
            isLoading={isLoadingRingkasanStatistik}
            icon={{
              icon: ShoppingBag,
              bgColor: "bg-purple-100",
              iconColor: "text-purple-400",
            }}
            label={windowSize === "sm" ? "Produk" : "Total Produk Terjual"}
            value={
              ringkasanStatistik?.data?.totalProdukTerjual
                ? formatNumber(
                    ringkasanStatistik?.data?.totalProdukTerjual ?? 0,
                  )
                : "0"
            }
            caption={
              windowSize !== "sm" ? "Jumlah produk yang terjual" : undefined
            }
          />

          <CardStatistik
            isLoading={isLoadingRingkasanStatistik}
            icon={{
              icon: Package,
              bgColor: "bg-indigo-100",
              iconColor: "text-indigo-400",
            }}
            label={windowSize === "sm" ? "Item" : "Total Item Terjual"}
            value={
              ringkasanStatistik?.data?.totalItemTerjual
                ? formatNumber(ringkasanStatistik?.data?.totalItemTerjual ?? 0)
                : "0"
            }
            caption={
              windowSize !== "sm" ? "Jumlah item yang terjual" : undefined
            }
          />

          <CardStatistik
            isLoading={isLoadingRingkasanStatistik}
            icon={{
              icon: TrendingUp,
              bgColor: "bg-green-100",
              iconColor: "text-green-400",
            }}
            label={windowSize === "sm" ? "Laba" : "Total Laba"}
            value={
              windowSize === "sm"
                ? formatRupiahShort(ringkasanStatistik?.data?.totalLaba ?? 0)
                : formatRupiah(ringkasanStatistik?.data?.totalLaba ?? 0)
            }
            caption={
              windowSize !== "sm"
                ? "Total keuntungan dari transaksi penjualan"
                : undefined
            }
            withAlert={`Data Laba sudah dikurangi kerugian`}
          />

          <CardStatistik
            icon={{
              icon: TrendingDown,
              bgColor: "bg-rose-100",
              iconColor: "text-rose-400",
            }}
            label={windowSize === "sm" ? "Kerugian" : "Total Kerugian"}
            value={
              windowSize === "sm"
                ? formatRupiahShort(
                    ringkasanStatistik?.data?.totalKerugian ?? 0,
                  )
                : formatRupiah(ringkasanStatistik?.data?.totalKerugian ?? 0)
            }
            caption={
              windowSize !== "sm"
                ? "Total kerugian dari barang keluar"
                : undefined
            }
          />

          <CardStatistik
            icon={{
              icon: PackageX,
              bgColor: "bg-amber-100",
              iconColor: "text-amber-400",
            }}
            label={windowSize === "sm" ? "Rusak" : "Total Barang Rusak"}
            value={
              windowSize === "sm"
                ? formatNumberK(ringkasanStatistik?.data?.totalBarangRusak ?? 0)
                : formatNumber(ringkasanStatistik?.data?.totalBarangRusak ?? 0)
            }
            caption={windowSize !== "sm" ? "Total barang rusak" : undefined}
          />

          <CardStatistik
            icon={{
              icon: PackageMinus,
              bgColor: "bg-amber-100",
              iconColor: "text-amber-400",
            }}
            label={windowSize === "sm" ? "Hilang" : "Total Barang Hilang"}
            value={
              windowSize === "sm"
                ? formatNumberK(
                    ringkasanStatistik?.data?.totalBarangHilang ?? 0,
                  )
                : formatNumber(ringkasanStatistik?.data?.totalBarangHilang ?? 0)
            }
            caption={windowSize !== "sm" ? "Total barang hilang" : undefined}
          />
        </div>
      </div>

      {/* data untuk mobile */}
      <div className="w-full flex flex-col justify-start items-start bg-base-100 shadow-sm rounded-lg border border-transparent dark:border-base-content/10 p-2 gap-2 order-3 md:hidden">
        {isLoadingRiwayatTransaksi ? (
          Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="w-full h-14 skeleton" />
          ))
        ) : isExistDataRiwayatTransaksi && dataRiwayatTransaksi ? (
          dataRiwayatTransaksi?.data?.data.map((item) => (
            <CardData
              key={item.id}
              nomorReferensi={item.nomorTransaksi || ""}
              tanggal={item?.completedAt || new Date()}
              metodePembayaran={item.metodePembayaran || "CASH"}
              statusTempo={item.statusTempo}
              totalItem={item.totalItem}
              totalTransaksi={item.totalBayar}
              status={item.status}
            />
          ))
        ) : (
          <div className="w-full flex flex-col justify-center items-center">
            <DataEmpty
              iconData={History}
              title="Riwayat Tidak Tersedia"
              description="Belum ada data riwayat yang dapat ditampilkan saat ini"
            />
          </div>
        )}
      </div>

      {/* data untuk > mobile */}
      <div className="overflow-x-auto w-full bg-base-100 rounded-xl border border-transparent dark:border-base-content/10 shadow-sm hidden lg:flex order-3">
        <table className="w-full table table-xs table-zebra lg:table-sm mb-2">
          {/* head */}
          <thead>
            <tr className="h-12 bg-base-200 text-xs">
              <th>No. Transaksi</th>
              <th>Tanggal</th>
              <th>Pelanggan</th>
              <th>Total Item</th>
              <th>Total Pembayaran</th>
              <th>Metode Pembayaran</th>
              <th>Status</th>
              <th className="sticky right-0 bg-base-200 z-10">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {false ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan={8}>
                    <div className="skeleton h-12 w-full py-1" />
                  </td>
                </tr>
              ))
            ) : isExistDataRiwayatTransaksi ? (
              dataRiwayatTransaksi?.data?.data.map((item, _) => (
                <tr
                  key={item.id}
                  className={cn(
                    "transition-all duration-75 ease-in-out h-12 text-base-content text-[0.7rem]",
                    // false === true && "bg-base-200",
                  )}
                >
                  <td>
                    <span className="font-medium text-info">
                      {item.nomorTransaksi}
                    </span>
                  </td>
                  <td>
                    {formatTanggalLengkap(item.completedAt ?? new Date())}
                  </td>
                  {/* pelanggan */}
                  <td>
                    <div className="w-full flex flex-row justify-start items-center gap-2">
                      {/* avatar */}
                      <Avatar
                        nama={item.pelanggan.nama}
                        index={item.pelanggan.id}
                        xs
                      />
                      <div className="flex flex-col justify-start items-start">
                        {/* nama */}
                        <span className="font-semibold text-[0.625rem]">
                          {item.pelanggan.nama}
                        </span>
                        {/* no wa */}
                        <span className="font-semibold text-[0.625rem] text-base-content/50">
                          {formatNumberPhone(item.pelanggan.noWa)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{formatNumber(item.totalItem)} item</td>
                  <td>{formatRupiah(item.totalBayar)}</td>
                  <td>
                    <MetodePembayaranComponent
                      metodePembayaran={item.metodePembayaran || "CASH"}
                    />
                  </td>
                  <td>
                    <StatusComponent
                      status={item.status}
                      statusTempo={item.statusTempo}
                    />
                  </td>
                  <td>
                    <button type="button" className="text-info hover:underline">
                      detail
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10}>
                  <div className="w-full h-full flex flex-col justify-center items-center">
                    <DataEmpty
                      title="Data Riwayat Transaksi Tidak Tersedia"
                      description="Belum ada data riwayat transaksi yang dapat ditampilkan saat ini."
                    />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              {!true && true && [1].length! > 8 ? (
                <>
                  <th>No. Transaksi</th>
                  <th>Tanggal</th>
                  <th>Pelanggan</th>
                  <th>Total Item</th>
                  <th>Total Pembayaran</th>
                  <th>Metode Pembayaran</th>
                  <th>Status</th>
                  <th className="sticky right-0 bg-base-200 z-10">Aksi</th>
                </>
              ) : (
                <>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </>
              )}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* pagination */}
      <div className="w-full order-4 -mt-2">
        <PaginationAndLimit
          currentPage={dataRiwayatTransaksi?.data?.meta?.currentPage || 1}
          setPage={setPage}
          totalPage={dataRiwayatTransaksi?.data?.meta?.totalPage || 1}
          limit={dataRiwayatTransaksi?.data?.meta?.limit || 8}
          setLimit={setLimit}
        />
      </div>
    </div>
  );
};

// card data
type CardDataType = {
  nomorReferensi: string;
  tanggal: Date;
  totalItem: number;
  metodePembayaran: PaymentMethodType;
  totalTransaksi: number;
  status?: TransactionStatusType;
  statusTempo?: TempoStatusType;
};
const CardData: FC<CardDataType> = ({
  nomorReferensi,
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
            {nomorReferensi}
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
          <StatusComponent status={status} statusTempo={statusTempo} />
        </div>

        {/* icon */}
        <ChevronRight className="size-4 text-base-content" />
      </div>
    </button>
  );
};

// status component
type StatusComponentProps = {
  status?: TransactionStatusType;
  statusTempo?: TempoStatusType;
};
const StatusComponent: FC<StatusComponentProps> = ({ status, statusTempo }) => {
  return (
    <>
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
        {status === TRANSACTION_STATUS_TYPE.COMPLETED &&
          !statusTempo &&
          "Lunas"}
        {statusTempo === TEMPO_STATUS_TYPE.UNPAID && "Belum Lunas"}
        {statusTempo === TEMPO_STATUS_TYPE.PAID && "Lunas"}
        {statusTempo === TEMPO_STATUS_TYPE.OVERDUE && "Terlambat"}
      </span>
    </>
  );
};

// metode pembayaran
type MetodePembayaranProps = {
  metodePembayaran: PaymentMethodType;
};
const MetodePembayaranComponent: FC<MetodePembayaranProps> = ({
  metodePembayaran,
}) => {
  return (
    <div className="flex gap-2 flex-row justify-start items-center">
      {metodePembayaran === "TRANSFER" && (
        <Landmark className="size-4 text-blue-400" />
      )}
      {metodePembayaran === "QRIS" && (
        <QrCode className="size-4 text-purple-400" />
      )}
      {metodePembayaran === "CASH" && (
        <Banknote className="size-4 text-emerald-400" />
      )}
      {metodePembayaran === "TEMPO" && (
        <CalendarClock className="size-4 text-amber-400" />
      )}

      <span
        className={cn(
          "font-medium capitalize",
          metodePembayaran === "CASH" && "text-emerald-400",
          metodePembayaran === "QRIS" && "text-purple-400",
          metodePembayaran === "TEMPO" && "text-amber-400",
          metodePembayaran === "TRANSFER" && "text-blue-400",
        )}
      >
        {metodePembayaran.toLowerCase()}
      </span>
    </div>
  );
};

export default Transaksi;
