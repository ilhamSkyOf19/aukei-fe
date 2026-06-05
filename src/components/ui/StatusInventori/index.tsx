import type { FC } from "react";
import {
  STATUS_INVENTORI_TYPE,
  type StatusInventoriType,
} from "../../../types/constant.type";
import { cn } from "../../../utils/cn";

type Props = {
  status: StatusInventoriType;
};
const StatusInventori: FC<Props> = ({ status }) => {
  return (
    <div className="flex flex-row justify-start items-center">
      <p
        className={cn(
          "text-xs rounded-md uppercase font-medium px-2 py-1",
          status === STATUS_INVENTORI_TYPE.DRAFT
            ? "text-blue-400 bg-blue-100"
            : status === STATUS_INVENTORI_TYPE.POSTED
              ? "text-emerald-400 bg-emerald-100"
              : "text-base-content",
        )}
      >
        {status}
      </p>
    </div>
  );
};

export default StatusInventori;
