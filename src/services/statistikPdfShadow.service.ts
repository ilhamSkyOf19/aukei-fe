import instanceAxios from "../libs/axios";

export class StatistikPdfShadowServices {
  static async downloadStatistikAll(params: {
    shadowId: number;
    query: {
      startDate?: string;
      endDate?: string;
    };
  }): Promise<Blob> {
    const response = await instanceAxios.get(
      `/export-statistik-shadow/all/shadow/${params.shadowId}`,
      {
        params: params.query,
        responseType: "blob",
      },
    );

    return response.data;
  }

  static async downloadLaporanTopPelanggan(params: {
    shadowId: number;
    query: {
      startDate?: string;
      endDate?: string;
    };
  }): Promise<Blob> {
    const response = await instanceAxios.get(
      `/export-statistik-shadow/top-pelanggan/shadow/${params.shadowId}`,
      {
        params: params.query,
        responseType: "blob",
      },
    );

    return response.data;
  }

  static async downloadLaporanTopProduk(params: {
    shadowId: number;
    query: {
      startDate?: string;
      endDate?: string;
    };
  }): Promise<Blob> {
    const response = await instanceAxios.get(
      `/export-statistik-shadow/top-produk/shadow/${params.shadowId}`,
      {
        params: params.query,
        responseType: "blob",
      },
    );

    return response.data;
  }
}
