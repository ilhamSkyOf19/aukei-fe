import useDaftarReturBarang from "./useDaftarReturBarang";
import ButtonBackText from "../../../components/ui/button/ButtonBackText";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_RETUR_BARANG } from "../../../types/toast.type";
import FilterSort from "../../../components/filters/Sort";
import FilterStatusRetur from "../../../components/filters/FilterStatusRetur";
import InputSearch from "../../../components/inputs/InputSearch";
import { cn } from "../../../utils/cn";
import Avatar from "../../../components/ui/Avatar";
import { formatTanggalPanjang } from "../../../helpers/formatDate";
import StatusReturBarang from "../../../components/ui/StatusReturBarang";
import ButtonDetailTable from "../../../components/ui/button/ButtonDetailTable";
import DataEmpty from "../../../components/messages/DataEmpty";
import ButtonDeleteTable from "../../../components/ui/button/ButtonDeleteTable";
import PaginationAndLimit from "../../../components/filters/PaginationAndLimit";
import { CircleAlert, EllipsisVertical, Undo2 } from "lucide-react";
import DropDownInventori from "../../../components/ui/DropDownInventori";
import { formatRupiah } from "../../../helpers/helpers";
import type { ResponseRegularReturnTransactionType } from "../../../models/returBarang.model";
import type { FC } from "react";
import { RETURN_STATUS } from "../../../types/constant.type";
import ModalDelete from "../../../components/modals/ModalDelete";

