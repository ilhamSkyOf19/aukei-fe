import type { FC } from "react";

import { RETURN_STATUS, type ReturnStatus } from "../../../types/constant.type";
import { cn } from "../../../utils/cn";

type Props = {
  status: ReturnStatus;
  uppercase?: boolean;
  customPy?: string;
};

const StatusReturBarang: FC<Props> = ({ status, uppercase, customPy }) => {
  return (
    <span
      className={cn(
        "px-2 rounded-md font-medium text-[0.625rem]",
        uppercase && "uppercase",
        customPy ?? "py-0.5",

        status === RETURN_STATUS.DRAFT && "bg-blue-100 text-blue-600",

        status === RETURN_STATUS.PENDING && "bg-amber-100 text-amber-600",

        status === RETURN_STATUS.APPROVED && "bg-emerald-100 text-emerald-600",

        status === RETURN_STATUS.REJECTED && "bg-red-100 text-red-600",

        status === RETURN_STATUS.CANCELLED && "bg-zinc-100 text-zinc-600",
      )}
    >
      {status === RETURN_STATUS.DRAFT && "Draft"}
      {status === RETURN_STATUS.PENDING && "Menunggu Verifikasi"}
      {status === RETURN_STATUS.APPROVED && "Disetujui"}
      {status === RETURN_STATUS.REJECTED && "Ditolak"}
      {status === RETURN_STATUS.CANCELLED && "Dibatalkan"}
    </span>
  );
};

export default StatusReturBarang;
