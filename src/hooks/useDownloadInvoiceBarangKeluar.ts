import { useMutation } from "@tanstack/react-query";
import { InvoiceServices } from "../services/invoice.service";

type DownloadInvoiceBarangKeluarParams = {
  id: number;
  kodeReferensi: string;
};

const useDownloadInvoiceBarangKeluar = () => {
  const {
    mutateAsync: downloadInvoice,
    isPending: isPendingDownloadInvoiceBarangKeluar,
  } = useMutation({
    mutationFn: async ({
      id,
      kodeReferensi,
    }: DownloadInvoiceBarangKeluarParams) => {
      const blob = await InvoiceServices.downloadInvoiceBarangKeluarPdf(id);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `invoice-barang-keluar-${kodeReferensi}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    },
  });

  const handleDownloadInvoiceBarangKeluarPdf = async (
    params: DownloadInvoiceBarangKeluarParams,
  ) => {
    try {
      await downloadInvoice(params);
    } catch (error) {
      console.error("Gagal download PDF:", error);
    }
  };

  return {
    handleDownloadInvoiceBarangKeluarPdf,
    isPendingDownloadInvoiceBarangKeluar,
  };
};

export default useDownloadInvoiceBarangKeluar;
