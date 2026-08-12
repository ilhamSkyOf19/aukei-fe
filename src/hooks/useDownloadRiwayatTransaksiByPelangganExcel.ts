import { useMutation } from "@tanstack/react-query";
import { RiwayatTransaksiExportServices } from "../services/riwayatTransaksiExport.service";

type DownloadInvoiceParams = {
  id: number;
  namaPelanggan: string;
};

const useDownloadRiwayatTransaksiByPelangganExcel = () => {
  const {
    mutateAsync: downloadRiwayatTransaksiByPelangganExcel,
    isPending: isLoadingDownloadRiwayatTransaksiByPelangganExcel,
  } = useMutation({
    mutationFn: async ({ id, namaPelanggan }: DownloadInvoiceParams) => {
      const blob =
        await RiwayatTransaksiExportServices.downloadRiwayatTransaksiByPelangganExcel(
          id,
        );

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `riwayat-transaksi-${namaPelanggan}.xlsx`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    },
  });

  const handleDownloadRiwayatTransaksiByPelangganExcel = async (
    params: Partial<DownloadInvoiceParams>,
  ) => {
    try {
      if (!params.id || !params.namaPelanggan) return;

      await downloadRiwayatTransaksiByPelangganExcel({
        id: params.id,
        namaPelanggan: params.namaPelanggan,
      });
    } catch (error) {
      console.error("Gagal download Excel:", error);
    }
  };

  return {
    handleDownloadRiwayatTransaksiByPelangganExcel,
    isLoadingDownloadRiwayatTransaksiByPelangganExcel,
  };
};

export default useDownloadRiwayatTransaksiByPelangganExcel;
