import {
  EllipsisVertical,
  Package,
  PackagePlus,
  PackageX,
  Trash2,
  Truck,
} from "lucide-react";
import FilterSort from "../../../../components/filters/Sort";
import InputSearch from "../../../../components/inputs/InputSearch";
import Toast from "../../../../components/messages/Toast";
import { TOAST_CONFIG_BARANG_KELUAR } from "../../../../types/toast.type";
import { formatTanggalLengkap } from "../../../../helpers/formatDate";
import { cn } from "../../../../utils/cn";
import DataEmpty from "../../../../components/messages/DataEmpty";
import PaginationAndLimit from "../../../../components/filters/PaginationAndLimit";
import StatusInventori from "../../../../components/ui/StatusInventori";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import {
  STATUS_INVENTORI_TYPE,
  type StatusInventoriType,
} from "../../../../types/constant.type";
import ModalDelete from "../../../../components/modals/ModalDelete";
import useBarangKeluar from "./useBarangKeluar";
import JenisKeluar from "../../../../components/ui/JenisKeluar";
import FormulirBarangKeluar from "../../../../components/forms/FormulirBarangKeluar";
import RangeDate from "../../../../components/filters/RangeDate";
import type { FC } from "react";
import DropDownInventori from "../../../../components/ui/DropDownInventori";
import { formatNumber } from "../../../../helpers/helpers";
import ButtonDetailTable from "../../../../components/ui/button/ButtonDetailTable";
import ButtonDeleteTable from "../../../../components/ui/button/ButtonDeleteTable";

