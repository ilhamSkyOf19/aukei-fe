import { useMutation } from "@tanstack/react-query";
import { RiwayatTransaksiExportServices } from "../services/riwayatTransaksiExport.service";

type DownloadInvoiceParams = {
  id: number;
  namaPelanggan: string;
};

const useDownloadRiwayatTransaksiByPelangganPdf = () => {
  const {
    mutateAsync: downloadRiwayatTransaksiByPelangganPdf,
    isPending: isLoadingDownloadRiwayatTransaksiByPelangganPdf,
  } = useMutation({
    mutationFn: async ({ id, namaPelanggan }: DownloadInvoiceParams) => {
      const blob =
        await RiwayatTransaksiExportServices.downloadRiwayatTransaksiByPelangganPdf(
          id,
        );

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `riwayat-transaksi-${namaPelanggan}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    },
  });

  const handleDownloadRiwayatTransaksiByPelangganPdf = async (
    params: Partial<DownloadInvoiceParams>,
  ) => {
    try {
      if (!params.id || !params.namaPelanggan) return;

      await downloadRiwayatTransaksiByPelangganPdf({
        id: params.id,
        namaPelanggan: params.namaPelanggan,
      });
    } catch (error) {
      console.error("Gagal download PDF:", error);
    }
  };

  return {
    handleDownloadRiwayatTransaksiByPelangganPdf,
    isLoadingDownloadRiwayatTransaksiByPelangganPdf,
  };
};

export default useDownloadRiwayatTransaksiByPelangganPdf;
