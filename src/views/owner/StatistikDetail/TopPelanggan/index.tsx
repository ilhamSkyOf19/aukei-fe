import InputSearch from "../../../../components/inputs/InputSearch";
import FilterSort from "../../../../components/filters/Sort";
import { cn } from "../../../../utils/cn";
import DataEmpty from "../../../../components/messages/DataEmpty";
import AlertLabel from "../../../../components/messages/AlertLabel";
import PaginationAndLimit from "../../../../components/filters/PaginationAndLimit";
import {
  formatNumber,
  formatNumberPhone,
  formatRupiah,
} from "../../../../helpers/helpers";
import RankStar from "../../../../components/ui/RankStar";
import RangeDate from "../../../../components/filters/RangeDate";
import useStatistikTopPelanggan from "../../../../hooks/useStatistikTopPelanggan";
import CardPelanggan from "../../../../components/ui/cards/CardPelanggan";

const TopPelanggan = () => {
  const {
    isLoading,
    handleLimit,
    handlePage,
    handleSearch,
    isExistData,
    setStartDateEndDate,
    startDateEndDate,
    dataTopPelanggan,
    handleSortTotalTransaksi,
    handleTotalNilaiTransaksi,
    sortTotalNilaiTransaksi,
    sortTotalTransaksi,
  } = useStatistikTopPelanggan({});

  return (
    <div className="w-full flex flex-col justify-start items-start">
      {/* filter */}
      <div className="w-full flex flex-col md:flex-row justify-start items-start md:items-end lg:items-start bg-base-100 p-2.5 rounded-2xl md:rounded-xl shadow-sm border border-transparent dark:border-base-content/10">
        <div className="w-full md:flex-1 flex flex-col justify-start items-start gap-1.5">
          <InputSearch
            handleSearch={handleSearch}
            placeholder="Cari ..."
            withLabel
          />
        </div>

        <div className="w-full md:flex-wrap md:flex-2 flex flex-col md:flex-row justify-start md:justify-end items-center gap-3 md:gap-2.5 mt-3 md:mt-0">
          {/* filter sort total transaksi */}
          <FilterSort
            setSort={handleSortTotalTransaksi}
            customWidth="w-full md:w-30 lg:w-40"
            value={sortTotalTransaksi}
            customLabel={["Tersedikit", "Terbanyak"]}
            customTitle="Urutkan Total Transaksi"
          />

          {/* filter sort total nilai */}
          <FilterSort
            setSort={handleTotalNilaiTransaksi}
            customWidth="w-full md:w-30 lg:w-40"
            value={sortTotalNilaiTransaksi}
            customLabel={["Tersedikit", "Terbanyak"]}
            customTitle="Urutkan Nilai Transaksi"
          />

          {/* filter range */}
          <RangeDate
            state={{
              value: startDateEndDate,
              onChange: setStartDateEndDate,
            }}
            customWidth="w-full md:w-50 lg:w-62"
          />
        </div>
      </div>

      {/* data SM & MD */}
      <div className="w-full lg:hidden flex flex-col justify-start items-center gap-2.5 pt-3 pb-2">
        {/* card */}
        {isLoading ? (
          <>
            <div className="w-full h-20 skeleton bg-base-200 border border-base-content/10" />
            <div className="w-full h-20 skeleton bg-base-200 border border-base-content/10" />
            <div className="w-full h-20 skeleton bg-base-200 border border-base-content/10" />
          </>
        ) : isExistData ? (
          dataTopPelanggan?.data.map((pelanggan) => (
            <CardPelanggan
              data={{
                id: pelanggan.id,
                nama: pelanggan.nama,
                noWa: pelanggan.noWa,
                onlyStatus: pelanggan.isActive,
                totalTransaction: pelanggan.totalTransaksi,
                totalNilaiTransaction: pelanggan.totalNilaiTransaksi,
                rankNilaiTransaction: pelanggan.rankNilaiTransaksi ?? 0,
                rankTransaction: pelanggan.rankTransaksi ?? 0,
              }}
            />
          ))
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <DataEmpty
              title="Data Pelanggan Tidak Tersedia"
              description="Belum ada data pelanggan yang dapat ditampilkan saat ini."
            />
          </div>
        )}
      </div>

      {/* data LG */}
      <div className="overflow-x-auto w-full bg-base-100 rounded-xl border border-transparent dark:border-base-content/10 shadow-sm hidden lg:flex mt-2.5">
        <table className="table table-xs lg:table-sm table-zebra">
          {/* head */}
          <thead>
            <tr className="h-12 bg-base-200 text-[0.7rem]">
              <th>Nama</th>
              <th>No. Wa</th>
              <th>Total Transaksi</th>
              <th>Total Nilai Transaksi</th>
              <th>Rank Transaksi</th>
              <th>Rank Nilai Transaksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan={6}>
                    <div className="skeleton h-12 w-full py-1" />
                  </td>
                </tr>
              ))
            ) : isExistData ? (
              dataTopPelanggan?.data?.map((pelanggan, _) => (
                <tr
                  key={pelanggan.id}
                  className={cn(
                    "transition-all duration-75 ease-in-out h-18 text-[0.7rem] text-base-content",
                  )}
                >
                  {/* nama */}
                  <td>
                    <div className="flex flex-col justify-start items-start gap-1">
                      <span className="text-xs font-semibold">
                        {pelanggan.nama}
                      </span>
                      <span
                        className={cn(
                          "px-1.5 py-px rounded-full text-[0.625rem] font-medium",
                          pelanggan.isActive
                            ? "bg-emerald-100 border border-emerald-600"
                            : "bg-rose-50 border border-rose-600",
                        )}
                      >
                        {pelanggan.isActive ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </div>
                  </td>
                  {/* no wa */}
                  <td>{formatNumberPhone(pelanggan.noWa)}</td>
                  {/* total transaksi */}
                  <td className="font-medium">
                    {formatNumber(pelanggan.totalTransaksi)}
                  </td>
                  {/* total nilai transaksi */}
                  <td className="font-medium">
                    {formatRupiah(pelanggan.totalNilaiTransaksi)}
                  </td>
                  {/* rank total trasaksi */}
                  <td>
                    {pelanggan.rankTransaksi ? (
                      <RankStar rank={pelanggan.rankTransaksi} />
                    ) : (
                      "-"
                    )}
                  </td>
                  {/* rank total nilai transaksi */}
                  <td>
                    {pelanggan.rankNilaiTransaksi ? (
                      <RankStar rank={pelanggan.rankNilaiTransaksi} />
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>
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
        <AlertLabel message="Data otomatis diurutkan berdasarkan total transaksi terbanyak, silahkan urutkan kembali sesuai kebutuhan." />
      </div>

      {/* pagination and limti */}
      <PaginationAndLimit
        currentPage={dataTopPelanggan?.meta?.currentPage ?? 1}
        totalPage={dataTopPelanggan?.meta?.totalPage ?? 1}
        setPage={handlePage}
        setLimit={handleLimit}
        limit={dataTopPelanggan?.meta?.limit ?? 8}
        isLoading={isLoading}
        emptyData={!isExistData}
      />
    </div>
  );
};

export default TopPelanggan;
