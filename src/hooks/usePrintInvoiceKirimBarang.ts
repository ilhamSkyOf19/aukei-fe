import { useMutation } from "@tanstack/react-query";
import { InvoiceServices } from "../services/invoice.service";

type PrintInvoiceKirimBarangParams = {
  id: number;
};

const usePrintInvoiceKirimBarang = (params: {
  handleSetAlert?: (value: string) => void;
}) => {
  const {
    mutateAsync: printInvoiceKirimBarang,
    isPending: isLoadingPrintInvoiceKirimBarang,
  } = useMutation({
    mutationFn: async ({ id }: PrintInvoiceKirimBarangParams) => {
      await InvoiceServices.printInvoiceKirimBarang({
        id,
      });
    },
    onError: () => {
      return params?.handleSetAlert?.("gagal_cetak_invoice_kirim_barang");
    },
  });

  const handlePrintInvoiceKirimBarang = async (
    params: PrintInvoiceKirimBarangParams,
  ) => {
    try {
      await printInvoiceKirimBarang(params);
    } catch (error) {
      console.error("Gagal mencetak invoice kirim barang:", error);
    }
  };

  return {
    handlePrintInvoiceKirimBarang,
    isLoadingPrintInvoiceKirimBarang,
  };
};

export default usePrintInvoiceKirimBarang;
