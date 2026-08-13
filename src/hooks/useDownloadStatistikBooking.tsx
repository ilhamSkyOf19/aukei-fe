import { useMutation } from "@tanstack/react-query";
import { StatistikPdfServices } from "../services/statistikPdf.service";

type Params = {
  startDate?: string;
  endDate?: string;
};

const useDownloadStatistikBooking = () => {
  const {
    mutateAsync: downloadStatistikBookingPdf,
    isPending: isLoadingDownloadStatistikBookingPdf,
  } = useMutation({
    mutationFn: async ({ endDate, startDate }: Params) => {
      const blob = await StatistikPdfServices.downloadStatistikBooking({
        startDate,
        endDate,
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `statistik-booking-${startDate}-${endDate}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    },
  });

  const handleDownloadStatistikBookingPdf = async (params: Params) => {
    try {
      await downloadStatistikBookingPdf(params);
    } catch (error) {
      console.error("Gagal download PDF:", error);
    }
  };

  return {
    handleDownloadStatistikBookingPdf,
    isLoadingDownloadStatistikBookingPdf,
  };
};

export default useDownloadStatistikBooking;
