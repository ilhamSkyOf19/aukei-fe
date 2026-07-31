import instanceAxios from "../libs/axios";
import type { PaginationType } from "../models/pagination.model";
import type {
  ResponseStatistikWithPersentaseType,
  ResponseChartType,
  ResponseRingkasanStatistikType,
  ResponseChartMetodePembayaranType,
  ResponseStatistikKebutuhanBarangBookingType,
  ResponseStatistikPantauanStokType,
  ResponseStatistikTopProdukWithMetaType,
  ResponseStatistikTopPelangganWithMetaType,
} from "../models/statistik.model";
import type {
  QueryRiwayatTransactionType,
  ResponseStatistikBookingType,
  ResponseStatistikKebutuhanBarangWithMetaType,
} from "../models/transaction.model";
import type { ResponseStructure } from "../types/response.type";

export class StatistikServices {
  // ringkasan riwayat
  static async ringkasanStatistik(
    query: QueryRiwayatTransactionType,
  ): Promise<ResponseStructure<ResponseRingkasanStatistikType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseRingkasanStatistikType | null>
    >("/statistik/ringkasan", {
      params: query,
    });

    return result.data;
  }

  // find statistik with persentase
  static async findStatistikWithPersentase(query: {
    startDate?: string;
    endDate?: string;
  }): Promise<ResponseStructure<ResponseStatistikWithPersentaseType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStatistikWithPersentaseType | null>
    >("/statistik/statistik", { params: query });

    return result.data;
  }

  // get chart omzet
  static async chartOmzet(query: {
    startDate?: string;
    endDate?: string;
  }): Promise<ResponseStructure<ResponseChartType[] | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseChartType[] | null>
    >("/statistik/chart-omzet", { params: query });

    return result.data;
  }

  // get chart modal
  static async chartModal(query: {
    startDate?: string;
    endDate?: string;
  }): Promise<ResponseStructure<ResponseChartType[] | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseChartType[] | null>
    >("/statistik/chart-modal", { params: query });

    return result.data;
  }

  // get chart kas masuk
  static async chartKasMasuk(query: {
    startDate?: string;
    endDate?: string;
  }): Promise<ResponseStructure<ResponseChartType[] | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseChartType[] | null>
    >("/statistik/chart-kas-masuk", { params: query });

    return result.data;
  }

  // get chart  kerugian
  static async chartKerugian(query: {
    startDate?: string;
    endDate?: string;
  }): Promise<ResponseStructure<ResponseChartType[] | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseChartType[] | null>
    >("/statistik/chart-kerugian", { params: query });

    return result.data;
  }

  // get chart laba
  static async chartLaba(query: {
    startDate?: string;
    endDate?: string;
  }): Promise<ResponseStructure<ResponseChartType[] | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseChartType[] | null>
    >("/statistik/chart-laba", { params: query });

    return result.data;
  }

  // get chart produk
  static async chartProduk(query: {
    startDate?: string;
    endDate?: string;
  }): Promise<ResponseStructure<ResponseChartType[] | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseChartType[] | null>
    >("/statistik/chart-produk", { params: query });

    return result.data;
  }

  // get chart barang rusak
  static async chartBarangRusak(query: {
    startDate?: string;
    endDate?: string;
  }): Promise<ResponseStructure<ResponseChartType[] | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseChartType[] | null>
    >("/statistik/chart-barang-rusak", { params: query });

    return result.data;
  }

  // get chart barang hilang
  static async chartBarangHilang(query: {
    startDate?: string;
    endDate?: string;
  }): Promise<ResponseStructure<ResponseChartType[] | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseChartType[] | null>
    >("/statistik/chart-barang-hilang", { params: query });

    return result.data;
  }

  // get chart item
  static async chartItem(query: {
    startDate?: string;
    endDate?: string;
  }): Promise<ResponseStructure<ResponseChartType[] | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseChartType[] | null>
    >("/statistik/chart-item", { params: query });

    return result.data;
  }

  // get chart metode pembayaran
  static async chartMetodePembayaran(query: {
    startDate?: string;
    endDate?: string;
  }): Promise<ResponseStructure<ResponseChartMetodePembayaranType[] | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseChartMetodePembayaranType[] | null>
    >("/statistik/chart-metode-pembayaran", { params: query });

    return result.data;
  }

  // top pelanggan
  static async statistikTopPelanggan(
    query: Pick<PaginationType, "page" | "search" | "limit"> & {
      sortTotalTransaksi?: string;
      sortTotalNilaiTransaksi?: string;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<
    ResponseStructure<ResponseStatistikTopPelangganWithMetaType | null>
  > {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStatistikTopPelangganWithMetaType | null>
    >("/statistik/top-pelanggan", { params: query });

    return result.data;
  }

  // top produk
  static async statistikTopProduk(
    query: Pick<PaginationType, "page" | "search" | "limit"> & {
      sortQty?: string;
      sortOmzet?: string;
      kategori?: string;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<ResponseStructure<ResponseStatistikTopProdukWithMetaType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStatistikTopProdukWithMetaType | null>
    >("/statistik/top-produk", { params: query });

    return result.data;
  }

  // kebutuhan barang
  static async kebutuhanBarangBooking(
    query: PaginationType & { kategori?: string },
  ): Promise<
    ResponseStructure<ResponseStatistikKebutuhanBarangWithMetaType | null>
  > {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStatistikKebutuhanBarangWithMetaType | null>
    >("/statistik/kebutuhan-barang-booking", { params: query });

    return result.data;
  }

  //  statistik kebutuhan barang booking
  static async statistikKebutuhanBarangBooking(query: {
    kategori?: string;
  }): Promise<
    ResponseStructure<ResponseStatistikKebutuhanBarangBookingType | null>
  > {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStatistikKebutuhanBarangBookingType | null>
    >("/statistik/statistik-kebutuhan-barang-booking", { params: query });

    return result.data;
  }

  // sttaistik pantauan stok
  static async statistikPantauanStok(query: {
    kategori?: string;
  }): Promise<ResponseStructure<ResponseStatistikPantauanStokType | null>> {
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStatistikPantauanStokType | null>
    >("/statistik/statistik-pantauan-stok", { params: query });

    return result.data;
  }
}
