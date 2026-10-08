import { useMutation } from "@tanstack/react-query";
import { StatistikPdfShadowServices } from "../services/statistikPdfShadow.service";

type Params = {
  startDate?: string;
  endDate?: string;
  shadowId: number;
};

const useDownloadStatistikAllShadow = (params: {
  handleSetToast: (value: string) => void;
  handleSetAlert: (value: string) => void;
}) => {
  const {
    mutateAsync: downloadStatistikAllShadowPdf,
    isPending: isLoadingDownloadStatistikAllShadowPdf,
  } = useMutation({
    mutationFn: async ({ endDate, startDate, shadowId }: Params) => {
      const blob = await StatistikPdfShadowServices.downloadStatistikAll({
        shadowId,
        query: {
          startDate,
          endDate,
        },
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `statistik-${startDate}-${endDate}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => params.handleSetToast("download_success"),
    onError: () => params.handleSetAlert("gagal_download"),
  });

  const handleDownloadStatistikAllShadowPdf = async (params: Params) => {
    try {
      await downloadStatistikAllShadowPdf(params);
    } catch (error) {
      console.error("Gagal download PDF:", error);
    }
  };

  return {
    handleDownloadStatistikAllShadowPdf,
    isLoadingDownloadStatistikAllShadowPdf,
  };
};

export default useDownloadStatistikAllShadow;
