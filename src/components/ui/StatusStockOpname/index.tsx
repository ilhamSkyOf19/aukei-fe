import type { FC } from "react";
import {
  STATUS_STOCK_OPNAME_TYPE,
  type StatusStockOpnameType,
} from "../../../types/constant.type";
import { cn } from "../../../utils/cn";

type Props = {
  status: StatusStockOpnameType;
};

const StatusStockOpname: FC<Props> = ({ status }) => {
  return (
    <div className="flex flex-row justify-start items-center">
      <p
        className={cn(
          "text-[0.625rem] rounded-full uppercase font-medium px-2 py-1",
          status === STATUS_STOCK_OPNAME_TYPE.DRAFT &&
            "text-blue-600 bg-blue-100",
          status === STATUS_STOCK_OPNAME_TYPE.PENDING &&
            "text-amber-600 bg-amber-100",
          status === STATUS_STOCK_OPNAME_TYPE.REJECTED &&
            "text-rose-600 bg-rose-100",
          status === STATUS_STOCK_OPNAME_TYPE.APPROVED &&
            "text-emerald-600 bg-emerald-100",
        )}
      >
        {status}{" "}
      </p>{" "}
    </div>
  );
};

export default StatusStockOpname;
