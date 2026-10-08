import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TransactionServices } from "../../../services/transaction.service";
import { useMemo } from "react";
import {
  ROLE_INTERNAL_TYPE,
  TRANSACTION_STATUS_TYPE,
} from "../../../types/constant.type";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { isMoreThanDays, parseId } from "../../../helpers/helpers";
import { useAuthStore } from "../../../stores/authStore";
import { LOCAL_STORAGE_KEYS } from "../../../utils/localStorageKeys";
import { useStepStore } from "../../../stores/stepStore";
import { useToastAnimation } from "../../../hooks/useToast";
import { useAlertAnimation } from "../../../hooks/useAlert";
import { getPreviousPath } from "../../../helpers/previousPath";
import useConfirm from "../../../hooks/useConfirm";

const useTransactionDetail = (params: { transactionId?: number }) => {
  const { transactionId: transactionIdProps } = params;

  // handle steps
  const { setStep: handleSteps, step } = useStepStore((state) => state);

  const queryClient = useQueryClient();

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

  const previousPath = getPreviousPath();

  // handle back transaksi
  const handleBackTransaksi = () => {
    if (!currentPathname.includes("kasir")) {
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
    queryFn: () => {
      if (validatedId) {
        return TransactionServices.findById({ id: validatedId! });
      }
    },
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

  // is expired
  const isExpired3Days =
    dataTransaction?.data?.completedAt &&
    isMoreThanDays(dataTransaction?.data?.completedAt, 3);

  // modal confirm
  const {
    modalRef: modalConfirmRef,
    confirm,
    data: dataConfirm,
    handleCancel: handleCancelModalConfirm,
    handleConfirm,
  } = useConfirm<{ bigTitle: string; smallTitle: string }>();

  // cancel mutation
  const {
    mutateAsync: mutateCancelTransaksi,
    isPending: isPendingCancelTransaksi,
  } = useMutation({
    mutationFn: (data: { transactionId: number }) => {
      return TransactionServices.cancelTransaction(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transaction"],
      });

      handleSetToast?.("cancelled_transaction");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // handle cancel transaksi
  const handleCancelTransaksi = async () => {
    try {
      if (validatedId) {
        const isConfirm = await confirm({
          bigTitle: "Apakah Anda yakin ingin membatalkan transaksi ini?",
          smallTitle: "Quantity produk akan dikembalikan ke inventori",
        });

        if (!isConfirm) return;

        await mutateCancelTransaksi({ transactionId: validatedId });
      }
    } catch (error) {
      console.log(error);
    }
  };

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

    isExpired3Days,
    modalConfirmRef,
    dataConfirm,
    handleCancelModalConfirm,
    handleConfirm,
    isPendingCancelTransaksi,
    handleCancelTransaksi,
  };
};

export default useTransactionDetail;
