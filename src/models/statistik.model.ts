import type { MetaType, PaymentMethodType } from "../types/constant.type";

// response riwayat transaksi
export interface ResponseRingkasanStatistikType {
  totalTransaksi: number;
  totalOmzet: number;
  totalRataRataTransaksi: number;
  totalModal: number;
  totalLaba: number;
  totalPiutangTempo?: number;
  totalProdukTerjual: number;
  totalItemTerjual: number;
  totalTransaksiBooking: number;
  totalNilaiBooking: number;
  totalBookingTerbayar: number;
  totalBookingBelumTerbayar: number;
  totalUangDiterima: number;
  totalUangKembalian: number;
  totalKasMasuk: number;
  totalPiutangKasMasuk: number;
}

export interface StatistikTrendType {
  total: number;
  persentase: number;
  trend: "up" | "down" | "same";
}

// response statistik with persentase
export interface ResponseStatistikWithPersentaseType {
  // ===========================
  // KEUANGAN (REALISASI)
  // ===========================

  /** Seluruh uang yang benar-benar diterima */
  totalKasMasuk: StatistikTrendType;

  /** Jumlah transaksi yang sudah selesai */
  totalTransaksiSelesai: StatistikTrendType;

  /** Omzet dari transaksi selesai */
  totalOmzetSelesai: StatistikTrendType;

  /** Nilai rata-rata transaksi selesai */
  rataRataTransaksiSelesai: StatistikTrendType;

  /** Total biaya modal transaksi selesai */
  totalModalSelesai: StatistikTrendType;

  /** Total laba transaksi selesai */
  totalLabaSelesai: StatistikTrendType;

  /** Total piutang yang belum lunas */
  totalPiutang: StatistikTrendType;

  // ===========================
  // PENJUALAN
  // ===========================

  /** Jumlah produk unik yang berhasil terjual */
  totalProdukTerjual: StatistikTrendType;

  /** Total item yang berhasil terjual */
  totalItemTerjual: StatistikTrendType;

  // ===========================
  // BOOKING
  // ===========================

  /** Jumlah transaksi booking yang masih aktif */
  totalBookingAktif: StatistikTrendType;

  /** Potensi omzet seluruh booking */
  totalPotensiOmzetBooking: StatistikTrendType;

  /** Total DP yang sudah diterima */
  totalDpBooking: StatistikTrendType;

  /** Total sisa tagihan booking */
  totalSisaTagihanBooking: StatistikTrendType;

  /** Jumlah produk unik pada booking */
  totalProdukBooking: StatistikTrendType;

  /** Total item pada booking */
  totalItemBooking: StatistikTrendType;

  // ===========================
  // INVENTORI
  // ===========================

  /** Total kerugian */
  totalKerugian: StatistikTrendType;

  /** Total barang rusak */
  totalBarangRusak: StatistikTrendType;

  /** Total barang hilang */
  totalBarangHilang: StatistikTrendType;
}

export interface ResponseChartType {
  date: string;
  value: number;
}

export interface ResponseChartMetodePembayaranType {
  label: PaymentMethodType;
  value: number;
  persentase: number;
}

export interface StatistikTopPelangganType {
  id: number;
  nama: string;
  noWa: string;
  isActive: boolean;
  totalTransaksi: number;
  totalNilaiTransaksi: number;
  rankTransaksi: number | null;
  rankNilaiTransaksi: number | null;
}

export interface ResponseStatistikTopPelangganWithMetaType {
  data: StatistikTopPelangganType[];
  meta: MetaType;
}

export interface DataStatistikTopProdukType {
  id: number;
  nama: string;
  kode: string;
  totalTerjual: number;
  totalOmzet: number;
  value: number;
  kategori: string;
  rankQty: number | null;
  rankOmzet: number | null;
  rankKategori: number | null;
  img: string;
}

// statistik top produk
export interface ResponseStatistikTopProdukWithMetaType {
  data: DataStatistikTopProdukType[];
  meta: MetaType;
}

// statistik kebutuha barang
export interface ResponseStatistikKebutuhanBarangBookingType {
  totalProdukBooking: number;
  totalItemBooking: number;
  totalProdukPerluRestock: number;
  totalKebutuhanStok: number;
}

export interface ResponseStatistikPantauanStokType {
  produkRestock: number;
  totalItemRestock: number;
}
