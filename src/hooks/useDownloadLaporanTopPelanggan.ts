import { useMutation } from "@tanstack/react-query";
import { StatistikPdfServices } from "../services/statistikPdf.service";

type Params = {
  startDate?: string;
  endDate?: string;
};
const useDownloadLaporanTopPelanggan = () => {
  const {
    mutateAsync: downloadLaporanTopPelangganPdf,
    isPending: isLoadingDownloadLaporanTopPelangganPdf,
  } = useMutation({
    mutationFn: async ({ startDate, endDate }: Params) => {
      const blob = await StatistikPdfServices.downloadLaporanTopPelanggan({
        startDate,
        endDate,
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `laporan-top-Pelanggan.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    },
  });

  const handleDownloadLaporanTopPelangganPdf = async (params: Params) => {
    try {
      await downloadLaporanTopPelangganPdf({
        startDate: params.startDate,
        endDate: params.endDate,
      });
    } catch (error) {
      console.error("Gagal download PDF:", error);
    }
  };

  return {
    handleDownloadLaporanTopPelangganPdf,
    isLoadingDownloadLaporanTopPelangganPdf,
  };
};

export default useDownloadLaporanTopPelanggan;
