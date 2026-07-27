import {
  BanknoteArrowDown,
  CalendarClock,
  ChartColumn,
  Clock3,
  Package,
  PackageMinus,
  PackageX,
  Receipt,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
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

type KategoriStatistik = "keuangan" | "booking" | "barang";

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
  detail: Record<string, any>;
};

const useDataStatistik = (params: {
  windowSize: string;
  statistik?: ResponseStructure<ResponseStatistikWithPersentaseType | null>;
}) => {
  const { windowSize, statistik } = params;
  const dataStatistik: StatistikConfig[] = [
    // ==== KEUANGAN ====
    {
      key: "kasMasuk",
      category: "keuangan",
      icon: {
        icon: Receipt,
        bgColor: "bg-blue-100",
        iconColor: "text-blue-400",
      },
      label: windowSize === "sm" ? "Kas Masuk" : "Total Kas Masuk",
      value:
        windowSize === "sm"
          ? formatNumberK(statistik?.data?.totalKasMasuk.total ?? 0) || "0"
          : formatNumber(statistik?.data?.totalKasMasuk.total ?? 0) || "0",
      caption:
        windowSize !== "sm"
          ? "Jumlah kas masuk berdasarkan tanggal"
          : undefined,
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
      key: "transaksiSelesai",
      category: "keuangan",
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
      caption:
        windowSize !== "sm" ? "Jumlah transaksi yang sudah selesai" : undefined,
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
      key: "omzetSelesai",
      category: "keuangan",
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
      caption:
        windowSize !== "sm"
          ? "Total omzet dari transaksi yang sudah selesai"
          : undefined,
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
      key: "rataRataTransaksiSelesai",
      category: "keuangan",
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
      caption:
        windowSize !== "sm"
          ? "Rata-rata nilai transaksi yang sudah selesai"
          : undefined,
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
      category: "keuangan",
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
      caption:
        windowSize !== "sm"
          ? "Total biaya modal untuk transaksi selesai"
          : undefined,
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
    {
      key: "piutang",
      category: "keuangan",
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
      caption:
        windowSize !== "sm"
          ? "Total nilai piutang yang belum dibayar"
          : undefined,
      detail: {
        ...(statistik?.data?.totalPiutang?.trend === "down" && {
          down: statistik?.data?.totalPiutang?.persentase,
        }),
        ...(statistik?.data?.totalPiutang?.trend === "up" && {
          up: statistik?.data?.totalPiutang?.persentase,
        }),
        ...(statistik?.data?.totalPiutang?.trend === "same" && {
          same: statistik?.data?.totalPiutang?.persentase,
        }),
      },
    },
    {
      key: "labaSelesai",
      category: "keuangan",
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
      caption:
        windowSize !== "sm"
          ? "Total keuntungan dari transaksi yang sudah selesai"
          : undefined,
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
      key: "kerugian",
      category: "keuangan",
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
      caption:
        windowSize !== "sm" ? "Total kerugian dari barang keluar" : undefined,
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

    // ==== BARANG ====
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
      caption:
        windowSize !== "sm"
          ? "Jumlah produk unik yang berhasil terjual"
          : undefined,
      detail: {
        ...(statistik?.data?.totalProdukTerjual?.trend === "down" && {
          down: statistik?.data?.totalProdukTerjual?.persentase,
        }),
        ...(statistik?.data?.totalProdukTerjual?.trend === "up" && {
          up: statistik?.data?.totalProdukTerjual?.persentase,
        }),
        ...(statistik?.data?.totalProdukTerjual?.trend === "same" && {
          same: statistik?.data?.totalProdukTerjual?.persentase,
        }),
      },
    },
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
      caption:
        windowSize !== "sm" ? "Total item yang berhasil terjual" : undefined,
      detail: {
        ...(statistik?.data?.totalItemTerjual?.trend === "down" && {
          down: statistik?.data?.totalItemTerjual?.persentase,
        }),
        ...(statistik?.data?.totalItemTerjual?.trend === "up" && {
          up: statistik?.data?.totalItemTerjual?.persentase,
        }),
        ...(statistik?.data?.totalItemTerjual?.trend === "same" && {
          same: statistik?.data?.totalItemTerjual?.persentase,
        }),
      },
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
      caption: windowSize !== "sm" ? "Total barang rusak" : undefined,
      detail: {
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
      },
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
      caption: windowSize !== "sm" ? "Total barang hilang" : undefined,
      detail: {
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
      },
    },

    // ==== BOOKING ====
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
      caption:
        windowSize !== "sm"
          ? "Jumlah transaksi booking yang masih aktif"
          : undefined,
      detail: {
        ...(statistik?.data?.totalBookingAktif?.trend === "down" && {
          down: statistik?.data?.totalBookingAktif?.persentase,
        }),
        ...(statistik?.data?.totalBookingAktif?.trend === "up" && {
          up: statistik?.data?.totalBookingAktif?.persentase,
        }),
        ...(statistik?.data?.totalBookingAktif?.trend === "same" && {
          same: statistik?.data?.totalBookingAktif?.persentase,
        }),
      },
    },
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
      caption:
        windowSize !== "sm" ? "Potensi omzet dari seluruh booking" : undefined,
      detail: {
        ...(statistik?.data?.totalPotensiOmzetBooking?.trend === "down" && {
          down: statistik?.data?.totalPotensiOmzetBooking?.persentase,
        }),
        ...(statistik?.data?.totalPotensiOmzetBooking?.trend === "up" && {
          up: statistik?.data?.totalPotensiOmzetBooking?.persentase,
        }),
        ...(statistik?.data?.totalPotensiOmzetBooking?.trend === "same" && {
          same: statistik?.data?.totalPotensiOmzetBooking?.persentase,
        }),
      },
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
      caption:
        windowSize !== "sm"
          ? "Total DP yang sudah diterima dari booking"
          : undefined,
      detail: {
        ...(statistik?.data?.totalDpBooking?.trend === "down" && {
          down: statistik?.data?.totalDpBooking?.persentase,
        }),
        ...(statistik?.data?.totalDpBooking?.trend === "up" && {
          up: statistik?.data?.totalDpBooking?.persentase,
        }),
        ...(statistik?.data?.totalDpBooking?.trend === "same" && {
          same: statistik?.data?.totalDpBooking?.persentase,
        }),
      },
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
      caption:
        windowSize !== "sm"
          ? "Total sisa tagihan booking yang belum dibayar"
          : undefined,
      detail: {
        ...(statistik?.data?.totalSisaTagihanBooking?.trend === "down" && {
          down: statistik?.data?.totalSisaTagihanBooking?.persentase,
          reverseColor: true,
        }),
        ...(statistik?.data?.totalSisaTagihanBooking?.trend === "up" && {
          up: statistik?.data?.totalSisaTagihanBooking?.persentase,
          reverseColor: true,
        }),
        ...(statistik?.data?.totalSisaTagihanBooking?.trend === "same" && {
          same: statistik?.data?.totalSisaTagihanBooking?.persentase,
          reverseColor: true,
        }),
      },
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
      caption:
        windowSize !== "sm" ? "Jumlah produk unik pada booking" : undefined,
      detail: {
        ...(statistik?.data?.totalProdukBooking?.trend === "down" && {
          down: statistik?.data?.totalProdukBooking?.persentase,
        }),
        ...(statistik?.data?.totalProdukBooking?.trend === "up" && {
          up: statistik?.data?.totalProdukBooking?.persentase,
        }),
        ...(statistik?.data?.totalProdukBooking?.trend === "same" && {
          same: statistik?.data?.totalProdukBooking?.persentase,
        }),
      },
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
      caption: windowSize !== "sm" ? "Jumlah item pada booking" : undefined,
      detail: {
        ...(statistik?.data?.totalItemBooking?.trend === "down" && {
          down: statistik?.data?.totalItemBooking?.persentase,
        }),
        ...(statistik?.data?.totalItemBooking?.trend === "up" && {
          up: statistik?.data?.totalItemBooking?.persentase,
        }),
        ...(statistik?.data?.totalItemBooking?.trend === "same" && {
          same: statistik?.data?.totalItemBooking?.persentase,
        }),
      },
    },
  ];

  return { dataStatistik };
};

export default useDataStatistik;
