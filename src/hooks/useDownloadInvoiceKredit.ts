import { useMutation } from "@tanstack/react-query";
import { InvoiceServices } from "../services/invoice.service";

type DownloadInvoiceKreditParams = {
  id: number;
  nomorTransaksi: string;
};

const useDownloadInvoiceKredit = (params: {
  handleSetToast?: (value: string) => void;
  handleSetAlert?: (value: string) => void;
}) => {
  const {
    mutateAsync: downloadInvoiceKreditPdf,
    isPending: isLoadingDownloadInvoiceKreditPdf,
  } = useMutation({
    mutationFn: async ({ id, nomorTransaksi }: DownloadInvoiceKreditParams) => {
      const blob = await InvoiceServices.downloadInvoiceKreditPdf(id);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `invoice-kredit-${nomorTransaksi}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => params?.handleSetToast?.("download_success"),
    onError: () => params?.handleSetAlert?.("gagal_download"),
  });

  const handleDownloadInvoiceKreditPdf = async (
    params: DownloadInvoiceKreditParams,
  ) => {
    try {
      await downloadInvoiceKreditPdf(params);
    } catch (error) {
      console.error("Gagal download PDF:", error);
    }
  };

  return {
    handleDownloadInvoiceKreditPdf,
    isLoadingDownloadInvoiceKreditPdf,
  };
};

export default useDownloadInvoiceKredit;
