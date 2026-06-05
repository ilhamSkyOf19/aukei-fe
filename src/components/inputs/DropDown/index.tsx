import { type ChangeEvent, type FC } from "react";
import { cn } from "../../../utils/cn";

type Props = {
  handleChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  listChoose: { value: string; label: string }[];
  placeholder: string;
  isLoading?: boolean;
  value?: string;
  customWidth?: string;
  fontWeight?: string;
};
const DropDown: FC<Props> = ({
  handleChange,
  listChoose,
  placeholder,
  isLoading,
  value,
  customWidth,
  fontWeight,
}) => {
  return (
    <div
      className={cn(
        "lg:h-8.5 h-7 overflow-hidden border border-base-content rounded-md focus-within:ring-1 focus-within:ring-base-content transition-all duration-200 ease-in-out",
        customWidth ? customWidth : "w-40",
      )}
    >
      {/* filter status */}
      <select
        {...(value !== undefined && value !== ""
          ? { value }
          : { defaultValue: placeholder })}
        className={cn(
          "text-base-content select w-full border-none outline-none rounded-md select-xs lg:select-sm",
          fontWeight,
        )}
        onChange={handleChange}
      >
        <option disabled={true}>{placeholder}</option>
        {isLoading ? (
          <option disabled>Loading...</option>
        ) : listChoose?.length > 0 ? (
          listChoose.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))
        ) : (
          <option disabled>Tidak ada data</option>
        )}
      </select>
    </div>
  );
};

export default DropDown;
