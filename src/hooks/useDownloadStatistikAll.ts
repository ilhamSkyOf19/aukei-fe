import { useMutation } from "@tanstack/react-query";
import { StatistikPdfServices } from "../services/statistikPdf.service";

type Params = {
  startDate?: string;
  endDate?: string;
};

const useDownloadStatistikAll = (params: {
  handleSetToast: (value: string) => void;
  handleSetAlert: (value: string) => void;
}) => {
  const {
    mutateAsync: downloadStatistikAllPdf,
    isPending: isLoadingDownloadStatistikAllPdf,
  } = useMutation({
    mutationFn: async ({ endDate, startDate }: Params) => {
      const blob = await StatistikPdfServices.downloadStatistikAll({
        startDate,
        endDate,
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

  const handleDownloadStatistikAllPdf = async (params: Params) => {
    try {
      await downloadStatistikAllPdf(params);
    } catch (error) {
      console.error("Gagal download PDF:", error);
    }
  };

  return {
    handleDownloadStatistikAllPdf,
    isLoadingDownloadStatistikAllPdf,
  };
};

export default useDownloadStatistikAll;
