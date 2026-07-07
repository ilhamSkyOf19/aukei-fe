import instanceAxios from "../libs/axios";
import type {
  ResponseStatistikWithPersentaseType,
  ResponseChartType,
  ResponseRingkasanStatistikType,
  ResponseChartMetodePembayaranType,
  ResponseStatistikTopPelangganType,
  ResponseStatistikTopProdukType,
} from "../models/statistik.model";
import type { QueryRiwayatTransactionType } from "../models/transaction.model";
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
  static async statistikTopPelanggan(query: {
    startDate?: string;
    endDate?: string;
  }): Promise<ResponseStructure<ResponseStatistikTopPelangganType[] | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStatistikTopPelangganType[] | null>
    >("/statistik/top-pelanggan", { params: query });

    return result.data;
  }

  // top produk
  static async statistikTopProduk(query: {
    startDate?: string;
    endDate?: string;
  }): Promise<ResponseStructure<ResponseStatistikTopProdukType[] | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStatistikTopProdukType[] | null>
    >("/statistik/top-produk", { params: query });

    return result.data;
  }
}
