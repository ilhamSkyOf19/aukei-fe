import {
  PackagePlus,
  Pencil,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import Toast from "../../../components/messages/Toast";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import { TOAST_CONFIG_PEGAWAI } from "../../../types/toast.type";
import usePegawai from "./usePegawai";
import InputSearch from "../../../components/inputs/InputSearch";
import FilterSort from "../../../components/filters/Sort";
import { cn } from "../../../utils/cn";
import DataEmpty from "../../../components/messages/DataEmpty";
import PaginationAndLimit from "../../../components/filters/PaginationAndLimit";
import ModalFormulirPegawai from "../../../components/modals/ModalFormulirPegawai";
import ModalDelete from "../../../components/modals/ModalDelete";

const Pegawai = () => {
  // call use
  const {
    toast,
    dataPegawai,
    handleLimit,
    handlePage,
    handleSearch,
    handleSort,
    isLoadingPegawai,
    isExistDataPegawai,
    dataFormulirPegawai,
    handleCloseModalFormulirPegawai,
    handleShowModalFormulirPegawai,
    idPegawaiForUpdate,
    modalFormulirPegawaiRef,
    dataDelete,
    handleCloseModalDelete,
    handleDelete,
    handleShowModalDelete,
    isPendingDelete,
    modalDeleteRef,
    dataDeleteMany,
    handleCloseModalDeleteMany,
    handleDeleteMany,
    handleSetChoosePegawai,
    handleShowModalDeleteMany,
    isPendingDeleteMany,
    modalDeleteManyRef,
    choosePegawai,
  } = usePegawai();

  return (
    <div className="w-full p-2 mb-28 md:mb-20">
      {/* toast create */}
      {toast && (
        <Toast
          toast={toast?.id !== null}
          isAnimationOut={toast?.isAnimationOut || false}
          label={TOAST_CONFIG_PEGAWAI[toast.type].message}
          color={TOAST_CONFIG_PEGAWAI[toast.type].color}
        />
      )}

      <div className="card dark:border dark:border-base-content/10 w-full bg-base-100 flex flex-col justify-start items-start p-4">
        {/* filter */}
        <div className=" w-full flex flex-col md:flex-row justify-start items-start md:items-start">
          <ButtonWithIcon
            icon={PackagePlus}
            label="Tambah Pegawai"
            handleBtn={() => handleShowModalFormulirPegawai()}
            customClass="md:hidden w-full mb-3"
          />
          <div className="w-full md:flex-1 flex flex-row justify-start items-center">
            {/* input search */}
            <InputSearch
              handleSearch={handleSearch}
              placeholder="Cari pegawai berdasarkan nama"
            />
          </div>

          <div className="w-full  md:flex-wrap md:flex-2 flex flex-row justify-start md:justify-end items-center md:items-start gap-4 lg:min-h-18">
            {/* filter sort */}
            <FilterSort setSort={handleSort} customWidth="w-full md:w-40" />

            {/* button add pegawai */}
            <ButtonWithIcon
              icon={PackagePlus}
              label="Tambah Pegawai"
              handleBtn={() => handleShowModalFormulirPegawai()}
              customClass="hidden md:flex"
            />
          </div>
        </div>

        {/* content sm */}
        <div className="w-full flex flex-col justify-start items-center gap-6 mt-8 md:hidden">
          {/* card */}
          {isExistDataPegawai &&
          dataPegawai?.data &&
          dataPegawai?.data?.data?.length > 0 ? (
            dataPegawai.data.data.map((pegawai, _) => (
              <div
                key={pegawai.id}
                className="card w-full shadow-sm flex flex-col justify-start items-start p-3 dark:border dark:border-base-content/10"
              >
                <div className="w-full flex flex-row justify-start items-center gap-4 pb-4 border-b border-base-content/10">
                  {/* avatar */}
                  <div className="avatar avatar-placeholder">
                    <div className="bg-custom-primary text-neutral-content w-12 rounded-full">
                      <UserRound className="size-6 text-custom-secondary" />
                    </div>
                  </div>

                  {/* nama */}
                  <p className="text-sm font-semibold text-base-content">
                    {pegawai.nama}
                  </p>
                </div>

                {/* data */}
                <div className="flex flex-col justify-start items-start w-full">
                  {/* Username */}
                  <div className="w-full flex flex-row justify-start items-center h-16 border-b border-base-content/10">
                    {/* label with icon */}
                    <div className="flex-1 flex flex-row justify-start items-center gap-4">
                      {/* icon */}
                      <UserRound className="size-6 text-base-content" />

                      <p className="text-xs font-semibold text-base-content/50">
                        Username
                      </p>
                    </div>

                    {/* value */}
                    <div className="flex-1 flex flex-row justify-end items-center gap-6">
                      {/* icon */}
                      <p className="text-xs font-semibold text-base-content">
                        {pegawai.username}
                      </p>
                    </div>
                  </div>
                  {/* role */}
                  <div className="w-full flex flex-row justify-start items-center h-16 border-b border-base-content/10">
                    {/* label with icon */}
                    <div className="flex-1 flex flex-row justify-start items-center gap-4">
                      {/* icon */}
                      <ShieldCheck className="size-6 text-base-content" />

                      <span className="text-xs font-semibold text-base-content/50">
                        Role
                      </span>
                    </div>

                    {/* value */}
                    <div className="flex-1 flex flex-row justify-end items-center gap-6">
                      {/* icon */}
                      <p className="text-xs py-2 px-3 bg-custom-primary/50 dark:bg-custom-primary font-semibold text-custom-secondary rounded-md">
                        {pegawai.role}
                      </p>
                    </div>
                  </div>

                  {/* aksi */}
                  <div className="w-full flex flex-row justify-start items-center h-16 gap-4">
                    {/* update */}
                    <div className="flex-1 flex flex-row justify-start items-center gap-4">
                      <ButtonWithIcon
                        customWidth="w-full"
                        bgColor="bg-blue-100"
                        handleBtn={() =>
                          handleShowModalFormulirPegawai(pegawai.id)
                        }
                        icon={Pencil}
                        label="Ubah"
                        textColor="text-blue-400"
                      />
                    </div>

                    {/* delete */}
                    <div className="flex-1 flex flex-row justify-end items-center gap-6">
                      <ButtonWithIcon
                        customWidth="w-full"
                        bgColor="bg-rose-100"
                        handleBtn={() =>
                          handleShowModalDelete(pegawai.id, {
                            nama: pegawai.nama,
                          })
                        }
                        icon={Trash2}
                        label="Hapus"
                        textColor="text-rose-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <DataEmpty
                title="Data Pegawai Tidak Tersedia"
                description="Belum ada data pegawai yang dapat ditampilkan saat ini."
              />
            </div>
          )}
        </div>

        {/* content lg */}
        <div className="overflow-x-auto w-full hidden md:block">
          <table className="w-full table table-xs lg:table-sm mb-2 md:mt-8 lg:mt-0">
            {/* head */}
            <thead>
              <tr>
                <th>Pilih</th>
                <th>Nama Pegawai</th>
                <th>Role</th>
                <th>Username</th>
                <th className="sticky right-0 bg-base-100 z-10">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingPegawai ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={10}>
                      <div className="skeleton h-12 w-full py-1" />
                    </td>
                  </tr>
                ))
              ) : isExistDataPegawai ? (
                dataPegawai?.data?.data.map((pegawai, _) => (
                  <tr
                    key={pegawai.id}
                    className={cn("transition-all duration-75 ease-in-out")}
                  >
                    <th>
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={choosePegawai.some(
                            (item) => item.id === pegawai.id,
                          )}
                          onChange={() => {
                            handleSetChoosePegawai({
                              id: pegawai.id,
                              nama: pegawai.nama,
                            });
                          }}
                        />
                      </label>
                    </th>
                    {/* nama pegawai */}
                    <td className="font-semibold text-base-content">
                      {pegawai.nama}
                    </td>
                    {/* role */}
                    <td className="text-base-content ">
                      <div className="flex flex-row justify-center w-18 items-center bg-custom-primary/50 dark:bg-custom-primary rounded-full">
                        <p className="text-xs py-1 px-3 font-semibold text-custom-secondary">
                          Kasir
                        </p>
                      </div>
                    </td>
                    {/* Username */}
                    <td className="text-base-content">
                      <div className="flex flex-row justify-start items-center gap-6">
                        {/* icon */}
                        <p className=" font-semibold text-base-content">
                          {pegawai.username}
                        </p>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-row justify-start items-center gap-1.5">
                        <div className="tooltip z-10" data-tip="ubah">
                          {/* update */}
                          <button
                            type="button"
                            className="w-7 h-7 bg-info rounded-md flex flex-row justify-center items-center hover-overlay"
                            onClick={() =>
                              handleShowModalFormulirPegawai(pegawai.id)
                            }
                          >
                            <Pencil className="size-3.5 text-primary-white" />
                          </button>
                        </div>

                        {/* hapus */}
                        <div className="tooltip z-10" data-tip="hapus">
                          {/* update */}
                          <button
                            type="button"
                            className="w-7 h-7 bg-error rounded-md flex flex-row justify-center items-center hover-overlay"
                            onClick={() =>
                              handleShowModalDelete(pegawai.id, {
                                nama: pegawai.nama,
                              })
                            }
                          >
                            <Trash2 className="size-3.5 text-primary-white" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10}>
                    <div className="w-full h-full flex flex-col justify-center items-center">
                      <DataEmpty
                        title="Data Pegawai Tidak Tersedia"
                        description="Belum ada data pegawai yang dapat ditampilkan saat ini."
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
                    disabled={choosePegawai.length === 0}
                    style={{
                      cursor: choosePegawai.length === 0 ? "not-allowed" : "",
                    }}
                  >
                    <Trash2
                      className={cn(
                        "size-6 text-rose-600 transition-all duration-150 ease-in-out",
                        choosePegawai.length > 0 && "group-hover:text-rose-400",
                      )}
                      onClick={() =>
                        handleShowModalDeleteMany(undefined, {
                          data: choosePegawai,
                        })
                      }
                    />
                  </button>
                </th>
                {!isLoadingPegawai &&
                isExistDataPegawai &&
                dataPegawai?.data?.data?.length! > 8 ? (
                  <>
                    <th>Nama</th>
                    <th>Role</th>
                    <th>Username</th>
                    <th className="sticky right-0 bg-base-100 z-10">Aksi</th>
                  </>
                ) : (
                  <>
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
          currentPage={dataPegawai?.data?.meta.currentPage || null}
          totalPage={dataPegawai?.data?.meta.totalPage || null}
          setPage={handlePage}
          setLimit={handleLimit}
          emptyData={!isExistDataPegawai}
        />
      </div>

      {/* modal formulir pegawai */}
      <ModalFormulirPegawai
        modalRef={modalFormulirPegawaiRef}
        handleCloseModal={handleCloseModalFormulirPegawai}
        id={idPegawaiForUpdate}
        data={dataFormulirPegawai?.data}
      />

      {/* modal delete */}
      <ModalDelete
        modalRef={modalDeleteRef}
        handleCloseModal={handleCloseModalDelete}
        handleDelete={handleDelete}
        bigTitle={`Apakah anda yakin ingin menghapus data pegawai dengan nama dibawah ini?`}
        highlightData={dataDelete?.nama}
        isLoadingDelete={isPendingDelete}
      />

      {/* modal delete many */}
      <ModalDelete
        modalRef={modalDeleteManyRef}
        handleCloseModal={handleCloseModalDeleteMany}
        handleDelete={handleDeleteMany}
        bigTitle={`Apakah anda yakin ingin menghapus data pegawai dengan nama dibawah ini?`}
        highlightDatas={dataDeleteMany?.data?.map((item) => item.nama)}
        isLoadingDelete={isPendingDeleteMany}
      />
    </div>
  );
};

export default Pegawai;
