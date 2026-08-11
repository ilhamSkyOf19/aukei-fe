import { PackagePlus, Trash2 } from "lucide-react";
import Toast from "../../../components/messages/Toast";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import { TOAST_CONFIG_PELANGGAN } from "../../../types/toast.type";
import InputSearch from "../../../components/inputs/InputSearch";
import FilterSort from "../../../components/filters/Sort";
import { cn } from "../../../utils/cn";
import DataEmpty from "../../../components/messages/DataEmpty";
import PaginationAndLimit from "../../../components/filters/PaginationAndLimit";
import ModalFormulirPelanggan from "../../../components/modals/ModalFormulirPelanggan";
import ModalDelete from "../../../components/modals/ModalDelete";
import usePelanggan from "./usePelanggan";
import { formatNumber, formatNumberPhone } from "../../../helpers/helpers";
import ModalAlert from "../../../components/modals/ModalAlert";
import AlertLabel from "../../../components/messages/AlertLabel";
import ButtonUpdateTable from "../../../components/ui/button/ButtonUpdateTable";
import ButtonDeleteTable from "../../../components/ui/button/ButtonDeleteTable";
import ButtonDetailTable from "../../../components/ui/button/ButtonDetailTable";
import CardPelanggan from "../../../components/ui/cards/CardPelanggan";
import LoadingFetch from "../../../components/ui/LoadingFetch";

