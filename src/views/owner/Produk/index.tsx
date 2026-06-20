import { EllipsisVertical, PackagePlus, Trash, View } from "lucide-react";
import FilterKategori from "../../../components/filters/Kategori";
import FilterSort from "../../../components/filters/Sort";
import InputSearch from "../../../components/inputs/InputSearch";
import ButtonCluster from "../../../components/ui/button/ButtonCluster";
import ButtonAdd from "../../../components/ui/button/ButtonWithIcon";
import { cn } from "../../../utils/cn";
import KategoriCluster from "./KategoriCluster";
import useProduk from "./useProduk";
import {
  formatNumber,
  formatRupiah,
  generateColorForStok,
} from "../../../helpers/helpers";
import PaginationAndLimit from "../../../components/filters/PaginationAndLimit";
import LabelButtonDropDownWithIcon from "../../../components/ui/button/LabelButtonDropDownWithIcon";
import DataEmpty from "../../../components/messages/DataEmpty";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_PRODUK } from "../../../types/toast.type";
import ModalDelete from "../../../components/modals/ModalDelete";

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
    handleRedirectDetail,
    handleRedirectTambah,
    toast,
    handleDeleteProduk,
    handleShowModalDelete,
    isPendingDeleteProduk,
    dataDeleteProduk,
    modalDeleteRef,
    handleCloseModalDelete,
    handleSetIsActiveAksi,
    isActiveAksi,
    wrapperRef,
  } = useProduk();

  return (
    <div className="w-full mb-30 flex flex-col justify-start items-start">
      {/* button cluster */}
      <div className="w-full flex flex-row justify-start items-center bg-base-100 shadow-sm h-14 p-2 gap-2 dark:border dark:border-base-content/10 sticky top-0 left-0 right-0 z-40">
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
      <div className="w-full h-full flex justify-center items-start px-2 lg:px-4 mt-4">
        {isActiveCluster === "produk" && (
          <>
            {/* toast create */}
            {toast && (
              <Toast
                toast={toast?.id !== null}
                isAnimationOut={toast?.isAnimationOut || false}
                label={TOAST_CONFIG_PRODUK[toast.type].message}
                color={TOAST_CONFIG_PRODUK[toast.type].color}
              />
            )}

            <div className="card dark:border dark:border-base-content/10 w-full bg-base-100 flex flex-col justify-start items-start p-4">
              {/* filter */}
              <div className="w-full flex flex-col md:flex-row justify-start items-start md:items-start">
                <ButtonAdd
                  icon={PackagePlus}
                  label="Tambah Produk"
                  handleBtn={() => handleRedirectTambah()}
                  customClass="md:hidden w-full mb-3"
                />

                <div className="w-full md:flex-1 flex flex-row justify-start items-center">
                  {/* input search */}
                  <InputSearch
                    handleSearch={handleSearch}
                    placeholder="Cari produk"
                  />
                </div>

                <div className="w-full md:flex-wrap md:flex-2 flex flex-row justify-start md:justify-end items-center gap-3 md:gap-4">
                  {/* filter kategori */}
                  <FilterKategori
                    setKategori={handleKategori}
                    customWidth="w-full md:w-auto"
                  />

                  {/* filter sort */}
                  <FilterSort
                    setSort={handleSort}
                    customWidth="w-full md:w-40"
                  />

                  {/* button add produk */}
                  <ButtonAdd
                    icon={PackagePlus}
                    label="Tambah Produk"
                    handleBtn={() => handleRedirectTambah()}
                    customClass="hidden md:flex"
                  />
                </div>
              </div>

              {/* table */}
              <div className="overflow-x-auto w-full mt-8 lg:mt-0 mb-2">
                <table className="table table-xs lg:table-sm">
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
                        <tr
                          key={produk.id}
                          className={cn(
                            "transition-all duration-75 ease-in-out",
                            isActiveAksi === produk.id && "bg-base-200",
                          )}
                        >
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
                          <td className="font-semibold text-info">
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
                            {formatNumber(produk.stok.toString())}
                          </td>
                          {/* isi perbox */}
                          <td className="font-medium text-base-content">
                            {formatNumber(produk.isiPerBox.toString())}
                          </td>
                          {/* detail */}
                          <td className="sticky right-0 bg-base-100 z-10">
                            <div
                              ref={wrapperRef}
                              className={cn(
                                "dropdown dropdown-left dropdown-end",
                              )}
                            >
                              <button
                                type="button"
                                role="button"
                                tabIndex={0}
                                className="btn btn-sm m-1"
                                onFocus={() => handleSetIsActiveAksi(produk.id)}
                                onBlur={() => handleSetIsActiveAksi(0)}
                              >
                                <EllipsisVertical className="size-4" />
                              </button>
                              <ul
                                tabIndex={-1}
                                className="z-1 dark:border dark:border-base-content/10 dropdown-content menu bg-base-100 rounded-box w-35 lg:w-40 p-2 shadow-sm space-y-2"
                              >
                                <li>
                                  <LabelButtonDropDownWithIcon
                                    label="Detail"
                                    icon={View}
                                    handleClick={() =>
                                      handleRedirectDetail(produk.id)
                                    }
                                  />
                                </li>
                                <li>
                                  <LabelButtonDropDownWithIcon
                                    color="text-error"
                                    label="Hapus"
                                    icon={Trash}
                                    handleClick={() =>
                                      handleShowModalDelete(produk.id, {
                                        nama: produk.nama,
                                      })
                                    }
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
          </>
        )}

        {isActiveCluster === "kategori" && <KategoriCluster />}
      </div>

      {/* modal delete */}
      <ModalDelete
        modalRef={modalDeleteRef}
        handleCloseModal={handleCloseModalDelete}
        handleDelete={handleDeleteProduk}
        bigTitle={`Apakah anda yakin ingin menghapus data "${dataDeleteProduk?.nama}" ini?`}
        isLoadingDelete={isPendingDeleteProduk}
      />
    </div>
  );
};

export default Produk;
