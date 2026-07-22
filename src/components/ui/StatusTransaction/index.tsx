import type { FC } from "react";
import {
  TEMPO_STATUS_TYPE,
  TRANSACTION_STATUS_TYPE,
  type TempoStatusType,
  type TransactionStatusType,
} from "../../../types/constant.type";
import { cn } from "../../../utils/cn";

type Props = {
  status?: TransactionStatusType;
  statusTempo?: TempoStatusType;
  uppercase?: boolean;
  customPy?: string;
};
const StatusTransaction: FC<Props> = ({
  status,
  statusTempo,
  uppercase,
  customPy,
}) => {
  return (
    <>
      <span
        className={cn(
          "px-2 rounded-md font-medium text-[0.625rem]",
          uppercase && "uppercase",
          customPy ?? "py-0.5",
          status === TRANSACTION_STATUS_TYPE.COMPLETED &&
            "bg-emerald-100 text-emerald-600",
          (statusTempo === TEMPO_STATUS_TYPE.UNPAID ||
            status === TRANSACTION_STATUS_TYPE.BOOKING ||
            statusTempo === TEMPO_STATUS_TYPE.PARTIAL) &&
            "bg-amber-100 text-amber-600",
          statusTempo === TEMPO_STATUS_TYPE.PAID &&
            "bg-green-100 text-green-600",
          statusTempo === TEMPO_STATUS_TYPE.OVERDUE &&
            "bg-red-100 text-red-600",
        )}
      >
        {status === TRANSACTION_STATUS_TYPE.COMPLETED &&
          !statusTempo &&
          "Lunas"}
        {status === TRANSACTION_STATUS_TYPE.BOOKING &&
          !statusTempo &&
          "Booking"}
        {statusTempo === TEMPO_STATUS_TYPE.UNPAID && "Belum Lunas"}
        {statusTempo === TEMPO_STATUS_TYPE.PARTIAL && "Sedang Berjalan"}
        {statusTempo === TEMPO_STATUS_TYPE.PAID && "Lunas"}
        {statusTempo === TEMPO_STATUS_TYPE.OVERDUE && "Terlambat"}
      </span>
    </>
  );
};

export default StatusTransaction;
