import type { PaymentMethodType } from "../types/constant.type";

// response riwayat transaksi
export interface ResponseRingkasanStatistikType {
  totalTransaksi: number;
  totalOmzet: number;
  totalRataRataTransaksi: number;
  totalModal: number;
  totalLaba: number;
  totalPiutang?: number;
  totalProdukTerjual: number;
  totalItemTerjual: number;
}

// response statistik with persentase
export interface ResponseStatistikWithPersentaseType {
  totalTransaksi: {
    total: number;
    persentase: number;
    trend: "up" | "down" | "same";
  };
  totalOmzet: {
    total: number;
    persentase: number;
    trend: "up" | "down" | "same";
  };
  totalRataRataTransaksi: {
    total: number;
    persentase: number;
    trend: "up" | "down" | "same";
  };
  totalModal: {
    total: number;
    persentase: number;
    trend: "up" | "down" | "same";
  };
  totalLaba: {
    total: number;
    persentase: number;
    trend: "up" | "down" | "same";
  };
  totalPiutang: {
    total: number;
    persentase: number;
    trend: "up" | "down" | "same";
  };
  totalProdukTerjual: {
    total: number;
    persentase: number;
    trend: "up" | "down" | "same";
  };
  totalItemTerjual: {
    total: number;
    persentase: number;
    trend: "up" | "down" | "same";
  };
  totalKerugian: {
    total: number;
    persentase: number;
    trend: "up" | "down" | "same";
  };
  totalBarangRusak: {
    total: number;
    persentase: number;
    trend: "up" | "down" | "same";
  };
  totalBarangHilang: {
    total: number;
    persentase: number;
    trend: "up" | "down" | "same";
  };
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

export interface ResponseStatistikTopPelangganType {
  id: number;
  nama: string;
  totalTransaksi: number;
  totalBelanja: number;
}

// statistik top produk
export interface ResponseStatistikTopProdukType {
  id: number;
  nama: string;
  kode: string;
  totalTerjual: number;
  totalOmzet: number;
  value: number;
}
