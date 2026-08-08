import type { FC } from "react";

import {
  ROLE_INTERNAL_TYPE,
  type RoleInternalType,
} from "../../../types/constant.type";
import { cn } from "../../../utils/cn";

type Props = {
  role: RoleInternalType;
  uppercase?: boolean;
  customPy?: string;
};

const RoleLabel: FC<Props> = ({ role, uppercase, customPy }) => {
  return (
    <span
      className={cn(
        "px-2 rounded-md font-medium text-[0.625rem]",
        uppercase && "uppercase",
        customPy ?? "py-0.5",

        role === ROLE_INTERNAL_TYPE.KASIR && "bg-blue-100 text-blue-600",

        role === ROLE_INTERNAL_TYPE.OWNER && "bg-emerald-100 text-emerald-600",
      )}
    >
      {role === ROLE_INTERNAL_TYPE.KASIR && "Kasir"}
      {role === ROLE_INTERNAL_TYPE.OWNER && "Owner"}
    </span>
  );
};

export default RoleLabel;
