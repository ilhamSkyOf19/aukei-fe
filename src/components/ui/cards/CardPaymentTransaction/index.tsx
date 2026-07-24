import type { FC } from "react";
import { formatRupiah } from "../../../../helpers/helpers";
import type { ResponseTransactionPaymentType } from "../../../../models/paymentTransaction.model";
import { formatTanggalLengkap } from "../../../../helpers/formatDate";
import {
  PAYMENT_METHOD_TYPE,
  TRANSACTION_PAYMENT_STATUS_TYPE,
} from "../../../../types/constant.type";

type Props = {
  paymentTransactions: Pick<
    ResponseTransactionPaymentType,
    | "id"
    | "jenis"
    | "kasir"
    | "keterangan"
    | "metodePembayaran"
    | "nominal"
    | "createdAt"
    | "diBayar"
    | "kembalian"
  >;
};
const CardPaymentTransaction: FC<Props> = ({ paymentTransactions }) => {
  return (
    <div className="w-full grid grid-cols-4 border border-base-content/10 rounded-2xl md:rounded-xl p-2.5">
      {/* label */}
      <div className="col-span-2 flex flex-col justify-start items-start gap-1.5">
        {/* kasir */}
        <span className="text-[0.7rem] font-medium text-base-content">
          Kasir
        </span>
        <span className="text-[0.7rem]  font-medium text-base-content">
          Tanggal
        </span>
        <span className="text-[0.7rem]  font-medium text-base-content">
          Jenis Pembayaran
        </span>
        <span className="text-[0.7rem]  font-medium text-base-content">
          Metode Pembayaran
        </span>
        <span className="text-[0.7rem]  font-medium text-base-content">
          Nominal
        </span>
        <span className="text-[0.7rem]  font-medium text-base-content">
          Di Bayar
        </span>
        {paymentTransactions.metodePembayaran === PAYMENT_METHOD_TYPE.CASH && (
          <span className="text-[0.7rem]  font-medium text-base-content">
            kembalian
          </span>
        )}
        <span className="text-[0.7rem]  font-medium text-base-content">
          Keterangan
        </span>
      </div>

      {/* value */}
      <div className="col-span-2 grid grid-cols-14 gap-1.5">
        <div className="col-span-1 flex flex-col justify-start items-start gap-1.5">
          {Array.from({ length: 7 }).map((_, index) => (
            <span key={index} className="text-[0.7rem] text-base-content">
              :
            </span>
          ))}
        </div>
        <div className="col-span-13 flex flex-col justify-start items-start gap-1.5">
          {/* kasir */}
          <span className="text-[0.7rem] text-base-content">
            {paymentTransactions?.kasir?.nama}
          </span>
          <span className="text-[0.7rem] text-base-content">
            {formatTanggalLengkap(paymentTransactions?.createdAt)}
          </span>
          <span className="text-[0.7rem] text-base-content">
            {paymentTransactions.jenis ===
              TRANSACTION_PAYMENT_STATUS_TYPE.BOOKING_DP && "DP Booking"}
            {paymentTransactions.jenis ===
              TRANSACTION_PAYMENT_STATUS_TYPE.TEMPO_DP && "DP Tempo"}
            {paymentTransactions.jenis ===
              TRANSACTION_PAYMENT_STATUS_TYPE.PELUNASAN && "Pelunasan"}
            {paymentTransactions.jenis ===
              TRANSACTION_PAYMENT_STATUS_TYPE.REFUND && "Refund"}
          </span>
          <span className="text-[0.7rem] text-base-content">
            {paymentTransactions.metodePembayaran}
          </span>
          <span className="text-[0.7rem] text-base-content">
            {formatRupiah(paymentTransactions?.nominal)}
          </span>
          <span className="text-[0.7rem] text-base-content">
            {formatRupiah(paymentTransactions?.diBayar)}
          </span>
          {paymentTransactions.metodePembayaran ===
            PAYMENT_METHOD_TYPE.CASH && (
            <span className="text-[0.7rem] text-base-content">
              {formatRupiah(paymentTransactions?.kembalian)}
            </span>
          )}
          <span className="text-[0.7rem] text-base-content">
            {paymentTransactions?.keterangan}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardPaymentTransaction;
