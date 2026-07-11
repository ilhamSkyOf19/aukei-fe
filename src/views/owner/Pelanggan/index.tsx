import {
  Check,
  Clock,
  Eye,
  Hourglass,
  PackagePlus,
  Pencil,
  Phone,
  ShoppingBag,
  Trash2,
  type LucideIcon,
} from "lucide-react";
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
import Avatar from "../../../components/ui/Avatar";
import type { FC } from "react";

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
  } = usePelanggan();

  return (
    <div className="w-full h-screen overflow-y-auto">
      <div className="w-full mb-30 md:mb-20 p-2">
        {/* toast create */}
        {toast && (
          <Toast
            toast={toast?.id !== null}
            isAnimationOut={toast?.isAnimationOut || false}
            label={TOAST_CONFIG_PELANGGAN[toast.type].message}
            color={TOAST_CONFIG_PELANGGAN[toast.type].color}
          />
        )}

        <div className="card flex flex-col justify-start items-start">
          {/* filter */}
          <div className=" w-full flex flex-col md:flex-row justify-start items-start md:items-start bg-base-100 py-2 px-4 rounded-lg shadow-sm border border-transparent dark:border-base-content/10">
            <ButtonWithIcon
              icon={PackagePlus}
              label="Tambah Pelanggan"
              handleBtn={() => handleShowModalFormulirPelanggan()}
              customClass="md:hidden w-full mb-3"
            />
            <div className="w-full md:flex-1 flex flex-row justify-start items-center">
              {/* input search */}
              <InputSearch
                handleSearch={handleSearch}
                placeholder="Cari Pelanggan berdasarkan nama"
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

              {/* button add Pelanggan */}
              <div className="flex-col justify-start items-start gap-1.5 hidden md:flex">
                <span className="text-xs text-base-content/80 font-medium">
                  Aksi
                </span>

                <ButtonWithIcon
                  icon={PackagePlus}
                  label="Tambah Pelanggan"
                  handleBtn={() => handleShowModalFormulirPelanggan()}
                  customClass="hidden md:flex"
                />
              </div>
            </div>
          </div>

          {/* content sm */}
          <div className="w-full lg:hidden flex flex-col justify-start items-center gap-4 pt-4 pb-2">
            {/* card */}
            {isLoadingPelanggan ? (
              <>
                <div className="w-full h-20 skeleton bg-base-200 border border-base-content/10" />
                <div className="w-full h-20 skeleton bg-base-200 border border-base-content/10" />
                <div className="w-full h-20 skeleton bg-base-200 border border-base-content/10" />
              </>
            ) : isExistDataPelanggan ? (
              dataPelanggan?.data?.data.map((pelanggan) => (
                <div
                  key={pelanggan.id}
                  className="w-full flex flex-col justify-start items-start bg-base-100 rounded-lg shadow-sm border border-transparent dark:border-base-content/10 p-4"
                >
                  {/* content 1 */}
                  <div className="w-full flex flex-row justify-between items-center pb-4 borde border-b border-base-content/10">
                    <div className="flex flex-1 justify-start items-start gap-4">
                      <Avatar nama={pelanggan?.nama} index={pelanggan.id} />
                      <div className="flex flex-col justify-start items-start gap-1">
                        {/* name */}
                        <span className="text-base-content font-semibold text-sm">
                          {pelanggan?.nama}
                        </span>
                        {/* no telp */}
                        <div className="w-full flex flex-row justify-start items-center gap-2">
                          <Phone className="size-3 text-base-content/80" />
                          <span className="text-base-content/80 text-xs">
                            {formatNumberPhone(pelanggan?.noWa)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:flex flex-1 flex-row justify-end items-center gap-12">
                      {/* aksi active */}
                      <div className=" flex flex-row justify-start items-center gap-4">
                        {/* label */}
                        <span className="text-xs font-medium text-base-content">
                          Aktif
                        </span>

                        {/* input */}
                        {isPendingUpdateIsActive &&
                        variablesUpdateIsActive?.id == pelanggan.id ? (
                          <div className="w-10 h-6 rounded-full flex justify-center items-center border border-base-content/10">
                            <div className="loading loading-xs" />
                          </div>
                        ) : (
                          <input
                            type="checkbox"
                            checked={pelanggan.isActive}
                            className="toggle toggle-success"
                            onChange={() =>
                              handelUpdateIsActive({
                                id: pelanggan.id,
                                status: !pelanggan.isActive,
                              })
                            }
                          />
                        )}
                      </div>

                      {/* aksi */}
                      <div className="flex  flex-row justify-end items-center gap-2">
                        {/* button update */}
                        <button
                          type="button"
                          className="w-8 h-8 flex justify-center items-center rounded-lg hover-overlay bg-blue-100"
                        >
                          <Pencil className="text-blue-400 size-4" />
                        </button>
                        {/* button delete */}
                        <button
                          type="button"
                          disabled={isPendingDelete}
                          className="w-8 h-8 disabled:opacity-50 hover-overlay flex justify-center items-center rounded-lg bg-rose-100"
                          onClick={() => {
                            if (pelanggan.totalTransaction !== undefined)
                              return;

                            handleShowModalDelete(pelanggan.id, {
                              nama: pelanggan.nama,
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
                    </div>
                  </div>

                  {/* content 2 */}
                  <div className="w-full flex flex-col md:flex-row justify-start items-start gap-2 py-2 border-b border-base-content/10 md:border-none">
                    {/* total transaksi */}
                    <LabelCardPelanggan
                      label="Total Transaksi"
                      icon={{
                        icon: ShoppingBag,
                        bgColor: "bg-purple-100",
                        iconColor: "text-purple-400",
                      }}
                      value={pelanggan.totalTransaction}
                    />

                    {/* kredit selesai */}
                    <LabelCardPelanggan
                      label="Kredit Selesai"
                      icon={{
                        icon: Check,
                        bgColor: "bg-emerald-100",
                        iconColor: "text-emerald-400",
                      }}
                      value={pelanggan.kredit?.selesai}
                    />

                    {/* kredit berjalan */}
                    <LabelCardPelanggan
                      label="Kredit Berjalan"
                      icon={{
                        icon: Clock,
                        bgColor: "bg-amber-100",
                        iconColor: "text-amber-400",
                      }}
                      value={pelanggan.kredit?.berjalan}
                    />

                    {/* kredit terlambat */}
                    <LabelCardPelanggan
                      label="Kredit Terlambat"
                      icon={{
                        icon: Hourglass,
                        bgColor: "bg-rose-100",
                        iconColor: "text-rose-400",
                      }}
                      value={pelanggan.kredit?.terlambat}
                    />
                  </div>

                  {/* content 3 */}
                  <div className="w-full pt-2 md:hidden flex flex-row justify-between items-center">
                    {/* aksi active */}
                    <div className="flex-1 flex flex-row justify-start items-center gap-4">
                      {/* label */}
                      <span className="text-xs font-medium text-base-content">
                        Aktif
                      </span>

                      {/* input */}
                      {isPendingUpdateIsActive &&
                      variablesUpdateIsActive?.id == pelanggan.id ? (
                        <div className="w-10 h-6 rounded-full flex justify-center items-center border border-base-content/10">
                          <div className="loading loading-xs" />
                        </div>
                      ) : (
                        <input
                          type="checkbox"
                          checked={pelanggan.isActive}
                          className="toggle toggle-success"
                          onChange={() =>
                            handelUpdateIsActive({
                              id: pelanggan.id,
                              status: !pelanggan.isActive,
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
                      >
                        <Pencil className="text-blue-400 size-4" />
                      </button>
                      {/* button delete */}
                      <button
                        type="button"
                        disabled={isPendingDelete}
                        className="w-8 h-8 disabled:opacity-50 hover-overlay flex justify-center items-center rounded-lg bg-rose-100"
                        onClick={() => {
                          if (pelanggan.totalTransaction !== undefined) return;

                          handleShowModalDelete(pelanggan.id, {
                            nama: pelanggan.nama,
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
                  </div>
                </div>
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
          <div className="w-full hidden lg:block bg-base-100 rounded-xl mt-2 shadow-sm border border-transparent dark:border-base-content/10">
            <table className="w-full table table-xs lg:table-sm mb-2">
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
                  <th>Aktif</th>
                  <th className="sticky right-0 bg-base-200 z-10">Aksi</th>
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
                            className="toggle toggle-success"
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
                          <div
                            className="tooltip z-10"
                            data-tip="lihat transaksi"
                          >
                            {/* detail transaksi */}
                            <button
                              type="button"
                              className="w-7 h-7 bg-custom-primary rounded-md flex flex-row justify-center items-center hover-overlay"
                              onClick={() => {}}
                            >
                              <Eye className="size-3.5 text-custom-secondary" />
                            </button>
                          </div>

                          {/* update */}
                          <div className="tooltip z-10" data-tip="ubah">
                            <button
                              type="button"
                              className="w-7 h-7 bg-info rounded-md flex flex-row justify-center items-center hover-overlay"
                              onClick={() =>
                                handleShowModalFormulirPelanggan(pelanggan.id)
                              }
                            >
                              <Pencil className="size-3.5 text-primary-white" />
                            </button>
                          </div>

                          {/* hapus */}
                          <div
                            className="tooltip z-10"
                            data-tip={
                              (pelanggan?.totalTransaction ?? 0) <= 0
                                ? "hapus"
                                : ""
                            }
                          >
                            {/* update */}
                            <button
                              type="button"
                              disabled={(pelanggan?.totalTransaction ?? 0) > 0}
                              className="w-7 h-7 bg-error rounded-md flex flex-row justify-center items-center not-disabled:hover-overlay disabled:opacity-20"
                              style={{
                                cursor:
                                  (pelanggan?.totalTransaction ?? 0) > 0
                                    ? "not-allowed"
                                    : "pointer",
                              }}
                              onClick={() =>
                                handleShowModalDelete(pelanggan.id, {
                                  nama: pelanggan.nama,
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
                        cursor:
                          choosePelanggan.length === 0 ? "not-allowed" : "",
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
                  {!isLoadingPelanggan &&
                  isExistDataPelanggan &&
                  dataPelanggan?.data?.data?.length! > 8 ? (
                    <>
                      <th>Nama Pelanggan</th>
                      <th>No Wa</th>
                      <th className="sticky right-0 bg-base-100 z-10">Aksi</th>
                    </>
                  ) : (
                    <>
                      <th></th>
                      <th></th>
                      <th></th>
                    </>
                  )}
                </tr>
              </tfoot>
            </table>
          </div>

          {/* alert */}
          {isExistDataPelanggan && (
            <div className="w-full my-2">
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
    </div>
  );
};

type LabelCardPelangganProps = {
  icon: {
    icon: LucideIcon;
    bgColor: string;
    iconColor: string;
  };
  label: string;
  value?: number;
};

// label card pelanggan
const LabelCardPelanggan: FC<LabelCardPelangganProps> = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="w-full md:flex-1 flex flex-row md:flex-col justify-between md:justify-start items-center md:items-start shrink-0">
      {/* icon and label */}
      <div className="flex-1 flex flex-row justify-start items-center gap-2.5">
        {/* icon */}
        <div
          className={cn(
            "w-8.5 h-8.5 rounded-lg flex justify-center items-center",
            icon.bgColor,
          )}
        >
          <icon.icon className={cn("size-4", icon.iconColor)} />
        </div>

        {/* label */}
        <div className="flex flex-col justify-start items-start gap-1">
          <p className="text-xs font-medium text-base-content">{label}</p>

          <div className="flex-1 md:flex flex-row justify-end items-center hidden">
            <span className="text-xs text-medium text-base-content">
              {value ? (
                formatNumber(value)
              ) : (
                <span className="text-base-content/50 text-xs italic font-light">
                  Kosong
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* value */}
      <div className="flex-1 flex flex-row justify-end items-center md:hidden">
        <span className="text-xs text-medium text-base-content">
          {value ? (
            formatNumber(value)
          ) : (
            <span className="text-base-content/50 text-xs italic font-light">
              Kosong
            </span>
          )}
        </span>
      </div>
    </div>
  );
};
export default Pelanggan;
