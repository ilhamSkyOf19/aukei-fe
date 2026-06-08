import { EllipsisVertical, PackagePlus, Trash, View } from "lucide-react";
import FilterSort from "../../../../components/filters/Sort";
import InputSearch from "../../../../components/inputs/InputSearch";
import Toast from "../../../../components/messages/Toast";
import { TOAST_CONFIG_BARANG_MASUK } from "../../../../types/toast.type";
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
  } = useBarangKeluar();

  return (
    <div className="w-full">
      {/* toast create */}
      {toast && (
        <Toast
          toast={toast?.id !== null}
          isAnimationOut={toast?.isAnimationOut || false}
          label={TOAST_CONFIG_BARANG_MASUK[toast.type].message}
          color={TOAST_CONFIG_BARANG_MASUK[toast.type].color}
        />
      )}

      <div className="card dark:border dark:border-base-content/10 w-full bg-base-100 flex flex-col justify-start items-start p-4">
        {/* filter */}
        <div className=" w-full flex flex-col lg:flex-row justify-start items-start lg:items-center gap-4 lg:gap-0">
          <div className="w-full lg:flex-1 flex flex-row justify-start items-center">
            {/* input search */}
            <InputSearch
              handleSearch={handleSearch}
              placeholder="Cari produk berdasarkan nama atau kode"
            />
          </div>

          <div className="w-full  flex-wrap lg:flex-2 flex flex-row justify-start lg:justify-end items-center gap-4">
            {/* filter sort */}
            <FilterSort setSort={handleSort} />

            {/* button add barang masuk */}
            <ButtonWithIcon
              icon={PackagePlus}
              label="Tambah Barang Keluar"
              handleBtn={() => handleShowModalFormulirBarangKeluar()}
            />
          </div>
        </div>

        {/* table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full table table-xs lg:table-sm my-8">
            {/* head */}
            <thead>
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th>Kode Referensi</th>
                <th>Tanggal Keluar</th>
                <th>Keterangan</th>
                <th>Jumlah Barang Keluar</th>
                <th>Jenis Keluar</th>
                <th>Status</th>
                <th className="sticky right-0 bg-base-100 z-10">Aksi</th>
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
                      "transition-all duration-75 ease-in-out",
                      isActiveAksi === barang.id && "bg-base-200",
                    )}
                  >
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    {/* kode */}
                    <td className="font-semibold text-info">
                      {barang.kodeReferensi}
                    </td>
                    {/* tanggal */}
                    <td className="text-base-content">
                      {formatTanggalLengkap(barang.tanggalKeluar)} WIB
                    </td>
                    {/* keterangan */}
                    <td className="text-base-content">
                      {barang.keterangan ? (
                        <span>{barang.keterangan}</span>
                      ) : (
                        <span className="text-xs italic text-base-content/50">
                          Tidak ada keterangan
                        </span>
                      )}
                    </td>
                    {/* jumlah barang keluar */}
                    <td className="text-base-content">
                      {barang.countDetailBarangKeluar}
                    </td>
                    {/* jumlah barang masuk */}
                    <td className="text-base-content">
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
                                  handleShowModalDelete(
                                    barang.id,
                                    barang.kodeReferensi,
                                  )
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
                        title="Data Barang Masuk Tidak Tersedia"
                        description="Belum ada data barang masuk yang dapat ditampilkan saat ini."
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
            {/* foot */}
            {!isLoadingBarangKeluar &&
              isExistDataBarangKeluar &&
              dataBarangKeluar?.data?.data?.length! > 8 && (
                <tfoot>
                  <tr>
                    <th></th>
                    <th>Kode Referensi</th>
                    <th>Tanggal Keluar</th>
                    <th>Keterangan</th>
                    <th>Jumlah Barang Keluar</th>
                    <th>Jenis Keluar</th>
                    <th>Status</th>
                    <th className="sticky right-0 bg-base-100 z-10">Aksi</th>
                  </tr>
                </tfoot>
              )}
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
        highlightData={dataDelete}
        isLoadingDelete={isPendingDelete}
      />
    </div>
  );
};

export default BarangKeluar;
