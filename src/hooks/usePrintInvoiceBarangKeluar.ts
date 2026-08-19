import { useMutation } from "@tanstack/react-query";
import { InvoiceServices } from "../services/invoice.service";

type PrintInvoiceBarangKeluarParams = {
  id: number;
};

const usePrintInvoiceBarangKeluar = (params: {
  handleSetAlert: (value: string) => void;
}) => {
  const {
    mutateAsync: printInvoiceBarangKeluar,
    isPending: isLoadingPrintInvoiceBarangKeluar,
  } = useMutation({
    mutationFn: async ({ id }: PrintInvoiceBarangKeluarParams) => {
      await InvoiceServices.printInvoiceBarangKeluar({
        id,
      });
    },
    onError: () => {
      return params.handleSetAlert("gagal_cetak_invoice");
    },
  });

  const handlePrintInvoiceBarangKeluar = async (
    params: PrintInvoiceBarangKeluarParams,
  ) => {
    try {
      await printInvoiceBarangKeluar(params);
    } catch (error) {
      console.error("Gagal mencetak invoice barang keluar:", error);
    }
  };

  return {
    handlePrintInvoiceBarangKeluar,
    isLoadingPrintInvoiceBarangKeluar,
  };
};

export default usePrintInvoiceBarangKeluar;
