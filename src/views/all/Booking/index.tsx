import {
  BanknoteArrowDown,
  CalendarClock,
  PackageSearch,
  Receipt,
  TrendingUp,
  Truck,
} from "lucide-react";
import { cn } from "../../../utils/cn";
import {
  formatNumber,
  formatNumberPhone,
  formatRupiah,
} from "../../../helpers/helpers";
import PaginationAndLimit from "../../../components/filters/PaginationAndLimit";
import DataEmpty from "../../../components/messages/DataEmpty";
import Avatar from "../../../components/ui/Avatar";
import StatusTransaction from "../../../components/ui/StatusTransaction";
import useBooking from "./useBooking";
import AlertLabel from "../../../components/messages/AlertLabel";
import InputSearch from "../../../components/inputs/InputSearch";
import FilterSort from "../../../components/filters/Sort";
import CardStatistik from "../../../components/ui/cards/CardStatistik";
import CardDataTransaksiBooking from "../../../components/ui/cards/CardDataTransaksiBooking";
import { ROLE_INTERNAL_TYPE } from "../../../types/constant.type";

const RiwayatTransaksi = () => {
  const {
    windowSize,
    setSort,
    sort,
    handleLimit,
    handlePage,
    isExistDataTransaksiBooking,
    pengguna,
    setSearch,
    dataTransaksiBooking,
    isLoadingDataTransaksiBooking,
    handleRedirect,
    dataStatistikBooking,
    isLoadingStatistikBooking,
    dataKebutuhanBarang,
    isLoadingKebutuhanBarang,
  } = useBooking();

  // sesuiakan lagi dengan ui yang sudah diperbarui

  return (
    <div className="w-full">
      <div className="w-full flex flex-col justify-start items-start gap-2.5 px-2.5 pt-2.5">
        {/* statistik */}
        <div
          className={cn(
            "w-full grid grid-cols-2 md:grid-cols-2 gap-2.5 bg-base-100 rounded-2xl shadow-sm border border-transparent dark:border-base-content/10 md:rounded-xl p-2.5",
            pengguna?.role === ROLE_INTERNAL_TYPE.OWNER
              ? "lg:grid-cols-3"
              : "lg:grid-cols-4",
          )}
        >
          {/* total produk booking */}
          <CardStatistik
            icon={{
              icon: PackageSearch,
              bgColor: "bg-rose-50",
              iconColor: "text-rose-600",
            }}
            label="Total Produk Booking"
            value={formatNumber(dataKebutuhanBarang?.data?.length ?? 0)}
            caption={windowSize === "sm" ? "" : "Total produk yang dibooking."}
            isLoading={isLoadingKebutuhanBarang}
          />

          {/* total stok yang dibooking */}
          <CardStatistik
            icon={{
              icon: Truck,
              bgColor: "bg-amber-50",
              iconColor: "text-amber-600",
            }}
            label="Total Stok Yang Dibooking"
            value={formatNumber(
              dataKebutuhanBarang?.data?.reduce(
                (total, item) => total + item.produk.stokBooking,
                0,
              ) ?? 0,
            )}
            caption={windowSize === "sm" ? "" : "Stok yang dibooking"}
            isLoading={isLoadingKebutuhanBarang}
          />

          {/* total stok yang sudah terpenuhi */}
          <CardStatistik
            icon={{
              icon: Truck,
              bgColor: "bg-emerald-50",
              iconColor: "text-emerald-600",
            }}
            label="Total Stok Terpenuhi"
            value={formatNumber(
              dataKebutuhanBarang?.data?.reduce(
                (total, item) =>
                  total +
                  Math.min(
                    item.produk.stokBooking,
                    item.produk.stokTersedia < 0 ? 0 : item.produk.stokTersedia,
                  ),
                0,
              ) ?? 0,
            )}
            caption={windowSize === "sm" ? "" : "Stok yang sudah terpenuhi"}
            isLoading={isLoadingKebutuhanBarang}
          />

          {/* total stok yang belum terpenuhi */}
          <CardStatistik
            icon={{
              icon: Truck,
              bgColor: "bg-rose-50",
              iconColor: "text-rose-600",
            }}
            label="Total Stok Belum Terpenuhi"
            value={formatNumber(
              dataKebutuhanBarang?.data?.reduce(
                (total, item) => total + item.produk.totalKebutuhanStok,
                0,
              ) ?? 0,
            )}
            caption={windowSize === "sm" ? "" : "Stok yang belum terpenuhi"}
            isLoading={isLoadingKebutuhanBarang}
          />

          {pengguna?.role === "OWNER" && (
            <>
              <CardStatistik
                icon={{
                  icon: CalendarClock,
                  bgColor: "bg-amber-50",
                  iconColor: "text-amber-600",
                }}
                label="Total Booking"
                value={
                  dataStatistikBooking?.data?.totalBooking &&
                  dataStatistikBooking?.data?.totalBooking > 0
                    ? formatNumber(
                        dataStatistikBooking?.data?.totalBooking ?? 0,
                      )
                    : "0"
                }
                caption={windowSize === "sm" ? "" : "Total transaksi booking."}
                isLoading={isLoadingStatistikBooking}
              />

              <CardStatistik
                icon={{
                  icon: TrendingUp,
                  bgColor: "bg-blue-50",
                  iconColor: "text-blue-600",
                }}
                label="Estimasi Omzet"
                value={formatRupiah(
                  dataStatistikBooking?.data?.estimasiOmzet ?? 0,
                )}
                caption={windowSize === "sm" ? "" : "Estimasi omzet booking."}
                isLoading={isLoadingStatistikBooking}
              />

              <CardStatistik
                icon={{
                  icon: BanknoteArrowDown,
                  bgColor: "bg-emerald-50",
                  iconColor: "text-emerald-600",
                }}
                label="Kas Masuk"
                value={formatRupiah(dataStatistikBooking?.data?.kasMasuk ?? 0)}
                caption={windowSize === "sm" ? "" : "Kas masuk booking."}
                isLoading={isLoadingStatistikBooking}
              />
            </>
          )}
        </div>

        {/* filter */}
        <div className="w-full bg-base-100 p-2.5 shadow-sm border border-transparent dark:border-base-content/10 rounded-2xl md:rounded-xl md:hidden flex flex-col justify-start items-start gap-4">
          <InputSearch handleSearch={setSearch} />
        </div>

        {/* filter */}
        <div className="w-full grid grid-cols-2 md:flex md:flex-row md:justify-between md:items-center bg-base-100 shadow-sm border border-transparent dark:border-base-content/10 rounded-2xl md:rounded-xl p-2.5 gap-2 lg:gap-12">
          <div
            className={cn(
              " hidden md:flex md:w-80 flex-col justify-start items-start gap-2",
            )}
          >
            <InputSearch handleSearch={setSearch} withLabel />
          </div>

          <div className="col-span-1 md:w-40">
            <FilterSort setSort={setSort} customWidth="w-full" value={sort} />
          </div>
        </div>

        {/* DATA SM */}
        <div className="w-full flex flex-col justify-start items-start bg-base-100 shadow-sm rounded-2xl border border-transparent dark:border-base-content/10 p-2 gap-2.5 lg:hidden">
          {isLoadingDataTransaksiBooking ? (
            Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="w-full h-14 skeleton" />
            ))
          ) : isExistDataTransaksiBooking && dataTransaksiBooking ? (
            dataTransaksiBooking?.data?.data.map((item) => (
              <CardDataTransaksiBooking
                handleRedirectDetail={() => handleRedirect(item.pelanggan.id)}
                key={item.id}
                status={item.status}
                pelanggan={item.pelanggan}
                totalItemBooking={item.totalItemBooking}
                totalTransaksi={item.totalTransaksiBooking}
              />
            ))
          ) : (
            <div className="w-full flex flex-col justify-center items-center">
              <DataEmpty
                iconData={CalendarClock}
                title="Data Transaksi Booking Tidak Tersedia"
                description="Belum ada data transaksi booking yang dapat ditampilkan saat ini"
              />
            </div>
          )}
        </div>

        {/* DATA LG */}
        <div className="overflow-x-auto w-full bg-base-100 rounded-xl border border-transparent dark:border-base-content/10 shadow-sm hidden lg:flex ">
          <table className="w-full table table-xs table-zebra lg:table-sm mb-2">
            {/* head */}
            <thead>
              <tr className="h-12 bg-base-200 text-xs">
                <th>Pelanggan</th>
                <th>Total Transaksi</th>
                <th>Total Item Booking</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingDataTransaksiBooking ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={8}>
                      <div className="skeleton h-12 w-full py-1" />
                    </td>
                  </tr>
                ))
              ) : isExistDataTransaksiBooking ? (
                dataTransaksiBooking?.data?.data.map((item, _) => (
                  <tr
                    key={item.id}
                    className={cn(
                      "transition-all duration-75 ease-in-out h-12 text-base-content text-[0.7rem]",
                      // false === true && "bg-base-200",
                    )}
                  >
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
                          <span className="text-[0.625rem] text-base-content/50">
                            {formatNumberPhone(item.pelanggan.noWa)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      {formatNumber(item.totalTransaksiBooking)} Transaksi
                    </td>
                    <td>
                      <span className="font-medium">
                        {item.totalItemBooking > 0
                          ? `${formatNumber(item.totalItemBooking)} Pcs`
                          : "-"}
                      </span>
                    </td>
                    <td>
                      <StatusTransaction status={item.status} />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="text-info hover:underline"
                        onClick={() => handleRedirect(item.pelanggan.id)}
                      >
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
                        iconData={Receipt}
                        title="Data Transaksi Booking Tidak Tersedia"
                        description="Belum ada data transaksi booking yang dapat ditampilkan saat ini."
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* alert label */}
        {isExistDataTransaksiBooking && (
          <AlertLabel message="Data yang ditampilkan adalah data transaksi booking yang belum selesai dikirim." />
        )}

        {/* pagination */}
        <div className="w-full order-4 -mt-2">
          <PaginationAndLimit
            currentPage={dataTransaksiBooking?.data?.meta?.currentPage || 1}
            setPage={handlePage}
            totalPage={dataTransaksiBooking?.data?.meta?.totalPage || 1}
            limit={dataTransaksiBooking?.data?.meta?.limit || 8}
            setLimit={handleLimit}
          />
        </div>
      </div>
    </div>
  );
};

export default RiwayatTransaksi;
