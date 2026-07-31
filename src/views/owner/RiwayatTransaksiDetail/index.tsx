import {
  Banknote,
  BanknoteArrowDown,
  CalendarClock,
  ChartColumn,
  Clock3,
  FileText,
  History,
  Landmark,
  Package,
  QrCode,
  Receipt,
  Sheet,
  ShoppingBag,
} from "lucide-react";
import type { FC } from "react";
import { cn } from "../../../utils/cn";
import {
  formatNumber,
  formatNumberPhone,
  formatRupiah,
  formatRupiahShort,
} from "../../../helpers/helpers";
import { formatTanggalLengkap } from "../../../helpers/formatDate";
import {
  TRANSACTION_STATUS_TYPE,
  type PaymentMethodType,
} from "../../../types/constant.type";
import PaginationAndLimit from "../../../components/filters/PaginationAndLimit";
import DataEmpty from "../../../components/messages/DataEmpty";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import CardStatistik from "../../../components/ui/cards/CardStatistik";
import FilterStatistik from "../../../components/filters/FilterStatistik";
import CardData from "../../../components/ui/cards/CardData";
import StatusTransaction from "../../../components/ui/StatusTransaction";
import Avatar from "../../../components/ui/Avatar";
import useRiwayatTransaksiDetail from "./useRiwayatTransaksiDetail";
import ButtonBackText from "../../../components/ui/button/ButtonBackText";

