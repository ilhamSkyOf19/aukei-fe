import { useMutation } from "@tanstack/react-query";
import { InvoiceServices } from "../services/invoice.service";

type DownloadInvoiceBarangMasukParams = {
  id: number;
  kodeReferensi: string;
};

const useDownloadInvoiceBarangMasuk = () => {
  const {
    mutateAsync: downloadInvoiceBarangMasukPdf,
    isPending: isLoadingDownloadInvoiceBarangMasukPdf,
  } = useMutation({
    mutationFn: async ({
      id,
      kodeReferensi,
    }: DownloadInvoiceBarangMasukParams) => {
      const blob = await InvoiceServices.downloadInvoiceBarangMasukPdf(id);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `invoice-barang-masuk-${kodeReferensi}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    },
  });

  const handleDownloadInvoiceBarangMasukPdf = async (
    params: DownloadInvoiceBarangMasukParams,
  ) => {
    try {
      await downloadInvoiceBarangMasukPdf(params);
    } catch (error) {
      console.error("Gagal download PDF:", error);
    }
  };

  return {
    handleDownloadInvoiceBarangMasukPdf,
    isLoadingDownloadInvoiceBarangMasukPdf,
  };
};

export default useDownloadInvoiceBarangMasuk;
