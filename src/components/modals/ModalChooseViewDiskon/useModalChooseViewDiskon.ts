import { useState } from "react";
import usePrintInvoiceTransaksi from "../../../hooks/usePrintInvoiceTransaksi";
import type { DiskonType } from "../../../models/transaction.model";
import useDownloadInvoice from "../../../hooks/useDownloadInvoice";

const useModalChooseViewDiskon = (params: {
  handleSetAlert(value: string): void;
  handleSetToast(value: string): void;
  handleCloseModal: () => void;
  type: "PRINT" | "DOWNLOAD";
  dataDownload?: {
    id: number;
    namaPelanggan: string;
    tanggal: Date;
  };
}) => {
  const {
    handleSetAlert,
    handleCloseModal,
    type,
    handleSetToast,
    dataDownload,
  } = params;

  const [diskonType, setDiskonType] = useState<DiskonType>("RUPIAH");

  const { handlePrintInvoiceTransaksi, isLoadingPrintInvoiceTransaksi } =
    usePrintInvoiceTransaksi({ handleSetAlert, diskonType });

  const { handleDownloadPdf, isLoadingDownloadInvoicePdf } = useDownloadInvoice(
    { handleSetAlert, handleSetToast, diskonType },
  );

  const handleAction = () => {
    if (!dataDownload) return;

    if (type === "PRINT") {
      if (!dataDownload.id) return handleSetAlert("empty_transaction_id");
      handlePrintInvoiceTransaksi({ id: dataDownload.id });
    } else {
      handleDownloadPdf(dataDownload);
    }

    handleCloseModal();
  };

  return {
    isLoading: isLoadingPrintInvoiceTransaksi || isLoadingDownloadInvoicePdf,
    handleAction,
    diskonType,
    setDiskonType,
  };
};

export default useModalChooseViewDiskon;