type Props = {
  fromPengajuanBarang?: boolean;
};
const BarangKeluar: FC<Props> = ({ fromPengajuanBarang }) => {
  // call use barang masuk
  const {
    dataBarangKeluar,
    handleLimit,
    handlePage,
    handleSearch,
    handleSort,
    isLoadingBarangKeluar,
    toast,
    isExistDataBarangKeluar,
    handleCloseModalFormulirBarangKeluar,
    handleShowModalFormulirBarangKeluar,
    modalFormulirBarangKeluarRef,
    handleRedirectDetail,
    dataDelete,
    handleCloseModalDelete,
    handleDelete,
    modalDeleteRef,
    handleShowModalDelete,
    isPendingDelete,
    chooseBarangKeluar,
    dataDeleteMany,
    handleCloseModalDeleteMany,
    handleDeleteMany,
    handleSetChooseBarangKeluar,
    handleShowModalDeleteMany,
    isPendingDeleteMany,
    modalDeleteManyRef,
    sort,
  } = useBarangKeluar({ fromPengajuanBarang });

  return (
    <div className="w-full  mb-30 md:mb-10 lg:mb-20 ">
      {/* toast create */}
      {toast && (
        <Toast
          toast={toast?.id !== null}
          isAnimationOut={toast?.isAnimationOut || false}
          label={TOAST_CONFIG_BARANG_KELUAR[toast.type].message}
          color={TOAST_CONFIG_BARANG_KELUAR[toast.type].color}
        />
      )}

      <div className="card flex flex-col justify-start items-start px-2.5 pt-2.5">
        {/* filter */}
        <div className="w-full bg-base-100 p-4 border border-transparent dark:border-base-content/10 flex flex-col md:flex-row justify-start items-start md:items-start rounded-lg shadow-sm">
          <ButtonWithIcon
            icon={PackagePlus}
            label="Tambah Barang Keluar"
            handleBtn={() => handleShowModalFormulirBarangKeluar()}
            customClass="md:hidden w-full mb-3"
          />
          <div className="w-full md:flex-1 flex flex-row justify-start items-center">
            {/* input search */}
            <InputSearch
              handleSearch={handleSearch}
              placeholder="Cari berdasarkan kode"
              withLabel
            />
          </div>
          <div className="w-full md:flex-wrap md:flex-2 flex flex-row justify-start md:justify-end items-start gap-4 lg:min-h-18 mt-3 md:mt-0">
            {/* input range date */}
            <RangeDate customWidth="w-full md:w-60" />

            {/* filter sort */}
            <FilterSort
              setSort={handleSort}
              customWidth="w-full md:w-40"
              value={sort}
            />

            {/* button add barang masuk */}
            <div className="flex-col justify-start items-start gap-1.5 hidden md:flex">
              <span className="text-xs text-base-content/80 font-medium">
                Aksi
              </span>
              <ButtonWithIcon
                icon={PackagePlus}
                label="Tambah Barang Keluar"
                handleBtn={() => handleShowModalFormulirBarangKeluar()}
                customClass="hidden md:flex"
              />
            </div>
          </div>
        </div>

        {/* SHOW DATA FOR SM */}
        <div className="flex w-full flex-col justify-start items-center gap-2 mt-2 md:hidden">
          {isLoadingBarangKeluar ? (
            <>
              <div className="w-full h-20 skeleton border border-base-content/10" />
              <div className="w-full h-20 skeleton border border-base-content/10" />
              <div className="w-full h-20 skeleton border border-base-content/10" />
            </>
          ) : isExistDataBarangKeluar ? (
            dataBarangKeluar?.data?.data?.map((barang, _) => (
              <CardBarangKeluar
                key={barang.id}
                barang={{
                  id: barang.id,
                  kode: barang.kodeReferensi,
                  jumlah: barang.countDetailBarangKeluar,
                  status: barang.status,
                  tanggalKeluar: barang.tanggalKeluar,
                  jenisKeluar: barang.jenisKeluar.nama,
                }}
                handleRedirectDetail={handleRedirectDetail}
                handleShowModalDelete={
                  barang.status === STATUS_INVENTORI_TYPE.DRAFT ||
                  (barang.status !== STATUS_INVENTORI_TYPE.PENDING &&
                    barang.status !== STATUS_INVENTORI_TYPE.POSTED)
                    ? () =>
                        handleShowModalDelete(barang.id, {
                          kodeReferensi: barang.kodeReferensi,
                        })
                    : undefined
                }
                chooseBarangMasuk={chooseBarangKeluar}
                handleSetChooseBarangMasuk={handleSetChooseBarangKeluar}
              />
            ))
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <DataEmpty
                title="Data Barang Keluar Tidak Tersedia"
                description="Belum ada data barang keluar yang dapat ditampilkan saat ini"
                xs
              />
            </div>
          )}

          {!isLoadingBarangKeluar && (
            <ButtonWithIcon
              icon={Trash2}
              bgColor="bg-error"
              textColor="text-primary-white"
              label="Hapus data yang dipilih"
              customWidth="w-full"
              disabled={chooseBarangKeluar.length === 0}
              handleBtn={() =>
                handleShowModalDeleteMany(undefined, {
                  data: chooseBarangKeluar,
                })
              }
            />
          )}
        </div>

        {/* SHOW DATA FOR MD, LG, XL */}
        <div className="overflow-x-auto w-full bg-base-100 rounded-xl shadow-sm border border-transparent dark:border-base-content/10 mt-4 hidden md:flex">
          <table className="w-full table table-xs lg:table-sm mb-2 table-zebra">
            {/* head */}
            <thead>
              <tr className="h-12 bg-base-200 text-xs">
                <th>Pilih</th>
                <th>Kode Referensi</th>
                <th>Tanggal Keluar</th>
                <th>Keterangan</th>
                <th>Jumlah</th>
                <th>Jenis Keluar</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingBarangKeluar ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={10}>
                      <div className="skeleton h-12 w-full py-1" />
                    </td>
                  </tr>
                ))
              ) : isExistDataBarangKeluar ? (
                dataBarangKeluar?.data?.data.map((barang, _) => (
                  <tr
                    key={barang.id}
                    className={cn(
                      "transition-all duration-75 ease-in-out h-18 text-xs text-base-content",
                    )}
                  >
                    <th>
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox"
                          disabled={
                            barang.status === STATUS_INVENTORI_TYPE.POSTED ||
                            barang.status === STATUS_INVENTORI_TYPE.PENDING
                          }
                          checked={chooseBarangKeluar.some(
                            (item) => item.id === barang.id,
                          )}
                          onChange={() => {
                            handleSetChooseBarangKeluar({
                              id: barang.id,
                              kodeReferensi: barang.kodeReferensi,
                            });
                          }}
                        />
                      </label>
                    </th>
                    {/* kode */}
                    <td className="font-medium text-info">
                      {barang.kodeReferensi}
                    </td>
                    {/* tanggal */}
                    <td>{formatTanggalLengkap(barang.tanggalKeluar)} WIB</td>
                    {/* keterangan */}
                    <td>
                      {barang.keterangan ? (
                        <span>{barang.keterangan}</span>
                      ) : (
                        <span className="italic text-base-content/50">
                          Tidak ada keterangan
                        </span>
                      )}
                    </td>
                    {/* jumlah */}
                    <td>{barang.countDetailBarangKeluar}</td>
                    {/* jumlah barang masuk */}
                    <td>
                      <JenisKeluar jenisKeluar={barang.jenisKeluar.nama} />
                    </td>
                    {/* status */}
                    <td>
                      <StatusInventori status={barang.status} />
                    </td>

                    {/* detail */}
                    <td>
                      <div className="flex flex-row justify-start items-center gap-2">
                        <ButtonDetailTable
                          handleRedirect={() => handleRedirectDetail(barang.id)}
                        />

                        {/* button delete */}
                        <ButtonDeleteTable
                          handleShowModalDelete={() =>
                            handleShowModalDelete(barang.id, {
                              kodeReferensi: barang.kodeReferensi,
                            })
                          }
                          customDataTip={
                            barang.status === STATUS_INVENTORI_TYPE.DRAFT ||
                            (barang.status !== STATUS_INVENTORI_TYPE.PENDING &&
                              barang.status !== STATUS_INVENTORI_TYPE.POSTED)
                              ? "hapus"
                              : ""
                          }
                          disabled={
                            !(
                              barang.status === STATUS_INVENTORI_TYPE.DRAFT ||
                              (barang.status !==
                                STATUS_INVENTORI_TYPE.PENDING &&
                                barang.status !== STATUS_INVENTORI_TYPE.POSTED)
                            )
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
                        title="Data Barang Keluar Tidak Tersedia"
                        description="Belum ada data barang keluar yang dapat ditampilkan saat ini."
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
            {/* foot */}
            <tfoot>
              <tr>
                <th>
                  <button
                    type="button"
                    className="hover group disabled:opacity-50"
                    disabled={chooseBarangKeluar.length === 0}
                    style={{
                      cursor:
                        chooseBarangKeluar.length === 0 ? "not-allowed" : "",
                    }}
                  >
                    <Trash2
                      className={cn(
                        "size-6 text-rose-600 transition-all duration-150 ease-in-out",
                        chooseBarangKeluar.length > 0 &&
                          "group-hover:text-rose-400",
                      )}
                      onClick={() =>
                        handleShowModalDeleteMany(undefined, {
                          data: chooseBarangKeluar,
                        })
                      }
                    />
                  </button>
                </th>
                {!isLoadingBarangKeluar &&
                isExistDataBarangKeluar &&
                dataBarangKeluar?.data?.data?.length! > 8 ? (
                  <>
                    <th>Kode Referensi</th>
                    <th>Tanggal Keluar</th>
                    <th>Keterangan</th>
                    <th>Jumlah</th>
                    <th>Jenis Keluar</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </>
                ) : (
                  <>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </>
                )}
              </tr>
            </tfoot>
          </table>
        </div>

        {/* pagination and limits */}
        <PaginationAndLimit
          currentPage={dataBarangKeluar?.data?.meta.currentPage || null}
          totalPage={dataBarangKeluar?.data?.meta.totalPage || null}
          setPage={handlePage}
          setLimit={handleLimit}
          emptyData={!isExistDataBarangKeluar}
        />
      </div>

      {/* modal formulir barang masuk */}
      <FormulirBarangKeluar
        modalRef={modalFormulirBarangKeluarRef}
        handleCloseModal={handleCloseModalFormulirBarangKeluar}
      />

      {/* modal delete */}
      <ModalDelete
        modalRef={modalDeleteRef}
        handleCloseModal={handleCloseModalDelete}
        handleDelete={handleDelete}
        bigTitle={`Apakah anda yakin ingin menghapus data dengan kode referensi dibawah ini?`}
        highlightData={dataDelete?.kodeReferensi}
        isLoadingDelete={isPendingDelete}
      />

      {/* modal delete many */}
      <ModalDelete
        modalRef={modalDeleteManyRef}
        handleCloseModal={handleCloseModalDeleteMany}
        handleDelete={handleDeleteMany}
        bigTitle={`Apakah anda yakin ingin menghapus data dengan kode referensi dibawah ini?`}
        highlightDatas={dataDeleteMany?.data?.map((item) => item.kodeReferensi)}
        isLoadingDelete={isPendingDeleteMany}
      />
    </div>
  );
};

type CardBarangKeluar = {
  barang: {
    id: number;
    kode: string;
    tanggalKeluar: Date;
    status: StatusInventoriType;
    jenisKeluar: string;
    jumlah: number;
  };
  handleRedirectDetail: (value: number) => void;
  handleShowModalDelete?: () => void;
  chooseBarangMasuk: {
    id: number;
    kodeReferensi: string;
  }[];
  handleSetChooseBarangMasuk: (data: {
    id: number;
    kodeReferensi: string;
  }) => void;
};

// card produk
const CardBarangKeluar: FC<CardBarangKeluar> = ({
  handleRedirectDetail,
  barang,
  handleShowModalDelete,
  chooseBarangMasuk,
  handleSetChooseBarangMasuk,
}) => {
  return (
    <div className="w-full bg-base-100 rounded-lg flex flex-col justify-start items-start p-4 border border-transparent dark:border-base-content/10 gap-2">
      <div className="w-full flex flex-row justify-between items-start pb-3 border-b border-base-content/10">
        {/* content 1 */}
        <div className="flex-8 flex flex-row justify-start items-start gap-4">
          <div className="flex flex-row justify-start items-start gap-3">
            {/* checkbox */}
            <input
              type="checkbox"
              className="checkbox"
              disabled={!handleShowModalDelete}
              checked={chooseBarangMasuk.some((item) => item.id === barang.id)}
              onChange={() => {
                handleSetChooseBarangMasuk({
                  id: barang.id,
                  kodeReferensi: barang.kode,
                });
              }}
            />

            {/* foto */}
            <div className="w-12 h-12 flex justify-center items-center overflow-hidden bg-rose-100 rounded-lg">
              <Truck className="size-6 text-rose-400" />
            </div>
          </div>

          {/* deskripsi */}
          <div className="flex flex-col justify-start items-start gap-1">
            {/* kode */}
            <span className="text-xs text-info font-medium">{barang.kode}</span>

            {/* tanggal masuk */}
            <span className="text-[0.7rem] font-medium text-custom-secondary dark:text-base-content">
              {formatTanggalLengkap(new Date())} WIB
            </span>
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

            <DropDownInventori
              handleRedirectDetail={() => handleRedirectDetail(barang.id)}
              handleShowModalDelete={handleShowModalDelete}
            />
          </div>
        </div>
      </div>

      {/* content 2 */}
      <div className="w-full flex flex-row justify-evenly items-start gap-4 pt-0.5">
        <div className="flex-2 flex flex-row justify-start items-start gap-1">
          {/* label */}
          <div className="flex-1 flex flex-row justify-start items-center gap-1">
            {/* icon */}
            <div className="w-5 h-5 rounded-full flex justify-center items-center bg-rose-100">
              <Package className="text-rose-400 size-3" />
            </div>

            {/* label */}
            <p className="text-xs text-base-content">
              Jumlah : <span>{formatNumber(barang.jumlah)}</span>
            </p>
          </div>

          {/* jenis keluar */}
          <div className="flex-1 flex flex-row justify-start items-center gap-1">
            {/* icon */}
            <div className="w-5 h-5 rounded-full flex justify-center items-center bg-rose-100">
              <PackageX className="text-rose-400 size-3" />
            </div>

            {/* label */}
            <p className="text-xs text-base-content capitalize">
              Jenis : <span>{barang.jenisKeluar.toLowerCase()}</span>
            </p>
          </div>
        </div>

        {/* status */}
        <div className="flex-1 flex flex-row justify-end items-center">
          <StatusInventori status={barang.status} />
        </div>
      </div>
    </div>
  );
};

export default BarangKeluar;
