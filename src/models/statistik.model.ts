import type { PaymentMethodType } from "../types/constant.type";

// response riwayat transaksi
export interface ResponseRingkasanStatistikType {
  totalTransaksi: number;
  totalOmzet: number;
  totalRataRataTransaksi: number;
  totalModal: number;
  totalLaba: number;
  totalPiutang: number;
  totalProdukTerjual: number;
  totalItemTerjual: number;
  totalKerugian: number;
  totalBarangRusak: number;
  totalBarangHilang: number;
}

// response statistik with persentase
export interface ResponseStatistikWithPersentaseType {
  totalTransaksi: {
    total: number;
    persentase: number;
  };
  totalOmzet: {
    total: number;
    persentase: number;
  };
  totalRataRataTransaksi: {
    total: number;
    persentase: number;
  };
  totalModal: {
    total: number;
    persentase: number;
  };
  totalLaba: {
    total: number;
    persentase: number;
  };
  totalPiutang: {
    total: number;
    persentase: number;
  };
  totalProdukTerjual: {
    total: number;
    persentase: number;
  };
  totalItemTerjual: {
    total: number;
    persentase: number;
  };
  totalKerugian: {
    total: number;
    persentase: number;
  };
  totalBarangRusak: {
    total: number;
    persentase: number;
  };
  totalBarangHilang: {
    total: number;
    persentase: number;
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
