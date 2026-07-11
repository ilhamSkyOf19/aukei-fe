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
};
const StatusTransaction: FC<Props> = ({ status, statusTempo }) => {
  return (
    <>
      <span
        className={cn(
          "px-2 py-0.5 rounded-md text-[0.625rem]",
          status === TRANSACTION_STATUS_TYPE.COMPLETED &&
            "bg-green-100 text-green-600",
          statusTempo === TEMPO_STATUS_TYPE.UNPAID &&
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
        {statusTempo === TEMPO_STATUS_TYPE.UNPAID && "Belum Lunas"}
        {statusTempo === TEMPO_STATUS_TYPE.PAID && "Lunas"}
        {statusTempo === TEMPO_STATUS_TYPE.OVERDUE && "Terlambat"}
      </span>
    </>
  );
};

export default StatusTransaction;
