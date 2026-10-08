import { useMutation } from "@tanstack/react-query";
import { StatistikPdfShadowServices } from "../services/statistikPdfShadow.service";

type Params = {
  startDate?: string;
  endDate?: string;
  shadowId: number;
};
const useDownloadLaporanTopPelangganShadow = (params: {
  handleSetAlert: (value: string) => void;
  handleSetToast: (value: string) => void;
}) => {
  const {
    mutateAsync: downloadLaporanTopPelangganShadowPdf,
    isPending: isLoadingDownloadLaporanTopPelangganShadowPdf,
  } = useMutation({
    mutationFn: async ({ startDate, endDate, shadowId }: Params) => {
      const blob = await StatistikPdfShadowServices.downloadLaporanTopPelanggan(
        {
          shadowId,
          query: {
            startDate,
            endDate,
          },
        },
      );

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `laporan-top-Pelanggan.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    },

    onSuccess: () => params.handleSetToast("download_success"),
    onError: () => params.handleSetAlert("gagal_download"),
  });

  const handleDownloadLaporanTopPelangganShadowPdf = async (params: Params) => {
    try {
      await downloadLaporanTopPelangganShadowPdf({
        shadowId: params.shadowId,
        startDate: params.startDate,
        endDate: params.endDate,
      });
    } catch (error) {
      console.error("Gagal download PDF:", error);
    }
  };

  return {
    handleDownloadLaporanTopPelangganShadowPdf,
    isLoadingDownloadLaporanTopPelangganShadowPdf,
  };
};

export default useDownloadLaporanTopPelangganShadow;
