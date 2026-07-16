import { IdCardLanyard, PackagePlus, Pencil, Trash2 } from "lucide-react";
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
import Avatar from "../../../components/ui/Avatar";
import type { FC } from "react";
import ButtonDeleteTable from "../../../components/ui/button/ButtonDeleteTable";
import ButtonUpdateTable from "../../../components/ui/button/ButtonUpdateTable";

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
    sort,
    handelUpdateIsActive,
    isPendingUpdateIsActive,
    variablesUpdateIsActive,
  } = usePegawai();

  return (
    <div className="w-full h-screen overflow-y-auto">
      <div className="w-full mb-30 md:mb-10 lg:mb-20 p-2">
        {/* toast create */}
        {toast && (
          <Toast
            toast={toast?.id !== null}
            isAnimationOut={toast?.isAnimationOut || false}
            label={TOAST_CONFIG_PEGAWAI[toast.type].message}
            color={TOAST_CONFIG_PEGAWAI[toast.type].color}
          />
        )}

        <div className=" flex flex-col justify-start items-start">
          {/* filter */}
          <div className=" w-full flex flex-col md:flex-row justify-start items-start md:items-start bg-base-100 p-2.5 rounded-2xl lg:rounded-xl shadow-sm border border-transparent dark:border-base-content/10">
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
                withLabel
              />
            </div>

            <div className="w-full  md:flex-wrap md:flex-2 flex flex-row justify-start md:justify-end items-center md:items-start gap-4 lg:min-h-18 mt-3 md:mt-0">
              {/* filter sort */}
              <FilterSort
                setSort={handleSort}
                customWidth="w-full md:w-40"
                value={sort}
              />

              {/* button add pegawai */}
              <div className="flex-col justify-start items-start gap-1.5 hidden md:flex">
                <span className="text-xs text-base-content/80 font-medium">
                  Aksi
                </span>

                <ButtonWithIcon
                  icon={PackagePlus}
                  label="Tambah Pegawai"
                  handleBtn={() => handleShowModalFormulirPegawai()}
                  customClass="hidden md:flex"
                />
              </div>
            </div>
          </div>

          {/* CONTENT SM */}
          <div className="w-full flex flex-col justify-start items-center gap-4 mt-2 md:hidden">
            {/* card */}
            {isExistDataPegawai &&
            dataPegawai?.data &&
            dataPegawai?.data?.data?.length > 0 ? (
              dataPegawai.data.data.map((pegawai, _) => (
                <div
                  key={pegawai.id}
                  className="w-full flex flex-col justify-start items-start bg-base-100 rounded-2xl shadow-sm border border-transparent dark:border-base-content/10 p-4"
                >
                  {/* content 1 */}
                  <div className="w-full flex flex-row justify-between items-center pb-4 borde border-b border-base-content/10 gap-4">
                    {/* checkbox */}
                    <input
                      type="checkbox"
                      className="checkbox"
                      onChange={() => {
                        handleSetChoosePegawai({
                          id: pegawai.id,
                          nama: pegawai.nama,
                        });
                      }}
                    />

                    <div className="flex flex-1 justify-start items-start gap-4">
                      <Avatar nama={pegawai?.nama} index={pegawai.id} />
                      <div className="flex flex-col justify-start items-start gap-1">
                        {/* name */}
                        <span className="text-base-content font-semibold text-sm">
                          {pegawai?.nama}
                        </span>
                        {/* no telp */}
                        <div className="w-full flex flex-row justify-start items-center gap-2">
                          <IdCardLanyard className="size-3 text-base-content/80" />
                          <span className="text-base-content/80 text-xs">
                            {pegawai.username}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* content 3 */}
                  <div className="w-full pt-2 md:hidden flex flex-row justify-between items-center">
                    {/* aksi active */}
                    <div className="flex-1 flex flex-row justify-start items-center gap-4">
                      <Aksi
                        handelUpdateIsActive={handelUpdateIsActive}
                        handleShowModalDelete={handleShowModalDelete}
                        handleShowModalFormulirPegawai={
                          handleShowModalFormulirPegawai
                        }
                        pegawai={pegawai}
                        isLoadingAktif={
                          isPendingDelete &&
                          variablesUpdateIsActive?.id === pegawai.id
                        }
                        isPendingDelete={isPendingDelete}
                      />
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

            {!isLoadingPegawai && isExistDataPegawai && (
              <ButtonWithIcon
                icon={Trash2}
                bgColor="bg-error"
                textColor="text-primary-white"
                label="Hapus data yang dipilih"
                customWidth="w-full"
                disabled={choosePegawai.length === 0}
                handleBtn={() =>
                  handleShowModalDeleteMany(undefined, {
                    data: choosePegawai,
                  })
                }
              />
            )}
          </div>

          {/* content lg */}
          <div className="overflow-x-auto w-full hidden md:block bg-base-100 rounded-xl mt-2 md:mt-4 shadow-sm border border-transparent dark:border-base-content/10">
            <table className="w-full table table-xs lg:table-sm mb-2">
              {/* head */}
              <thead>
                <tr className="text-xs h-12 bg-base-200">
                  <th>Pilih</th>
                  <th>Nama Pegawai</th>
                  <th>Role</th>
                  <th>Username</th>
                  <th>Aktif</th>
                  <th className="sticky right-0 bg-base-200 z-10">Aksi</th>
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
                            // checked={choosePegawai.some(
                            //   (item) => item.id === pegawai.id,
                            // )}
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
                          <p className="text-xs py-1 px-3 uppercase font-semibold text-custom-secondary">
                            {pegawai.role.toLowerCase()}
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

                      {/* update is active */}
                      <td>
                        {isPendingUpdateIsActive &&
                        variablesUpdateIsActive?.id == pegawai.id ? (
                          <div className="w-10 h-6 rounded-full flex justify-center items-center border border-base-content/10">
                            <div className="loading loading-xs" />
                          </div>
                        ) : (
                          <input
                            type="checkbox"
                            checked={pegawai.isActive}
                            className="toggle toggle-success toggle-sm"
                            onChange={() =>
                              handelUpdateIsActive({
                                id: pegawai.id,
                                status: !pegawai.isActive,
                              })
                            }
                          />
                        )}
                      </td>
                      <td>
                        <div className="flex flex-row justify-start items-center gap-1.5">
                          {/* update */}
                          <ButtonUpdateTable
                            handleShowModalFormulir={() =>
                              handleShowModalFormulirPegawai(pegawai.id)
                            }
                          />

                          {/* hapus */}
                          <ButtonDeleteTable
                            handleShowModalDelete={() =>
                              handleShowModalDelete(pegawai.id, {
                                nama: pegawai.nama,
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
                          choosePegawai.length > 0 &&
                            "group-hover:text-rose-400",
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
                      <th>Nama Pegawai</th>
                      <th>Role</th>
                      <th>Username</th>
                      <th>Aktif</th>
                      <th className="sticky right-0 bg-base-100 z-10">Aksi</th>
                    </>
                  ) : (
                    <>
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
    </div>
  );
};

type AksiProps = {
  isLoadingAktif?: boolean;
  pegawai: {
    id: number;
    nama: string;
    username: string;
    isActive: boolean;
  };
  isPendingDelete?: boolean;
  handelUpdateIsActive: (params: { id: number; status: boolean }) => void;
  handleShowModalFormulirPegawai: (id: number) => void;
  handleShowModalDelete: (
    id?: number,
    data?: {
      nama: string;
    },
  ) => void;
};
// aksi
const Aksi: FC<AksiProps> = ({
  isLoadingAktif,
  isPendingDelete,
  handelUpdateIsActive,
  handleShowModalDelete,
  handleShowModalFormulirPegawai,
  pegawai,
}) => {
  return (
    <>
      {/* label */}
      <div className=" flex flex-row justify-start items-center gap-4">
        <span className="text-xs font-medium text-base-content">Aktif</span>

        {/* input */}
        {isLoadingAktif ? (
          <div className="w-10 h-6 rounded-full flex justify-center items-center border border-base-content/10">
            <div className="loading loading-xs" />
          </div>
        ) : (
          <input
            type="checkbox"
            checked={pegawai.isActive}
            className="toggle toggle-success toggle-sm"
            onChange={() =>
              handelUpdateIsActive({
                id: pegawai.id,
                status: !pegawai.isActive,
              })
            }
          />
        )}
      </div>

      {/* aksi */}
      <div className="flex flex-1 flex-row justify-end items-center gap-2">
        {/* button update */}
        <button
          type="button"
          className="w-8 h-8 flex justify-center items-center rounded-lg hover-overlay bg-blue-100"
          onClick={() => handleShowModalFormulirPegawai(pegawai.id)}
        >
          <Pencil className="text-blue-400 size-4" />
        </button>
        {/* button delete */}
        <button
          type="button"
          disabled={isPendingDelete}
          className="w-8 h-8 disabled:opacity-50 not-disabled:hover-overlay flex justify-center items-center rounded-lg hover-overlay bg-rose-100"
          onClick={() => {
            handleShowModalDelete(pegawai.id, {
              nama: pegawai.nama,
            });
          }}
        >
          {isPendingDelete ? (
            <div className="loading loading-xs" />
          ) : (
            <Trash2 className="text-rose-400 size-4" />
          )}
        </button>
      </div>
    </>
  );
};

export default Pegawai;
