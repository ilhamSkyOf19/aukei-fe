import { useMutation } from "@tanstack/react-query";
import { InvoiceServices } from "../services/invoice.service";

type DownloadInvoiceParams = {
  id: number;
  nomorTransaksi: string;
};

const useDownloadInvoice = (params: {
  handleSetToast: (value: string) => void;
  handleSetAlert: (value: string) => void;
}) => {
  const {
    mutateAsync: downloadInvoicePdf,
    isPending: isLoadingDownloadInvoicePdf,
  } = useMutation({
    mutationFn: async ({ id, nomorTransaksi }: DownloadInvoiceParams) => {
      const blob = await InvoiceServices.downloadInvoiceTransaksiPdf(id);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `invoice-${nomorTransaksi}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    },

    onSuccess: () => params.handleSetToast("download_invoice"),
    onError: () => params.handleSetAlert("gagal_download_invoice"),
  });

  const handleDownloadPdf = async (params: DownloadInvoiceParams) => {
    try {
      await downloadInvoicePdf(params);
    } catch (error) {
      console.error("Gagal download PDF:", error);
    }
  };

  return {
    handleDownloadPdf,
    isLoadingDownloadInvoicePdf,
  };
};

export default useDownloadInvoice;
