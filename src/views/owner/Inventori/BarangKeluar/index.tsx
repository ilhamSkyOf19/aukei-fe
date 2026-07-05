import {
  EllipsisVertical,
  PackagePlus,
  Trash,
  Trash2,
  View,
} from "lucide-react";
import FilterSort from "../../../../components/filters/Sort";
import InputSearch from "../../../../components/inputs/InputSearch";
import Toast from "../../../../components/messages/Toast";
import { TOAST_CONFIG_BARANG_KELUAR } from "../../../../types/toast.type";
import { formatTanggalLengkap } from "../../../../helpers/formatDate";
import { cn } from "../../../../utils/cn";
import LabelButtonDropDownWithIcon from "../../../../components/ui/button/LabelButtonDropDownWithIcon";
import DataEmpty from "../../../../components/messages/DataEmpty";
import PaginationAndLimit from "../../../../components/filters/PaginationAndLimit";
import StatusInventori from "../../../../components/ui/StatusInventori";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import { STATUS_INVENTORI_TYPE } from "../../../../types/constant.type";
import ModalDelete from "../../../../components/modals/ModalDelete";
import useBarangKeluar from "./useBarangKeluar";
import JenisKeluar from "../../../../components/ui/JenisKeluar";
import FormulirBarangKeluar from "../../../../components/forms/FormulirBarangKeluar";
import RangeDate from "../../../../components/filters/RangeDate";

const BarangKeluar = () => {
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
    handleSetIsActiveAksi,
    isActiveAksi,
    wrapperRef,
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
  } = useBarangKeluar();

  return (
    <div className="w-full">
      {/* toast create */}
      {toast && (
        <Toast
          toast={toast?.id !== null}
          isAnimationOut={toast?.isAnimationOut || false}
          label={TOAST_CONFIG_BARANG_KELUAR[toast.type].message}
          color={TOAST_CONFIG_BARANG_KELUAR[toast.type].color}
        />
      )}

      <div className="card flex flex-col justify-start items-start">
        {/* filter */}
        <div className="w-full bg-base-100 py-2 px-4 border border-transparent dark:border-base-content/10 flex flex-col md:flex-row justify-start items-start md:items-start rounded-lg shadow-sm">
          <ButtonWithIcon
            icon={PackagePlus}
            label="Tambah Barang Keluar"
            handleBtn={() => handleShowModalFormulirBarangKeluar()}
            customClass="md:hidden w-full mb-3"
          />
          <div className="w-full md:flex-1 flex flex-row justify-start items-center">
            {/* input search */}
            <InputSearch handleSearch={handleSearch} placeholder="Cari kode" />
          </div>
          <div className="w-full  md:flex-wrap md:flex-2 flex flex-row justify-start md:justify-end items-center md:items-start gap-4 lg:min-h-18 mt-3 md:mt-0">
            {/* input range date */}
            <RangeDate customWidth="w-full md:w-60" />

            {/* filter sort */}
            <FilterSort setSort={handleSort} customWidth="w-full md:w-40" />

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

        {/* table */}
        <div className="overflow-x-auto w-full bg-base-100 rounded-xl shadow-sm border border-transparent dark:border-base-content/10 mt-4">
          <table className="w-full table table-xs lg:table-sm mb-2">
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
                <th className="sticky right-0 bg-base-200 z-10">Aksi</th>
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
                      isActiveAksi === barang.id && "bg-base-200",
                    )}
                  >
                    <th>
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox"
                          disabled={
                            barang.status === STATUS_INVENTORI_TYPE.POSTED
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
                    <td className="sticky right-0 bg-base-100 z-10">
                      <div
                        ref={wrapperRef}
                        className={cn("dropdown dropdown-left dropdown-end")}
                      >
                        <button
                          type="button"
                          className="btn btn-sm m-1"
                          tabIndex={0}
                          onClick={() => handleSetIsActiveAksi(barang.id)}
                          onFocus={() => handleSetIsActiveAksi(barang.id)}
                          onBlur={() => handleSetIsActiveAksi(0)}
                        >
                          <EllipsisVertical className="size-4" />
                        </button>
                        <ul
                          tabIndex={-1}
                          className="z-50 dark:border dark:border-base-content/10 dropdown-content menu bg-base-100 rounded-box w-40 lg:w-50 p-2 shadow-sm space-y-2 absolute"
                        >
                          <li>
                            <LabelButtonDropDownWithIcon
                              label="Detail"
                              icon={View}
                              handleClick={() =>
                                handleRedirectDetail(barang.id)
                              }
                            />
                          </li>
                          {barang.status === STATUS_INVENTORI_TYPE.DRAFT && (
                            <li>
                              <LabelButtonDropDownWithIcon
                                color="text-error"
                                label="Hapus"
                                icon={Trash}
                                handleClick={() =>
                                  handleShowModalDelete(barang.id, {
                                    kodeReferensi: barang.kodeReferensi,
                                  })
                                }
                              />
                            </li>
                          )}
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
                    <th className="sticky right-0 bg-base-100 z-10">Aksi</th>
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

export default BarangKeluar;
