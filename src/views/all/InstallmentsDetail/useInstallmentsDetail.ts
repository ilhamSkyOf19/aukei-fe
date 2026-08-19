import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useQuery } from "@tanstack/react-query";
import { TempoService } from "../../../services/tempo.service";
import useSizeWindows from "../../../hooks/useSizeWindows";
import { useState } from "react";
import type { ITempoInstallmentType } from "../../../models/tempoInstallment.model";
import { useAuthStore } from "../../../stores/authStore";
import useDownloadInvoiceKredit from "../../../hooks/useDownloadInvoiceKredit";
import useDownloadInvoiceKreditPayment from "../../../hooks/useDownloadInvoiceKreditPaymentPdf";
import usePrintInvoiceKredit from "../../../hooks/usePrintInvoiceKredit";
import usePrintTempoPayment from "../../../hooks/usePrintInvoiceTempoPayment";
import { useAlertAnimation } from "../../../hooks/useAlert";
import { useToastAnimation } from "../../../hooks/useToast";

const useInstallmentsDetail = () => {
  // alert
  const { alert, handleSetAlert } = useAlertAnimation();

  // toast
  const { toast, handleSetToast } = useToastAnimation();

  // get id from params
  const { tempoId } = useParams<{ tempoId: string }>();

  const pengguna = useAuthStore((state) => state.pengguna);

  // state data pembayaran
  const [dataPembayaran, setDataPembayaran] = useState<
    | (Pick<
        ITempoInstallmentType,
        | "id"
        | "jatuhTempo"
        | "nominal"
        | "tanggalLunas"
        | "cicilanKe"
        | "status"
      > & { diBayar: number })
    | null
  >(null);

  //   window size
  const windowSize = useSizeWindows();

  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  const validatedId = parseId(tempoId);

  const { data: dataInstallments, isLoading: isLoadingDataInstallments } =
    useQuery({
      queryKey: ["installments-detail", validatedId],
      queryFn: () =>
        TempoService.findWithInstallmenstByTempoId({
          id: validatedId!,
        }),
      enabled: !!validatedId,
      retry: false,
      refetchOnWindowFocus: false,
    });
  // is existing data tempo
  const isExistDataInstallments: boolean =
    !isLoadingDataInstallments && dataInstallments?.data ? true : false;

  // handle reset data
  const handleResetDataPembayaran = () => {
    setDataPembayaran(null);
  };

  // handle download invoice
  const { handleDownloadInvoiceKreditPdf, isLoadingDownloadInvoiceKreditPdf } =
    useDownloadInvoiceKredit({ handleSetAlert, handleSetToast });

  // handle download invoice cicilan
  const {
    handleDownloadInvoiceKreditPaymentPdf,
    isLoadingDownloadInvoiceKreditPaymentPdf,
    variables,
  } = useDownloadInvoiceKreditPayment({ handleSetAlert, handleSetToast });

  // use print invoice kredit
  const { handlePrintInvoiceKredit, isLoadingPrintInvoiceKredit } =
    usePrintInvoiceKredit({ handleSetAlert });

  // use print invoice kredit payment
  const { handlePrintTempoPayment, isLoadingPrintTempoPayment } =
    usePrintTempoPayment({ handleSetAlert });

  return {
    windowSize,
    navigate,
    isExistDataInstallments,
    dataInstallments,
    isLoadingDataInstallments,
    currentPathname,
    setDataPembayaran,
    dataPembayaran,
    handleResetDataPembayaran,
    validatedId,
    pengguna,
    handleDownloadInvoiceKreditPdf,
    isLoadingDownloadInvoiceKreditPaymentPdf,

    handleDownloadInvoiceKreditPaymentPdf,
    isLoadingDownloadInvoiceKreditPdf,
    variables,

    handlePrintInvoiceKredit,
    isLoadingPrintInvoiceKredit,
    handlePrintTempoPayment,
    isLoadingPrintTempoPayment,

    alert,
    toast,
    handleSetAlert,
    handleSetToast,
  };
};

export default useInstallmentsDetail;
