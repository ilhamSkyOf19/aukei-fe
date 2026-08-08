import { type FC } from "react";
import DropDown from "../../inputs/DropDown";
import { cn } from "../../../utils/cn";
import {
  ROLE_INTERNAL_TYPE,
  type RoleInternalType,
} from "../../../types/constant.type";

type Props = {
  setStatus: (value: string) => void;
  customWidth?: string;
  value?: string;
  role?: RoleInternalType;
};

const filter: { value: string; label: string }[] = [
  {
    label: "Approved",
    value: "approved",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Rejected",
    value: "rejected",
  },
  {
    label: "Draft",
    value: "draft",
  },
  {
    label: "Semua",
    value: "semua",
  },
];

const FilterStatusRetur: FC<Props> = ({
  setStatus,
  customWidth,
  value,
  role,
}) => {
  const finalFilter =
    role === ROLE_INTERNAL_TYPE.OWNER
      ? filter.filter((item) => item.value !== "draft")
      : filter;

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 justify-start items-start",
        customWidth ? customWidth : "w-40",
      )}
    >
      <span className="text-xs text-base-content/80 font-medium">Status</span>
      <DropDown
        handleChange={(e) => setStatus(e.target.value)}
        listChoose={finalFilter}
        placeholder="Status"
        value={value || "semua"}
      />
    </div>
  );
};

export default FilterStatusRetur;
