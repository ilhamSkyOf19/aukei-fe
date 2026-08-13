import instanceAxios from "../libs/axios";

export class StatistikPdfServices {
  static async downloadStatistikAll(query: {
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> {
    const response = await instanceAxios.get(`/export-statistik/all`, {
      params: query,
      responseType: "blob",
    });

    return response.data;
  }

  //   booking
  static async downloadStatistikBooking(query: {
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> {
    const response = await instanceAxios.get(`/export-statistik/booking`, {
      params: query,
      responseType: "blob",
    });

    return response.data;
  }

  // laporan  stok
  static async downloadLaporanStok(): Promise<Blob> {
    const response = await instanceAxios.get(`/export-statistik/laporan-stok`, {
      responseType: "blob",
    });

    return response.data;
  }

  // laporan  top produk
  static async downloadLaporanTopProduk(params: {
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> {
    const response = await instanceAxios.get(`/export-statistik/top-produk`, {
      params: params,
      responseType: "blob",
    });

    return response.data;
  }

  // laporan  top pelanggan
  static async downloadLaporanTopPelanggan(params: {
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> {
    const response = await instanceAxios.get(
      `/export-statistik/top-pelanggan`,
      {
        params: params,
        responseType: "blob",
      },
    );

    return response.data;
  }
}
