import { useMutation } from "@tanstack/react-query";
import { StatistikPdfShadowServices } from "../services/statistikPdfShadow.service";

type Params = {
  startDate?: string;
  endDate?: string;
  shadowId: number;
};
const useDownloadLaporanTopProdukShadow = (params: {
  handleSetToast: (value: string) => void;
  handleSetAlert: (value: string) => void;
}) => {
  const {
    mutateAsync: downloadLaporanTopProdukShadowPdf,
    isPending: isLoadingDownloadLaporanTopProdukShadowPdf,
  } = useMutation({
    mutationFn: async ({ startDate, endDate, shadowId }: Params) => {
      const blob = await StatistikPdfShadowServices.downloadLaporanTopProduk({
        shadowId,
        query: {
          startDate,
          endDate,
        },
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

    onSuccess: () => params.handleSetToast("download_success"),
    onError: () => params.handleSetAlert("gagal_download"),
  });

  const handleDownloadLaporanTopProdukShadowPdf = async (params: Params) => {
    try {
      await downloadLaporanTopProdukShadowPdf({
        shadowId: params.shadowId,
        startDate: params.startDate,
        endDate: params.endDate,
      });
    } catch (error) {
      console.error("Gagal download PDF:", error);
    }
  };

  return {
    handleDownloadLaporanTopProdukShadowPdf,
    isLoadingDownloadLaporanTopProdukShadowPdf,
  };
};

export default useDownloadLaporanTopProdukShadow;
