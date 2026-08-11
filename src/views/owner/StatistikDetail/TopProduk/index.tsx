import InputSearch from "../../../../components/inputs/InputSearch";
import FilterKategori from "../../../../components/filters/Kategori";
import FilterSort from "../../../../components/filters/Sort";
import { cn } from "../../../../utils/cn";
import DataEmpty from "../../../../components/messages/DataEmpty";
import AlertLabel from "../../../../components/messages/AlertLabel";
import PaginationAndLimit from "../../../../components/filters/PaginationAndLimit";
import {
  formatNumber,
  formatNumberK,
  formatRupiah,
  formatRupiahShort,
} from "../../../../helpers/helpers";
import RankStar from "../../../../components/ui/RankStar";
import RankMedal from "../../../../components/ui/RankMedal";
import RangeDate from "../../../../components/filters/RangeDate";
import useStatistikTopProduk from "../../../../hooks/useStatistikTopProduk";
import type { DataStatistikTopProdukType } from "../../../../models/statistik.model";
import type { FC } from "react";
import { ArrowUpRight, Trophy } from "lucide-react";
import LoadingFetch from "../../../../components/ui/LoadingFetch";

const TopProduk = () => {
  const {
    dataTopProduk,
    isLoading,
    handleLimit,
    handlePage,
    handleSearch,
    handleKategori,
    kategori,
    isExistData,
    handleSortOmzet,
    handleSortQty,
    sortOmzet,
    sortQty,
    setStartDateEndDate,
    startDateEndDate,
  } = useStatistikTopProduk({});

  return (
    <div className="w-full flex flex-col justify-start items-start">
      {/* filter */}
      <div className="w-full flex flex-col md:flex-row justify-start items-start md:items-start bg-base-100 p-2.5 rounded-2xl md:rounded-xl shadow-sm border border-transparent dark:border-base-content/10">
        <div className="w-full md:flex-1 flex flex-col justify-start items-start gap-1.5">
          <InputSearch
            handleSearch={handleSearch}
            placeholder="Cari ..."
            withLabel
          />
        </div>

        <div className="w-full md:flex-wrap md:flex-2 flex flex-col md:flex-row justify-start md:justify-end items-center gap-3 md:gap-2.5 mt-3 md:mt-0">
          {/* filter kategori */}
          <FilterKategori
            setKategori={handleKategori}
            customWidth="w-full md:w-40"
            value={kategori}
          />
          {/* filter sort omzet */}
          <FilterSort
            setSort={handleSortOmzet}
            customWidth="w-full md:w-30"
            value={sortOmzet}
            customLabel={["Tersedikit", "Terbanyak"]}
            customTitle="Urutkan Omzet"
          />

          {/* filter sort qty */}
          <FilterSort
            setSort={handleSortQty}
            customWidth="w-full md:w-30"
            value={sortQty}
            customLabel={["Tersedikit", "Terbanyak"]}
            customTitle="Urutkan Qty"
          />

          {/* filter range */}
          <RangeDate
            state={{
              value: startDateEndDate,
              onChange: setStartDateEndDate,
            }}
            customWidth="w-full md:w-62"
          />
        </div>
      </div>

      {/* buat untuk mobile  */}
      <div className="flex w-full flex-col justify-start items-center gap-2 mt-2.5 lg:hidden">
        {/* card */}
        {isLoading ? (
          <LoadingFetch />
        ) : isExistData ? (
          dataTopProduk?.data?.map((produk, _) => (
            <CardTopProduk key={produk.id} produk={produk} />
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
              <th>Total Terjual</th>
              <th>Total Omzet</th>
              <th>Rank (Qty)</th>
              <th>Rank (Omzet)</th>
              <th>Top Kategori</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan={10}>
                    <div className="skeleton h-12 w-full py-1" />
                  </td>
                </tr>
              ))
            ) : isExistData ? (
              dataTopProduk?.data?.map((produk, _) => (
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
                  {/* total terjual */}
                  <td>{formatNumber(produk.totalTerjual)} Item</td>
                  {/* total omzet */}
                  <td>{formatRupiah(produk.totalOmzet)}</td>
                  {/* rank qty */}
                  <td>
                    {produk.rankQty ? <RankStar rank={produk.rankQty} /> : "-"}
                  </td>
                  {/* rank omzet */}
                  <td>
                    {produk.rankOmzet ? (
                      <RankStar rank={produk.rankOmzet} />
                    ) : (
                      "-"
                    )}
                  </td>
                  {/* top kategori */}
                  <td>
                    {produk.rankKategori ? (
                      <RankMedal rank={produk.rankKategori} />
                    ) : (
                      "-"
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
        <AlertLabel message="Data otomatis diurutkan berdasarkan total item terbanyak, silahkan urutkan kembali sesuai kebutuhan." />
      </div>

      {/* pagination and limti */}
      <PaginationAndLimit
        currentPage={dataTopProduk?.meta?.currentPage ?? 1}
        totalPage={dataTopProduk?.meta?.totalPage ?? 1}
        setPage={handlePage}
        setLimit={handleLimit}
        limit={dataTopProduk?.meta?.limit ?? 8}
        isLoading={isLoading}
        emptyData={!isExistData}
      />
    </div>
  );
};

type CardTopProdukProps = {
  produk: DataStatistikTopProdukType;
};

// card produk
const CardTopProduk: FC<CardTopProdukProps> = ({ produk }) => {
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
              {produk.kategori}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between items-end">
          <div className="flex flex-col justify-start items-start gap-0.5">
            {/* label */}
            <span className="text-[0.625rem] text-base-content/70">
              Terjual:
            </span>
            <span className="text-[0.625rem] text-base-content font-medium">
              {formatNumberK(produk.totalTerjual)}
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
            <div className="w-5 h-5 rounded-full flex justify-center items-center bg-emerald-100">
              <ArrowUpRight className="text-emerald-400 size-2.5" />
            </div>

            {/* label */}
            <span className="text-[0.625rem] text-base-content">Omzet</span>
          </div>

          {/* value */}
          <span className="text-[0.7rem] font-medium text-base-content">
            {formatRupiahShort(produk.totalOmzet)}
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-start items-start gap-1 border-r border-base-content/10">
          {/* label */}
          <div className="flex flex-row justify-start items-center gap-1">
            {/* icon */}
            <div className="w-5 h-5 rounded-full flex justify-center items-center bg-purple-100">
              <Trophy className="text-purple-400 size-2.5" />
            </div>

            {/* label */}
            <span className="text-[0.625rem] text-base-content">Omzet</span>
          </div>

          {/* value */}
          <span className="text-[0.7rem] font-medium text-base-content">
            {produk.rankOmzet && produk.rankOmzet > 0
              ? `
              #${produk.rankOmzet}
              `
              : "-"}
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-start items-start gap-1">
          {/* label */}
          <div className="flex flex-row justify-start items-center gap-1">
            {/* icon */}
            <div className="w-5 h-5 rounded-full flex justify-center items-center bg-blue-100">
              <Trophy className="text-blue-600 size-2.5" />
            </div>

            {/* label */}
            <span className="text-[0.625rem] text-base-content">Qty.</span>
          </div>

          {/* value */}
          <span className="text-[0.7rem] font-medium text-base-content">
            {produk.rankQty && produk.rankQty > 0
              ? `
              #${produk.rankQty}
              `
              : "-"}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-start items-start gap-1">
          {/* label */}
          <div className="flex flex-row justify-start items-center gap-1">
            {/* icon */}
            <div className="w-5 h-5 rounded-full flex justify-center items-center bg-amber-100">
              <Trophy className="text-amber-600 size-2.5" />
            </div>

            {/* label */}
            <span className="text-[0.625rem] text-base-content">Kategori</span>
          </div>

          {/* value */}
          <span className="text-[0.7rem] font-medium text-base-content">
            {produk.rankKategori && produk.rankKategori > 0
              ? `
              #${produk.rankKategori}
              `
              : "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopProduk;
