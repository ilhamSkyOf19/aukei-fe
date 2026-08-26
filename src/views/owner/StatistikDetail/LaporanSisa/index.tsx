import { type FC } from "react";
import { cn } from "../../../../utils/cn";
import { formatNumber, formatNumberK } from "../../../../helpers/helpers";
import { formatTanggalPanjang } from "../../../../helpers/formatDate";
import {
  STATUS_PERGERAKAN,
  type StatusPergerakan,
} from "../../../../types/constant.type";
import { Banknote, ChartLine, CircleAlert, Package } from "lucide-react";
import type { ProdukResponseType } from "../../../../models/produk.model";
import useLaporanSisa from "./useLaporanSisa";
import CardStatistik from "../../../../components/ui/cards/CardStatistik";
import ButtonDetailTable from "../../../../components/ui/button/ButtonDetailTable";
import DataEmpty from "../../../../components/messages/DataEmpty";
import ButtonRefresh from "../../../../components/ui/button/ButtonRefresh";
import ButtonBackText from "../../../../components/ui/button/ButtonBackText";

type Props = {
  pilihan: string;
  handleSetToast: (value: string) => void;
  handleSetAlert: (value: string) => void;
};

const LaporanSisa: FC<Props> = ({}) => {
  const {
    dataLaporanSisa,
    isLoadingLaporanSisa,
    isRefetchingLaporanSisa,
    handleRefresh,
    statistik,

    dataSisaModalByProduk,
    isLoadingSisaModalByProduk,
    isRefetchingSisaModalByProduk,
    refetchLaporanSisaModalByProduk,
    resetKategori,
    setKategori,
    kategori,
  } = useLaporanSisa();

  return (
    <div className="w-full flex flex-col justify-start items-start">
      {/* back */}
      {kategori.id !== 0 && (
        <div className="flex flex-row justify-start items-start mb-2.5">
          <ButtonBackText label="Kembali" handleClick={() => resetKategori()} />
        </div>
      )}
      {/* header */}
      <div className="w-full flex flex-col justify-start items-start bg-base-100 p-2.5 rounded-2xl md:rounded-xl shadow-sm border border-transparent dark:border-base-content/10 gap-2.5">
        {/* title */}
        <div className="w-full flex flex-row justify-between items-start">
          {/* title */}
          <div className="w-full gap-0.5 flex flex-col justify-start items-start">
            <span className="text-sm font-medium text-base-content">
              {kategori.id !== 0
                ? kategori?.nama
                : "Laporan Sisa Stok dan Modal"}
            </span>
            <span className="text-[0.7rem] w-[70%] text-base-content/70">
              Informasi Laporan Sisa Stok dan Modal{" "}
              {kategori.id !== 0 && `Berdasarkan ketegori ${kategori?.nama}`}
            </span>
          </div>

          {/* button refresh */}
          <ButtonRefresh handleRefresh={() => handleRefresh()} />
        </div>

        {/* statistik */}
        <div className="w-full flex flex-row justify-start items-start gap-2.5">
          {/* total stok tersisa */}
          <CardStatistik
            isLoading={isLoadingLaporanSisa || isRefetchingLaporanSisa}
            icon={{
              icon: Package,
              bgColor: "bg-blue-100",
              iconColor: "text-blue-400",
            }}
            label={"Total Stok Tersisa"}
            value={formatNumber(statistik.totalStok) || "0"}
            caption={"Jumlah Stok Tersisa"}
          />
          {/* total modal tersisa */}
          <CardStatistik
            isLoading={isLoadingLaporanSisa || isRefetchingLaporanSisa}
            icon={{
              icon: Banknote,
              bgColor: "bg-emerald-100",
              iconColor: "text-emerald-400",
            }}
            label={"Total Modal Tersisa"}
            value={formatNumber(statistik.totalModal)}
            caption={"Jumlah Modal Tersissa"}
          />

          {/* total estimasi omzet  */}
          <CardStatistik
            isLoading={isLoadingLaporanSisa || isRefetchingLaporanSisa}
            icon={{
              icon: Banknote,
              bgColor: "bg-purple-100",
              iconColor: "text-purple-400",
            }}
            label={"Total Estimasi Omzet"}
            value={formatNumber(statistik.totalEstimasiOmzet)}
            caption={"Jumlah Estimasi Omzet Tersissa"}
          />

          {/* total estimasi laba  */}
          <CardStatistik
            isLoading={isLoadingLaporanSisa || isRefetchingLaporanSisa}
            icon={{
              icon: ChartLine,
              bgColor: "bg-emerald-100",
              iconColor: "text-emerald-400",
            }}
            label={"Total Estimasi Laba"}
            value={formatNumber(
              statistik.totalEstimasiOmzet - statistik.totalModal,
            )}
            caption={"Jumlah Estimasi Laba Tersissa"}
          />
        </div>
      </div>

      {/* daftar kategori */}
      {kategori.id === 0 && (
        <div className="overflow-x-auto w-full bg-base-100 rounded-xl border border-transparent dark:border-base-content/10 shadow-sm hidden lg:flex mt-2.5">
          <table className="table table-xs lg:table-sm table-zebra">
            {/* head */}
            <thead>
              <tr className="h-12 bg-base-200 text-[0.7rem]">
                <th>No</th>
                <th>Kategori</th>
                <th>Total Produk</th>
                <th>Total Stok</th>
                <th>Total Estimasi Omzet</th>
                <th align="center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingLaporanSisa || isRefetchingLaporanSisa ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={6}>
                      <div className="skeleton h-12 w-full py-1" />
                    </td>
                  </tr>
                ))
              ) : dataLaporanSisa?.data?.kategori &&
                dataLaporanSisa?.data?.kategori.length > 0 ? (
                dataLaporanSisa?.data?.kategori?.map((item, index) => (
                  <tr
                    key={item.kategoriId}
                    className={cn(
                      "transition-all duration-75 ease-in-out h-18 text-[0.7rem] text-base-content",
                    )}
                  >
                    {/* no */}
                    <td>{index + 1}</td>
                    {/* nama */}
                    <td className="font-semibold">{item.namaKategori}</td>
                    {/* total produk*/}
                    <td>{formatNumber(item.totalProduk)}</td>
                    {/* total stok */}
                    <td>{formatNumber(item.totalStok)}</td>
                    {/* total estimasi omzet */}
                    <td>{formatNumber(item.totalEstimasiOmzet)}</td>
                    {/* aksi */}
                    <td align="center">
                      <ButtonDetailTable
                        handleRedirect={() =>
                          setKategori({
                            id: item.kategoriId,
                            nama: item.namaKategori,
                          })
                        }
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="w-full h-full flex flex-col justify-center items-center">
                      <DataEmpty
                        title="Data Produk Tidak Tersedia"
                        description="Belum ada data produk yang dapat ditampilkan saat ini."
                        xs
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* daftar produk */}
      {kategori.id !== 0 && (
        <div className="overflow-x-auto w-full bg-base-100 rounded-xl border border-transparent dark:border-base-content/10 shadow-sm hidden lg:flex mt-2.5">
          <table className="table table-xs lg:table-sm table-zebra">
            {/* head */}
            <thead>
              <tr className="h-12 bg-base-200 text-[0.7rem]">
                <th>No</th>
                <th>Foto</th>
                <th>Nama</th>
                <th>Hrg. Mdl. Rata Rata</th>
                <th>Haga Jual</th>
                <th>Ttl. Stok</th>
                <th>Ttl. Est. Modal</th>
                <th>Ttl. Est. Omzet</th>
                <th>Ttl. Est. Laba</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingSisaModalByProduk || isRefetchingSisaModalByProduk ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={9}>
                      <div className="skeleton h-12 w-full py-1" />
                    </td>
                  </tr>
                ))
              ) : dataSisaModalByProduk?.data?.produk &&
                dataSisaModalByProduk?.data?.produk.length > 0 ? (
                dataSisaModalByProduk?.data?.produk?.map((item, index) => (
                  <tr
                    key={item.id}
                    className={cn(
                      "transition-all duration-75 ease-in-out h-18 text-[0.7rem] text-base-content",
                    )}
                  >
                    {/* no */}
                    <td>{index + 1}</td>
                    {/* gambar */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-10 h-10 lg:h-12 lg:w-12">
                            <img
                              src={item.img}
                              alt="Foto Produk"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* nama */}
                    <td>
                      <div className="flex flex-col justify-start items-start">
                        <p>{item.nama}</p>
                        <p>{item.kode ?? "-"}</p>
                      </div>
                    </td>
                    {/* harga modal rata rata */}
                    <td>{formatNumber(item.hargaModalRataRata)}</td>
                    {/* total harga jual */}
                    <td>{formatNumber(item.hargaJual)}</td>
                    {/* total stok */}
                    <td>{formatNumber(item.totalStok)}</td>
                    {/* total modal */}
                    <td>{formatNumber(item.totalModal)}</td>
                    {/* total omzet*/}
                    <td>{formatNumber(item.totalOmzet)}</td>
                    {/* total laba*/}
                    <td>{formatNumber(item.totalLaba)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9}>
                    <div className="w-full h-full flex flex-col justify-center items-center">
                      <DataEmpty
                        title="Data Produk Tidak Tersedia"
                        description="Belum ada data produk yang dapat ditampilkan saat ini."
                        xs
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

type CardProdukStokProps = {
  produk: ProdukResponseType & {
    restockTerakhir: Date | null;

    statusPergerakan: StatusPergerakan | null;
  };
};

// card produk
const CardProdukStok: FC<CardProdukStokProps> = ({ produk }) => {
  return (
    <div className="w-full bg-base-100 rounded-2xl flex flex-col justify-start items-start p-4 border border-transparent dark:border-base-content/10 gap-2">
      {/* content 1 */}
      <div className="w-full flex flex-row justify-between items-stretch pb-3 border-b border-base-content/10">
        <div className="flex-2 flex flex-row justify-start items-start gap-4">
          <div className="flex flex-row justify-start items-start gap-3">
            {/* foto */}
            <div className="w-16 h-16 overflow-hidden rounded-2xl">
              <img src={produk.img} alt="foto produk" loading="lazy" />
            </div>
          </div>

          {/* deskripsi */}
          <div className="flex flex-col justify-start items-start gap-1.5">
            {/* kode produk */}
            <span className="text-[0.7rem] font-medium text-base-content/70 dark:text-base-content">
              {produk.kode}
            </span>
            {/* nama produk */}
            <span className="text-sm font-medium text-base-content">
              {produk.nama}
            </span>

            {/* kategori produk */}
            <span className="text-xs text-base-content/70">
              {produk.kategori.nama}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between items-end">
          {produk?.stok > produk.stokMinimum ? (
            <span className="text-[0.625rem] font-medium text-primary-white py-1 px-1.5 rounded-full bg-emerald-500 ">
              Cukup
            </span>
          ) : produk?.stok < produk.stokMinimum && produk?.stok !== 0 ? (
            <span className="text-[0.625rem] font-medium text-primary-white py-1 px-1.5 rounded-full bg-amber-500 ">
              Menipis
            </span>
          ) : (
            <span className="text-[0.625rem] font-medium text-primary-white py-1 px-1.5 rounded-full bg-rose-500 ">
              Habis
            </span>
          )}

          <div className="flex flex-col justify-start items-start gap-0.5">
            {/* label */}
            <span className="text-[0.625rem] text-base-content/70">
              Restock:
            </span>
            <span className="text-[0.625rem] text-base-content font-medium">
              {produk.restockTerakhir
                ? formatTanggalPanjang(produk.restockTerakhir)
                : "-"}
            </span>
          </div>
        </div>
      </div>

      {/* content 2 */}
      <div className="w-full flex flex-row justify-evenly items-start gap-4 pt-1">
        <div className="flex-1 flex flex-col justify-start items-start gap-1 border-r border-base-content/10">
          {/* label */}
          <div className="flex flex-row justify-start items-center gap-1">
            {/* icon */}
            <div className="w-5 h-5 rounded-full flex justify-center items-center bg-purple-100">
              <Package className="text-purple-400 size-2.5" />
            </div>

            {/* label */}
            <span className="text-[0.625rem] text-base-content">Stok</span>
          </div>

          {/* value */}
          <span className="text-[0.7rem] font-medium text-base-content">
            {formatNumberK(produk.stok)}
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-start items-start gap-1 border-r border-base-content/10">
          {/* label */}
          <div className="flex flex-row justify-start items-center gap-1">
            {/* icon */}
            <div className="w-5 h-5 rounded-full flex justify-center items-center bg-emerald-100">
              <CircleAlert className="text-emerald-400 size-2.5" />
            </div>

            {/* label */}
            <span className="text-[0.625rem] text-base-content">Min.</span>
          </div>

          {/* value */}
          <span className="text-[0.7rem] font-medium text-base-content">
            {formatNumberK(produk.stokMinimum)}
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-start items-start gap-1">
          {/* label */}
          <div className="flex flex-row justify-start items-center gap-1">
            {/* icon */}
            <div className="w-5 h-5 rounded-full flex justify-center items-center bg-amber-100">
              <ChartLine className="text-amber-600 size-2.5" />
            </div>

            {/* label */}
            <span className="text-[0.625rem] text-base-content">
              Pergerakan
            </span>
          </div>

          {/* value */}
          {produk.statusPergerakan !== null ? (
            <span
              className={cn(
                "text-[0.625rem] font-medium text-primary-white py-1 px-1.5 rounded-full capitalize",
                produk.statusPergerakan === STATUS_PERGERAKAN.CEPAT &&
                  "bg-emerald-500",
                produk.statusPergerakan === STATUS_PERGERAKAN.LAMBAT &&
                  "bg-amber-500",
                produk.statusPergerakan === STATUS_PERGERAKAN.NORMAL &&
                  "bg-blue-500",
              )}
            >
              {produk?.statusPergerakan?.toLowerCase()}
            </span>
          ) : (
            "-"
          )}
        </div>
      </div>
    </div>
  );
};

export default LaporanSisa;
