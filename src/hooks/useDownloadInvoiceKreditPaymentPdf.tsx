import { useMutation } from "@tanstack/react-query";
import { InvoiceServices } from "../services/invoice.service";

type DownloadInvoiceParams = {
  id: number;
  cicilanKe: number;
};

const useDownloadInvoiceKreditPayment = (params: {
  handleSetToast?: (value: string) => void;
  handleSetAlert?: (value: string) => void;
}) => {
  const {
    mutateAsync: downloadInvoicePdf,
    isPending: isLoadingDownloadInvoiceKreditPaymentPdf,
    variables,
  } = useMutation({
    mutationFn: async ({ id, cicilanKe }: DownloadInvoiceParams) => {
      const blob = await InvoiceServices.downloadInvoiceKreditPaymentPdf(id);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `invoice-cicilan-ke-${cicilanKe}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => params?.handleSetToast?.("download_success"),
    onError: () => params?.handleSetAlert?.("gagal_download"),
  });

  const handleDownloadInvoiceKreditPaymentPdf = async (
    params: DownloadInvoiceParams,
  ) => {
    try {
      await downloadInvoicePdf(params);
    } catch (error) {
      console.error("Gagal download PDF:", error);
    }
  };

  return {
    handleDownloadInvoiceKreditPaymentPdf,
    isLoadingDownloadInvoiceKreditPaymentPdf,
    variables,
  };
};

export default useDownloadInvoiceKreditPayment;
