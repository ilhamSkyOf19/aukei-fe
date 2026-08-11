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
import usePantauStok from "./usePantauStok";
import { formatTanggalPanjang } from "../../../../helpers/formatDate";
import {
  STATUS_PERGERAKAN,
  type StatusPergerakan,
} from "../../../../types/constant.type";
import AlertLabel from "../../../../components/messages/AlertLabel";
import CardStatistik from "../../../../components/ui/cards/CardStatistik";
import { ChartLine, CircleAlert, Package } from "lucide-react";
import type { ProdukResponseType } from "../../../../models/produk.model";
import LoadingFetch from "../../../../components/ui/LoadingFetch";

type Props = {
  pilihan: string;
};
const PantauStok: FC<Props> = ({ pilihan }) => {
  const {
    dataProduk,
    isExistDataProduk,
    isLoadingDataProduk,
    handleKategori,
    handleLimit,
    handlePage,
    handleSearch,
    handleSort,
    sort,
    kategori,
    dataStatistik,
    isLoadingStatistik,
  } = usePantauStok({ pilihan });
  return (
    <div className="w-full flex flex-col justify-start items-start">
      {/* filter */}
      <div className="w-full flex flex-col md:flex-row justify-start items-start md:items-start bg-base-100 p-2.5 rounded-2xl md:rounded-xl shadow-sm border border-transparent dark:border-base-content/10 mt-2.5">
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

      <div className="w-full flex flex-col justify-start items-start mt-2.5 bg-base-100 p-2.5 rounded-2xl md:rounded-xl">
        <div className="w-full gap-0.5 flex flex-col justify-start items-start mb-4">
          <span className="text-sm font-medium text-base-content">
            Ringkasan Restock
          </span>
          <span className="text-[0.7rem] w-[70%] text-base-content/70">
            Ringkasan restock di bawah ini dihitung berdasarkan filter kategori
            yang sedang diterapkan.
          </span>
        </div>

        {/* statistik */}
        <div className="w-full grid grid-cols-2 gap-2.5">
          <CardStatistik
            isLoading={isLoadingStatistik}
            icon={{
              icon: Package,
              bgColor: "bg-amber-100",
              iconColor: "text-amber-400",
            }}
            label={"Total Produk Restock"}
            value={formatNumber(dataStatistik?.data?.produkRestock ?? 0)}
            caption="Total produk yang perlu direstock"
          />
          <CardStatistik
            isLoading={isLoadingStatistik}
            icon={{
              icon: Package,
              bgColor: "bg-blue-100",
              iconColor: "text-blue-400",
            }}
            label={"Total Item Restock"}
            value={formatNumber(dataStatistik?.data?.totalItemRestock ?? 0)}
            caption="Total item yang perlu direstock"
          />
        </div>
      </div>

      {/* buat untuk mobile  */}
      <div className="flex w-full flex-col justify-start items-center gap-2 mt-2.5 lg:hidden">
        {/* card */}
        {isLoadingDataProduk ? (
          <LoadingFetch />
        ) : isExistDataProduk ? (
          dataProduk?.data?.data?.map((produk, _) => (
            <CardProdukStok key={produk.id} produk={produk} />
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
      <div className="overflow-x-auto w-full bg-base-100 rounded-xl border border-transparent dark:border-base-content/10 shadow-sm hidden lg:flex mt-2.5">
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
              <th>Terakhir Restock</th>
              <th>Pergerakan</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingDataProduk ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan={10}>
                    <div className="skeleton h-12 w-full py-1" />
                  </td>
                </tr>
              ))
            ) : isExistDataProduk ? (
              dataProduk?.data?.data?.map((produk, _) => (
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
                  <td>{produk.kategori.nama}</td>
                  {/* stok */}
                  <td
                    className={cn(
                      "font-medium",
                      generateColorForStok(produk.stok, produk.stokMinimum),
                    )}
                  >
                    {formatNumber(produk.stok.toString())}
                  </td>

                  {/* stok minimum */}
                  <td>
                    <span className="font-semibold ">
                      {formatNumber(produk.stokMinimum)}
                    </span>
                  </td>

                  {/* terkhir restock */}
                  <td>
                    <span>
                      {produk.restockTerakhir
                        ? formatTanggalPanjang(produk.restockTerakhir)
                        : "-"}
                    </span>
                  </td>

                  {/* penjualan */}
                  <td>
                    {produk.statusPergerakan !== null ? (
                      <span
                        className={cn(
                          "text-[0.625rem] font-medium text-primary-white py-1 px-1.5 rounded-full capitalize",
                          produk.statusPergerakan === STATUS_PERGERAKAN.CEPAT &&
                            "bg-emerald-500",
                          produk.statusPergerakan ===
                            STATUS_PERGERAKAN.LAMBAT && "bg-amber-500",
                          produk.statusPergerakan ===
                            STATUS_PERGERAKAN.NORMAL && "bg-blue-500",
                        )}
                      >
                        {produk?.statusPergerakan?.toLowerCase()}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>
                    {produk?.stok > produk.stokMinimum ? (
                      <span className="text-[0.625rem] font-medium text-primary-white py-1 px-1.5 rounded-full bg-emerald-500 ">
                        Cukup
                      </span>
                    ) : produk?.stok < produk.stokMinimum &&
                      produk?.stok !== 0 ? (
                      <span className="text-[0.625rem] font-medium text-primary-white py-1 px-1.5 rounded-full bg-amber-500 ">
                        Menipis
                      </span>
                    ) : (
                      <span className="text-[0.625rem] font-medium text-primary-white py-1 px-1.5 rounded-full bg-rose-500 ">
                        Habis
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

      {/* alert label */}
      <div className="w-full mt-2.5">
        <AlertLabel message="Pergerakan dihitung berdasarkan data terakhir restock barang." />
      </div>

      {/* pagination and limti */}
      <PaginationAndLimit
        currentPage={dataProduk?.data?.meta?.currentPage ?? 1}
        totalPage={dataProduk?.data?.meta?.totalPage ?? 1}
        setPage={handlePage}
        setLimit={handleLimit}
        limit={dataProduk?.data?.meta?.limit ?? 8}
        isLoading={isLoadingDataProduk}
        emptyData={!isExistDataProduk}
      />
    </div>
  );
};

type CardProdukStokProps = {
  produk: ProdukResponseType & {
    restockTerakhir: Date | null;

    statusPergerakan: StatusPergerakan | null;
  };
};

// card produk
const CardProdukStok: FC<CardProdukStokProps> = ({ produk }) => {
  return (
    <div className="w-full bg-base-100 rounded-2xl flex flex-col justify-start items-start p-4 border border-transparent dark:border-base-content/10 gap-2">
      {/* content 1 */}
      <div className="w-full flex flex-row justify-between items-stretch pb-3 border-b border-base-content/10">
        <div className="flex-2 flex flex-row justify-start items-start gap-4">
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
              {produk.kategori.nama}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between items-end">
          {produk?.stok > produk.stokMinimum ? (
            <span className="text-[0.625rem] font-medium text-primary-white py-1 px-1.5 rounded-full bg-emerald-500 ">
              Cukup
            </span>
          ) : produk?.stok < produk.stokMinimum && produk?.stok !== 0 ? (
            <span className="text-[0.625rem] font-medium text-primary-white py-1 px-1.5 rounded-full bg-amber-500 ">
              Menipis
            </span>
          ) : (
            <span className="text-[0.625rem] font-medium text-primary-white py-1 px-1.5 rounded-full bg-rose-500 ">
              Habis
            </span>
          )}

          <div className="flex flex-col justify-start items-start gap-0.5">
            {/* label */}
            <span className="text-[0.625rem] text-base-content/70">
              Restock:
            </span>
            <span className="text-[0.625rem] text-base-content font-medium">
              {produk.restockTerakhir
                ? formatTanggalPanjang(produk.restockTerakhir)
                : "-"}
            </span>
          </div>
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
            {formatNumberK(produk.stok)}
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
        <div className="flex-1 flex flex-col justify-start items-start gap-1">
          {/* label */}
          <div className="flex flex-row justify-start items-center gap-1">
            {/* icon */}
            <div className="w-5 h-5 rounded-full flex justify-center items-center bg-amber-100">
              <ChartLine className="text-amber-600 size-2.5" />
            </div>

            {/* label */}
            <span className="text-[0.625rem] text-base-content">
              Pergerakan
            </span>
          </div>

          {/* value */}
          {produk.statusPergerakan !== null ? (
            <span
              className={cn(
                "text-[0.625rem] font-medium text-primary-white py-1 px-1.5 rounded-full capitalize",
                produk.statusPergerakan === STATUS_PERGERAKAN.CEPAT &&
                  "bg-emerald-500",
                produk.statusPergerakan === STATUS_PERGERAKAN.LAMBAT &&
                  "bg-amber-500",
                produk.statusPergerakan === STATUS_PERGERAKAN.NORMAL &&
                  "bg-blue-500",
              )}
            >
              {produk?.statusPergerakan?.toLowerCase()}
            </span>
          ) : (
            "-"
          )}
        </div>
      </div>
    </div>
  );
};

export default PantauStok;
