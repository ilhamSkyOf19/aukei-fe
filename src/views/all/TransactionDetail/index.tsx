import type { FC } from "react";
import { cn } from "../../../utils/cn";
import useTransactionDetail from "./useTransactionDetail";
import ButtonBackText from "../../../components/ui/button/ButtonBackText";
import HeaderTransactionDetail from "./HeaderTransactionDetail";
import DaftarDetailProduk from "./DaftarDetailProduk";
import {
  PAYMENT_METHOD_TYPE,
  TRANSACTION_STATUS_TYPE,
} from "../../../types/constant.type";
import InformasiPembayaran from "./InformasiPembayaran";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_TRANSACTION_DETAIL } from "../../../types/toast.type";
import Alert from "../../../components/messages/Alert";
import { ALERT_CONFIG_TRANSACTION_DETAIL } from "../../../types/alert.types";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import { AlertTriangle, X } from "lucide-react";
import ModalAlert from "../../../components/modals/ModalAlert";

type Props = {
  transactionId?: number;
  handleSetToast?: (value: string) => void;
};
const TransactionDetail: FC<Props> = ({
  transactionId,
  handleSetToast: handleSetToastFormProps,
}) => {
  // call use
  const {
    dataTransaction,
    isExistingDataTransaction,
    isLoadingTransaction,
    handleBackTransaksi,
    transactionSummary,
    isStatusBooking,
    isPageBookingKasir,
    dataKebutuhanBarang,
    isLoadingKebutuhanBarang,
    isKasirPage,
    toast,
    pengguna,

    alert,
    handleSetAlert,
    handleSetToast,
    dataConfirm,
    handleCancelModalConfirm,
    handleCancelTransaksi,
    handleConfirm,
    isExpired3Days,
    isPendingCancelTransaksi,
    modalConfirmRef,
  } = useTransactionDetail({ transactionId });

  return (
    <div
      className={cn(
        "w-full flex flex-col justify-start items-start gap-2.5",
        isKasirPage ? "pb-2.5" : "pt-2.5 px-2.5",
      )}
    >
      <div className="w-full flex flex-row justify-between items-center">
        {/* back */}
        <ButtonBackText handleClick={() => handleBackTransaksi()} />

        {!isExpired3Days &&
          dataTransaction?.data?.status ===
            TRANSACTION_STATUS_TYPE.COMPLETED && (
            <ButtonWithIcon
              label="Batalkan Transaksi"
              icon={X}
              bgColor="bg-error"
              textColor="text-primary-white"
              handleBtn={() => handleCancelTransaksi()}
            />
          )}
      </div>
      {/* toast */}
      {toast && (
        <Toast
          toast={toast?.id !== null}
          isAnimationOut={toast?.isAnimationOut || false}
          label={TOAST_CONFIG_TRANSACTION_DETAIL[toast.type].message}
          color={TOAST_CONFIG_TRANSACTION_DETAIL[toast.type].color}
        />
      )}
      {/* alert */}
      {alert && (
        <Alert
          alert={alert?.id !== null}
          isAnimationOut={alert?.isAnimationOut || false}
          label={ALERT_CONFIG_TRANSACTION_DETAIL[alert.type].message}
        />
      )}
      {/* header */}
      <HeaderTransactionDetail
        nomorTransaksi={dataTransaction?.data?.nomorTransaksi}
        metodePembayaran={dataTransaction?.data?.metodePembayaran}
        pelanggan={dataTransaction?.data?.pelanggan}
        statusTransaction={
          dataTransaction?.data?.metodePembayaran !== PAYMENT_METHOD_TYPE.TEMPO
            ? dataTransaction?.data?.status
            : null
        }
        tanggalTransaksi={
          dataTransaction?.data?.completedAt ??
          dataTransaction?.data?.tanggalBooking
        }
        kasir={dataTransaction?.data?.kasir}
        statusTempo={dataTransaction?.data?.tempo?.status}
        isLoadingTransaction={isLoadingTransaction}
      />
      {/* data */}
      <div className="flex w-full flex-col lg:flex-row justify-start md:items-end items-start lg:items-start gap-2.5">
        {/* daftar produk and kredit detail */}
        <DaftarDetailProduk
          role={pengguna?.role}
          dataTransaction={dataTransaction}
          isExistingDataTransaction={isExistingDataTransaction}
          isLoadingTransaction={isLoadingTransaction}
          isPageBookingKasir={isPageBookingKasir}
          dataKebutuhanBarang={dataKebutuhanBarang}
          isLoadingKebutuhanBarang={isLoadingKebutuhanBarang}
          handleSetAlert={handleSetAlert}
          handleSetToast={handleSetToastFormProps ?? handleSetToast}
        />
        <InformasiPembayaran
          dataTransaction={dataTransaction}
          transactionSummary={transactionSummary}
          isLoadingTransaction={isLoadingTransaction}
          isStatusBooking={isStatusBooking}
          isPageBookingKasir={isPageBookingKasir}
          siapKirim={dataKebutuhanBarang?.data?.some((item) => item.siapKirim)}
        />
      </div>

      {/* modal alert */}
      <ModalAlert
        icon={AlertTriangle}
        bigTitle={dataConfirm?.bigTitle ?? ""}
        smallTitle={dataConfirm?.smallTitle ?? ""}
        modalRef={modalConfirmRef}
        handleCloseModal={handleCancelModalConfirm}
        handleConfirm={handleConfirm}
        iconColor={"text-warning"}
        isLoading={isPendingCancelTransaksi}
      />
    </div>
  );
};

export default TransactionDetail;
