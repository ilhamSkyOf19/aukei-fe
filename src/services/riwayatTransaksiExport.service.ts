import instanceAxios from "../libs/axios";

export class RiwayatTransaksiExportServices {
  static async downloadRiwayatTransaksiByPelangganPdf(
    id: number,
  ): Promise<Blob> {
    const response = await instanceAxios.get(
      `/export-riwayat-transaksi/pdf-pelanggan/${id}`,
      {
        responseType: "blob",
      },
    );

    return response.data;
  }

  static async downloadRiwayatTransaksiByPelangganExcel(
    id: number,
  ): Promise<Blob> {
    const response = await instanceAxios.get(
      `/export-riwayat-transaksi/excel-pelanggan/${id}`,
      {
        responseType: "blob",
      },
    );

    return response.data;
  }
}
