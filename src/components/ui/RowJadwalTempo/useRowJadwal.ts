import useDownloadInvoiceKredit from "../../../hooks/useDownloadInvoiceKredit";
import useDownloadInvoiceKreditPayment from "../../../hooks/useDownloadInvoiceKreditPaymentPdf";
import usePrintInvoiceKredit from "../../../hooks/usePrintInvoiceKredit";
import usePrintTempoPayment from "../../../hooks/usePrintInvoiceTempoPayment";

const useRowJadwal = (params: {
  handleSetToast?: (value: string) => void;
  handleSetAlert?: (value: string) => void;
}) => {
  const { handleSetAlert, handleSetToast } = params;

  const { handlePrintTempoPayment, isLoadingPrintTempoPayment } =
    usePrintTempoPayment({ handleSetAlert });

  // handle download struk kredit
  const { handleDownloadInvoiceKreditPdf, isLoadingDownloadInvoiceKreditPdf } =
    useDownloadInvoiceKredit({ handleSetAlert, handleSetToast });

  // handle download struk installment
  const {
    handleDownloadInvoiceKreditPaymentPdf,
    isLoadingDownloadInvoiceKreditPaymentPdf,
  } = useDownloadInvoiceKreditPayment({ handleSetAlert, handleSetToast });

  // handle print kredit
  const { handlePrintInvoiceKredit, isLoadingPrintInvoiceKredit } =
    usePrintInvoiceKredit({ handleSetAlert });

  return {
    handleDownloadInvoiceKreditPdf,
    isLoadingDownloadInvoiceKreditPdf,
    handleDownloadInvoiceKreditPaymentPdf,
    isLoadingDownloadInvoiceKreditPaymentPdf,

    handlePrintInvoiceKredit,
    isLoadingPrintInvoiceKredit,

    handlePrintTempoPayment,
    isLoadingPrintTempoPayment,
  };
};

export default useRowJadwal;
