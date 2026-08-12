import type { FC } from "react";
import { cn } from "../../../utils/cn";
import useTransactionDetail from "./useTransactionDetail";
import ButtonBackText from "../../../components/ui/button/ButtonBackText";
import HeaderTransactionDetail from "./HeaderTransactionDetail";
import DaftarDetailProduk from "./DaftarDetailProduk";
import { PAYMENT_METHOD_TYPE } from "../../../types/constant.type";
import InformasiPembayaran from "./InformasiPembayaran";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_TRANSACTION_DETAIL } from "../../../types/toast.type";

type Props = {
  transactionId?: number;
};
const TransactionDetail: FC<Props> = ({ transactionId }) => {
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
  } = useTransactionDetail({ transactionId });

  return (
    <div
      className={cn(
        "w-full flex flex-col justify-start items-start gap-2.5",
        isKasirPage ? "pb-2.5" : "pt-2.5 px-2.5",
      )}
    >
      {/* back */}
      <ButtonBackText handleClick={() => handleBackTransaksi()} />

      {/* toast */}
      {toast && (
        <Toast
          toast={toast?.id !== null}
          isAnimationOut={toast?.isAnimationOut || false}
          label={TOAST_CONFIG_TRANSACTION_DETAIL[toast.type].message}
          color={TOAST_CONFIG_TRANSACTION_DETAIL[toast.type].color}
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
          dataTransaction={dataTransaction}
          isExistingDataTransaction={isExistingDataTransaction}
          isLoadingTransaction={isLoadingTransaction}
          isPageBookingKasir={isPageBookingKasir}
          dataKebutuhanBarang={dataKebutuhanBarang}
          isLoadingKebutuhanBarang={isLoadingKebutuhanBarang}
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
    </div>
  );
};

export default TransactionDetail;
