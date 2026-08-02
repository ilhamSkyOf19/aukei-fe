import { type FC } from "react";
import { cn } from "../../../../utils/cn";
import {
  formatNumber,
  formatNumberK,
  generateColorForStok,
} from "../../../../helpers/helpers";
import DataEmpty from "../../../../components/messages/DataEmpty";
import FilterSort from "../../../../components/filters/Sort";
import FilterKategori from "../../../../components/filters/Kategori";
import InputSearch from "../../../../components/inputs/InputSearch";
import PaginationAndLimit from "../../../../components/filters/PaginationAndLimit";
import useDataBooking from "./useDataBooking";
import CardStatistik from "../../../../components/ui/cards/CardStatistik";
import {
  CalendarClock,
  CircleAlert,
  Package,
  PackagePlus,
  PackageSearchIcon,
} from "lucide-react";
import type { StatistikKebutuhanBarangType } from "../../../../models/transaction.model";

type Props = {
  pilihan: string;
};
const DataBooking: FC<Props> = ({ pilihan }) => {
  const {
    daftarKebutuhanBarang,
    isExistDataKebutuhanBarang,
    isLoadingDaftarKebutuhanBarang,
    handleKategori,
    handleLimit,
    handlePage,
    handleSearch,
    handleSort,
    sort,
    kategori,
    statistikDaftarKebutuhanBarang,
  } = useDataBooking({ pilihan });
  return (
    <div className="w-full flex flex-col justify-start items-start gap-2.5 -mt-2">
      {/* filter */}
      <div className="w-full flex flex-col justify-start items-start bg-base-100 p-2.5 rounded-2xl md:rounded-xl shadow-sm border border-transparent dark:border-base-content/10">
        <div className="w-full flex flex-col md:flex-row justify-start items-start md:items-start">
          <div className="w-full md:flex-1 flex flex-col justify-start items-start gap-1.5">
            <InputSearch
              handleSearch={handleSearch}
              placeholder="Cari produk berdasarkan nama atau kode ..."
              withLabel
            />
          </div>

          <div className="w-full md:flex-wrap md:flex-2 flex flex-row justify-start md:justify-end items-center gap-3 md:gap-4 mt-3 md:mt-0">
            {/* filter kategori */}
            <FilterKategori
              setKategori={handleKategori}
              customWidth="w-full md:w-40"
              value={kategori}
            />

            {/* filter sort */}
            <FilterSort
              setSort={handleSort}
              customWidth="w-full md:w-30"
              value={sort}
            />
          </div>
        </div>

        {/* data statistik */}
        <div className="w-full flex flex-col justify-start items-start mt-2.5 md:mt-6">
          <div className="w-full gap-0.5 flex flex-col justify-start items-start mb-4">
            <span className="text-sm font-medium text-base-content">
              Ringkasan Data Booking
            </span>
            <span className="w-full text-[0.7rem] md:w-[70%] text-base-content/70">
              Ringkasan data booking di bawah ini dihitung berdasarkan filter
              yang sedang diterapkan, seperti pencarian, kategori, jumlah data
              per halaman (limit), serta urutan data.
            </span>
          </div>
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <CardStatistik
              isLoading={isLoadingDaftarKebutuhanBarang}
              icon={{
                icon: PackageSearchIcon,
                bgColor: "bg-amber-100",
                iconColor: "text-amber-400",
              }}
              label={"Total Produk Booking"}
              value={formatNumber(
                statistikDaftarKebutuhanBarang.totalProdukBooking ?? 0,
              )}
            />
            <CardStatistik
              isLoading={isLoadingDaftarKebutuhanBarang}
              icon={{
                icon: Package,
                bgColor: "bg-blue-100",
                iconColor: "text-blue-400",
              }}
              label={"Total Item Booking"}
              value={formatNumber(
                statistikDaftarKebutuhanBarang.totalItemBooking ?? 0,
              )}
            />
            <CardStatistik
              isLoading={isLoadingDaftarKebutuhanBarang}
              icon={{
                icon: PackagePlus,
                bgColor: "bg-emerald-100",
                iconColor: "text-emerald-400",
              }}
              label={"Total Kebutuhan Stok"}
              value={formatNumber(
                statistikDaftarKebutuhanBarang.totalKebutuhanStok ?? 0,
              )}
            />
            <CardStatistik
              isLoading={isLoadingDaftarKebutuhanBarang}
              icon={{
                icon: PackagePlus,
                bgColor: "bg-emerald-100",
                iconColor: "text-emerald-400",
              }}
              label={"Total Produk Perlu Restock"}
              value={formatNumber(
                statistikDaftarKebutuhanBarang.totalProdukPerluRestock ?? 0,
              )}
            />
          </div>
        </div>
      </div>

      {/* buat untuk mobile  */}
      <div className="flex w-full flex-col justify-start items-center gap-2 mt-2.5 lg:hidden">
        {/* card */}
        {isLoadingDaftarKebutuhanBarang ? (
          <>
            <div className="w-full h-20 skeleton border border-base-content/10" />
            <div className="w-full h-20 skeleton border border-base-content/10" />
            <div className="w-full h-20 skeleton border border-base-content/10" />
          </>
        ) : isExistDataKebutuhanBarang ? (
          daftarKebutuhanBarang?.data?.data?.map((produk, _) => (
            <CardProdukBooking key={produk.id} produk={produk} />
          ))
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <DataEmpty
              title="Data Booking Tidak Tersedia"
              description="Belum ada data booking yang dapat ditampilkan saat ini"
              xs
            />
          </div>
        )}
      </div>

      {/* data */}
      <div className="overflow-x-auto w-full bg-base-100 rounded-xl border border-transparent dark:border-base-content/10 shadow-sm hidden lg:flex">
        <table className="table table-xs lg:table-sm table-zebra">
          {/* head */}
          <thead>
            <tr className="h-12 bg-base-200 text-[0.7rem]">
              <th>Foto</th>
              <th>Kode</th>
              <th>Nama</th>
              <th>Kategori</th>
              <th>Stok Tersedia</th>
              <th>Stok Minimum</th>
              <th>Stok Dibooking</th>
              <th>Stok Dibutuhkan</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingDaftarKebutuhanBarang ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan={10}>
                    <div className="skeleton h-12 w-full py-1" />
                  </td>
                </tr>
              ))
            ) : isExistDataKebutuhanBarang ? (
              daftarKebutuhanBarang?.data?.data?.map((produk, _) => (
                <tr
                  key={produk.id}
                  className={cn(
                    "transition-all duration-75 ease-in-out h-18 text-[0.7rem] text-base-content",
                  )}
                >
                  {/* foto */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-10 h-10 lg:h-12 lg:w-12">
                          <img
                            src={produk.img}
                            alt="Foto Produk"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* kode */}
                  <td className="font-medium text-info">{produk.kode}</td>
                  {/* nama */}
                  <td>{produk.nama}</td>
                  {/* kategori */}
                  <td>{produk.kategori}</td>
                  {/* stok */}
                  <td
                    className={cn(
                      "font-medium",
                      generateColorForStok(
                        produk.stokTersedia,
                        produk.stokMinimum,
                      ),
                    )}
                  >
                    {formatNumber(produk.stokTersedia.toString())}
                  </td>

                  {/* stok minimum */}
                  <td>
                    <span className="font-semibold mr-1">
                      {formatNumber(produk.stokMinimum)}
                    </span>
                  </td>
                  {/* stok di booking */}
                  <td>
                    <span className="font-semibold mr-1">
                      {formatNumber(produk.stokBooking)}
                    </span>
                  </td>
                  {/* stok di butuhkan */}
                  <td>
                    <span className="font-semibold mr-1">
                      {formatNumber(produk.totalKebutuhanStok)}
                    </span>
                  </td>

                  <td>
                    {produk?.stokBooking <= produk.stokTersedia ? (
                      <span className="text-[0.625rem] font-medium text-primary-white py-1 px-1.5 rounded-full bg-emerald-500 ">
                        Cukup
                      </span>
                    ) : (
                      <span className="text-[0.625rem] font-medium text-primary-white py-1 px-1.5 rounded-full bg-rose-500 ">
                        Kurang
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10}>
                  <div className="w-full h-full flex flex-col justify-center items-center">
                    <DataEmpty
                      title="Data Produk Tidak Tersedia"
                      description="Belum ada data produk yang dapat ditampilkan saat ini."
                    />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* pagination and limti */}
      <PaginationAndLimit
        currentPage={daftarKebutuhanBarang?.data?.meta?.currentPage ?? 1}
        totalPage={daftarKebutuhanBarang?.data?.meta?.totalPage ?? 1}
        setPage={handlePage}
        setLimit={handleLimit}
        limit={daftarKebutuhanBarang?.data?.meta?.limit ?? 8}
        isLoading={isLoadingDaftarKebutuhanBarang}
        emptyData={!isExistDataKebutuhanBarang}
      />
    </div>
  );
};

type CardProdukBookingProps = {
  produk: StatistikKebutuhanBarangType;
};

// card produk
const CardProdukBooking: FC<CardProdukBookingProps> = ({ produk }) => {
  return (
    <div className="w-full bg-base-100 rounded-2xl flex flex-col justify-start items-start p-4 border border-transparent dark:border-base-content/10 gap-2">
      {/* content 1 */}
      <div className="w-full flex flex-row justify-between items-stretch pb-3 border-b border-base-content/10">
        <div className="flex-8 flex flex-row justify-start items-start gap-4">
          <div className="flex flex-row justify-start items-start gap-3">
            {/* foto */}
            <div className="w-16 h-16 overflow-hidden rounded-2xl">
              <img src={produk.img} alt="foto produk" loading="lazy" />
            </div>
          </div>

          {/* deskripsi */}
          <div className="flex flex-col justify-start items-start gap-1.5">
            {/* kode produk */}
            <span className="text-[0.7rem] font-medium text-base-content/70 dark:text-base-content">
              {produk.kode}
            </span>
            {/* nama produk */}
            <span className="text-sm font-medium text-base-content">
              {produk.nama}
            </span>

            {/* kategori produk */}
            <span className="text-xs text-base-content/70">
              {produk.kategori}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-row justify-end items-start">
          {produk?.stokBooking <= produk.stokTersedia ? (
            <span className="text-[0.625rem] font-medium text-primary-white py-1 px-1.5 rounded-full bg-emerald-500 ">
              Cukup
            </span>
          ) : (
            <span className="text-[0.625rem] font-medium text-primary-white py-1 px-1.5 rounded-full bg-rose-500 ">
              Kurang
            </span>
          )}
        </div>
      </div>

      {/* content 2 */}
      <div className="w-full flex flex-row justify-evenly items-start gap-4 pt-1">
        <div className="flex-1 flex flex-col justify-start items-start gap-1 border-r border-base-content/10">
          {/* label */}
          <div className="flex flex-row justify-start items-center gap-1">
            {/* icon */}
            <div className="w-5 h-5 rounded-full flex justify-center items-center bg-purple-100">
              <Package className="text-purple-400 size-2.5" />
            </div>

            {/* label */}
            <span className="text-[0.625rem] text-base-content">Stok</span>
          </div>

          {/* value */}
          <span className="text-[0.7rem] font-medium text-base-content">
            {formatNumberK(produk.stokTersedia)}
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-start items-start gap-1 border-r border-base-content/10">
          {/* label */}
          <div className="flex flex-row justify-start items-center gap-1">
            {/* icon */}
            <div className="w-5 h-5 rounded-full flex justify-center items-center bg-emerald-100">
              <CircleAlert className="text-emerald-400 size-2.5" />
            </div>

            {/* label */}
            <span className="text-[0.625rem] text-base-content">Min.</span>
          </div>

          {/* value */}
          <span className="text-[0.7rem] font-medium text-base-content">
            {formatNumberK(produk.stokMinimum)}
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-start items-start gap-1 border-r border-base-content/10">
          {/* label */}
          <div className="flex flex-row justify-start items-center gap-1">
            {/* icon */}
            <div className="w-5 h-5 rounded-full flex justify-center items-center bg-blue-100">
              <CalendarClock className="text-blue-400 size-2.5" />
            </div>

            {/* label */}
            <span className="text-[0.625rem] text-base-content">Bo.</span>
          </div>

          {/* value */}
          <span className={cn("text-[0.7rem] font-medium text-base-content")}>
            {produk.stokBooking}
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-start items-start gap-1">
          {/* label */}
          <div className="flex flex-row justify-start items-center gap-1">
            {/* icon */}
            <div className="w-5 h-5 rounded-full flex justify-center items-center bg-amber-100">
              <PackagePlus className="text-amber-600 size-2.5" />
            </div>

            {/* label */}
            <span className="text-[0.625rem] text-base-content">Butuh</span>
          </div>

          {/* value */}
          <span className="text-[0.7rem] font-medium text-base-content">
            {formatNumberK(produk.totalKebutuhanStok)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DataBooking;
