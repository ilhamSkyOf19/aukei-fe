import {
  BanknoteArrowDown,
  CalendarClock,
  ChartColumn,
  Clock3,
  Package,
  PackageMinus,
  PackageX,
  Receipt,
  ReceiptText,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import type { ResponseStructure } from "../../../types/response.type";
import type { ResponseStatistikWithPersentaseType } from "../../../models/statistik.model";
import {
  formatNumber,
  formatNumberK,
  formatRupiah,
  formatRupiahShort,
} from "../../../helpers/helpers";

type KategoriStatistik = "penjualan" | "booking" | "barang";

type StatistikConfig = {
  key: string;
  category: KategoriStatistik;
  icon: {
    icon: LucideIcon; // sesuaikan import type-nya dari lucide-react
    bgColor: string;
    iconColor: string;
  };
  label: string;
  value: string;
  caption?: string;
  minus?: boolean;
  withAlert?: string;
  detail?: Record<string, any>;
};

const useDataStatistik = (params: {
  windowSize: string;
  statistik?: ResponseStructure<ResponseStatistikWithPersentaseType | null>;
}) => {
  const { windowSize, statistik } = params;
  const dataStatistik: StatistikConfig[] = [
    // ==== 💰 RINGKASAN PENJUALAN ====
    {
      key: "kasMasuk",
      category: "penjualan",
      icon: {
        icon: ReceiptText,
        bgColor: "bg-blue-100",
        iconColor: "text-blue-400",
      },
      label: windowSize === "sm" ? "Kas Masuk" : "Total Kas Masuk",
      value:
        windowSize === "sm"
          ? formatRupiahShort(statistik?.data?.totalKasMasuk.total ?? 0) || "0"
          : formatRupiah(statistik?.data?.totalKasMasuk.total ?? 0) || "0",
      caption: "Jumlah kas masuk berdasarkan tanggal",
      detail: {
        ...(statistik?.data?.totalKasMasuk?.trend === "down" && {
          down: statistik?.data?.totalKasMasuk?.persentase,
        }),
        ...(statistik?.data?.totalKasMasuk?.trend === "up" && {
          up: statistik?.data?.totalKasMasuk?.persentase,
        }),
        ...(statistik?.data?.totalKasMasuk?.trend === "same" && {
          same: statistik?.data?.totalKasMasuk?.persentase,
        }),
      },
    },

    {
      key: "totalRefund",
      category: "penjualan",
      icon: {
        icon: Undo2,
        bgColor: "bg-rose-100",
        iconColor: "text-rose-400",
      },
      label: windowSize === "sm" ? "Refund" : "Total Refund",
      value:
        windowSize === "sm"
          ? formatRupiahShort(statistik?.data?.totalRefund.total ?? 0) || "0"
          : formatRupiah(statistik?.data?.totalRefund.total ?? 0) || "0",
      caption: "Jumlah refund berdasarkan tanggal",
      detail: {
        ...(statistik?.data?.totalRefund?.trend === "down" && {
          down: statistik?.data?.totalRefund?.persentase,
        }),
        ...(statistik?.data?.totalRefund?.trend === "up" && {
          up: statistik?.data?.totalRefund?.persentase,
        }),
        ...(statistik?.data?.totalRefund?.trend === "same" && {
          same: statistik?.data?.totalRefund?.persentase,
        }),
      },
    },

    {
      key: "omzetSelesai",
      category: "penjualan",
      icon: {
        icon: BanknoteArrowDown,
        bgColor: "bg-emerald-100",
        iconColor: "text-emerald-400",
      },
      label: windowSize === "sm" ? "Omzet" : "Total Omzet Selesai",
      value:
        windowSize === "sm"
          ? formatRupiahShort(statistik?.data?.totalOmzetSelesai.total ?? 0)
          : formatRupiah(statistik?.data?.totalOmzetSelesai.total ?? 0),
      caption: "Total omzet dari transaksi yang sudah selesai",
      detail: {
        ...(statistik?.data?.totalOmzetSelesai?.trend === "down" && {
          down: statistik?.data?.totalOmzetSelesai?.persentase,
        }),
        ...(statistik?.data?.totalOmzetSelesai?.trend === "up" && {
          up: statistik?.data?.totalOmzetSelesai?.persentase,
        }),
        ...(statistik?.data?.totalOmzetSelesai?.trend === "same" && {
          same: statistik?.data?.totalOmzetSelesai?.persentase,
        }),
      },
    },
    {
      key: "labaSelesai",
      category: "penjualan",
      icon: {
        icon: TrendingUp,
        bgColor: "bg-emerald-100",
        iconColor: "text-emerald-400",
      },
      label: windowSize === "sm" ? "Laba" : "Total Laba Selesai",
      value:
        windowSize === "sm"
          ? formatRupiahShort(statistik?.data?.totalLabaSelesai.total ?? 0)
          : formatRupiah(statistik?.data?.totalLabaSelesai.total ?? 0),
      minus: (statistik?.data?.totalLabaSelesai?.total ?? 0) < 0,
      caption: "Total keuntungan dari transaksi yang sudah selesai",
      withAlert: "Data Laba sudah dikurangi kerugian",
      detail: {
        ...(statistik?.data?.totalLabaSelesai?.trend === "down" && {
          down: statistik?.data?.totalLabaSelesai?.persentase,
        }),
        ...(statistik?.data?.totalLabaSelesai?.trend === "up" && {
          up: statistik?.data?.totalLabaSelesai?.persentase,
        }),
        ...(statistik?.data?.totalLabaSelesai?.trend === "same" && {
          same: statistik?.data?.totalLabaSelesai?.persentase,
        }),
      },
    },
    {
      key: "transaksiSelesai",
      category: "penjualan",
      icon: {
        icon: Receipt,
        bgColor: "bg-blue-100",
        iconColor: "text-blue-400",
      },
      label: windowSize === "sm" ? "Transaksi" : "Total Transaksi Selesai",
      value:
        windowSize === "sm"
          ? formatNumberK(statistik?.data?.totalTransaksiSelesai.total ?? 0) ||
            "0"
          : formatNumber(statistik?.data?.totalTransaksiSelesai.total ?? 0) ||
            "0",
      caption: "Jumlah transaksi yang sudah selesai",
      detail: {
        ...(statistik?.data?.totalTransaksiSelesai?.trend === "down" && {
          down: statistik?.data?.totalTransaksiSelesai?.persentase,
        }),
        ...(statistik?.data?.totalTransaksiSelesai?.trend === "up" && {
          up: statistik?.data?.totalTransaksiSelesai?.persentase,
        }),
        ...(statistik?.data?.totalTransaksiSelesai?.trend === "same" && {
          same: statistik?.data?.totalTransaksiSelesai?.persentase,
        }),
      },
    },
    {
      key: "rataRataTransaksiSelesai",
      category: "penjualan",
      icon: {
        icon: ChartColumn,
        bgColor: "bg-emerald-100",
        iconColor: "text-emerald-400",
      },
      label: windowSize === "sm" ? "Rata-rata" : "Rata-rata Transaksi Selesai",
      value:
        windowSize === "sm"
          ? formatRupiahShort(
              statistik?.data?.rataRataTransaksiSelesai.total ?? 0,
            )
          : formatRupiah(statistik?.data?.rataRataTransaksiSelesai.total ?? 0),
      caption: "Rata-rata nilai transaksi yang sudah selesai",
      detail: {
        ...(statistik?.data?.rataRataTransaksiSelesai?.trend === "down" && {
          down: statistik?.data?.rataRataTransaksiSelesai?.persentase,
        }),
        ...(statistik?.data?.rataRataTransaksiSelesai?.trend === "up" && {
          up: statistik?.data?.rataRataTransaksiSelesai?.persentase,
        }),
        ...(statistik?.data?.rataRataTransaksiSelesai?.trend === "same" && {
          same: statistik?.data?.rataRataTransaksiSelesai?.persentase,
        }),
      },
    },
    {
      key: "modalSelesai",
      category: "penjualan",
      icon: {
        icon: Package,
        bgColor: "bg-amber-100",
        iconColor: "text-amber-400",
      },
      label: windowSize === "sm" ? "Modal" : "Total Modal Selesai",
      value:
        windowSize === "sm"
          ? formatRupiahShort(statistik?.data?.totalModalSelesai.total ?? 0)
          : formatRupiah(statistik?.data?.totalModalSelesai.total ?? 0),
      caption: "Total biaya modal untuk transaksi selesai",
      detail: {
        ...(statistik?.data?.totalModalSelesai?.trend === "down" && {
          down: statistik?.data?.totalModalSelesai?.persentase,
        }),
        ...(statistik?.data?.totalModalSelesai?.trend === "up" && {
          up: statistik?.data?.totalModalSelesai?.persentase,
        }),
        ...(statistik?.data?.totalModalSelesai?.trend === "same" && {
          same: statistik?.data?.totalModalSelesai?.persentase,
        }),
      },
    },

    // ==== ⚠ PERLU PERHATIAN ====
    {
      key: "piutang",
      category: "penjualan",
      icon: {
        icon: Clock3,
        bgColor: "bg-amber-100",
        iconColor: "text-amber-400",
      },
      label: windowSize === "sm" ? "Piutang" : "Total Piutang",
      value:
        windowSize === "sm"
          ? formatRupiahShort(statistik?.data?.totalPiutang.total ?? 0)
          : formatRupiah(statistik?.data?.totalPiutang.total ?? 0),
      caption: "Total nilai piutang yang belum dibayar",
    },
    {
      key: "bookingAktif",
      category: "booking",
      icon: {
        icon: CalendarClock,
        bgColor: "bg-blue-100",
        iconColor: "text-blue-400",
      },
      label: windowSize === "sm" ? "Booking" : "Booking Aktif",
      value:
        windowSize === "sm"
          ? formatNumberK(statistik?.data?.totalBookingAktif.total ?? 0) || "0"
          : formatNumber(statistik?.data?.totalBookingAktif.total ?? 0) || "0",
      caption: "Jumlah transaksi booking yang masih aktif",
    },
    {
      key: "kerugian",
      category: "penjualan",
      icon: {
        icon: TrendingDown,
        bgColor: "bg-amber-100",
        iconColor: "text-amber-400",
      },
      label: windowSize === "sm" ? "Kerugian" : "Total Kerugian",
      value:
        windowSize === "sm"
          ? formatRupiahShort(statistik?.data?.totalKerugian.total ?? 0)
          : formatRupiah(statistik?.data?.totalKerugian.total ?? 0),
      caption: "Total kerugian dari barang keluar",
      detail: {
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
      },
    },

    // ==== 📅 BOOKING ====
    {
      key: "potensiOmzetBooking",
      category: "booking",
      icon: {
        icon: BanknoteArrowDown,
        bgColor: "bg-emerald-100",
        iconColor: "text-emerald-400",
      },
      label: windowSize === "sm" ? "Potensi Omzet" : "Potensi Omzet Booking",
      value:
        windowSize === "sm"
          ? formatRupiahShort(
              statistik?.data?.totalPotensiOmzetBooking.total ?? 0,
            )
          : formatRupiah(statistik?.data?.totalPotensiOmzetBooking.total ?? 0),
      caption: "Potensi omzet dari seluruh booking",
    },
    {
      key: "sisaTagihanBooking",
      category: "booking",
      icon: {
        icon: Clock3,
        bgColor: "bg-amber-100",
        iconColor: "text-amber-400",
      },
      label: windowSize === "sm" ? "Sisa Tagihan" : "Sisa Tagihan Booking",
      value:
        windowSize === "sm"
          ? formatRupiahShort(
              statistik?.data?.totalSisaTagihanBooking.total ?? 0,
            )
          : formatRupiah(statistik?.data?.totalSisaTagihanBooking.total ?? 0),
      caption: "Total sisa tagihan booking yang belum dibayar",
    },

    // ==== 📦 INVENTORI ====
    {
      key: "itemTerjual",
      category: "barang",
      icon: {
        icon: Package,
        bgColor: "bg-purple-100",
        iconColor: "text-purple-400",
      },
      label: windowSize === "sm" ? "Item" : "Total Item Terjual",
      value:
        windowSize === "sm"
          ? formatNumberK(statistik?.data?.totalItemTerjual.total ?? 0)
          : formatNumber(statistik?.data?.totalItemTerjual.total ?? 0),
      caption: "Total item yang berhasil terjual",
    },

    // ==== SISANYA (tidak disebutkan di list, tetap disimpan di akhir) ====
    {
      key: "produkTerjual",
      category: "barang",
      icon: {
        icon: ShoppingBag,
        bgColor: "bg-purple-100",
        iconColor: "text-purple-400",
      },
      label: windowSize === "sm" ? "Produk" : "Total Produk Terjual",
      value:
        windowSize === "sm"
          ? formatNumberK(statistik?.data?.totalProdukTerjual.total ?? 0)
          : formatNumber(statistik?.data?.totalProdukTerjual.total ?? 0),
      caption: "Jumlah produk unik yang berhasil terjual",
    },
    {
      key: "barangRusak",
      category: "barang",
      icon: {
        icon: PackageX,
        bgColor: "bg-amber-100",
        iconColor: "text-amber-400",
      },
      label: windowSize === "sm" ? "Rusak" : "Total Barang Rusak",
      value:
        windowSize === "sm"
          ? formatNumberK(statistik?.data?.totalBarangRusak.total ?? 0)
          : formatNumber(statistik?.data?.totalBarangRusak.total ?? 0),
      caption: "Total barang rusak",
    },
    {
      key: "barangHilang",
      category: "barang",
      icon: {
        icon: PackageMinus,
        bgColor: "bg-amber-100",
        iconColor: "text-amber-400",
      },
      label: windowSize === "sm" ? "Hilang" : "Total Barang Hilang",
      value:
        windowSize === "sm"
          ? formatNumberK(statistik?.data?.totalBarangHilang.total ?? 0)
          : formatNumber(statistik?.data?.totalBarangHilang.total ?? 0),
      caption: "Total barang hilang",
    },
    {
      key: "dpBooking",
      category: "booking",
      icon: {
        icon: Receipt,
        bgColor: "bg-blue-100",
        iconColor: "text-blue-400",
      },
      label: windowSize === "sm" ? "DP Booking" : "Total DP Booking",
      value:
        windowSize === "sm"
          ? formatRupiahShort(statistik?.data?.totalDpBooking.total ?? 0)
          : formatRupiah(statistik?.data?.totalDpBooking.total ?? 0),
      caption: "Total DP yang sudah diterima dari booking",
    },
    {
      key: "produkBooking",
      category: "booking",
      icon: {
        icon: ShoppingBag,
        bgColor: "bg-purple-100",
        iconColor: "text-purple-400",
      },
      label: windowSize === "sm" ? "Produk" : "Produk pada Booking",
      value:
        windowSize === "sm"
          ? formatNumberK(statistik?.data?.totalProdukBooking.total ?? 0)
          : formatNumber(statistik?.data?.totalProdukBooking.total ?? 0),
      caption: "Jumlah produk unik pada booking",
    },
    {
      key: "itemBooking",
      category: "booking",
      icon: {
        icon: Package,
        bgColor: "bg-purple-100",
        iconColor: "text-purple-400",
      },
      label: windowSize === "sm" ? "Item" : "Item pada Booking",
      value:
        windowSize === "sm"
          ? formatNumberK(statistik?.data?.totalItemBooking.total ?? 0)
          : formatNumber(statistik?.data?.totalItemBooking.total ?? 0),
      caption: "Jumlah item pada booking",
    },
  ];
  return { dataStatistik };
};

export default useDataStatistik;
