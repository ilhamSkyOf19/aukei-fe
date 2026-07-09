import {
  Banknote,
  EllipsisVertical,
  Package,
  PackagePlus,
  ShoppingBag,
  Tag,
  Trash,
  View,
} from "lucide-react";
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
  formatNumberK,
  formatRupiah,
  formatRupiahShort,
  generateColorForStok,
} from "../../../helpers/helpers";
import PaginationAndLimit from "../../../components/filters/PaginationAndLimit";
import LabelButtonDropDownWithIcon from "../../../components/ui/button/LabelButtonDropDownWithIcon";
import DataEmpty from "../../../components/messages/DataEmpty";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_PRODUK } from "../../../types/toast.type";
import ModalDelete from "../../../components/modals/ModalDelete";
import type { FC } from "react";

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
    kategori,
    sort,
  } = useProduk();

  return (
    <div className="w-full h-screen overflow-y-auto ">
      <div className="w-full mb-30 md:mb-10 lg:mb-20 flex flex-col justify-start items-start ">
        {/* button cluster */}
        <div className="w-full flex flex-row justify-start items-center bg-base-100 shadow-sm h-14 p-2 gap-2 dark:border dark:border-base-content/10 sticky top-0 left-0 right-0 z-30 shrink-0">
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
        <div className="w-full flex justify-center items-start px-2 lg:px-4 mt-2">
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

              <div className=" w-full flex flex-col justify-start items-start ">
                {/* filter */}
                <div className="w-full flex flex-col md:flex-row justify-start items-start md:items-start bg-base-100 p-4 rounded-lg shadow-sm border border-transparent dark:border-base-content/10">
                  <ButtonAdd
                    icon={PackagePlus}
                    label="Tambah Produk"
                    handleBtn={() => handleRedirectTambah()}
                    customClass="md:hidden w-full mb-3"
                  />

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

                    {/* button add produk */}
                    <div className="flex-col justify-start items-start gap-1.5 hidden md:flex">
                      <span className="text-xs text-base-content/80 font-medium">
                        Aksi
                      </span>

                      <ButtonAdd
                        icon={PackagePlus}
                        label="Tambah Produk"
                        handleBtn={() => handleRedirectTambah()}
                      />
                    </div>
                  </div>
                </div>

                {/* SHOW DAYA FOR SM */}
                <div className="flex w-full flex-col justify-start items-center gap-2 mt-2 md:hidden">
                  {/* card */}
                  {isLoadingProduk ? (
                    <>
                      <div className="w-full h-20 skeleton border border-base-content/10 shadow-sm" />
                      <div className="w-full h-20 skeleton border border-base-content/10 shadow-sm" />
                      <div className="w-full h-20 skeleton border border-base-content/10 shadow-sm" />
                    </>
                  ) : !isExistDataProduk ? (
                    dataProduk?.data?.data?.map((produk, _) => (
                      <CardProduk
                        key={produk.id}
                        produk={{
                          id: produk.id,
                          nama: produk.nama,
                          hargaBeli: produk.hargaBeli,
                          hargaJual: produk.hargaJual,
                          img: produk.img,
                          isiPerBox: produk.isiPerBox,
                          kategori: produk.kategori.nama,
                          kode: produk.kode,
                          stok: produk.stok,
                        }}
                        handleSetIsActiveAksi={handleSetIsActiveAksi}
                        handleRedirectDetail={handleRedirectDetail}
                        handleShowModalDelete={() =>
                          handleShowModalDelete(produk.id, {
                            nama: produk.nama,
                          })
                        }
                      />
                    ))
                  ) : (
                    <div className="w-full h-full flex flex-col justify-center items-center">
                      <DataEmpty
                        title="Data Produk Tidak Tersedia"
                        description="Belum ada data produk yang dapat ditampilkan saat ini"
                      />
                    </div>
                  )}
                </div>

                {/* SHOW DATA FOR MD, LG, XL*/}
                <div className="overflow-x-auto w-full bg-base-100 rounded-xl mt-2 border border-transparent dark:border-base-content/10 shadow-sm hidden md:flex">
                  <table className="table table-xs lg:table-sm">
                    {/* head */}
                    <thead>
                      <tr className="h-12 bg-base-200 text-xs">
                        <th>
                          <label>
                            <input type="checkbox" className="checkbox" />
                          </label>
                        </th>
                        <th>Foto</th>
                        <th>Kode</th>
                        <th>Nama</th>
                        <th>Kategori</th>
                        <th>Harga Beli</th>
                        <th>Harga Jual</th>
                        <th>Stok</th>
                        <th>Isi PerBox</th>
                        <th className="sticky right-0 bg-base-200 z-10">
                          Aksi
                        </th>
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
                              "transition-all duration-75 ease-in-out h-18 text-xs text-base-content",
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
                            <td className="font-medium text-info">
                              {produk.kode}
                            </td>
                            {/* nama */}
                            <td>{produk.nama}</td>
                            {/* kategori */}
                            <td>{produk.kategori.nama}</td>
                            {/* harga beli */}
                            <td>{formatRupiah(produk.hargaBeli)}</td>
                            {/* harga jual */}
                            <td>{formatRupiah(produk.hargaJual)}</td>
                            {/* stok */}
                            <td
                              className={cn(
                                "font-medium",
                                generateColorForStok(
                                  produk.stok,
                                  produk.stokMinimum,
                                ),
                              )}
                            >
                              {formatNumber(produk.stok.toString())}
                            </td>
                            {/* isi perbox */}
                            <td className="font-medium">
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
                                  onFocus={() =>
                                    handleSetIsActiveAksi(produk.id)
                                  }
                                  onBlur={() => handleSetIsActiveAksi(0)}
                                >
                                  <EllipsisVertical className="size-4" />
                                </button>
                                <DropDown
                                  handleRedirectDetail={() =>
                                    handleRedirectDetail(produk.id)
                                  }
                                  handleShowModalDelete={() =>
                                    handleShowModalDelete(produk.id, {
                                      nama: produk.nama,
                                    })
                                  }
                                />
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
                  limit={dataProduk?.data?.meta?.limit}
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
    </div>
  );
};

