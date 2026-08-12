import useDownloadInvoiceKredit from "../../../hooks/useDownloadInvoiceKredit";
import useDownloadInvoiceKreditPayment from "../../../hooks/useDownloadInvoiceKreditPaymentPdf";
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

  // handle download struk installment
  const {
    handleDownloadInvoiceKreditPaymentPdf,
    isLoadingDownloadInvoiceKreditPaymentPdf,
  } = useDownloadInvoiceKreditPayment();

  return {
    handlePrintAll,
    handleDownloadInvoiceKreditPdf,
    isLoadingDownloadInvoiceKreditPdf,
    handleDownloadInvoiceKreditPaymentPdf,
    isLoadingDownloadInvoiceKreditPaymentPdf,
  };
};

export default useRowJadwal;
