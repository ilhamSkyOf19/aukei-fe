import { EllipsisVertical, PackagePlus, Trash, View } from "lucide-react";
import FilterKategori from "../../../components/filters/Kategori";
import FilterSort from "../../../components/filters/Sort";
import InputSearch from "../../../components/inputs/InputSearch";
import ButtonCluster from "../../../components/ui/button/ButtonCluster";
import ButtonAdd from "../../../components/ui/button/ButtonWithIcon";
import { cn } from "../../../utils/cn";
import KategoriCluster from "./KategoriCluster";
import useProduk from "./useProduk";
import { formatRupiah, generateColorForStok } from "../../../helpers/helpers";
import PaginationAndLimit from "../../../components/filters/PaginationAndLimit";
import LabelButtonDropDownWithIcon from "../../../components/ui/button/LabelButtonDropDownWithIcon";
import DataEmpty from "../../../components/messages/DataEmpty";

const Produk = () => {
  // call use
  const {
    handleActiveCluster,
    isActiveCluster,
    handleSearch,
    handleSort,
    handleKategori,
    dataProduk,
    handleLimit,
    handlePage,
    isLoadingProduk,
    isExistDataProduk,
  } = useProduk();

  return (
    <div className="w-full mb-30 flex flex-col justify-start items-start">
      {/* Cluster inventori */}
      <div className="w-full flex flex-row justify-start items-center bg-base-100 shadow-sm h-14 p-2 gap-2 dark:border dark:border-base-content/10">
        {/* produk */}
        <ButtonCluster
          isActive={isActiveCluster === "produk"}
          label="Produk"
          handleActive={() => handleActiveCluster("produk")}
        />
        {/* kategori */}
        <ButtonCluster
          isActive={isActiveCluster === "kategori"}
          label="Kategori"
          handleActive={() => handleActiveCluster("kategori")}
        />
        {/* spesifikasi */}
        <ButtonCluster
          isActive={isActiveCluster === "spesifikasi"}
          label="Spesifikasi"
          handleActive={() => handleActiveCluster("spesifikasi")}
        />
      </div>

      {/* content */}
      <div className="w-full h-full flex justify-center items-start px-4 mt-4">
        {isActiveCluster === "produk" && (
          <div className="card w-full bg-base-100 flex flex-col justify-start items-start p-4">
            {/* filter */}
            <div className="w-full flex flex-col lg:flex-row justify-start items-start lg:items-center gap-4 lg:gap-0">
              <div className="w-full lg:flex-1 flex flex-row justify-start items-center">
                {/* input search */}
                <InputSearch
                  handleSearch={handleSearch}
                  placeholder="Cari produk berdasarkan nama atau kode"
                />
              </div>

              <div className="w-full flex-wrap lg:flex-2 flex flex-row justify-start lg:justify-end items-center gap-4">
                {/* filter kategori */}
                <FilterKategori setKategori={handleKategori} />

                {/* filter sort */}
                <FilterSort setSort={handleSort} />

                {/* button add produk */}
                <ButtonAdd
                  icon={PackagePlus}
                  label="Tambah Produk"
                  handleBtn={() => {}}
                />
              </div>
            </div>

            {/* table */}
            <div className="overflow-x-auto w-full my-8">
              <table className="table table-sm lg:table-md">
                {/* head */}
                <thead>
                  <tr>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <th>Foto</th>
                    <th>Kode</th>
                    <th>Nama</th>
                    <th>Kategori</th>
                    <th>Harga Beli Satuan</th>
                    <th>Harga Jual Satuan</th>
                    <th>Stok</th>
                    <th>Isi PerBox</th>
                    <th className="sticky right-0 bg-base-100 z-10">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingProduk ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <tr key={index}>
                        <td colSpan={10}>
                          <div className="skeleton h-12 w-full py-1" />
                        </td>
                      </tr>
                    ))
                  ) : isExistDataProduk ? (
                    dataProduk?.data?.data.map((produk, _) => (
                      <tr key={produk.id}>
                        <th>
                          <label>
                            <input type="checkbox" className="checkbox" />
                          </label>
                        </th>
                        {/* foto */}
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle w-10 h-10 lg:h-12 lg:w-12">
                                <img src={produk.img} alt="Foto Produk" />
                              </div>
                            </div>
                          </div>
                        </td>
                        {/* kode */}
                        <td className="font-semibold text-base-content">
                          {produk.kode}
                        </td>
                        {/* nama */}
                        <td className="text-base-content">{produk.nama}</td>
                        {/* kategori */}
                        <td className="text-base-content">
                          {produk.kategori.nama}
                        </td>
                        {/* harga beli */}
                        <td className="text-base-content">
                          {formatRupiah(produk.hargaBeli)}
                        </td>
                        {/* harga jual */}
                        <td className="text-base-content">
                          {formatRupiah(produk.hargaJual)}
                        </td>
                        {/* stok */}
                        <td
                          className={cn(
                            "font-medium",
                            true
                              ? generateColorForStok(
                                  produk.stok,
                                  produk.stokMinimum,
                                )
                              : "text-base-content",
                          )}
                        >
                          {produk.stok}
                        </td>
                        {/* isi perbox */}
                        <td className="font-medium text-base-content">
                          {produk.isiPerBox}
                        </td>
                        {/* detail */}
                        <td className="sticky right-0 bg-base-100 z-10">
                          <div
                            className={cn(
                              "dropdown dropdown-left dropdown-end",
                            )}
                          >
                            <div
                              tabIndex={0}
                              role="button"
                              className="btn btn-sm m-1"
                            >
                              <EllipsisVertical className="size-4" />
                            </div>
                            <ul
                              tabIndex={-1}
                              className="z-1 dark:border dark:border-base-content/10 dropdown-content menu bg-base-100 rounded-box w-35 lg:w-40 p-2 shadow-sm space-y-2"
                            >
                              <li>
                                <LabelButtonDropDownWithIcon
                                  label="Detail"
                                  icon={View}
                                  handleClick={() => {}}
                                />
                              </li>
                              <li>
                                <LabelButtonDropDownWithIcon
                                  color="text-error"
                                  label="Hapus"
                                  icon={Trash}
                                  handleClick={() => {}}
                                />
                              </li>
                            </ul>
                          </div>
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
                {/* foot */}
                {!isLoadingProduk &&
                  isExistDataProduk &&
                  dataProduk?.data?.data?.length! > 8 && (
                    <tfoot>
                      <tr>
                        <th></th>
                        <th>Foto</th>
                        <th>Kode</th>
                        <th>Nama</th>
                        <th>Kategori</th>
                        <th>Harga Beli Satuan</th>
                        <th>Harga Jual Satuan</th>
                        <th>Stok</th>
                        <th>Isi PerBox</th>
                        <th className="sticky right-0 bg-base-100 z-10">
                          Aksi
                        </th>
                      </tr>
                    </tfoot>
                  )}
              </table>
            </div>

            {/* pagination and limits */}
            <PaginationAndLimit
              currentPage={dataProduk?.data?.meta.currentPage || null}
              totalPage={dataProduk?.data?.meta.totalPage || null}
              setPage={handlePage}
              setLimit={handleLimit}
              emptyData={!isExistDataProduk}
            />
          </div>
        )}

        {isActiveCluster === "kategori" && <KategoriCluster />}
      </div>
    </div>
  );
};

export default Produk;