const Pelanggan = () => {
  // call use
  const {
    toast,
    dataPelanggan,
    handleLimit,
    handlePage,
    handleSearch,
    handleSort,
    isLoadingPelanggan,
    isExistDataPelanggan,
    dataFormulirPelanggan,
    handleCloseModalFormulirPelanggan,
    handleShowModalFormulirPelanggan,
    idPelangganForUpdate,
    modalFormulirPelangganRef,
    dataDelete,
    handleCloseModalDelete,
    handleDelete,
    handleShowModalDelete,
    isPendingDelete,
    modalDeleteRef,
    dataDeleteMany,
    handleCloseModalDeleteMany,
    handleDeleteMany,
    handleSetChoosePelanggan,
    handleShowModalDeleteMany,
    isPendingDeleteMany,
    modalDeleteManyRef,
    choosePelanggan,
    sort,
    dataFailedDelete,
    handleCloseModalFailedDelete,
    modalFailedDeleteRef,
    handelUpdateIsActive,
    isPendingUpdateIsActive,
    variablesUpdateIsActive,
    handleRedirectRiwayatTransaksiDetail,
  } = usePelanggan();

  return (
    <div className="w-full flex flex-col justify-start items-start p-2.5">
      {/* toast create */}
      {toast && (
        <Toast
          toast={toast?.id !== null}
          isAnimationOut={toast?.isAnimationOut || false}
          label={TOAST_CONFIG_PELANGGAN[toast.type].message}
          color={TOAST_CONFIG_PELANGGAN[toast.type].color}
        />
      )}

      <div className="flex flex-col justify-start items-start w-full">
        {/* filter */}
        <div className="w-full flex flex-col md:flex-row justify-start items-start md:items-start bg-base-100 p-2.5 rounded-2xl md:rounded-xl shadow-sm border border-transparent dark:border-base-content/10">
          <ButtonWithIcon
            icon={PackagePlus}
            label="Tambah Pelanggan"
            handleBtn={() => handleShowModalFormulirPelanggan()}
            classHidden="md:hidden flex mb-3"
            customWidth="w-full"
          />
          <div className="w-full md:flex-1 flex flex-row justify-start items-center">
            {/* input search */}
            <InputSearch
              handleSearch={handleSearch}
              placeholder="Cari Pelanggan berdasarkan nama"
              withLabel
            />
          </div>

          <div className="w-full md:flex-wrap md:flex-2 flex flex-row justify-start md:justify-end items-center md:items-start gap-2.5 mt-3 md:mt-0">
            {/* filter sort */}
            <FilterSort
              setSort={handleSort}
              customWidth="w-full md:w-40"
              value={sort}
            />

            {/* button add Pelanggan */}
            <div className="flex-col justify-start items-start gap-1.5 hidden md:flex">
              <span className="text-xs text-base-content/80 font-medium">
                Aksi
              </span>

              <ButtonWithIcon
                icon={PackagePlus}
                label="Tambah Pelanggan"
                handleBtn={() => handleShowModalFormulirPelanggan()}
                // customClass="hidden md:flex"
              />
            </div>
          </div>
        </div>

        {/* content sm */}
        <div className="w-full lg:hidden flex flex-col justify-start items-center gap-2.5 pt-3 pb-2">
          {/* card */}
          {isLoadingPelanggan ? (
            <LoadingFetch />
          ) : isExistDataPelanggan ? (
            dataPelanggan?.data?.data.map((pelanggan) => (
              <CardPelanggan
                data={pelanggan}
                handelUpdateIsActive={handelUpdateIsActive}
                handleRedirectRiwayatTransaksiDetail={
                  handleRedirectRiwayatTransaksiDetail
                }
                handleShowModalDelete={handleShowModalDelete}
                handleShowModalFormulirPelanggan={
                  handleShowModalFormulirPelanggan
                }
                variablesUpdateIsActive={variablesUpdateIsActive}
                isPendingDelete={isPendingDelete}
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

        {/* content lg */}
        <div className="w-full hidden lg:block bg-base-100 overflow-hidden rounded-xl mt-2.5 shadow-sm border border-transparent dark:border-base-content/10">
          <table className="w-full table table-xs mb-2">
            {/* head */}
            <thead>
              <tr className="text-xs h-12 bg-base-200">
                <th>Pilih</th>
                <th>Nama Pelanggan</th>
                <th>No Wa</th>
                <th>Total transaksi</th>
                <th>Kredit Selesai</th>
                <th>Kredit Berjalan</th>
                <th>Kredit Terlambat</th>
                <th>Booking</th>
                <th>Aktif</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingPelanggan ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={10}>
                      <div className="skeleton h-12 w-full py-1" />
                    </td>
                  </tr>
                ))
              ) : isExistDataPelanggan ? (
                dataPelanggan?.data?.data.map((pelanggan, _) => (
                  <tr
                    key={pelanggan.id}
                    className={cn("transition-all duration-75 ease-in-out")}
                  >
                    <th>
                      <label>
                        <input
                          disabled={(pelanggan?.totalTransaction ?? 0) > 0}
                          type="checkbox"
                          className="checkbox"
                          checked={choosePelanggan.some(
                            (item) => item.id === pelanggan.id,
                          )}
                          onChange={() => {
                            (pelanggan?.totalTransaction ?? 0) <= 0 &&
                              handleSetChoosePelanggan({
                                id: pelanggan.id,
                                nama: pelanggan.nama,
                              });
                          }}
                        />
                      </label>
                    </th>
                    {/* nama Pelanggan */}
                    <td className="font-semibold text-base-content">
                      {pelanggan.nama}
                    </td>
                    {/* no wa */}
                    <td className="text-base-content">
                      <div className="flex flex-row justify-start items-center gap-6">
                        {/* icon */}
                        <p className=" font-semibold text-base-content">
                          {formatNumberPhone(pelanggan.noWa)}
                        </p>
                      </div>
                    </td>
                    {/*  total transaksi */}
                    <td className="text-base-content">
                      <div className="flex flex-row justify-start items-center gap-6">
                        {/* icon */}
                        {pelanggan?.totalTransaction ? (
                          <p className=" font-semibold text-base-content">
                            {formatNumber(pelanggan.totalTransaction)}
                          </p>
                        ) : (
                          <p className=" font-light italic text-base-content/50">
                            Kosong
                          </p>
                        )}
                      </div>
                    </td>
                    {/* kredit selesai */}
                    <td className="text-base-content">
                      <div className="flex flex-row justify-start items-center gap-6">
                        {/* icon */}
                        {pelanggan?.kredit?.selesai ? (
                          <p className=" font-semibold text-base-content">
                            {formatNumber(pelanggan.kredit.selesai)}
                          </p>
                        ) : (
                          <p className=" font-light italic text-base-content/50">
                            Kosong
                          </p>
                        )}
                      </div>
                    </td>
                    {/* kredit berjalan */}
                    <td className="text-base-content">
                      <div className="flex flex-row justify-start items-center gap-6">
                        {/* icon */}
                        {pelanggan?.kredit?.berjalan ? (
                          <p className=" font-semibold text-base-content">
                            {formatNumber(pelanggan.kredit.berjalan)}
                          </p>
                        ) : (
                          <p className=" font-light italic text-base-content/50">
                            Kosong
                          </p>
                        )}
                      </div>
                    </td>
                    {/* kredit terlambat */}
                    <td className="text-base-content">
                      <div className="flex flex-row justify-start items-center gap-6">
                        {/* icon */}
                        {pelanggan?.kredit?.terlambat ? (
                          <p className=" font-semibold text-base-content">
                            {formatNumber(pelanggan.kredit.terlambat)}
                          </p>
                        ) : (
                          <p className=" font-light italic text-base-content/50">
                            Kosong
                          </p>
                        )}
                      </div>
                    </td>
                    {/* booking */}
                    <td className="text-base-content">
                      <div className="flex flex-row justify-start items-center gap-6">
                        {/* icon */}
                        {pelanggan?.booking ? (
                          <p className=" font-semibold text-base-content">
                            {formatNumber(pelanggan.booking)}
                          </p>
                        ) : (
                          <p className=" font-light italic text-base-content/50">
                            Kosong
                          </p>
                        )}
                      </div>
                    </td>

                    {/* aktif */}
                    <td>
                      {isPendingUpdateIsActive &&
                      variablesUpdateIsActive?.id == pelanggan.id ? (
                        <div className="w-10 h-6 rounded-full flex justify-center items-center border border-base-content/10">
                          <div className="loading loading-xs" />
                        </div>
                      ) : (
                        <input
                          type="checkbox"
                          checked={pelanggan.isActive}
                          className="toggle toggle-success toggle-sm"
                          onChange={() =>
                            handelUpdateIsActive({
                              id: pelanggan.id,
                              status: !pelanggan.isActive,
                            })
                          }
                        />
                      )}
                    </td>

                    <td>
                      <div className="flex flex-row justify-start items-center gap-1.5">
                        <ButtonDetailTable
                          handleRedirect={() =>
                            handleRedirectRiwayatTransaksiDetail(pelanggan.id)
                          }
                          customDataTip="lihat transaksi"
                        />

                        {/* update */}
                        <ButtonUpdateTable
                          handleShowModalFormulir={() =>
                            handleShowModalFormulirPelanggan(pelanggan.id)
                          }
                        />

                        {/* hapus */}
                        <ButtonDeleteTable
                          handleShowModalDelete={() =>
                            handleShowModalDelete(pelanggan.id, {
                              nama: pelanggan.nama,
                            })
                          }
                          customDataTip={
                            (pelanggan?.totalTransaction ?? 0) <= 0
                              ? "hapus"
                              : ""
                          }
                          disabled={
                            (pelanggan?.totalTransaction ?? 0) > 0 ||
                            isPendingDelete
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
                        title="Data Pelanggan Tidak Tersedia"
                        description="Belum ada data pelanggan yang dapat ditampilkan saat ini."
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
                    disabled={choosePelanggan.length === 0}
                    style={{
                      cursor: choosePelanggan.length === 0 ? "not-allowed" : "",
                    }}
                  >
                    <Trash2
                      className={cn(
                        "size-6 text-rose-600 transition-all duration-150 ease-in-out",
                        choosePelanggan.length > 0 &&
                          "group-hover:text-rose-400",
                      )}
                      onClick={() =>
                        handleShowModalDeleteMany(undefined, {
                          data: choosePelanggan,
                        })
                      }
                    />
                  </button>
                </th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* alert */}
        {isExistDataPelanggan && (
          <div className="w-full mt-2">
            <AlertLabel message="Pelanggan yang memiliki riwayat transaksi hanya bisa di nonaktifkan" />
          </div>
        )}

        {/* pagination and limits */}
        <PaginationAndLimit
          currentPage={dataPelanggan?.data?.meta.currentPage || null}
          totalPage={dataPelanggan?.data?.meta.totalPage || null}
          setPage={handlePage}
          setLimit={handleLimit}
          emptyData={!isExistDataPelanggan}
        />
      </div>

      {/* modal formulir Pelanggan */}
      <ModalFormulirPelanggan
        modalRef={modalFormulirPelangganRef}
        handleCloseModal={handleCloseModalFormulirPelanggan}
        id={idPelangganForUpdate}
        data={dataFormulirPelanggan?.data}
      />

      {/* modal delete */}
      <ModalDelete
        modalRef={modalDeleteRef}
        handleCloseModal={handleCloseModalDelete}
        handleDelete={handleDelete}
        bigTitle={`Apakah anda yakin ingin menghapus data pelanggan dengan nama dibawah ini?`}
        highlightData={dataDelete?.nama}
        isLoadingDelete={isPendingDelete}
      />

      {/* modal delete many */}
      <ModalDelete
        modalRef={modalDeleteManyRef}
        handleCloseModal={handleCloseModalDeleteMany}
        handleDelete={handleDeleteMany}
        bigTitle={`Apakah anda yakin ingin menghapus data pelanggan dengan nama dibawah ini?`}
        highlightDatas={dataDeleteMany?.data?.map((item) => item.nama)}
        isLoadingDelete={isPendingDeleteMany}
      />

      {/* modal alert */}
      <ModalAlert
        modalRef={modalFailedDeleteRef}
        handleCloseModal={handleCloseModalFailedDelete}
        bigTitle={dataFailedDelete?.message ?? ""}
        smallTitle={dataFailedDelete?.description ?? ""}
      />
    </div>
  );
};

export default Pelanggan;
