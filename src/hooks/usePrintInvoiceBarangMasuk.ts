import { useMutation } from "@tanstack/react-query";
import { InvoiceServices } from "../services/invoice.service";

type PrintInvoiceBarangMasukParams = {
  id: number;
};

const usePrintInvoiceBarangMasuk = (params: {
  handleSetAlert: (value: string) => void;
}) => {
  const {
    mutateAsync: printInvoiceBarangMasuk,
    isPending: isLoadingPrintInvoiceBarangMasuk,
  } = useMutation({
    mutationFn: async ({ id }: PrintInvoiceBarangMasukParams) => {
      await InvoiceServices.printInvoiceBarangMasuk({
        id,
      });
    },
    onError: () => {
      return params.handleSetAlert("gagal_cetak_invoice");
    },
  });

  const handlePrintInvoiceBarangMasuk = async (
    params: PrintInvoiceBarangMasukParams,
  ) => {
    try {
      await printInvoiceBarangMasuk(params);
    } catch (error) {
      console.error("Gagal mencetak invoice barang masuk:", error);
    }
  };

  return {
    handlePrintInvoiceBarangMasuk,
    isLoadingPrintInvoiceBarangMasuk,
  };
};

export default usePrintInvoiceBarangMasuk;
