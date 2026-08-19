import { useMutation } from "@tanstack/react-query";
import { InvoiceServices } from "../services/invoice.service";

type PrintTempoPaymentParams = {
  installmentId: number;
};

const usePrintTempoPayment = (params: {
  handleSetAlert?: (value: string) => void;
}) => {
  const {
    mutateAsync: printTempoPayment,
    isPending: isLoadingPrintTempoPayment,
  } = useMutation({
    mutationFn: async ({ installmentId }: PrintTempoPaymentParams) => {
      await InvoiceServices.printTempoPayment({
        installmentId,
      });
    },
    onError: () => {
      return params?.handleSetAlert?.("gagal_cetak_invoice");
    },
  });

  const handlePrintTempoPayment = async (params: PrintTempoPaymentParams) => {
    try {
      await printTempoPayment(params);
    } catch (error) {
      console.error("Gagal mencetak tempo payment:", error);
    }
  };

  return {
    handlePrintTempoPayment,
    isLoadingPrintTempoPayment,
  };
};

export default usePrintTempoPayment;
