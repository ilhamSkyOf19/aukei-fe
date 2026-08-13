import { useMutation } from "@tanstack/react-query";
import { StatistikPdfServices } from "../services/statistikPdf.service";

const useDownloadLaporanStok = () => {
  const {
    mutateAsync: downloadLaporanStokPdf,
    isPending: isLoadingDownloadLaporanStokPdf,
  } = useMutation({
    mutationFn: async () => {
      const blob = await StatistikPdfServices.downloadLaporanStok();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `laporan-stok.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    },
  });

  const handleDownloadLaporanStokPdf = async () => {
    try {
      await downloadLaporanStokPdf();
    } catch (error) {
      console.error("Gagal download PDF:", error);
    }
  };

  return {
    handleDownloadLaporanStokPdf,
    isLoadingDownloadLaporanStokPdf,
  };
};

export default useDownloadLaporanStok;
