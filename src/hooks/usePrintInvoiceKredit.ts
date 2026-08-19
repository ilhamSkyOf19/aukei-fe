import { useMutation } from "@tanstack/react-query";
import { InvoiceServices } from "../services/invoice.service";

type PrintInvoiceKreditParams = {
  id: number;
};

const usePrintInvoiceKredit = (params: {
  handleSetAlert?: (value: string) => void;
}) => {
  const {
    mutateAsync: printInvoiceKredit,
    isPending: isLoadingPrintInvoiceKredit,
  } = useMutation({
    mutationFn: async ({ id }: PrintInvoiceKreditParams) => {
      await InvoiceServices.printInvoiceKredit({
        id,
      });
    },
    onError: () => {
      return params?.handleSetAlert?.("gagal_cetak_invoice");
    },
  });

  const handlePrintInvoiceKredit = async (params: PrintInvoiceKreditParams) => {
    try {
      await printInvoiceKredit(params);
    } catch (error) {
      console.error("Gagal mencetak invoice kredit:", error);
    }
  };

  return {
    handlePrintInvoiceKredit,
    isLoadingPrintInvoiceKredit,
  };
};

export default usePrintInvoiceKredit;
