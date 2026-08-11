import { InvoiceServices } from "../../../services/invoice.service";

const useRowJadwal = () => {
  const handlePrintAll = (params: { tempoPaymentId: number }) => {
    InvoiceServices.printTempoPayment({
      installmentId: params.tempoPaymentId,
    });
  };

  return {
    handlePrintAll,
  };
};

export default useRowJadwal;
