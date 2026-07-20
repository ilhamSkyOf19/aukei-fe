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
};
const StatusInstallment: FC<Props> = ({ status, uppercase, customPy }) => {
  return (
    <>
      <span
        className={cn(
          "px-2 rounded-md font-medium text-[0.625rem]",
          uppercase && "uppercase",
          customPy ? customPy : "py-0.5",
          status === TEMPO_STATUS_TYPE.UNPAID && "bg-amber-100 text-amber-600",
          status === TEMPO_STATUS_TYPE.PAID && "bg-green-100 text-green-600",
          status === TEMPO_STATUS_TYPE.OVERDUE && "bg-red-100 text-red-600",
        )}
      >
        {status === TEMPO_STATUS_TYPE.UNPAID && "Belum Lunas"}
        {status === TEMPO_STATUS_TYPE.PAID && "Lunas"}
        {status === TEMPO_STATUS_TYPE.OVERDUE && "Terlambat"}
      </span>
    </>
  );
};

export default StatusInstallment;
