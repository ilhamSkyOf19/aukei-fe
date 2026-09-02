import { type FC } from "react";
import { cn } from "../../../../utils/cn";
import { formatNumber } from "../../../../helpers/helpers";
import {
  ArrowRight,
  Banknote,
  ChartLine,
  Package,
  ShoppingCart,
  Wallet,
} from "lucide-react";

import useLaporanSisa from "./useLaporanSisa";
import CardStatistik from "../../../../components/ui/cards/CardStatistik";
import ButtonDetailTable from "../../../../components/ui/button/ButtonDetailTable";
import DataEmpty from "../../../../components/messages/DataEmpty";
import ButtonRefresh from "../../../../components/ui/button/ButtonRefresh";
import ButtonBackText from "../../../../components/ui/button/ButtonBackText";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";

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
    resetKategori,
    setKategori,
    kategori,
  } = useLaporanSisa();

  const isLoadingKategori = isLoadingLaporanSisa || isRefetchingLaporanSisa;

  const isLoadingProduk =
    isLoadingSisaModalByProduk || isRefetchingSisaModalByProduk;

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
          <div className="w-full gap-0.5 flex flex-col justify-start items-start">
            <span className="text-sm font-medium text-base-content">
              {kategori.id !== 0
                ? kategori.nama
                : "Laporan Sisa Stok dan Modal"}
            </span>

            <span className="text-[0.7rem] w-[70%] text-base-content/70">
              Informasi Laporan Sisa Stok dan Modal{" "}
              {kategori.id !== 0 && `Berdasarkan kategori ${kategori.nama}`}
            </span>
          </div>

          <ButtonRefresh handleRefresh={() => handleRefresh()} />
        </div>

        {/* statistik */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2.5">
          <CardStatistik
            isLoading={isLoadingKategori}
            icon={{
              icon: Package,
              bgColor: "bg-blue-100",
              iconColor: "text-blue-400",
            }}
            label="Total Stok Tersisa"
            value={formatNumber(statistik.totalStok) || "0"}
            caption="Jumlah Stok Tersisa"
          />

          <CardStatistik
            isLoading={isLoadingKategori}
            icon={{
              icon: Banknote,
              bgColor: "bg-emerald-100",
              iconColor: "text-emerald-400",
            }}
            label="Total Modal Tersisa"
            value={formatNumber(statistik.totalModal)}
            caption="Jumlah Modal Tersisa"
          />

          <CardStatistik
            isLoading={isLoadingKategori}
            icon={{
              icon: Wallet,
              bgColor: "bg-purple-100",
              iconColor: "text-purple-400",
            }}
            label="Total Estimasi Omzet"
            value={formatNumber(statistik.totalEstimasiOmzet)}
            caption="Jumlah Estimasi Omzet Tersisa"
          />

          <CardStatistik
            isLoading={isLoadingKategori}
            icon={{
              icon: ChartLine,
              bgColor: "bg-emerald-100",
              iconColor: "text-emerald-400",
            }}
            label="Total Estimasi Laba"
            value={formatNumber(
              statistik.totalEstimasiOmzet - statistik.totalModal,
            )}
            caption="Jumlah Estimasi Laba Tersisa"
          />
        </div>
      </div>

      {/* ============================================================
          DAFTAR KATEGORI - DESKTOP
      ============================================================ */}
      {kategori.id === 0 && (
        <div className="overflow-x-auto w-full bg-base-100 rounded-xl border border-transparent dark:border-base-content/10 shadow-sm hidden lg:flex mt-2.5">
          <table className="table table-xs lg:table-sm table-zebra">
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
              {isLoadingKategori ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={6}>
                      <div className="skeleton h-12 w-full py-1" />
                    </td>
                  </tr>
                ))
              ) : dataLaporanSisa?.data?.kategori &&
                dataLaporanSisa.data.kategori.length > 0 ? (
                dataLaporanSisa.data.kategori.map((item, index) => (
                  <tr
                    key={item.kategoriId}
                    className={cn(
                      "transition-all duration-75 ease-in-out h-18 text-[0.7rem] text-base-content",
                    )}
                  >
                    <td>{index + 1}</td>

                    <td className="font-semibold">{item.namaKategori}</td>

                    <td>{formatNumber(item.totalProduk)}</td>

                    <td>{formatNumber(item.totalStok)}</td>

                    <td>{formatNumber(item.totalEstimasiOmzet)}</td>

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
                        title="Data Kategori Tidak Tersedia"
                        description="Belum ada data kategori yang dapat ditampilkan saat ini."
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

      {/* ============================================================
          DAFTAR KATEGORI - MOBILE
      ============================================================ */}
      {kategori.id === 0 && (
        <div className="w-full lg:hidden flex flex-col gap-2.5 mt-2.5">
          {isLoadingKategori ? (
            Array.from({ length: 4 }).map((_, index) => (
              <CardKategoriSkeleton key={index} />
            ))
          ) : dataLaporanSisa?.data?.kategori &&
            dataLaporanSisa.data.kategori.length > 0 ? (
            dataLaporanSisa.data.kategori.map((item, index) => (
              <CardKategori
                key={item.kategoriId}
                nomor={index + 1}
                nama={item.namaKategori}
                totalProduk={item.totalProduk}
                totalStok={item.totalStok}
                totalEstimasiOmzet={item.totalEstimasiOmzet}
                handleClick={() =>
                  setKategori({
                    id: item.kategoriId,
                    nama: item.namaKategori,
                  })
                }
              />
            ))
          ) : (
            <div className="w-full bg-base-100 rounded-2xl border border-transparent dark:border-base-content/10 shadow-sm py-10">
              <DataEmpty
                title="Data Kategori Tidak Tersedia"
                description="Belum ada data kategori yang dapat ditampilkan saat ini."
                xs
              />
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          DAFTAR PRODUK - DESKTOP
      ============================================================ */}
      {kategori.id !== 0 && (
        <div className="overflow-x-auto w-full bg-base-100 rounded-xl border border-transparent dark:border-base-content/10 shadow-sm hidden lg:flex mt-2.5">
          <table className="table table-xs lg:table-sm table-zebra">
            <thead>
              <tr className="h-12 bg-base-200 text-[0.7rem]">
                <th>No</th>
                <th>Foto</th>
                <th>Nama</th>
                <th>Hrg. Mdl. Rata Rata</th>
                <th>Harga Jual</th>
                <th>Ttl. Stok</th>
                <th>Ttl. Est. Modal</th>
                <th>Ttl. Est. Omzet</th>
                <th>Ttl. Est. Laba</th>
              </tr>
            </thead>

            <tbody>
              {isLoadingProduk ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={9}>
                      <div className="skeleton h-12 w-full py-1" />
                    </td>
                  </tr>
                ))
              ) : dataSisaModalByProduk?.data?.produk &&
                dataSisaModalByProduk.data.produk.length > 0 ? (
                dataSisaModalByProduk.data.produk.map((item, index) => (
                  <tr
                    key={item.id}
                    className="transition-all duration-75 ease-in-out h-18 text-[0.7rem] text-base-content"
                  >
                    <td>{index + 1}</td>

                    <td>
                      <div className="avatar">
                        <div className="mask mask-squircle w-10 h-10 lg:h-12 lg:w-12">
                          <img src={item.img} alt={item.nama} loading="lazy" />
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="flex flex-col justify-start items-start">
                        <p className="font-medium">{item.nama}</p>

                        <p className="text-base-content/60">
                          {item.kode ?? "-"}
                        </p>
                      </div>
                    </td>

                    <td>{formatNumber(item.hargaModalRataRata)}</td>

                    <td>{formatNumber(item.hargaJual)}</td>

                    <td>{formatNumber(item.totalStok)}</td>

                    <td>{formatNumber(item.totalModal)}</td>

                    <td>{formatNumber(item.totalOmzet)}</td>

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

      {/* ============================================================
          DAFTAR PRODUK - MOBILE
      ============================================================ */}
      {kategori.id !== 0 && (
        <div className="w-full lg:hidden flex flex-col gap-2.5 mt-2.5">
          {isLoadingProduk ? (
            Array.from({ length: 4 }).map((_, index) => (
              <CardProdukSkeleton key={index} />
            ))
          ) : dataSisaModalByProduk?.data?.produk &&
            dataSisaModalByProduk.data.produk.length > 0 ? (
            dataSisaModalByProduk.data.produk.map((item) => (
              <CardProdukStok key={item.id} produk={item} />
            ))
          ) : (
            <div className="w-full bg-base-100 rounded-2xl border border-transparent dark:border-base-content/10 shadow-sm py-10">
              <DataEmpty
                title="Data Produk Tidak Tersedia"
                description="Belum ada data produk yang dapat ditampilkan saat ini."
                xs
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ============================================================
    TYPE CARD PRODUK
============================================================ */

type CardProdukStokProps = {
  produk: {
    id: number;
    img: string;
    nama: string;
    kode: string | null;
    hargaModalRataRata: number;
    hargaJual: number;
    totalStok: number;
    totalModal: number;
    totalOmzet: number;
    totalLaba: number;
  };
};

/* ============================================================
    CARD PRODUK MOBILE
============================================================ */

const CardProdukStok: FC<CardProdukStokProps> = ({ produk }) => {
  return (
    <div className="w-full bg-base-100 rounded-2xl flex flex-col justify-start items-start p-4 border border-transparent dark:border-base-content/10 shadow-sm gap-3">
      {/* ========================================================
          HEADER PRODUK
      ======================================================== */}
      <div className="w-full flex justify-between items-start gap-3 pb-3 border-b border-base-content/10">
        <div className="flex items-start gap-3 min-w-0">
          {/* foto */}
          <div className="w-14 h-14 shrink-0 overflow-hidden rounded-xl bg-base-200">
            <img
              src={produk.img}
              alt={produk.nama}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>

          {/* informasi produk */}
          <div className="flex flex-col justify-start items-start gap-0.5 min-w-0">
            <span className="text-[0.65rem] text-base-content/60">
              {produk.kode ?? "-"}
            </span>

            <span className="text-sm font-semibold text-base-content line-clamp-2">
              {produk.nama}
            </span>

            <div className="flex flex-col mt-1">
              <span className="text-[0.6rem] text-base-content/60">
                Harga Jual
              </span>

              <span className="text-xs font-semibold text-primary">
                {formatNumber(produk.hargaJual)}
              </span>
            </div>
          </div>
        </div>

        {/* stok */}
        <div className="flex flex-col justify-start items-end shrink-0">
          <span className="text-[0.6rem] text-base-content/60">Total Stok</span>

          <span className="text-sm font-bold text-base-content">
            {formatNumber(produk.totalStok)}
          </span>
        </div>
      </div>

      {/* ========================================================
          HARGA
      ======================================================== */}
      <div className="w-full grid grid-cols-2 gap-2">
        <div className="bg-base-200/60 rounded-xl p-2.5 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-amber-100 flex justify-center items-center">
              <Banknote className="size-3 text-amber-600" />
            </div>

            <span className="text-[0.6rem] text-base-content/60">
              Modal Rata-rata
            </span>
          </div>

          <span className="text-[0.7rem] font-semibold text-base-content">
            {formatNumber(produk.hargaModalRataRata)}
          </span>
        </div>

        <div className="bg-base-200/60 rounded-xl p-2.5 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex justify-center items-center">
              <ShoppingCart className="size-3 text-blue-500" />
            </div>

            <span className="text-[0.6rem] text-base-content/60">
              Harga Jual
            </span>
          </div>

          <span className="text-[0.7rem] font-semibold text-base-content">
            {formatNumber(produk.hargaJual)}
          </span>
        </div>
      </div>

      {/* ========================================================
          ESTIMASI NILAI
      ======================================================== */}
      <div className="w-full grid grid-cols-3 divide-x divide-base-content/10 border-y border-base-content/10 py-3">
        {/* modal */}
        <div className="flex flex-col justify-start items-center px-2 gap-1">
          <span className="text-[0.58rem] text-center text-base-content/60">
            Est. Modal
          </span>

          <span className="text-[0.65rem] text-center font-semibold text-base-content">
            {formatNumber(produk.totalModal)}
          </span>
        </div>

        {/* omzet */}
        <div className="flex flex-col justify-start items-center px-2 gap-1">
          <span className="text-[0.58rem] text-center text-base-content/60">
            Est. Omzet
          </span>

          <span className="text-[0.65rem] text-center font-semibold text-primary">
            {formatNumber(produk.totalOmzet)}
          </span>
        </div>

        {/* laba */}
        <div className="flex flex-col justify-start items-center px-2 gap-1">
          <span className="text-[0.58rem] text-center text-base-content/60">
            Est. Laba
          </span>

          <span
            className={cn(
              "text-[0.65rem] text-center font-semibold",
              produk.totalLaba > 0
                ? "text-emerald-500"
                : produk.totalLaba < 0
                  ? "text-error"
                  : "text-base-content",
            )}
          >
            {formatNumber(produk.totalLaba)}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
    TYPE CARD KATEGORI
============================================================ */

type CardKategoriProps = {
  nomor: number;
  nama: string;
  totalProduk: number;
  totalStok: number;
  totalEstimasiOmzet: number;
  handleClick: () => void;
};

/* ============================================================
    CARD KATEGORI MOBILE
============================================================ */

const CardKategori: FC<CardKategoriProps> = ({
  nomor,
  nama,
  totalProduk,
  totalStok,
  totalEstimasiOmzet,
  handleClick,
}) => {
  return (
    <div className="w-full bg-base-100 rounded-2xl p-4 border border-transparent dark:border-base-content/10 shadow-sm flex flex-col gap-3">
      {/* header */}
      <div className="w-full flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="text-[0.6rem] text-base-content/60">
            Kategori #{nomor}
          </span>

          <span className="text-sm font-semibold text-base-content">
            {nama}
          </span>
        </div>

        <ButtonWithIcon
          icon={ArrowRight}
          reverse
          label="Detail"
          handleBtn={() => handleClick()}
          customHeight="h-8.5"
        />
      </div>

      {/* statistik */}
      <div className="w-full grid grid-cols-3 divide-x divide-base-content/10 border-y border-base-content/10 py-3">
        <div className="flex flex-col items-center px-2 gap-1">
          <span className="text-[0.58rem] text-center text-base-content/60">
            Produk
          </span>

          <span className="text-xs font-semibold">
            {formatNumber(totalProduk)}
          </span>
        </div>

        <div className="flex flex-col items-center px-2 gap-1">
          <span className="text-[0.58rem] text-center text-base-content/60">
            Total Stok
          </span>

          <span className="text-xs font-semibold">
            {formatNumber(totalStok)}
          </span>
        </div>

        <div className="flex flex-col items-center px-2 gap-1">
          <span className="text-[0.58rem] text-center text-base-content/60">
            Est. Omzet
          </span>

          <span className="text-xs text-center font-semibold text-primary">
            {formatNumber(totalEstimasiOmzet)}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
    SKELETON CARD PRODUK
============================================================ */

const CardProdukSkeleton: FC = () => {
  return (
    <div className="w-full bg-base-100 rounded-2xl p-4 border border-transparent dark:border-base-content/10 shadow-sm flex flex-col gap-3">
      <div className="w-full flex gap-3">
        <div className="skeleton w-14 h-14 rounded-xl shrink-0" />

        <div className="flex flex-col gap-2 flex-1">
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="skeleton h-16 w-full rounded-xl" />
        <div className="skeleton h-16 w-full rounded-xl" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="skeleton h-12 w-full" />
        <div className="skeleton h-12 w-full" />
        <div className="skeleton h-12 w-full" />
      </div>
    </div>
  );
};

/* ============================================================
    SKELETON CARD KATEGORI
============================================================ */

const CardKategoriSkeleton: FC = () => {
  return (
    <div className="w-full bg-base-100 rounded-2xl p-4 border border-transparent dark:border-base-content/10 shadow-sm flex flex-col gap-3">
      <div className="w-full flex justify-between">
        <div className="flex flex-col gap-2">
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-4 w-32" />
        </div>

        <div className="skeleton h-8 w-8 rounded-lg" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="skeleton h-12 w-full" />
        <div className="skeleton h-12 w-full" />
        <div className="skeleton h-12 w-full" />
      </div>
    </div>
  );
};

export default LaporanSisa;
