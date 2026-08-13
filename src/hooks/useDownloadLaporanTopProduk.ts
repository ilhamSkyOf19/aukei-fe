import { useMutation } from "@tanstack/react-query";
import { StatistikPdfServices } from "../services/statistikPdf.service";

type Params = {
  startDate?: string;
  endDate?: string;
};
const useDownloadLaporanTopProduk = () => {
  const {
    mutateAsync: downloadLaporanTopProdukPdf,
    isPending: isLoadingDownloadLaporanTopProdukPdf,
  } = useMutation({
    mutationFn: async ({ startDate, endDate }: Params) => {
      const blob = await StatistikPdfServices.downloadLaporanTopProduk({
        startDate,
        endDate,
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `laporan-top-produk.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    },
  });

  const handleDownloadLaporanTopProdukPdf = async (params: Params) => {
    try {
      await downloadLaporanTopProdukPdf({
        startDate: params.startDate,
        endDate: params.endDate,
      });
    } catch (error) {
      console.error("Gagal download PDF:", error);
    }
  };

  return {
    handleDownloadLaporanTopProdukPdf,
    isLoadingDownloadLaporanTopProdukPdf,
  };
};

export default useDownloadLaporanTopProduk;
