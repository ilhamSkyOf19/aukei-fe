import {
  ArrowRight,
  Banknote,
  CircleDollarSign,
  Package,
  PackagePlus,
  RefreshCcwIcon,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import FilterKategori from "../../../../components/filters/Kategori";
import FilterSort from "../../../../components/filters/Sort";
import InputSearch from "../../../../components/inputs/InputSearch";
import ButtonAdd from "../../../../components/ui/button/ButtonWithIcon";
import { cn } from "../../../../utils/cn";
import {
  formatNumber,
  formatNumberK,
  formatRupiah,
  formatRupiahShort,
  generateColorForStok,
} from "../../../../helpers/helpers";
import PaginationAndLimit from "../../../../components/filters/PaginationAndLimit";
import DataEmpty from "../../../../components/messages/DataEmpty";
import ModalDelete from "../../../../components/modals/ModalDelete";
import { Fragment, type FC } from "react";
import ModalAlert from "../../../../components/modals/ModalAlert";
import ButtonDetailTable from "../../../../components/ui/button/ButtonDetailTable";
import ButtonDeleteTable from "../../../../components/ui/button/ButtonDeleteTable";
import useDaftarProduk from "./useDaftarProduk";
import ButtonGenerateHargaJual from "../../../../components/ui/button/ButtonGenerateHargaJual";
import ModalGenerateHargaJual from "../../../../components/modals/ModalGenerateHargaJual";
import LoadingFetch from "../../../../components/ui/LoadingFetch";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";

type Props = {
  handleSetToast: (toast: string) => void;
};
const DaftarProduk: FC<Props> = ({ handleSetToast }) => {
  // call use
  const {
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
    handleDeleteProduk,
    handleShowModalDelete,
    isPendingDeleteProduk,
    dataDeleteProduk,
    modalDeleteRef,
    handleCloseModalDelete,
    kategori,
    sort,
    handelUpdateIsActive,
    isPendingUpdateIsActive,
    variablesUpdateIsActive,
    dataModalFailedDelete,
    handleCloseModalFailedDelete,
    modalFailedDeleteRef,
    dataModalGenerateHargaJual,
    handleCloseModalGenerateHargaJual,
    handleShowModalGenerateHargaJual,
    modalGenerateHargaJualRef,
    handleGetHargaPpn,
    isPendingGetHargaPpn,
  } = useDaftarProduk({ handleSetToast });

  return (
    <>
      <div className="w-full flex flex-col justify-start items-start">
        {/* filter */}
        <div className="w-full flex flex-col md:flex-row justify-start items-start md:items-start bg-base-100 p-2.5 rounded-2xl md:rounded-xl shadow-sm border border-transparent dark:border-base-content/10">
          <ButtonAdd
            icon={PackagePlus}
            label="Tambah Produk"
            handleBtn={() => handleRedirectTambah()}
            classHidden="md:hidden flex w-full mb-3"
            customWidth="w-full"
          />
          <ButtonAdd
            icon={PackagePlus}
            label="Generate Harga Jual PPN"
            bgColor="bg-info"
            textColor="text-primary-white"
            handleBtn={() => handleGetHargaPpn()}
            classHidden="md:hidden flex w-full mb-3"
            customWidth="w-full"
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
              customLabel={{
                "0": "Kecil - Besar",
                "1": "Besar - Kecil",
              }}
            />

            {/* generate */}
            <div className="flex-col justify-start items-start gap-1.5 hidden md:flex">
              <span className="text-xs text-base-content/80 font-medium">
                Harga PPN
              </span>

              <ButtonAdd
                icon={CircleDollarSign}
                bgColor="bg-info"
                textColor="text-primary-white"
                label="Generate"
                isLoading={isPendingGetHargaPpn}
                handleBtn={() => handleGetHargaPpn()}
              />
            </div>
            <div className="flex-col justify-start items-start gap-1.5 hidden md:flex">
              <span className="text-xs text-base-content/80 font-medium">
                Tambah
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
        <div className="flex w-full flex-col justify-start items-center gap-2 mt-2.5 lg:hidden">
          {/* card */}
          {isLoadingProduk ? (
            <LoadingFetch />
          ) : isExistDataProduk ? (
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
                  isActive: produk.isActive,
                  hargaPpn: produk.hargaPpn,
                }}
                variablesUpdateIsActive={variablesUpdateIsActive}
                handelUpdateIsActive={handelUpdateIsActive}
                handleRedirectDetail={handleRedirectDetail}
                disableGenerateHargaJual={produk.stok <= 0}
                handleShowModalGenerateHargaJual={() =>
                  handleShowModalGenerateHargaJual(undefined, {
                    produk: {
                      id: produk.id,
                      hargaJual: produk.hargaJual,
                      img: produk.img,
                      kategori: produk.kategori,
                      nama: produk.nama,
                      kode: produk.kode,
                      hargaModalRataRata: produk.hargaModalRataRata,
                    },
                  })
                }
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
                xs
              />
            </div>
          )}
        </div>

        {/* SHOW DATA FOR MD, LG, XL*/}
        <div className="overflow-x-auto w-full h-full bg-base-100 rounded-xl mt-2.5 md:mt-2.5 border border-transparent dark:border-base-content/10 shadow-sm hidden lg:flex">
          <table className="table table-xs lg:table-sm table-zebra">
            {/* head */}
            <thead>
              <tr className="h-12 bg-base-200 text-[0.7rem]">
                <th>Foto</th>
                <th>Kode</th>
                <th>Nama</th>
                <th>Kategori</th>
                <th>Hrg. Beli Terakhir</th>
                <th>Mdl. Rata Rata</th>
                <th>Hrg. Jual</th>
                <th>Hrg. PPN</th>
                <th>Stok</th>
                <th>Isi Box</th>
                <th>Aktif</th>
                <th align="center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingProduk ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={12}>
                      <div className="skeleton h-12 w-full py-1" />
                    </td>
                  </tr>
                ))
              ) : isExistDataProduk ? (
                dataProduk?.data?.data.map((produk, index) => (
                  <Fragment key={produk.id}>
                    {/* Header setiap 25 data */}
                    {index > 0 && index % 25 === 0 && (
                      <tr className="h-12 bg-base-200 text-[0.7rem] text-base-content/60">
                        <th>Foto</th>
                        <th>Kode</th>
                        <th>Nama</th>
                        <th>Kategori</th>
                        <th>Hrg. Beli Terakhir</th>
                        <th>Mdl. Rata Rata</th>
                        <th>Hrg. Jual</th>
                        <th>Hrg. PPN</th>
                        <th>Stok</th>
                        <th>Isi Box</th>
                        <th>Aktif</th>
                        <th align="center">Aksi</th>
                      </tr>
                    )}

                    <tr
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
                      <td className="font-medium">{produk.kode ?? "-"}</td>

                      {/* nama */}
                      <td>{produk.nama}</td>

                      {/* kategori */}
                      <td>{produk.kategori.nama}</td>

                      {/* harga beli */}
                      <td>{formatRupiah(produk.hargaBeli)}</td>

                      {/* harga modal rata rata */}
                      <td>{formatRupiah(produk.hargaModalRataRata)}</td>

                      {/* harga jual */}
                      <td>{formatRupiah(produk.hargaJual)}</td>

                      {/* harga ppn */}
                      <td>{formatRupiah(produk.hargaPpn)}</td>

                      {/* stok */}
                      <td
                        className={cn(
                          "font-medium",
                          generateColorForStok(produk.stok, produk.stokMinimum),
                        )}
                      >
                        {formatNumber(produk.stok.toString())}
                      </td>

                      {/* isi perbox */}
                      <td className="font-medium">
                        {formatNumber(produk.isiPerBox.toString())} Pcs
                      </td>

                      {/* aktif */}
                      <td>
                        {isPendingUpdateIsActive &&
                        variablesUpdateIsActive?.id == produk.id ? (
                          <div className="w-10 h-6 rounded-full flex justify-center items-center border border-base-content/10">
                            <div className="loading loading-xs" />
                          </div>
                        ) : (
                          <input
                            type="checkbox"
                            checked={produk.isActive}
                            className="toggle toggle-success toggle-sm"
                            onChange={() =>
                              handelUpdateIsActive({
                                id: produk.id,
                                status: !produk.isActive,
                              })
                            }
                          />
                        )}
                      </td>

                      {/* aksi */}
                      <td>
                        <div className="flex flex-row justify-center items-center gap-2">
                          <ButtonGenerateHargaJual
                            disabled={produk.stok <= 0}
                            handleShowModalGenerateHargaJual={() =>
                              handleShowModalGenerateHargaJual(undefined, {
                                produk: {
                                  id: produk.id,
                                  hargaJual: produk.hargaJual,
                                  img: produk.img,
                                  kategori: produk.kategori,
                                  nama: produk.nama,
                                  kode: produk.kode,
                                  hargaModalRataRata: produk.hargaModalRataRata,
                                },
                              })
                            }
                          />

                          <ButtonDetailTable
                            handleRedirect={() =>
                              handleRedirectDetail(produk.id)
                            }
                          />

                          <ButtonDeleteTable
                            handleShowModalDelete={() =>
                              handleShowModalDelete(produk.id, {
                                nama: produk.nama,
                              })
                            }
                            customSize="w-7 h-7"
                          />
                        </div>
                      </td>
                    </tr>
                  </Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={12}>
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

        {/* pagination and limits */}
        <PaginationAndLimit
          currentPage={dataProduk?.data?.meta.currentPage || null}
          totalPage={dataProduk?.data?.meta.totalPage || null}
          setPage={handlePage}
          setLimit={handleLimit}
          emptyData={!isExistDataProduk}
          limit={dataProduk?.data?.meta?.limit}
          totalData={dataProduk?.data?.meta?.totalData}
        />
      </div>
      <ModalDelete
        modalRef={modalDeleteRef}
        handleCloseModal={handleCloseModalDelete}
        handleDelete={handleDeleteProduk}
        bigTitle={`Apakah anda yakin ingin menghapus data "${dataDeleteProduk?.nama}" ini?`}
        isLoadingDelete={isPendingDeleteProduk}
      />

      {/* modal alert */}
      <ModalAlert
        modalRef={modalFailedDeleteRef}
        handleCloseModal={handleCloseModalFailedDelete}
        bigTitle={dataModalFailedDelete?.titleMessage ?? ""}
        smallTitle={dataModalFailedDelete?.description ?? ""}
      />

      {/* modal generate harga jual */}
      <ModalGenerateHargaJual
        modalRef={modalGenerateHargaJualRef}
        handleCloseModal={handleCloseModalGenerateHargaJual}
        handleSetToast={handleSetToast}
        data={dataModalGenerateHargaJual?.produk}
      />
    </>
  );
};

type CardProdukProps = {
  produk: {
    id: number;
    kode?: string | null;
    nama: string;
    kategori: string;
    hargaBeli: number;
    hargaJual: number;
    stok: number;
    isiPerBox: number;
    img: string;
    isActive: boolean;
    hargaPpn: number;
  };
  handleRedirectDetail: (value: number) => void;
  handleShowModalDelete: () => void;
  isPendingUpdateIsActive?: boolean;
  variablesUpdateIsActive?: {
    id: number;
    status: boolean;
  };
  handelUpdateIsActive?: (params: { id: number; status: boolean }) => void;
  handleShowModalGenerateHargaJual: () => void;
  disableGenerateHargaJual?: boolean;
};

// card produk
const CardProduk: FC<CardProdukProps> = ({
  handleRedirectDetail,
  isPendingUpdateIsActive,
  variablesUpdateIsActive,
  handleShowModalDelete,
  produk,
  handelUpdateIsActive,
  handleShowModalGenerateHargaJual,
  disableGenerateHargaJual,
}) => {
  return (
    <div className="w-full bg-base-100 rounded-2xl flex flex-col justify-start items-start p-4 border border-transparent dark:border-base-content/10 gap-2">
      <div className="w-full flex flex-row justify-between items-stretch pb-3 border-b border-base-content/10">
        {/* content 1 */}
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
            <span className="text-[0.7rem] font-medium text-base-content dark:text-base-content">
              {produk.nama}
            </span>
            {/* nama produk */}
            <span className="text-sm font-medium text-base-content">
              {produk.kode ?? "-"}
            </span>

            {/* kategori produk */}
            <span className="text-xs text-base-content">{produk.kategori}</span>
          </div>
        </div>

        {/* aksi */}
        <div className="flex-1 flex flex-col justify-end gap-2 items-end">
          <div>
            {isPendingUpdateIsActive &&
            variablesUpdateIsActive?.id == produk.id ? (
              <div className="w-10 h-6 rounded-full flex justify-center items-center border border-base-content/10">
                <div className="loading loading-xs" />
              </div>
            ) : (
              <input
                type="checkbox"
                checked={produk.isActive}
                className="toggle toggle-success toggle-md"
                onChange={() =>
                  handelUpdateIsActive?.({
                    id: produk.id,
                    status: !produk.isActive,
                  })
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* content 2 */}
      <div className="w-full flex flex-col gap-3 py-1">
        {/* baris atas - 3 item */}
        <div className="w-full grid grid-cols-3 gap-x-2">
          <div className="flex flex-col justify-start items-start gap-1 border-r border-base-content/10">
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

          <div className="flex flex-col justify-start items-start gap-1 border-r border-base-content/10">
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

          <div className="flex flex-col justify-start items-start gap-1">
            {/* label */}
            <div className="flex flex-row justify-start items-center gap-1">
              {/* icon */}
              <div className="w-5 h-5 rounded-full flex justify-center items-center bg-emerald-100">
                <CircleDollarSign className="text-emerald-400 size-2.5" />
              </div>

              {/* label */}
              <span className="text-[0.625rem] text-base-content">
                Hrg. PPN
              </span>
            </div>

            {/* value */}
            <span className="text-[0.7rem] font-medium text-base-content">
              {(produk.hargaPpn ?? 0) >= 100000
                ? formatRupiahShort(produk.hargaPpn ?? 0)
                : formatRupiah(produk.hargaPpn ?? 0)}
            </span>
          </div>
        </div>

        {/* garis pemisah tengah */}
        <div className="w-full border-t border-base-content/10" />

        {/* baris bawah - 2 item */}
        <div className="w-full grid grid-cols-3 gap-x-2">
          <div className="flex flex-col justify-start items-start gap-1 border-r border-base-content/10">
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
              {produk.stok === 0
                ? 0
                : (produk.stok ?? 0) >= 1000
                  ? formatNumberK(produk.stok ?? 0)
                  : formatNumber(produk.stok ?? 0)}
            </span>
          </div>

          <div className="flex flex-col justify-start items-start gap-1">
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
                ? formatNumberK(produk.isiPerBox ?? 0)
                : formatNumber(produk.isiPerBox ?? 0)}
            </span>
          </div>
        </div>
      </div>

      {/* content 3 */}
      <div className="w-full flex flex-row justify-start items-end gap-2.5 pt-2.5 border-t border-base-content/30">
        {/* button kalkulasi harga jual */}
        <ButtonWithIcon
          icon={RefreshCcwIcon}
          label="Hrg. Jual"
          bgColor="bg-emerald-500"
          textColor="text-primary-white"
          customHeight="h-9"
          customWidth="flex-1"
          disabled={disableGenerateHargaJual}
          handleBtn={() => handleShowModalGenerateHargaJual()}
        />

        {/* button hapus */}
        <ButtonWithIcon
          icon={Trash2}
          label="Hapus"
          bgColor="bg-error"
          textColor="text-primary-white"
          customHeight="h-9"
          customWidth="flex-1"
          handleBtn={() => handleShowModalDelete()}
        />

        {/* detail */}
        <ButtonWithIcon
          icon={ArrowRight}
          label="Detail"
          customHeight="h-9"
          reverse
          handleBtn={() => handleRedirectDetail(produk.id)}
          customWidth="flex-1"
        />
      </div>
    </div>
  );
};

export default DaftarProduk;