const RiwayatTransaksiDetail = () => {
  const {
    metodePembayaran,
    handleSetMetodePembayaran,
    windowSize,
    setStatusTempo,
    statusTempo,
    dataRiwayatTransaksi,
    handleSearch,
    isExistDataRiwayatTransaksi,
    isLoadingRiwayatTransaksi,
    setLimit,
    setPage,
    setSort,
    sort,
    pelanggan,
    handleRedirectDetail,
    handleBack,
  } = useRiwayatTransaksiDetail();

  return (
    <div className="w-full ">
      <div className="w-full flex flex-col justify-start items-start gap-2.5 px-2.5 pt-2.5">
        <ButtonBackText handleClick={() => handleBack()} />
        <FilterStatistik
          handleSearch={handleSearch}
          filterSort={{
            handleSort: setSort,
            value: sort,
          }}
          filterMetodePembayaran={{
            handleMetodePembayaran: handleSetMetodePembayaran,
            value: metodePembayaran,
          }}
          filterTempo={{
            handleTempo: setStatusTempo,
            value: statusTempo,
          }}
        />

        {/* data */}
        <div className="bg-base-100 w-full shadow-sm border border-transparent dark:border-base-content/10 rounded-lg p-2.5 gap-4 flex flex-col justify-start items-start">
          <div className="w-full flex flex-row justify-between items-start">
            {/* pelanggan */}
            <div className="w-full md:w-auto flex flex-row justify-start items-center gap-4 border p-2 rounded-lg border-base-content/10">
              <Avatar nama={pelanggan?.nama ?? ""} index={pelanggan?.id} />
              <div className="w-full md:w-auto flex flex-col justify-start items-start gap-1">
                <div className="w-full md:w-auto flex flex-row justify-between md:justify-start items-center md:gap-12">
                  <p className="text-base-content text-sm font-semibold">
                    {pelanggan?.nama}
                  </p>

                  {/* status */}
                  <p
                    className={cn(
                      "px-2 py-0.5  font-medium text-[0.625rem] rounded-md flex justify-center items-center",
                      pelanggan?.isActive
                        ? "bg-emerald-100 text-emerald-400"
                        : "bg-rose-100 text-rose-400",
                    )}
                  >
                    {pelanggan?.isActive ? "Aktif" : "Tidak Aktif"}
                  </p>
                </div>

                <span className="text-[0.625rem]  md:text-xs text-base-content ">
                  {formatNumberPhone(pelanggan?.noWa ?? "")}
                </span>
              </div>
            </div>

            {/* aksi */}
            <div className="flex flex-row justify-end items-center gap-2">
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
          <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2">
            <CardStatistik
              isLoading={isLoadingRiwayatTransaksi}
              icon={{
                icon: Receipt,
                bgColor: "bg-blue-100",
                iconColor: "text-blue-400",
              }}
              label={windowSize === "sm" ? "Transaksi" : "Total Transaksi"}
              value={
                formatNumber(
                  dataRiwayatTransaksi?.data?.data?.statistik?.totalTransaksi ??
                    0,
                ) || "0"
              }
              caption={
                windowSize !== "sm"
                  ? "Jumlah transaksi berdasarkan tanggal"
                  : undefined
              }
            />
            <CardStatistik
              isLoading={isLoadingRiwayatTransaksi}
              icon={{
                icon: BanknoteArrowDown,
                bgColor: "bg-emerald-100",
                iconColor: "text-emerald-400",
              }}
              label={windowSize === "sm" ? "Omzet" : "Total Omzet"}
              value={
                windowSize === "sm"
                  ? formatRupiahShort(
                      dataRiwayatTransaksi?.data?.data?.statistik?.totalOmzet ??
                        0,
                    )
                  : formatRupiah(
                      dataRiwayatTransaksi?.data?.data?.statistik?.totalOmzet ??
                        0,
                    )
              }
              caption={
                windowSize !== "sm"
                  ? "Total omzet dari transaksi penjualan"
                  : undefined
              }
            />
            <CardStatistik
              isLoading={isLoadingRiwayatTransaksi}
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
                      dataRiwayatTransaksi?.data?.data?.statistik
                        ?.totalRataRataTransaksi ?? 0,
                    )
                  : formatRupiah(
                      dataRiwayatTransaksi?.data?.data?.statistik
                        ?.totalRataRataTransaksi ?? 0,
                    )
              }
              caption={
                windowSize !== "sm"
                  ? "Total omzet dari transaksi penjualan"
                  : undefined
              }
            />
            {dataRiwayatTransaksi?.data?.data?.statistik?.totalPiutangTempo !==
              undefined && (
              <CardStatistik
                isLoading={isLoadingRiwayatTransaksi}
                icon={{
                  icon: Clock3,
                  bgColor: "bg-red-100",
                  iconColor: "text-red-400",
                }}
                label={windowSize === "sm" ? "Piutang" : "Total Piutang"}
                value={
                  windowSize === "sm"
                    ? formatRupiahShort(
                        dataRiwayatTransaksi?.data?.data?.statistik
                          ?.totalPiutangTempo ?? 0,
                      )
                    : formatRupiah(
                        dataRiwayatTransaksi?.data?.data?.statistik
                          ?.totalPiutangTempo ?? 0,
                      )
                }
                caption={
                  windowSize !== "sm"
                    ? "Total nilai piutang yang belum dibayar"
                    : undefined
                }
              />
            )}
            <CardStatistik
              isLoading={isLoadingRiwayatTransaksi}
              icon={{
                icon: ShoppingBag,
                bgColor: "bg-purple-100",
                iconColor: "text-purple-400",
              }}
              label={windowSize === "sm" ? "Produk" : "Total Produk Terjual"}
              value={
                dataRiwayatTransaksi?.data?.data?.statistik?.totalProdukTerjual
                  ? formatNumber(
                      dataRiwayatTransaksi?.data?.data?.statistik
                        ?.totalProdukTerjual ?? 0,
                    )
                  : "0"
              }
              caption={
                windowSize !== "sm" ? "Jumlah produk yang terjual" : undefined
              }
            />
            <CardStatistik
              isLoading={isLoadingRiwayatTransaksi}
              icon={{
                icon: Package,
                bgColor: "bg-indigo-100",
                iconColor: "text-indigo-400",
              }}
              label={windowSize === "sm" ? "Item" : "Total Item Terjual"}
              value={
                dataRiwayatTransaksi?.data?.data?.statistik?.totalItemTerjual
                  ? formatNumber(
                      dataRiwayatTransaksi?.data?.data?.statistik
                        ?.totalItemTerjual ?? 0,
                    )
                  : "0"
              }
              caption={
                windowSize !== "sm" ? "Jumlah item yang terjual" : undefined
              }
            />
          </div>
        </div>

        {/* data untuk mobile */}
        <div className="w-full flex flex-col justify-start items-start bg-base-100 shadow-sm rounded-lg border border-transparent dark:border-base-content/10 p-2 gap-2 order-3 lg:hidden">
          {isLoadingRiwayatTransaksi ? (
            Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="w-full h-14 skeleton" />
            ))
          ) : isExistDataRiwayatTransaksi &&
            dataRiwayatTransaksi &&
            dataRiwayatTransaksi?.data?.data.transaksi !== undefined ? (
            dataRiwayatTransaksi.data.data.transaksi?.map((item) => (
              <CardData
                key={item.id}
                nomorReferensi={item.nomorTransaksi || ""}
                tanggal={item?.completedAt || new Date()}
                metodePembayaran={item.metodePembayaran || "CASH"}
                statusTempo={item.statusTempo}
                totalItem={item.totalItem}
                totalTransaksi={item.totalBayar}
                status={item.status}
                handleRedirectDetail={() => handleRedirectDetail(item.id)}
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
              <tr className="h-12 bg-base-100 text-xs">
                <th>No. Transaksi</th>
                <th>Tanggal</th>
                <th>Total Item</th>
                <th>Total Pembayaran</th>
                <th>Pembayaran</th>
                <th>Status</th>
                <th className="sticky right-0 bg-base-100 z-10">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {false ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={7}>
                      <div className="skeleton h-12 w-full py-1" />
                    </td>
                  </tr>
                ))
              ) : isExistDataRiwayatTransaksi &&
                dataRiwayatTransaksi?.data?.data.transaksi !== undefined ? (
                dataRiwayatTransaksi?.data?.data.transaksi.map((item, _) => (
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
                      {formatTanggalLengkap(
                        item.status === TRANSACTION_STATUS_TYPE.BOOKING
                          ? (item.tanggalBooking ?? new Date())
                          : (item.completedAt ?? new Date()),
                      )}
                    </td>
                    <td>{formatNumber(item.totalItem)} item</td>
                    <td>{formatRupiah(item.totalBayar)}</td>
                    <td>
                      <MetodePembayaranComponent
                        metodePembayaran={item.metodePembayaran || "CASH"}
                      />
                    </td>
                    <td>
                      <StatusTransaction
                        status={item.status}
                        statusTempo={item.statusTempo}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="text-info hover:underline"
                        onClick={() => handleRedirectDetail(item.id)}
                      >
                        detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
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
          </table>
        </div>

        {/* pagination */}
        {dataRiwayatTransaksi?.data?.data?.transaksi && (
          <div className="w-full order-4 -mt-2">
            <PaginationAndLimit
              currentPage={dataRiwayatTransaksi?.data?.meta?.currentPage || 1}
              setPage={setPage}
              totalPage={dataRiwayatTransaksi?.data?.meta?.totalPage || 1}
              limit={dataRiwayatTransaksi?.data?.meta?.limit || 8}
              setLimit={setLimit}
            />
          </div>
        )}
      </div>
    </div>
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

export default RiwayatTransaksiDetail;
