import InputSearch from "../../../../components/inputs/InputSearch";
import FilterKategori from "../../../../components/filters/Kategori";
import FilterSort from "../../../../components/filters/Sort";
import { cn } from "../../../../utils/cn";
import DataEmpty from "../../../../components/messages/DataEmpty";
import AlertLabel from "../../../../components/messages/AlertLabel";
import PaginationAndLimit from "../../../../components/filters/PaginationAndLimit";
import { formatNumber, formatRupiah } from "../../../../helpers/helpers";
import RankStar from "../../../../components/ui/RankStar";
import RankMedal from "../../../../components/ui/RankMedal";
import RangeDate from "../../../../components/filters/RangeDate";
import useStatistikTopProduk from "../../../../hooks/useStatistikTopProduk";

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

        <div className="w-full md:flex-wrap md:flex-2 flex flex-row justify-start md:justify-end items-center gap-3 md:gap-2.5 mt-3 md:mt-0">
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
            customWidth="w-62"
          />
        </div>
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

export default TopProduk;
