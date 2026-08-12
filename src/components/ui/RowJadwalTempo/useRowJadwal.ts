import useDownloadInvoiceKredit from "../../../hooks/useDownloadInvoiceKredit";
import { InvoiceServices } from "../../../services/invoice.service";

const useRowJadwal = () => {
  const handlePrintAll = (params: { tempoPaymentId: number }) => {
    InvoiceServices.printTempoPayment({
      installmentId: params.tempoPaymentId,
    });
  };

  // handle download struk kredit
  const { handleDownloadInvoiceKreditPdf, isLoadingDownloadInvoiceKreditPdf } =
    useDownloadInvoiceKredit();

  return {
    handlePrintAll,
    handleDownloadInvoiceKreditPdf,
    isLoadingDownloadInvoiceKreditPdf,
  };
};

export default useRowJadwal;
