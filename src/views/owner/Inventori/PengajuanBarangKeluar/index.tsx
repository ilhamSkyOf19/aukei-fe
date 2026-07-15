import {
  CircleAlert,
  EllipsisVertical,
  Package,
  PackagePlus,
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
import {
  ROLE_INTERNAL_TYPE,
  type StatusInventoriType,
} from "../../../../types/constant.type";
import JenisKeluar from "../../../../components/ui/JenisKeluar";
import RangeDate from "../../../../components/filters/RangeDate";
import type { FC } from "react";
import DropDownInventori from "../../../../components/ui/DropDownInventori";
import { formatNumber } from "../../../../helpers/helpers";
import usePengajuanBarangKeluar from "./usePengajuanBarangKeluar";
import Avatar from "../../../../components/ui/Avatar";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import ButtonDetailTable from "../../../../components/ui/button/ButtonDetailTable";

const PengajuanBarangKeluar = () => {
  // call use barang masuk
  const {
    handleLimit,
    handlePage,
    handleSearch,
    handleSort,
    toast,
    handleRedirectDetail,
    sort,
    dataPengajuanBarangKeluar,
    isExistDataPengajuanBarangKeluar,
    isLoadingPengajuanBarangKeluar,
    pengguna,
    windowSize,
  } = usePengajuanBarangKeluar();

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
          {pengguna?.role === ROLE_INTERNAL_TYPE.KASIR && (
            <ButtonWithIcon
              icon={PackagePlus}
              label="Tambah Barang Masuk"
              handleBtn={() => {}}
              customClass="md:hidden w-full mb-3"
            />
          )}

          <div className="w-full md:flex-1 flex flex-row justify-start items-center">
            {/* input search */}
            <InputSearch
              handleSearch={handleSearch}
              placeholder="Cari berdasarkan kode"
              withLabel
            />
          </div>
          <div className="w-full  md:flex-wrap md:flex-2 flex flex-row justify-start md:justify-end items-start gap-4 lg:min-h-18 mt-3 md:mt-0">
            {/* input range date */}
            <RangeDate customWidth="w-full md:w-60" />

            {/* filter sort */}
            <FilterSort
              setSort={handleSort}
              customWidth="w-full md:w-40"
              value={sort}
            />

            {/* button add barang masuk */}
            {pengguna?.role === ROLE_INTERNAL_TYPE.KASIR && (
              <div className="flex-col justify-start items-start gap-1.5 hidden md:flex">
                <span className="text-xs text-base-content/80 font-medium">
                  Aksi
                </span>

                <ButtonWithIcon
                  icon={PackagePlus}
                  label="Tambah Barang Masuk"
                  handleBtn={() => {}}
                  customClass="hidden md:flex"
                  noLabel={windowSize === "md" && true}
                  {...(windowSize === "md" && { customSize: "lg" })}
                />
              </div>
            )}
          </div>
        </div>

        {/* SHOW DATA FOR SM */}
        <div className="flex w-full flex-col justify-start items-center gap-2 mt-2 md:hidden">
          {isLoadingPengajuanBarangKeluar ? (
            <>
              <div className="w-full h-20 skeleton border border-base-content/10" />
              <div className="w-full h-20 skeleton border border-base-content/10" />
              <div className="w-full h-20 skeleton border border-base-content/10" />
            </>
          ) : isExistDataPengajuanBarangKeluar ? (
            dataPengajuanBarangKeluar?.data?.data?.map((item, _) => (
              <CardBarangKeluar
                key={item.id}
                author={item.author}
                tanggalDiajukan={item.tanggalDiajukan}
                barang={{
                  id: item.id,
                  kode: item.kodeReferensi,
                  jumlah: item.countDetailBarangKeluar,
                  status: item.status,
                  jenisKeluar: item.jenisKeluar.nama,
                }}
                handleRedirectDetail={handleRedirectDetail}
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
        </div>

        {/* SHOW DATA FOR MD, LG, XL */}
        <div className="overflow-x-auto w-full bg-base-100 rounded-xl shadow-sm border border-transparent dark:border-base-content/10 mt-4 hidden md:flex">
          <table className="w-full table table-xs lg:table-sm mb-2">
            {/* head */}
            <thead>
              <tr className="h-12 bg-base-200 text-xs">
                <th>Diajukan Oleh</th>
                <th>Tanggal Diajukan</th>
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
              {isLoadingPengajuanBarangKeluar ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={10}>
                      <div className="skeleton h-12 w-full py-1" />
                    </td>
                  </tr>
                ))
              ) : isExistDataPengajuanBarangKeluar ? (
                dataPengajuanBarangKeluar?.data?.data.map((barang, _) => (
                  <tr
                    key={barang.id}
                    className={cn(
                      "transition-all duration-75 ease-in-out h-18 text-xs text-base-content",
                    )}
                  >
                    {/* author */}
                    <td>
                      {barang.author ? (
                        <div className="flex flex-row justify-start items-start gap-2.5">
                          <Avatar
                            index={barang.author.id}
                            nama={barang.author.nama}
                            isActive={barang.author.isActive}
                            xs
                          />
                          <div className="flex flex-col justify-start items-start gap-0.5">
                            <span className="text-xs font-medium">
                              {barang.author.nama}
                            </span>
                            <span className="text-[0.625rem] font-medium">
                              {barang.author.username}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>

                    {/* tanggal diajukan */}
                    <td>
                      {barang?.tanggalDiajukan
                        ? formatTanggalLengkap(barang?.tanggalDiajukan)
                        : "-"}{" "}
                      WIB
                    </td>

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
                      <ButtonDetailTable
                        handleRedirect={() => handleRedirectDetail(barang.id)}
                      />
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
                {!isLoadingPengajuanBarangKeluar &&
                isExistDataPengajuanBarangKeluar &&
                dataPengajuanBarangKeluar?.data?.data?.length! > 8 ? (
                  <>
                    <th>Diajukan Oleh</th>
                    <th>Tanggal Diajukan</th>
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
          currentPage={
            dataPengajuanBarangKeluar?.data?.meta.currentPage || null
          }
          totalPage={dataPengajuanBarangKeluar?.data?.meta.totalPage || null}
          setPage={handlePage}
          setLimit={handleLimit}
          emptyData={!isExistDataPengajuanBarangKeluar}
        />
      </div>
    </div>
  );
};

type CardBarangKeluar = {
  tanggalDiajukan?: Date | null;
  author?: {
    id: number;
    nama: string;
    username: string;
    isActive: boolean;
  } | null;
  barang: {
    id: number;
    kode: string;
    status: StatusInventoriType;
    jenisKeluar: string;
    jumlah: number;
  };
  handleRedirectDetail: (value: number) => void;
};

// card produk
const CardBarangKeluar: FC<CardBarangKeluar> = ({
  handleRedirectDetail,
  barang,
  tanggalDiajukan,
  author,
}) => {
  return (
    <div className="w-full bg-base-100 rounded-lg flex flex-col justify-start items-start p-4 border border-transparent dark:border-base-content/10 gap-2">
      <div className="w-full flex flex-row justify-between items-start pb-3 border-b border-base-content/10">
        {/* content 1 */}
        <div className="flex-8 flex flex-row justify-start items-start gap-4">
          <div className="flex flex-row justify-start items-start gap-3">
            {/* foto */}
            <div className="w-12 h-12 flex justify-center items-center overflow-hidden bg-rose-100 rounded-lg">
              <Truck className="size-6 text-rose-400" />
            </div>
          </div>

          {/* deskripsi */}
          <div className="flex flex-col justify-start items-start gap-1">
            {/* kode */}
            <span className="text-xs text-info font-medium">{barang.kode}</span>

            <div className="flex flex-row justify-start items-center gap-2">
              <span className="text-[0.7rem] font-medium text-custom-secondary dark:text-base-content">
                {tanggalDiajukan
                  ? `${formatTanggalLengkap(tanggalDiajukan)} WIB`
                  : "-"}
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
              handleRedirectDetail={() => handleRedirectDetail(barang.id)}
            />
          </div>
        </div>
      </div>

      {/* content 2 */}
      <div className="w-full flex flex-row justify-evenly items-center gap-4 pt-0.5">
        {/* author */}
        {author ? (
          <div className="flex-1 flex flex-row justify-start items-center gap-2.5">
            <Avatar
              xs
              nama={author.nama}
              index={author.id}
              isActive={author.isActive}
            />

            <div className="flex flex-col justify-start items-start gap-0.5">
              <span className="text-xs font-medium text-base-content">
                {author.nama}
              </span>
            </div>
          </div>
        ) : (
          <span>-</span>
        )}

        {/* jumlah */}
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

        {/* status */}
        <div className="flex-1 flex flex-row justify-end items-center">
          <StatusInventori status={barang.status} />
        </div>
      </div>
    </div>
  );
};

export default PengajuanBarangKeluar;
