import { PackagePlus } from "lucide-react";
import FilterKategori from "../../../components/filters/Kategori";
import FilterSort from "../../../components/filters/Sort";
import InputSearch from "../../../components/inputs/InputSearch";
import ButtonCluster from "../../../components/ui/button/ButtonCluster";
import ButtonAdd from "../../../components/ui/button/ButtonWithIcon";
import { cn } from "../../../utils/cn";
import KategoriCluster from "./KategoriCluster";
import useProduk from "./useProduk";
import { formatRupiah } from "../../../helpers/helpers";

const Produk = () => {
  // call use
  const {
    handleActiveCluster,
    isActiveCluster,
    handleSearch,
    handleSort,
    handleKategori,
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
      <div className="w-full h-full flex justify-center items-baseline px-4 mt-4">
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
            <div className="overflow-x-auto w-full mt-8">
              <table className="table lg:table-md">
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
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 10 }).map((_, index) => (
                    <tr key={index}>
                      <th>
                        <label>
                          <input type="checkbox" className="checkbox" />
                        </label>
                      </th>
                      {/* foto */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle h-12 w-12">
                              <img
                                src="http://localhost:3000/uploads/produk/produk-1780252600721-703940578.png"
                                alt="Foto Produk"
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* kode */}
                      <td className="font-semibold">JV000{index + 1}</td>
                      {/* nama */}
                      <td>Plavon Kayu</td>
                      {/* kategori */}
                      <td>Plafon</td>
                      {/* harga beli */}
                      <td>{formatRupiah(12000)}</td>
                      {/* harga jual */}
                      <td>{formatRupiah(16000)}</td>
                      {/* stok */}
                      <td>10</td>
                      {/* isi perbox */}
                      <td>20</td>
                      {/* detail */}
                      <th>
                        <button className="btn btn-ghost btn-xs">
                          details
                        </button>
                      </th>
                    </tr>
                  ))}
                </tbody>
                {/* foot */}
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
                    <th>Aksi</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {isActiveCluster === "kategori" && <KategoriCluster />}
      </div>
    </div>
  );
};

export default Produk;
