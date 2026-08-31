import { useMutation } from "@tanstack/react-query";
import { InvoiceServices } from "../services/invoice.service";
import { formatTanggalLine } from "../helpers/helpers";

type DownloadInvoiceParams = {
  id: number;
  namaPelanggan: string;
  tanggal: Date;
};

const useDownloadInvoice = (params: {
  handleSetToast: (value: string) => void;
  handleSetAlert: (value: string) => void;
}) => {
  const {
    mutateAsync: downloadInvoicePdf,
    isPending: isLoadingDownloadInvoicePdf,
  } = useMutation({
    mutationFn: async ({
      id,
      namaPelanggan,
      tanggal,
    }: DownloadInvoiceParams) => {
      const blob = await InvoiceServices.downloadInvoiceTransaksiPdf(id);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `${namaPelanggan}-${formatTanggalLine(tanggal)}.pdf`;

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
