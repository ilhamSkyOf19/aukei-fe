import type { FC } from "react";
import {
  TEMPO_STATUS_TYPE,
  type InstallmentStatusType,
} from "../../../types/constant.type";
import { cn } from "../../../utils/cn";

type Props = {
  status?: InstallmentStatusType;
  uppercase?: boolean;
  customPy?: string;
  statusDueToday?: boolean;
};
const StatusInstallment: FC<Props> = ({
  status,
  uppercase,
  customPy,
  statusDueToday,
}) => {
  return (
    <>
      <span
        className={cn(
          "px-2 rounded-md font-medium text-[0.625rem]",
          uppercase && "uppercase",
          customPy ? customPy : "py-0.5",
          (status === TEMPO_STATUS_TYPE.UNPAID ||
            status === TEMPO_STATUS_TYPE.PARTIAL) &&
            "bg-amber-100 text-amber-600",
          status === TEMPO_STATUS_TYPE.PAID && "bg-green-100 text-green-600",
          (status === TEMPO_STATUS_TYPE.OVERDUE || statusDueToday) &&
            "bg-red-100 text-red-600",
        )}
      >
        {status === TEMPO_STATUS_TYPE.UNPAID && "Belum Lunas"}
        {status === TEMPO_STATUS_TYPE.PARTIAL && "Berjalan"}
        {status === TEMPO_STATUS_TYPE.PAID && "Lunas"}
        {status === TEMPO_STATUS_TYPE.OVERDUE && "Terlambat"}
        {statusDueToday && "Jatuh Tempo"}
      </span>
    </>
  );
};

export default StatusInstallment;
