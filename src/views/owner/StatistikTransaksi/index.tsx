import {
  ArrowLeft,
  BanknoteArrowDown,
  ChartColumn,
  Clock3,
  FileText,
  Package,
  PackageMinus,
  PackageX,
  Receipt,
  Sheet,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

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
import listDateRangeLong from "../../../utils/listDateRangeLong";
import StatistikTopPelanggan from "../../../components/grafik/StatistikTopPelanggan";
import StatistikTopProduk from "../../../components/grafik/StatistikTopProduk";
import CardStatistik from "../../../components/ui/cards/CardStatistik";

const StatistikTransaksi = () => {
  const { windowSize, navigate, isLoading, statistik } =
    useStatistikTransaksi();

  return (
    <div className="w-full h-screen overflow-y-auto">
      <div className="w-full mb-30 md:mb-20 lg:mb-20 flex flex-col justify-start items-start gap-2 p-2">
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
              <RangeDate
                noLabel
                customWidth="w-50"
                listDate={listDateRangeLong}
              />
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
          <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2">
            <CardStatistik
              isLoading={isLoading}
              icon={{
                icon: Receipt,
                bgColor: "bg-blue-100",
                iconColor: "text-blue-400",
              }}
              label={windowSize === "sm" ? "Transaksi" : "Total Transaksi"}
              value={
                windowSize === "sm"
                  ? formatNumberK(statistik?.data?.totalTransaksi.total ?? 0)
                  : formatNumber(statistik?.data?.totalTransaksi.total ?? 0)
              }
              caption={
                windowSize !== "sm"
                  ? "Jumlah transaksi berdasarkan tanggal"
                  : undefined
              }
              detail={{
                ...(statistik?.data?.totalTransaksi?.trend === "down" && {
                  down: statistik?.data?.totalTransaksi?.persentase,
                }),
                ...(statistik?.data?.totalTransaksi?.trend === "up" && {
                  up: statistik?.data?.totalTransaksi?.persentase,
                }),
                ...(statistik?.data?.totalTransaksi?.trend === "same" && {
                  same: statistik?.data?.totalTransaksi?.persentase,
                }),
              }}
            />

            <CardStatistik
              isLoading={isLoading}
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
              detail={{
                ...(statistik?.data?.totalOmzet?.trend === "down" && {
                  down: statistik?.data?.totalOmzet?.persentase,
                }),
                ...(statistik?.data?.totalOmzet?.trend === "up" && {
                  up: statistik?.data?.totalOmzet?.persentase,
                }),
                ...(statistik?.data?.totalOmzet?.trend === "same" && {
                  same: statistik?.data?.totalOmzet?.persentase,
                }),
              }}
            />

            <CardStatistik
              isLoading={isLoading}
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
              detail={{
                ...(statistik?.data?.totalRataRataTransaksi?.trend ===
                  "down" && {
                  down: statistik?.data?.totalRataRataTransaksi?.persentase,
                }),
                ...(statistik?.data?.totalRataRataTransaksi?.trend === "up" && {
                  up: statistik?.data?.totalRataRataTransaksi?.persentase,
                }),
                ...(statistik?.data?.totalRataRataTransaksi?.trend ===
                  "same" && {
                  same: statistik?.data?.totalRataRataTransaksi?.persentase,
                }),
              }}
            />

            <CardStatistik
              isLoading={isLoading}
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
              detail={{
                ...(statistik?.data?.totalModal?.trend === "down" && {
                  down: statistik?.data?.totalModal?.persentase,
                }),
                ...(statistik?.data?.totalModal?.trend === "up" && {
                  up: statistik?.data?.totalModal?.persentase,
                }),
                ...(statistik?.data?.totalModal?.trend === "same" && {
                  same: statistik?.data?.totalModal?.persentase,
                }),
              }}
            />

            <CardStatistik
              isLoading={isLoading}
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
              detail={{
                ...(statistik?.data?.totalPiutang?.trend === "down" && {
                  down: statistik?.data?.totalPiutang?.persentase,
                }),
                ...(statistik?.data?.totalPiutang?.trend === "up" && {
                  up: statistik?.data?.totalPiutang?.persentase,
                }),
                ...(statistik?.data?.totalPiutang?.trend === "same" && {
                  same: statistik?.data?.totalPiutang?.persentase,
                }),
              }}
            />

            <CardStatistik
              isLoading={isLoading}
              icon={{
                icon: ShoppingBag,
                bgColor: "bg-purple-100",
                iconColor: "text-purple-400",
              }}
              label={windowSize === "sm" ? "Produk" : "Total Produk Terjual"}
              value={
                windowSize === "sm"
                  ? formatNumberK(
                      statistik?.data?.totalProdukTerjual.total ?? 0,
                    )
                  : formatNumber(statistik?.data?.totalProdukTerjual.total ?? 0)
              }
              caption={
                windowSize !== "sm" ? "Jumlah produk yang terjual" : undefined
              }
              detail={{
                ...(statistik?.data?.totalProdukTerjual?.trend === "down" && {
                  down: statistik?.data?.totalProdukTerjual?.persentase,
                }),
                ...(statistik?.data?.totalProdukTerjual?.trend === "up" && {
                  up: statistik?.data?.totalProdukTerjual?.persentase,
                }),
                ...(statistik?.data?.totalProdukTerjual?.trend === "same" && {
                  same: statistik?.data?.totalProdukTerjual?.persentase,
                }),
              }}
            />

            <CardStatistik
              isLoading={isLoading}
              icon={{
                icon: Package,
                bgColor: "bg-indigo-100",
                iconColor: "text-indigo-400",
              }}
              label={windowSize === "sm" ? "Item" : "Total Item Terjual"}
              value={
                windowSize === "sm"
                  ? formatNumberK(statistik?.data?.totalItemTerjual.total ?? 0)
                  : formatNumber(statistik?.data?.totalItemTerjual.total ?? 0)
              }
              caption={
                windowSize !== "sm" ? "Jumlah item yang terjual" : undefined
              }
              detail={{
                ...(statistik?.data?.totalItemTerjual?.trend === "down" && {
                  down: statistik?.data?.totalItemTerjual?.persentase,
                }),
                ...(statistik?.data?.totalItemTerjual?.trend === "up" && {
                  up: statistik?.data?.totalItemTerjual?.persentase,
                }),
                ...(statistik?.data?.totalItemTerjual?.trend === "same" && {
                  same: statistik?.data?.totalItemTerjual?.persentase,
                }),
              }}
            />

            <CardStatistik
              isLoading={isLoading}
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
              minus={(statistik?.data?.totalLaba?.total ?? 0) < 0}
              caption={
                windowSize !== "sm"
                  ? "Total keuntungan dari transaksi penjualan"
                  : undefined
              }
              withAlert={`Data Laba sudah dikurangi kerugian`}
              detail={{
                ...(statistik?.data?.totalLaba?.trend === "down" && {
                  down: statistik?.data?.totalLaba?.persentase,
                }),
                ...(statistik?.data?.totalLaba?.trend === "up" && {
                  up: statistik?.data?.totalLaba?.persentase,
                }),
                ...(statistik?.data?.totalLaba?.trend === "same" && {
                  same: statistik?.data?.totalLaba?.persentase,
                }),
              }}
            />

            <CardStatistik
              isLoading={isLoading}
              icon={{
                icon: TrendingDown,
                bgColor: "bg-rose-100",
                iconColor: "text-rose-400",
              }}
              label={windowSize === "sm" ? "Kerugian" : "Total Kerugian"}
              value={
                windowSize === "sm"
                  ? formatRupiahShort(statistik?.data?.totalKerugian.total ?? 0)
                  : formatRupiah(statistik?.data?.totalKerugian.total ?? 0)
              }
              caption={
                windowSize !== "sm"
                  ? "Total kerugian dari barang keluar"
                  : undefined
              }
              detail={{
                ...(statistik?.data?.totalKerugian?.trend === "down" && {
                  down: statistik?.data?.totalKerugian?.persentase,
                  reverseColor: true,
                }),
                ...(statistik?.data?.totalKerugian?.trend === "up" && {
                  up: statistik?.data?.totalKerugian?.persentase,
                  reverseColor: true,
                }),
                ...(statistik?.data?.totalKerugian?.trend === "same" && {
                  same: statistik?.data?.totalKerugian?.persentase,
                  reverseColor: true,
                }),
              }}
            />

            <CardStatistik
              isLoading={isLoading}
              icon={{
                icon: PackageX,
                bgColor: "bg-amber-100",
                iconColor: "text-amber-400",
              }}
              label={windowSize === "sm" ? "Rusak" : "Total Barang Rusak"}
              value={
                windowSize === "sm"
                  ? formatNumberK(statistik?.data?.totalBarangRusak.total ?? 0)
                  : formatNumber(statistik?.data?.totalBarangRusak.total ?? 0)
              }
              caption={windowSize !== "sm" ? "Total barang rusak" : undefined}
              detail={{
                ...(statistik?.data?.totalBarangRusak?.trend === "down" && {
                  down: statistik?.data?.totalBarangRusak?.persentase,
                  reverseColor: true,
                }),
                ...(statistik?.data?.totalBarangRusak?.trend === "up" && {
                  up: statistik?.data?.totalBarangRusak?.persentase,
                  reverseColor: true,
                }),
                ...(statistik?.data?.totalBarangRusak?.trend === "same" && {
                  same: statistik?.data?.totalBarangRusak?.persentase,
                  reverseColor: true,
                }),
              }}
            />

            <CardStatistik
              isLoading={isLoading}
              icon={{
                icon: PackageMinus,
                bgColor: "bg-amber-100",
                iconColor: "text-amber-400",
              }}
              label={windowSize === "sm" ? "Hilang" : "Total Barang Hilang"}
              value={
                windowSize === "sm"
                  ? formatNumberK(statistik?.data?.totalBarangHilang.total ?? 0)
                  : formatNumber(statistik?.data?.totalBarangHilang.total ?? 0)
              }
              caption={windowSize !== "sm" ? "Total barang hilang" : undefined}
              detail={{
                ...(statistik?.data?.totalBarangHilang?.trend === "down" && {
                  down: statistik?.data?.totalBarangHilang?.persentase,
                  reverseColor: true,
                }),
                ...(statistik?.data?.totalBarangHilang?.trend === "up" && {
                  up: statistik?.data?.totalBarangHilang?.persentase,
                  reverseColor: true,
                }),
                ...(statistik?.data?.totalBarangHilang?.trend === "same" && {
                  same: statistik?.data?.totalBarangHilang?.persentase,
                  reverseColor: true,
                }),
              }}
            />
          </div>
        </div>

        {/* grafik */}
        <div className="w-full gap-4 flex flex-col lg:flex-row justify-between items-start">
          <GrafikLine windowSize={windowSize} />

          {/* graifk  */}
          <GrafikBatang windowSize={windowSize} />
        </div>

        {/* grafik pie */}
        <div className="w-full gap-4 flex flex-col lg:flex-row justify-between items-start">
          <GrafikPieMetodePembayaran />

          <div className="lg:flex-1 w-full flex flex-col md:flex-row justify-between items-start gap-4 md:h-90 h-auto">
            <StatistikTopProduk />
            <StatistikTopPelanggan />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatistikTransaksi;
