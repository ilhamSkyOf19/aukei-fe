import {
  BanknoteArrowDown,
  CalendarClock,
  Package,
  PackageCheck,
  PackageSearch,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";
import CardStatistik from "../../../components/ui/cards/CardStatistik";
import {
  formatNumber,
  formatNumberPhone,
  formatRupiah,
} from "../../../helpers/helpers";
import Avatar from "../../../components/ui/Avatar";
import { cn } from "../../../utils/cn";
import InputSearch from "../../../components/inputs/InputSearch";
import FilterSort from "../../../components/filters/Sort";
import { formatTanggalLengkap } from "../../../helpers/formatDate";
import DataEmpty from "../../../components/messages/DataEmpty";
import PaginationAndLimit from "../../../components/filters/PaginationAndLimit";
import NotCompatible from "../../../components/messages/NotCompatible";
import ButtonBackText from "../../../components/ui/button/ButtonBackText";
import useBookingByPelanggan from "./useBookingByPelanggan";
import { ROLE_INTERNAL_TYPE } from "../../../types/constant.type";
import CardLabelMetodePembayaran from "../../../components/ui/cards/CardLabelMetodePembayaran";
import CardDataTransaksiBookingDetail from "../../../components/ui/cards/CardDataTransaksiBookingDetail";

const filterStatus: { label: string; value: string }[] = [
  {
    label: "Semua Transaksi",
    value: "semua",
  },
  {
    label: "Belum Lunas",
    value: "unpaid",
  },
  {
    label: "Lunas",
    value: "paid",
  },
];

const BookingByPelanggan = () => {
  const {
    windowSize,
    navigate,
    setStatus,
    status,
    handleLimit,
    handlePage,
    isExistDataBookingByPelanggan,
    setSearch,
    setSort,
    sort,
    handleRedirectDetail,
    dataBookingByPelanggan,
    dataStatistikBookingByPelanggan,
    isLoadingDataBookingByPelanggan,
    isLoadingStatistikBookingByPelanggan,
    pengguna,
  } = useBookingByPelanggan();

  return (
    <div className="w-full h-screen overflow-y-auto">
      {(windowSize === "lg" && pengguna?.role === ROLE_INTERNAL_TYPE.KASIR) ||
      pengguna?.role === ROLE_INTERNAL_TYPE.OWNER ? (
        <div className="w-full mb-30 md:mb-10 lg:mb-20 p-2 flex flex-col justify-start items-start">
          <ButtonBackText handleClick={() => navigate("/dashboard/booking")} />
          {/* statistik */}
          <div className="w-full flex flex-col justify-start items-start gap-2.5 bg-base-100 rounded-2xl shadow-sm border border-transparent dark:border-base-content/10 md:rounded-xl p-2.5 mt-2.5">
            <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div className="col-span-1 flex flex-row justify-start items-center gap-4 border p-2 rounded-lg border-base-content/10">
                <Avatar
                  nama={
                    dataStatistikBookingByPelanggan?.data?.pelanggan?.nama ?? ""
                  }
                  index={dataStatistikBookingByPelanggan?.data?.pelanggan?.id}
                />
                <div className="w-full flex flex-col justify-start items-start gap-1">
                  <div className="w-full flex flex-row justify-between items-center md:gap-12">
                    <p className="text-base-content text-sm font-semibold">
                      {dataStatistikBookingByPelanggan?.data?.pelanggan?.nama}
                    </p>

                    {/* status */}
                    <p
                      className={cn(
                        "px-2 py-0.5  font-medium text-[0.625rem] rounded-md flex justify-center items-center",
                        dataStatistikBookingByPelanggan?.data?.pelanggan
                          ?.isActive
                          ? "bg-emerald-100 text-emerald-400"
                          : "bg-rose-100 text-rose-400",
                      )}
                    >
                      {dataStatistikBookingByPelanggan?.data?.pelanggan
                        ?.isActive
                        ? "Aktif"
                        : "Tidak Aktif"}
                    </p>
                  </div>

                  <span className="text-[0.625rem]  md:text-xs text-base-content ">
                    {formatNumberPhone(
                      dataStatistikBookingByPelanggan?.data?.pelanggan?.noWa ??
                        "",
                    )}
                  </span>
                </div>
              </div>

              <CardStatistik
                icon={{
                  icon: CalendarClock,
                  bgColor: "bg-amber-50",
                  iconColor: "text-amber-600",
                }}
                label="Total Booking"
                value={
                  dataStatistikBookingByPelanggan?.data?.totalBooking &&
                  dataStatistikBookingByPelanggan?.data?.totalBooking > 0
                    ? formatNumber(
                        dataStatistikBookingByPelanggan?.data?.totalBooking ??
                          0,
                      )
                    : "0"
                }
                caption={windowSize === "sm" ? "" : "Total transaksi booking."}
                isLoading={isLoadingStatistikBookingByPelanggan}
              />

              <CardStatistik
                icon={{
                  icon: TrendingUp,
                  bgColor: "bg-blue-50",
                  iconColor: "text-blue-600",
                }}
                label="Estimasi Omzet"
                value={formatRupiah(
                  dataStatistikBookingByPelanggan?.data?.estimasiOmzet ?? 0,
                )}
                caption={windowSize === "sm" ? "" : "Estimasi omzet booking."}
                isLoading={isLoadingStatistikBookingByPelanggan}
              />

              <CardStatistik
                icon={{
                  icon: BanknoteArrowDown,
                  bgColor: "bg-emerald-50",
                  iconColor: "text-emerald-600",
                }}
                label="Kas Masuk"
                value={formatRupiah(
                  dataStatistikBookingByPelanggan?.data?.kasMasuk ?? 0,
                )}
                caption={windowSize === "sm" ? "" : "Kas masuk booking."}
                isLoading={isLoadingStatistikBookingByPelanggan}
              />

              <CardStatistik
                icon={{
                  icon: Wallet,
                  bgColor: "bg-rose-50",
                  iconColor: "text-rose-400",
                }}
                label="Sisa Pembayaran"
                value={formatRupiah(
                  dataStatistikBookingByPelanggan?.data?.sisaPembayaran ?? 0,
                )}
                caption={
                  windowSize === "sm"
                    ? ""
                    : "Sisa pembayaran yang masih harus dibayar."
                }
                isLoading={isLoadingStatistikBookingByPelanggan}
              />

              <CardStatistik
                icon={{
                  icon: Package,
                  bgColor: "bg-blue-50",
                  iconColor: "text-blue-400",
                }}
                label="Total Item Booking"
                value={formatNumber(
                  dataStatistikBookingByPelanggan?.data?.totalItemBooking ?? 0,
                )}
                caption={
                  windowSize === "sm" ? "" : "Total item booking keseluruhan."
                }
                isLoading={isLoadingStatistikBookingByPelanggan}
              />

              <CardStatistik
                icon={{
                  icon: PackageCheck,
                  bgColor: "bg-emerald-50",
                  iconColor: "text-emerald-400",
                }}
                label="Total Item Dikirim"
                caption={
                  windowSize === "sm" ? "" : "Total item yang sudah dikirim."
                }
                value={formatNumber(
                  dataStatistikBookingByPelanggan?.data?.totalItemDikirim ?? 0,
                )}
                isLoading={isLoadingStatistikBookingByPelanggan}
              />

              <CardStatistik
                icon={{
                  icon: PackageSearch,
                  bgColor: "bg-amber-50",
                  iconColor: "text-amber-400",
                }}
                label="Total Item Belum Dikirim"
                caption={
                  windowSize === "sm" ? "" : "Total item yang belum dikirim."
                }
                value={formatNumber(
                  dataStatistikBookingByPelanggan?.data?.totalSisaItem ?? 0,
                )}
              />
            </div>
          </div>

          {/* filter */}
          <div className="w-full flex flex-col md:flex-row justify-start items-start gap-4 md:gap-2.5 bg-base-100 rounded-2xl shadow-sm border border-transparent dark:border-base-content/10 md:rounded-xl p-2.5 mt-2.5">
            <div className="flex-1 order-2 md:order-1">
              <div role="tablist" className="tabs tabs-border">
                {filterStatus.map((item, index) => (
                  <a
                    key={index}
                    role="tab"
                    onClick={() => setStatus(item.value)}
                    className={cn(
                      "tab text-xs",
                      item.value === (status || "semua")
                        ? "text-emerald-600 tab-active"
                        : "text-base-content",
                    )}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="w-full order-1 md:order-2 md:flex-1 flex flex-row justify-start items-start gap-2.5">
              <InputSearch
                handleSearch={setSearch}
                placeholder="Cari nomor transaksi ..."
              />

              <FilterSort
                setSort={setSort}
                customWidth="w-40"
                noLabel
                value={sort}
              />
            </div>
          </div>

          {/* DATA SM */}

          <div className="w-full flex flex-col justify-start items-start bg-base-100 shadow-sm rounded-2xl border border-transparent dark:border-base-content/10 p-2 gap-2.5 lg:hidden mt-2.5">
            {isLoadingDataBookingByPelanggan ? (
              Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="w-full h-14 skeleton" />
              ))
            ) : isExistDataBookingByPelanggan && dataBookingByPelanggan ? (
              dataBookingByPelanggan?.data?.data?.transaksi?.map((item) => (
                <CardDataTransaksiBookingDetail
                  handleRedirectDetail={() => handleRedirectDetail(item.id)}
                  key={item.id}
                  metodePembayaran={item.metodePembayaran}
                  totalBayar={item.totalBayar}
                  totalItem={item.totalItem}
                  nomorReferensi={item.nomorTransaksi ?? ""}
                  tanggalBooking={item.tanggalBooking ?? new Date()}
                  diBayar={item.diBayar ?? 0}
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
          <div className="overflow-x-auto w-full bg-base-100 rounded-xl border border-transparent dark:border-base-content/10 shadow-sm hidden lg:flex mt-2.5">
            <table className="w-full table table-xs table-zebra lg:table-sm mb-2">
              {/* head */}
              <thead>
                <tr className="h-12 bg-base-200 text-xs">
                  <th>No. Transaksi</th>
                  <th>Total Item</th>
                  <th>Total Bayar</th>
                  <th>Dibayar</th>
                  <th>Kurang</th>
                  <th>Dikirim</th>
                  <th>Sisa</th>
                  <th>Metode Pembayaran</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingDataBookingByPelanggan ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index}>
                      <td colSpan={8}>
                        <div className="skeleton h-12 w-full py-1" />
                      </td>
                    </tr>
                  ))
                ) : isExistDataBookingByPelanggan ? (
                  dataBookingByPelanggan?.data?.data?.transaksi?.map(
                    (item, _) => (
                      <tr
                        key={item.id}
                        className={cn(
                          "transition-all duration-75 ease-in-out h-12 text-base-content text-[0.7rem]",
                          // false === true && "bg-base-200",
                        )}
                      >
                        <td>
                          <div className="flex flex-col justify-start items-start">
                            <span className="font-medium text-info">
                              {item?.nomorTransaksi}
                            </span>
                            <span className="text-[0.625rem]">
                              {formatTanggalLengkap(
                                item.tanggalBooking ?? new Date(),
                              )}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="font-medium">
                            {formatNumber(item.totalItem)} Pcs
                          </span>
                        </td>
                        <td>
                          <span className="text-info font-medium">
                            {formatRupiah(item.totalBayar)}
                          </span>
                        </td>
                        <td>
                          <span className="text-success font-medium">
                            {formatRupiah(item.diBayar ?? 0)}
                          </span>
                        </td>
                        <td>
                          <span className="text-error font-medium">
                            {formatRupiah(
                              item.totalBayar - (item.diBayar ?? 0),
                            )}
                          </span>
                        </td>
                        <td>
                          <span className="text-success font-medium">
                            {formatNumber(item.totalQuantityDelivered ?? 0)} Pcs
                          </span>
                        </td>
                        <td>
                          <span className="text-error font-medium">
                            {formatNumber(item.totalSisaQuantity ?? 0)} Pcs
                          </span>
                        </td>
                        <td>
                          <CardLabelMetodePembayaran
                            metodePembayaran={item.metodePembayaran!}
                            noLabel
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
                    ),
                  )
                ) : (
                  <tr>
                    <td colSpan={10}>
                      <div className="w-full h-full flex flex-col justify-center items-center">
                        <DataEmpty
                          iconData={Receipt}
                          title="Data Transaksi Tempo Tidak Tersedia"
                          description="Belum ada data transaksi tempo yang dapat ditampilkan saat ini."
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* pagination */}
          <PaginationAndLimit
            currentPage={dataBookingByPelanggan?.data?.meta?.currentPage ?? 1}
            setPage={handlePage}
            totalPage={dataBookingByPelanggan?.data?.meta?.totalPage ?? 1}
            emptyData={!isExistDataBookingByPelanggan}
            isLoading={isLoadingDataBookingByPelanggan}
            limit={dataBookingByPelanggan?.data?.meta?.limit ?? 8}
            setLimit={handleLimit}
          />
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <NotCompatible />
        </div>
      )}
    </div>
  );
};

export default BookingByPelanggan;
