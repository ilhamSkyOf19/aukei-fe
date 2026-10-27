import { useMutation } from "@tanstack/react-query";
import { InvoiceServices } from "../services/invoice.service";
import type { DiskonType } from "../models/transaction.model";

type PrintInvoiceTransaksiParams = {
  id: number;
};

const usePrintInvoiceTransaksi = (params: {
  handleSetAlert: (value: string) => void;
  diskonType?: DiskonType;
}) => {
  const {
    mutateAsync: printInvoiceTransaksi,
    isPending: isLoadingPrintInvoiceTransaksi,
  } = useMutation({
    mutationFn: async ({ id }: PrintInvoiceTransaksiParams) => {
      await InvoiceServices.printInvoice({
        id,
        diskonType: params.diskonType,
      });
    },
    onError: () => {
      return params.handleSetAlert("gagal_cetak_invoice");
    },
  });

  const handlePrintInvoiceTransaksi = async (
    params: PrintInvoiceTransaksiParams,
  ) => {
    try {
      await printInvoiceTransaksi(params);
    } catch (error) {
      console.error("Gagal mencetak invoice transaksi:", error);
    }
  };

  return {
    handlePrintInvoiceTransaksi,
    isLoadingPrintInvoiceTransaksi,
  };
};

export default usePrintInvoiceTransaksi;
