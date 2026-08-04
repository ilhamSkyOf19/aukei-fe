import { useState } from "react";
import { InvoiceServices } from "../../../services/invoice.service";

const useRowJadwal = () => {
  const [selectedTempoPaymentIds, setSelectedTempoPaymentIds] = useState<
    number[]
  >([]);

  const handleSelectTempoPayment = (tempoPaymentId: number) => {
    setSelectedTempoPaymentIds((prev) =>
      prev.includes(tempoPaymentId)
        ? prev.filter((id) => id !== tempoPaymentId)
        : [...prev, tempoPaymentId],
    );
  };

  const handlePrintSelected = (parmas: { installmentId: number }) => {
    if (selectedTempoPaymentIds.length === 0) {
      return;
    }

    InvoiceServices.printTempoPayment({
      installmentId: parmas.installmentId,
      tempoPaymentIds: selectedTempoPaymentIds,
    });
  };

  const handlePrintAll = (params: { tempoPaymentId: number }) => {
    InvoiceServices.printTempoPayment({
      installmentId: params.tempoPaymentId,
    });
  };

  return {
    selectedTempoPaymentIds,
    handleSelectTempoPayment,
    handlePrintSelected,
    handlePrintAll,
  };
};

export default useRowJadwal;
