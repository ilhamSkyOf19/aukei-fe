import instanceAxios from "../libs/axios";
import type { PaginationType } from "../models/pagination.model";
import type {
  ResponseChartType,
  ResponseDaftarLaporanProdukByKategoriType,
  ResponseLaporanProdukByKategoriType,
  ResponseStatistikTopPelangganWithMetaType,
  ResponseStatistikTopProdukWithMetaType,
  ResponseStatistikWithPersentaseType,
} from "../models/statistik.model";
import type { ResponseStatistikTempo } from "../models/tempo.model";
import type { ResponseStructure } from "../types/response.type";

export class ShadowStatistikServices {
  // statistik
  static async shadowStatistikTempo(params: {
    shadowId: number;
  }): Promise<ResponseStructure<ResponseStatistikTempo | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStatistikTempo | null>
    >(`/shadow-statistik/tempo/shadow/${params.shadowId}`);

    return result.data;
  }

  static async findShadowStatistikWithPersentase(params: {
    shadowId: number;
    query: {
      startDate?: string;
      endDate?: string;
    };
  }): Promise<ResponseStructure<ResponseStatistikWithPersentaseType | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStatistikWithPersentaseType | null>
    >(`/shadow-statistik/statistik/shadow/${params.shadowId}`, {
      params: params.query,
    });

    return result.data;
  }

  // chart omzet
  static async chartShadowOmzet(params: {
    shadowId: number;
    query: {
      startDate?: string;
      endDate?: string;
    };
  }): Promise<ResponseStructure<ResponseChartType[] | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseChartType[] | null>
    >(`/shadow-statistik/chart-omzet/shadow/${params.shadowId}`, {
      params: params.query,
    });

    return result.data;
  }

  // chart kas masuk
  static async chartShadowKasMasuk(params: {
    shadowId: number;
    query: {
      startDate?: string;
      endDate?: string;
    };
  }): Promise<ResponseStructure<ResponseChartType[] | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseChartType[] | null>
    >(`/shadow-statistik/chart-kas-masuk/shadow/${params.shadowId}`, {
      params: params.query,
    });

    return result.data;
  }

  // chart laba
  static async chartShadowLaba(params: {
    shadowId: number;
    query: {
      startDate?: string;
      endDate?: string;
    };
  }): Promise<ResponseStructure<ResponseChartType[] | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseChartType[] | null>
    >(`/shadow-statistik/chart-laba/shadow/${params.shadowId}`, {
      params: params.query,
    });

    return result.data;
  }

  // chart modal
  static async chartShadowModal(params: {
    shadowId: number;
    query: {
      startDate?: string;
      endDate?: string;
    };
  }): Promise<ResponseStructure<ResponseChartType[] | null>> {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseChartType[] | null>
    >(`/shadow-statistik/chart-modal/shadow/${params.shadowId}`, {
      params: params.query,
    });

    return result.data;
  }

  // top pelanggan
  static async statistikShadowTopPelanggan(params: {
    shadowId: number;
    query: Pick<PaginationType, "page" | "search" | "limit"> & {
      sortTotalTransaksi?: string;
      sortTotalNilaiTransaksi?: string;
      startDate?: string;
      endDate?: string;
    };
  }): Promise<
    ResponseStructure<ResponseStatistikTopPelangganWithMetaType | null>
  > {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStatistikTopPelangganWithMetaType | null>
    >(`/shadow-statistik/top-pelanggan/shadow/${params.shadowId}`, {
      params: params.query,
    });

    return result.data;
  }

  // top produk
  static async statistikShadowTopProduk(params: {
    shadowId: number;
    query: Pick<PaginationType, "page" | "search" | "limit"> & {
      sortQty?: string;
      sortOmzet?: string;
      kategori?: string;
      startDate?: string;
      endDate?: string;
    };
  }): Promise<
    ResponseStructure<ResponseStatistikTopProdukWithMetaType | null>
  > {
    // call api
    const result = await instanceAxios.get<
      ResponseStructure<ResponseStatistikTopProdukWithMetaType | null>
    >(`/shadow-statistik/top-produk/shadow/${params.shadowId}`, {
      params: params.query,
    });

    return result.data;
  }

  // laporan penjualan produk
  static async laporanShadowPenjualanProduk(params: {
    shadowId: number;
    query: {
      startDate?: string;
      endDate?: string;
      sortOmzet?: string;
      sortLaba?: string;
      sortQty?: string;
    };
  }): Promise<ResponseStructure<ResponseLaporanProdukByKategoriType | null>> {
    const result = await instanceAxios.get<
      ResponseStructure<ResponseLaporanProdukByKategoriType | null>
    >(`/shadow-statistik/laporan-penjualan-produk/shadow/${params.shadowId}`, {
      params: params.query,
    });

    return result.data;
  }

  // by kategori
  static async laporanShadowPenjualanProdukByKategori(params: {
    shadowId: number;
    kategoriId: number;
    query: {
      startDate?: string;
      endDate?: string;
      sortOmzet?: string;
      sortLaba?: string;
      sortQty?: string;
    };
  }): Promise<
    ResponseStructure<ResponseDaftarLaporanProdukByKategoriType | null>
  > {
    const result = await instanceAxios.get<
      ResponseStructure<ResponseDaftarLaporanProdukByKategoriType | null>
    >(
      `/shadow-statistik/laporan-penjualan-produk/kategori/${params.kategoriId}/shadow/${params.shadowId}`,
      {
        params: {
          startDate: params.query.startDate,
          endDate: params.query.endDate,
          sortOmzet: params.query.sortOmzet,
          sortLaba: params.query.sortLaba,
          sortQty: params.query.sortQty,
        },
      },
    );

    return result.data;
  }
}