const DaftarReturBarang = () => {
  const {
    toast,
    handleBack,
    daftarReturBarang,
    handleLimit,
    handlePage,
    handleSearch,
    handleSort,
    handleStatus,
    sort,
    status,
    isExistingDaftarReturBarang,
    isLoadingReturBarang,
    handleRedirectDetail,
    pengguna,

    handleCloseModalDelete,
    handleDelete,
    handleShowModalDelete,
    idModalDelete,
    isPendingDelete,
    modalDeleteRef,
    dataDelete,
  } = useDaftarReturBarang();

  return (
    <div className="w-full">
      <div className="w-full flex flex-col justify-start items-start px-2.5 pt-2.5">
        <ButtonBackText handleClick={() => handleBack()} />

        {/* toast */}
        {toast && (
          <Toast
            toast={toast?.id !== null}
            isAnimationOut={toast?.isAnimationOut || false}
            label={TOAST_CONFIG_RETUR_BARANG[toast.type].message}
            color={TOAST_CONFIG_RETUR_BARANG[toast.type].color}
          />
        )}

        {/* filter */}
        <div className="bg-base-100 w-full shadow-sm border border-transparent dark:border-base-content/10 rounded-2xl md:rounded-xl p-2.5 gap-4 flex flex-col md:flex-row justify-start items-start mt-2.5">
          <div className="w-full md:flex-1 flex flex-col justify-start items-start gap-1.5">
            <InputSearch
              handleSearch={handleSearch}
              placeholder="Cari ..."
              withLabel
            />
          </div>

          <div className="w-full md:flex-wrap md:flex-2 flex flex-row justify-start md:justify-end items-center gap-3 md:gap-4 mt-3 md:mt-0">
            {/* filter status */}
            <FilterStatusRetur
              setStatus={handleStatus}
              customWidth="w-full md:w-40"
              value={status}
              role={pengguna?.role}
            />

            {/* filter sort */}
            <FilterSort
              setSort={handleSort}
              customWidth="w-full md:w-30"
              value={sort}
            />
          </div>
        </div>

        {/* data for sm */}
        <div className="w-full flex flex-col justify-start items-start gap-2.5 md:hidden mt-2.5">
          {isLoadingReturBarang ? (
            <>
              <div className="w-full h-20 skeleton bg-base-200 border border-base-content/10" />
              <div className="w-full h-20 skeleton bg-base-200 border border-base-content/10" />
              <div className="w-full h-20 skeleton bg-base-200 border border-base-content/10" />
            </>
          ) : daftarReturBarang?.data &&
            daftarReturBarang?.data?.data.length > 0 ? (
            daftarReturBarang?.data?.data?.map((item) => (
              <CardReturBarang
                key={item.id}
                data={item}
                handleRedirectDetail={handleRedirectDetail}
                handleShowModalDelete={() =>
                  handleShowModalDelete(item.id, {
                    kodeReferensi: item.kodeReferensi,
                  })
                }
              />
            ))
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <DataEmpty
                title="Data Retur Barang Tidak Tersedia"
                description="Belum ada data retur barang yang dapat ditampilkan saat ini."
              />
            </div>
          )}
        </div>

        {/* data for md & lg */}
        <div
          className={cn(
            "w-full md:flex flex-col justify-start items-start rounded-xl border border-transparent dark:border-base-content/10 bg-base-100 shadow-sm overflow-hidden mt-2.5 hidden",
          )}
        >
          <div className="w-full flex flex-col justify-start items-start">
            <div className="overflow-x-auto w-full">
              <table className="table table-xs">
                {/* head */}
                <thead>
                  <tr className="text-[0.625rem] bg-base-content/5 h-10">
                    <th>No</th>
                    <th>Kode Referensi</th>
                    <th>Dibuat</th>
                    <th>Tgl. Retur</th>
                    <th>Diverifikasi</th>
                    <th>Tgl. Verifikasi</th>
                    <th>Total Refund</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  {isLoadingReturBarang ? (
                    Array.from({ length: 4 }, (_, i) => i).map((item) => (
                      <tr key={item} className="h-18">
                        <td colSpan={8}>
                          <div className="w-full skeleton h-12" />
                        </td>
                      </tr>
                    ))
                  ) : daftarReturBarang?.data &&
                    daftarReturBarang?.data?.data.length > 0 ? (
                    <>
                      {daftarReturBarang?.data?.data.map((item, index) => {
                        return (
                          <tr key={item.id} className="h-18 text-base-content">
                            <th className="px-3">{index + 1}</th>
                            <td>
                              <span className="text-info font-medium">
                                {item.kodeReferensi}
                              </span>
                            </td>
                            <td>
                              <div className="w-full flex flex-row justify-start items-center gap-2">
                                {/* avatar */}
                                <Avatar
                                  nama={item.createdBy.nama}
                                  index={item.createdBy.id}
                                  xs
                                />
                                <div className="flex flex-col justify-start items-start">
                                  {/* nama */}
                                  <span className="font-semibold text-[0.625rem]">
                                    {item.createdBy.nama}
                                  </span>
                                  {/* no wa */}
                                  <span className="text-[0.625rem] text-base-content/50 capitalize">
                                    {item.createdBy.role.toLowerCase()}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>{formatTanggalPanjang(item.tanggalReturn)}</td>

                            <td>
                              {item.verifiedBy ? (
                                <div className="w-full flex flex-row justify-start items-center gap-2">
                                  {/* avatar */}
                                  <Avatar
                                    nama={item.verifiedBy.nama}
                                    index={item.verifiedBy.id}
                                    xs
                                  />
                                  <div className="flex flex-col justify-start items-start">
                                    {/* nama */}
                                    <span className="font-semibold text-[0.625rem]">
                                      {item.verifiedBy.nama}
                                    </span>
                                    {/* no wa */}
                                    <span className="text-[0.625rem] text-base-content/50 capitalize">
                                      {item.verifiedBy.role.toLowerCase()}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td>
                              {item.verifiedAt
                                ? formatTanggalPanjang(item.verifiedAt)
                                : "-"}
                            </td>
                            <td>{formatRupiah(item.totalRefundAll)}</td>
                            <td>
                              <StatusReturBarang status={item.status} />
                            </td>
                            <td>
                              <div className="flex flex-row justify-start items-center gap-1.5">
                                {/* button detail */}
                                <ButtonDetailTable
                                  handleRedirect={() =>
                                    handleRedirectDetail(item.id)
                                  }
                                />

                                {/* button delete */}
                                <ButtonDeleteTable
                                  disabled={
                                    (item.status !== RETURN_STATUS.DRAFT &&
                                      item.status !== RETURN_STATUS.REJECTED) ||
                                    item.createdBy.id !== pengguna?.id
                                  }
                                  handleShowModalDelete={() =>
                                    handleShowModalDelete(item.id, {
                                      kodeReferensi: item.kodeReferensi,
                                    })
                                  }
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={8}>
                        <DataEmpty
                          xs
                          title="Data Retur Tidak Tersedia"
                          description="Belum ada data yang dapat ditampilkan saat ini"
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* pagination */}
        <PaginationAndLimit
          currentPage={daftarReturBarang?.data?.meta.currentPage ?? 1}
          setPage={handlePage}
          totalPage={daftarReturBarang?.data?.meta?.totalPage ?? 1}
          isLoading={isLoadingReturBarang}
          limit={daftarReturBarang?.data?.meta?.limit ?? 8}
          setLimit={handleLimit}
          emptyData={!isExistingDaftarReturBarang}
        />
      </div>

      {/* modal delete */}
      <ModalDelete
        modalRef={modalDeleteRef}
        handleCloseModal={handleCloseModalDelete}
        handleDelete={handleDelete}
        bigTitle="Apakah anda yakin ingin menghapus data retur barang dengan kode referensi dibawah ini?"
        highlightData={dataDelete?.kodeReferensi}
        isLoadingDelete={isPendingDelete}
      />
    </div>
  );
};

type CardReturBarangProps = {
  handleRedirectDetail: (id: number) => void;
  data: ResponseRegularReturnTransactionType;
  handleShowModalDelete: () => void;
};

const CardReturBarang: FC<CardReturBarangProps> = ({
  data: { createdBy, id, kodeReferensi, status, tanggalReturn, verifiedAt },
  handleRedirectDetail,
  handleShowModalDelete,
}) => {
  return (
    <div className="w-full bg-base-100 rounded-lg flex flex-col justify-start items-start p-4 border border-transparent dark:border-base-content/10 gap-2">
      <div className="w-full flex flex-row justify-between items-start pb-3 border-b border-base-content/10">
        {/* content 1 */}
        <div className="flex-8 flex flex-row justify-start items-start gap-4">
          <div className="flex flex-row justify-start items-start gap-3">
            {/* icon */}
            <div className="w-10 h-10 flex justify-center items-center overflow-hidden bg-rose-100 rounded-lg">
              <Undo2 className="size-4 text-rose-400" />
            </div>
          </div>

          {/* deskripsi */}
          <div className="flex flex-col justify-start items-start gap-1">
            {/* kode */}
            <span className="text-xs text-info font-medium">
              {kodeReferensi}
            </span>

            {/* tanggal diajukan */}
            <div className="flex flex-row justify-start items-center gap-2">
              <span className="text-[0.7rem] font-medium text-custom-secondary dark:text-base-content">
                {formatTanggalPanjang(tanggalReturn)}
              </span>

              <div className="tooltip" data-tip="tanggal diajukan">
                <button type="button">
                  <CircleAlert className="size-3.5" />
                </button>
              </div>
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

            <DropDownInventori
              handleRedirectDetail={() => handleRedirectDetail(id)}
              handleShowModalDelete={() => handleShowModalDelete()}
            />
          </div>
        </div>
      </div>

      {/* content 2 */}
      <div className="w-full flex flex-row justify-evenly items-center gap-4 pt-0.5">
        {/* di ajukan oleh */}
        <div className="flex-1 flex flex-row justify-start items-center gap-2.5">
          <Avatar xs nama={createdBy.nama} index={createdBy.id} />

          <div className="flex flex-col justify-start items-start gap-0.5">
            <span className="text-xs font-medium text-base-content">
              {createdBy.nama}
            </span>
            <span className="text-[0.625rem] font-medium text-base-content capitalize">
              {createdBy.role.toLowerCase()}
            </span>
          </div>
        </div>

        {/* jumlah */}
        <div className="flex-1 flex flex-col justify-start items-start gap-1">
          <div className="flex flex-col justify-start items-start gap-0.5">
            <span className="text-[0.625rem] font-medium text-base-content/70">
              Tgl. Verifikasi
            </span>
            <span className="text-xs font-medium text-base-content">
              {verifiedAt ? formatTanggalPanjang(new Date()) : "-"}
            </span>
          </div>
        </div>

        {/* status */}
        <div className="flex-1 flex flex-row justify-end items-center">
          <StatusReturBarang status={status} />
        </div>
      </div>
    </div>
  );
};

export default DaftarReturBarang;
