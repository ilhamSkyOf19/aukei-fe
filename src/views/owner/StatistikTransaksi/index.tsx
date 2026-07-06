import {
  ArrowLeft,
  ArrowRight,
  BanknoteArrowDown,
  ChartColumn,
  Clock3,
  FileText,
  Package,
  Receipt,
  Sheet,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import CardStatistik from "../../../components/ui/cards/CardStatistik";
import useStatistikTransaksi from "./useStatistikTransaksi";
import {
  formatNumber,
  formatNumberK,
  formatRupiah,
  formatRupiahShort,
} from "../../../helpers/helpers";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import RangeDate from "../../../components/filters/RangeDate";
import GrafikBatang from "../../../components/grafik/GrafikBatang";
import GrafikLine from "../../../components/grafik/GrafikLine";
import GrafikPieMetodePembayaran from "../../../components/grafik/GrafikPieMetodePembayaran";
import type { FC } from "react";

const StatistikTransaksi = () => {
  const { windowSize, navigate, isExistingData, isLoading, statistik } =
    useStatistikTransaksi();

  return (
    <div className="w-full mb-30 flex flex-col justify-start items-start p-2 gap-4">
      <div className="bg-base-100 w-full shadow-sm border border-transparent dark:border-base-content/10 rounded-lg p-2.5 gap-4 flex flex-col justify-start items-start">
        <div className="w-full flex flex-row justify-between items-start">
          {/* title */}
          <div className="flex flex-col justify-start items-start gap-0.5">
            <h3 className="text-lg font-semibold text-base-content">
              Statistik
            </h3>

            {/* back */}
            <button
              type="button"
              className="text-xs text-base-content/50 hover:text-base-content transition-colors duration-150 ease-in-out font-medium flex flex-row justify-start items-start gap-2 py-0.5"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="size-4" />
              <span>Kembali</span>
            </button>
          </div>

          {/* aksi */}
          <div className="flex flex-row justify-end items-start gap-2">
            {/* button filter */}
            <RangeDate noLabel customWidth="w-50" />
            {/* button export */}
            <div className="md:flex flex-row justify-start items-center gap-2 hidden">
              <ButtonWithIcon
                icon={FileText}
                label="Export PDF"
                bgColor="bg-error"
                textColor="text-primary-white"
              />
              <ButtonWithIcon
                icon={Sheet}
                label="Export Excel"
                bgColor="bg-success"
                textColor="text-primary-white"
              />
            </div>
          </div>
        </div>
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2">
          <CardStatistik
            icon={{
              icon: Receipt,
              bgColor: "bg-blue-100",
              iconColor: "text-blue-400",
            }}
            label={windowSize === "sm" ? "Transaksi" : "Total Transaksi"}
            value={formatNumber(statistik?.data?.totalTransaksi.total ?? 0)}
            caption={
              windowSize !== "sm"
                ? "Jumlah transaksi berdasarkan tanggal"
                : undefined
            }
            detail={
              statistik?.data?.totalTransaksi?.persentase
                ? statistik?.data?.totalTransaksi?.persentase > 0
                  ? { up: statistik?.data?.totalTransaksi?.persentase }
                  : { down: statistik?.data?.totalTransaksi?.persentase }
                : undefined
            }
          />

          <CardStatistik
            icon={{
              icon: BanknoteArrowDown,
              bgColor: "bg-emerald-100",
              iconColor: "text-emerald-400",
            }}
            label={windowSize === "sm" ? "Omzet" : "Total Omzet"}
            value={
              windowSize === "sm"
                ? formatRupiahShort(statistik?.data?.totalOmzet.total ?? 0)
                : formatRupiah(statistik?.data?.totalOmzet.total ?? 0)
            }
            caption={
              windowSize !== "sm"
                ? "Total omzet dari transaksi penjualan"
                : undefined
            }
            detail={
              statistik?.data?.totalOmzet?.persentase
                ? statistik?.data?.totalOmzet?.persentase > 0
                  ? { up: statistik?.data?.totalOmzet?.persentase }
                  : { down: statistik?.data?.totalOmzet?.persentase }
                : undefined
            }
          />

          <CardStatistik
            icon={{
              icon: ChartColumn,
              bgColor: "bg-emerald-100",
              iconColor: "text-emerald-400",
            }}
            label={
              windowSize === "sm" ? "Rata-rata" : "Total Rata-rata transaksi"
            }
            value={
              windowSize === "sm"
                ? formatRupiahShort(
                    statistik?.data?.totalRataRataTransaksi.total ?? 0,
                  )
                : formatRupiah(
                    statistik?.data?.totalRataRataTransaksi.total ?? 0,
                  )
            }
            caption={
              windowSize !== "sm"
                ? "Total omzet dari transaksi penjualan"
                : undefined
            }
            detail={
              statistik?.data?.totalRataRataTransaksi?.persentase
                ? statistik?.data?.totalRataRataTransaksi?.persentase > 0
                  ? { up: statistik?.data?.totalRataRataTransaksi?.persentase }
                  : {
                      down: statistik?.data?.totalRataRataTransaksi?.persentase,
                    }
                : undefined
            }
          />

          <CardStatistik
            icon={{
              icon: Package,
              bgColor: "bg-amber-100",
              iconColor: "text-amber-400",
            }}
            label={windowSize === "sm" ? "Modal" : "Total Modal"}
            value={
              windowSize === "sm"
                ? formatRupiahShort(statistik?.data?.totalModal.total ?? 0)
                : formatRupiah(statistik?.data?.totalModal.total ?? 0)
            }
            caption={
              windowSize !== "sm"
                ? "Total biaya modal untuk transaksi penjualan"
                : undefined
            }
            detail={
              statistik?.data?.totalModal?.persentase
                ? statistik?.data?.totalModal?.persentase > 0
                  ? { up: statistik?.data?.totalModal?.persentase }
                  : { down: statistik?.data?.totalModal?.persentase }
                : undefined
            }
          />

          <CardStatistik
            icon={{
              icon: TrendingUp,
              bgColor: "bg-green-100",
              iconColor: "text-green-400",
            }}
            label={windowSize === "sm" ? "Laba" : "Total Laba"}
            value={
              windowSize === "sm"
                ? formatRupiahShort(statistik?.data?.totalLaba.total ?? 0)
                : formatRupiah(statistik?.data?.totalLaba.total ?? 0)
            }
            caption={
              windowSize !== "sm"
                ? "Total keuntungan dari transaksi penjualan"
                : undefined
            }
            detail={
              statistik?.data?.totalLaba?.persentase
                ? statistik?.data?.totalLaba?.persentase > 0
                  ? { up: statistik?.data?.totalLaba?.persentase }
                  : { down: statistik?.data?.totalLaba?.persentase }
                : undefined
            }
          />

          <CardStatistik
            icon={{
              icon: Clock3,
              bgColor: "bg-red-100",
              iconColor: "text-red-400",
            }}
            label={windowSize === "sm" ? "Piutang" : "Total Piutang"}
            value={
              windowSize === "sm"
                ? formatRupiahShort(statistik?.data?.totalPiutang.total ?? 0)
                : formatRupiah(statistik?.data?.totalPiutang.total ?? 0)
            }
            caption={
              windowSize !== "sm"
                ? "Total nilai piutang yang belum dibayar"
                : undefined
            }
            detail={
              statistik?.data?.totalPiutang?.persentase
                ? statistik?.data?.totalPiutang?.persentase > 0
                  ? { up: statistik?.data?.totalPiutang?.persentase }
                  : { down: statistik?.data?.totalPiutang?.persentase }
                : undefined
            }
          />

          <CardStatistik
            icon={{
              icon: ShoppingBag,
              bgColor: "bg-purple-100",
              iconColor: "text-purple-400",
            }}
            label={windowSize === "sm" ? "Produk" : "Total Produk Terjual"}
            value={formatNumber(statistik?.data?.totalProdukTerjual.total ?? 0)}
            caption={
              windowSize !== "sm" ? "Jumlah produk yang terjual" : undefined
            }
            detail={
              statistik?.data?.totalProdukTerjual?.persentase
                ? statistik?.data?.totalProdukTerjual?.persentase > 0
                  ? { up: statistik?.data?.totalProdukTerjual?.persentase }
                  : { down: statistik?.data?.totalProdukTerjual?.persentase }
                : undefined
            }
          />

          <CardStatistik
            icon={{
              icon: Package,
              bgColor: "bg-indigo-100",
              iconColor: "text-indigo-400",
            }}
            label={windowSize === "sm" ? "Item" : "Total Item Terjual"}
            value={formatNumber(statistik?.data?.totalItemTerjual.total ?? 0)}
            caption={
              windowSize !== "sm" ? "Jumlah item yang terjual" : undefined
            }
            detail={
              statistik?.data?.totalItemTerjual?.persentase
                ? statistik?.data?.totalItemTerjual?.persentase > 0
                  ? { up: statistik?.data?.totalItemTerjual?.persentase }
                  : { down: statistik?.data?.totalItemTerjual?.persentase }
                : undefined
            }
          />
        </div>
      </div>

      {/* grafik */}
      <div className="w-full gap-4 flex flex-col md:flex-row justify-between items-start">
        <GrafikLine windowSize={windowSize} />

        {/* graifk  */}
        <GrafikBatang windowSize={windowSize} />
      </div>

      {/* grafik pie */}
      <div className="w-full gap-4 flex flex-col md:flex-row justify-between items-start">
        <GrafikPieMetodePembayaran />

        <div className="md:flex-1 w-full flex flex-col md:flex-row justify-between items-start gap-4 md:h-90 h-auto">
          <div className="md:flex-1 md:h-full flex flex-col justify-start items-start bg-base-100 w-full shadow-sm border border-transparent dark:border-base-content/10 rounded-lg py-2.5 px-4 md:p-2.5 overflow-y-auto h-90">
            {/* header */}
            <div className="w-full flex flex-col justify-start items-start mb-2">
              <h3 className="text-sm font-semibold text-base-content capitalize">
                Top 5 Produk Terlaris
              </h3>
            </div>

            {/* content */}
            <div className="w-full flex flex-col justify-start items-start">
              <CardTopProduk
                nama="Gypsum A"
                kode="JVW 0002"
                total={2000}
                totalBelanja={100000000}
                value={90}
              />
              <CardTopProduk
                nama="Gypsum B"
                kode="JVW 0002 - E"
                total={1900}
                totalBelanja={11200000}
                value={60}
              />
              <CardTopProduk
                nama="Gypsum B"
                kode="JVW 0002 - E"
                total={1900}
                totalBelanja={11200000}
                value={40}
              />
              <CardTopProduk
                nama="Gypsum B"
                kode="JVW 0002 - E"
                total={1900}
                totalBelanja={11200000}
                value={30}
              />
              <CardTopProduk
                nama="Gypsum B"
                kode="JVW 0002 - E"
                total={1900}
                totalBelanja={11200000}
                value={30}
              />

              <div className="w-full flex flex-row justify-center items-center pt-3">
                <button
                  type="button"
                  className="text-xs font-medium text-base-content/50 hover:text-base-content transition-colors duration-150 ease-in-out py-0.5 flex flex-row justify-start items-start gap-2"
                >
                  <span>Lihat Semua Produk</span>

                  {/* icon */}
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="md:flex-1 md:h-full flex flex-col justify-start items-start bg-base-100 w-full shadow-sm border border-transparent dark:border-base-content/10 rounded-lg py-2.5 px-4 md:p-2.5 overflow-y-auto h-90">
            {/* header */}
            <div className="w-full flex flex-col justify-start items-start mb-2">
              <h3 className="text-sm font-semibold text-base-content capitalize">
                Top 5 Pelanggan
              </h3>
            </div>

            {/* content */}
            <div className="w-full flex flex-col justify-start items-start">
              <CardTopPelanggan
                nama="Ilham Hidayat"
                totalTransaksi={2000}
                totalBelanja={100000000}
              />
              <CardTopPelanggan
                nama="Agus Surya"
                totalTransaksi={2000}
                totalBelanja={10000000}
              />
              <CardTopPelanggan
                nama="Andi Sandi"
                totalTransaksi={2000}
                totalBelanja={10000000}
              />
              <CardTopPelanggan
                nama="Urba Putra"
                totalTransaksi={2000}
                totalBelanja={10000000}
              />
              <CardTopPelanggan
                nama="Sandi Irawan"
                totalTransaksi={2000}
                totalBelanja={10000000}
              />
            </div>

            {/* button */}
            <div className="w-full flex flex-row justify-center items-center pt-3">
              <button
                type="button"
                className="text-xs font-medium text-base-content/50 hover:text-base-content transition-colors duration-150 ease-in-out py-0.5 flex flex-row justify-start items-start gap-2"
              >
                <span>Lihat Semua Pelanggan</span>

                {/* icon */}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// card content
type CardTopProdukProps = {
  nama: string;
  kode: string;
  total: number;
  totalBelanja: number;
  value: number;
};
const CardTopProduk: FC<CardTopProdukProps> = ({
  kode,
  nama,
  total,
  totalBelanja,
  value,
}) => {
  return (
    <div className=" w-full flex flex-col justify-start items-start gap-1 border-b border-base-content/10 py-2">
      {/* nama */}
      <div className="flex flex-row justify-between items-center w-full">
        <span className="text-xs font-medium text-base-content">{nama}</span>
        <span className="text-[0.625rem] font-semibold uppercase text-base-content/60">
          {kode}
        </span>
      </div>

      <div className="w-full flex flex-row justify-between items-center gap-1">
        <div className="flex-3 flex flex-row justify-start items-center gap-1">
          {/* total */}
          <span className="flex-1 text-[0.625rem] font-medium text-base-content/60">
            {formatNumberK(total)} Pcs
          </span>

          <div className="flex-3 flex flex-row justify-start items-center">
            <progress
              className="progress border border-custom-secondary progress-custom-primary w-full h-2.5"
              value={value}
              max="100"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-row justify-end items-center">
          <span className="text-xs font-medium text-base-content">
            {formatRupiahShort(totalBelanja)}
          </span>
        </div>
      </div>
    </div>
  );
};

type CardTopPelangganProps = {
  nama: string;
  totalTransaksi: number;
  totalBelanja: number;
};
const CardTopPelanggan: FC<CardTopPelangganProps> = ({
  nama,
  totalBelanja,
  totalTransaksi,
}) => {
  return (
    <div className=" w-full flex flex-col justify-start items-start gap-1 border-b border-base-content/10 py-2">
      {/* nama */}
      <div className="flex flex-row justify-between items-center w-full">
        <span className="text-xs font-medium text-base-content">{nama}</span>
      </div>

      <div className="w-full flex flex-row justify-between items-center gap-1">
        {/* total */}
        <span className="text-[0.625rem] font-medium text-base-content/60">
          {formatNumber(totalTransaksi)} Transaksi
        </span>

        <span className="text-xs font-medium text-base-content">
          {formatRupiah(totalBelanja)}
        </span>
      </div>
    </div>
  );
};

export default StatistikTransaksi;