// drop down
type DropDownProps = {
  handleRedirectDetail: () => void;
  handleShowModalDelete: () => void;
};
const DropDown: FC<DropDownProps> = ({
  handleRedirectDetail,
  handleShowModalDelete,
}) => {
  return (
    <ul
      tabIndex={-1}
      className="z-1 dark:border dark:border-base-content/10 dropdown-content menu bg-base-100 rounded-box w-35 lg:w-40 p-2 shadow-sm space-y-2"
    >
      <li>
        <LabelButtonDropDownWithIcon
          label="Detail"
          icon={View}
          handleClick={() => handleRedirectDetail()}
        />
      </li>
      <li>
        <LabelButtonDropDownWithIcon
          color="text-error"
          label="Hapus"
          icon={Trash}
          handleClick={() => handleShowModalDelete()}
        />
      </li>
    </ul>
  );
};

type CardProdukProps = {
  produk: {
    id: number;
    kode: string;
    nama: string;
    kategori: string;
    hargaBeli: number;
    hargaJual: number;
    stok: number;
    isiPerBox: number;
    img: string;
  };
  handleRedirectDetail: (value: number) => void;
  handleShowModalDelete: () => void;
  handleSetIsActiveAksi: (value: number) => void;
};

// card produk
const CardProduk: FC<CardProdukProps> = ({
  handleRedirectDetail,
  handleShowModalDelete,
  produk,
}) => {
  return (
    <div className="w-full bg-base-100 rounded-lg flex flex-col justify-start items-start p-4 border border-transparent dark:border-base-content/10 gap-2">
      <div className="w-full flex flex-row justify-between items-start pb-3 border-b border-base-content/10">
        {/* content 1 */}
        <div className="flex-2 flex flex-row justify-start items-start gap-4">
          <div className="flex flex-row justify-start items-start gap-3">
            {/* checkbox */}
            <input type="checkbox" className="checkbox" />

            {/* foto */}
            <div className="w-20 h-18 overflow-hidden rounded-lg">
              <img src={produk.img} alt="foto produk" loading="lazy" />
            </div>
          </div>

          {/* deskripsi */}
          <div className="flex flex-col justify-start items-start gap-1.5">
            {/* kode produk */}
            <span className="text-[0.7rem] font-medium text-custom-secondary dark:text-base-content">
              {produk.kode}
            </span>
            {/* nama produk */}
            <span className="text-sm font-medium text-base-content">
              {produk.nama}
            </span>

            {/* kategori produk */}
            <div className="flex flex-row justify-start items-center gap-1">
              {/* icon */}
              <Tag className="size-3 text-base-content" />

              {/* label */}
              <span className="text-xs text-base-content">
                {produk.kategori}
              </span>
            </div>
          </div>
        </div>

        {/* aksi */}
        <div className="flex-1 flex flex-row justify-end items-start">
          <div className={cn("dropdown dropdown-left dropdown-end")}>
            <button
              type="button"
              role="button"
              tabIndex={0}
              className="px-1 py-1.5 border border-base-content/10 rounded-lg"
            >
              <EllipsisVertical className="size-4 text-base-content" />
            </button>

            <DropDown
              handleRedirectDetail={() => handleRedirectDetail(produk.id)}
              handleShowModalDelete={() => handleShowModalDelete()}
            />
          </div>
        </div>
      </div>

      {/* content 2 */}
      <div className="w-full flex flex-row justify-evenly items-start gap-4 py-1">
        <div className="flex-1 flex flex-col justify-start items-start gap-1 border-r border-base-content/10">
          {/* label */}
          <div className="flex flex-row justify-start items-center gap-1">
            {/* icon */}
            <div className="w-5 h-5 rounded-full flex justify-center items-center bg-purple-100">
              <ShoppingBag className="text-purple-400 size-2.5" />
            </div>

            {/* label */}
            <span className="text-[0.625rem] text-base-content">Beli</span>
          </div>

          {/* value */}
          <span className="text-[0.7rem] font-medium text-base-content">
            {(produk.hargaBeli ?? 0) >= 100000
              ? formatRupiahShort(produk.hargaBeli ?? 0)
              : formatRupiah(produk.hargaBeli ?? 0)}
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-start items-start gap-1 border-r border-base-content/10">
          {/* label */}
          <div className="flex flex-row justify-start items-center gap-1">
            {/* icon */}
            <div className="w-5 h-5 rounded-full flex justify-center items-center bg-emerald-100">
              <Banknote className="text-emerald-400 size-2.5" />
            </div>

            {/* label */}
            <span className="text-[0.625rem] text-base-content">Jual</span>
          </div>

          {/* value */}
          <span className="text-[0.7rem] font-medium text-base-content">
            {(produk.hargaJual ?? 0) >= 100000
              ? formatRupiahShort(produk.hargaJual ?? 0)
              : formatRupiah(produk.hargaJual ?? 0)}
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-start items-start gap-1 border-r border-base-content/10">
          {/* label */}
          <div className="flex flex-row justify-start items-center gap-1">
            {/* icon */}
            <div className="w-5 h-5 rounded-full flex justify-center items-center bg-blue-100">
              <Package className="text-blue-400 size-2.5" />
            </div>

            {/* label */}
            <span className="text-[0.625rem] text-base-content">Stok</span>
          </div>

          {/* value */}
          <span
            className={cn(
              "text-[0.7rem] font-medium text-base-content",
              generateColorForStok(produk.stok ?? 0, produk.stok ?? 0),
            )}
          >
            {(produk.stok ?? 0) >= 1000
              ? formatNumberK(produk.stok ?? 0)
              : formatNumber(produk.stok ?? 0)}
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-start items-start gap-1">
          {/* label */}
          <div className="flex flex-row justify-start items-center gap-1">
            {/* icon */}
            <div className="w-5 h-5 rounded-full flex justify-center items-center bg-amber-100">
              <ShoppingBag className="text-amber-600 size-2.5" />
            </div>

            {/* label */}
            <span className="text-[0.625rem] text-base-content">Isi/Box</span>
          </div>

          {/* value */}
          <span className="text-[0.7rem] font-medium text-base-content">
            {(produk.isiPerBox ?? 0) >= 100000
              ? formatRupiahShort(produk.isiPerBox ?? 0)
              : formatRupiah(produk.isiPerBox ?? 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Produk;
