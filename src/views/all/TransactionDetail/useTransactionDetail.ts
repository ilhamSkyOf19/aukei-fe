import { useQuery } from "@tanstack/react-query";
import { TransactionServices } from "../../../services/transaction.service";
import { useMemo } from "react";
import {
  ROLE_INTERNAL_TYPE,
  TRANSACTION_STATUS_TYPE,
} from "../../../types/constant.type";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useAuthStore } from "../../../stores/authStore";
import { LOCAL_STORAGE_KEYS } from "../../../utils/localStorageKeys";
import { useStepStore } from "../../../stores/stepStore";
import { useToastAnimation } from "../../../hooks/useToast";
import { useAlertAnimation } from "../../../hooks/useAlert";
import { getPreviousPath } from "../../../helpers/previousPath";

const useTransactionDetail = (params: { transactionId?: number }) => {
  const { transactionId: transactionIdProps } = params;

  // handle steps
  const { setStep: handleSteps, step } = useStepStore((state) => state);

  // toast
  const { toast, handleSetToast } = useToastAnimation();

  // alert
  const { alert, handleSetAlert } = useAlertAnimation();
  // get pengguna
  const pengguna = useAuthStore((state) => state.pengguna);

  // current pathname
  const currentPathname = useLocation().pathname;

  // is kasir page
  const isKasirPage = currentPathname.includes("kasir");

  // navigate
  const navigate = useNavigate();

  // handle back transaksi
  const handleBackTransaksi = () => {
    if (!currentPathname.includes("kasir")) {
      const previousPath = getPreviousPath();

      // kembali ke riwayat transaksi
      if (currentPathname.includes("riwayat-transaksi") && previousPath) {
        return navigate(previousPath);
      }

      if (step > 0) {
        navigate("/dashboard/kasir");
        return handleSteps?.(1);
      }

      return navigate("/dashboard/riwayat-transaksi");
    } else {
      handleSteps?.(1);

      // remove local storage
      localStorage.removeItem(LOCAL_STORAGE_KEYS.TRANSACTION);
    }
  };

  // get local storage
  const { transactionId } = useParams<{ transactionId: string }>();

  //   parse
  const validatedId = parseId(transactionId) ?? transactionIdProps;

  // query
  const { data: dataTransaction, isLoading: isLoadingTransaction } = useQuery({
    queryKey: ["transaction", validatedId],
    queryFn: () => TransactionServices.findById({ id: validatedId! }),
    retry: false,
    enabled: !!validatedId,
    refetchOnWindowFocus: false,
  });

  // data kebutuhan barang
  const { data: dataKebutuhanBarang, isLoading: isLoadingKebutuhanBarang } =
    useQuery({
      queryKey: ["kebutuhan-barang", dataTransaction?.data?.id],
      queryFn: () =>
        TransactionServices.kebutuhanBarang({
          transactionId: dataTransaction?.data?.id!,
        }),
      enabled:
        !!dataTransaction?.data?.id &&
        dataTransaction?.data?.status === TRANSACTION_STATUS_TYPE.BOOKING,
      retry: false,
      refetchOnWindowFocus: false,
    });

  // is status booking
  const isStatusBooking =
    dataTransaction?.data?.status === TRANSACTION_STATUS_TYPE.BOOKING;

  const isExistingDataTransaction: boolean =
    !isLoadingTransaction && dataTransaction?.data ? true : false;

  const transactionSummary = useMemo(() => {
    if (!dataTransaction?.data) {
      return {
        totalQuantity: 0,
        totalPembayaran: 0,
        totalDiBayar: 0,
        totalKembalian: 0,
        sisaTagihan: 0,
      };
    }

    let totalQuantity = 0;
    let totalPembayaran = dataTransaction?.data?.totalBayar;

    for (const item of dataTransaction.data.details) {
      totalQuantity += item.quantity;
    }

    const totalDiBayar =
      dataTransaction.data.paymentTransactions?.reduce(
        (total, item) => total + item.diBayar,
        0,
      ) ?? 0;

    const totalKembalian =
      dataTransaction.data.paymentTransactions?.reduce(
        (total, item) => total + item.kembalian,
        0,
      ) ?? 0;

    const sisaTagihan =
      totalPembayaran -
      (totalDiBayar - totalKembalian) +
      dataTransaction?.data?.ongkir;

    return {
      totalQuantity,
      totalPembayaran: dataTransaction?.data?.totalBayar,
      totalDiBayar,
      totalKembalian,
      sisaTagihan,
    };
  }, [dataTransaction?.data]);

  // is booking kasir
  const isPageBookingKasir =
    currentPathname.includes("booking") &&
    pengguna?.role === ROLE_INTERNAL_TYPE.KASIR;

  return {
    dataTransaction,
    isLoadingTransaction,
    isExistingDataTransaction,
    handleBackTransaksi,
    transactionSummary,
    isStatusBooking,
    isPageBookingKasir,
    dataKebutuhanBarang,
    isLoadingKebutuhanBarang,
    isKasirPage,
    pengguna,
    toast,

    alert,
    handleSetToast,
    handleSetAlert,
  };
};

export default useTransactionDetail;
