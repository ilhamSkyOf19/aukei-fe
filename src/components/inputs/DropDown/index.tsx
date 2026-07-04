import { type ChangeEvent, type FC } from "react";
import { cn } from "../../../utils/cn";

type Props = {
  handleChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  listChoose: { value: string; label: string }[];
  listBtn?: { handleClick: () => void; label: string; value: string }[];
  placeholder: string;
  isLoading?: boolean;
  customWidth?: string;
  fontWeight?: string;
  noBorder?: boolean;
  defaultValue?: string;
};
const DropDown: FC<Props> = ({
  handleChange,
  listChoose,
  placeholder,
  isLoading,
  customWidth,
  fontWeight,
  listBtn,
  noBorder,
  defaultValue,
}) => {
  return (
    <div
      className={cn(
        "h-8.5 overflow-hidden transition-all duration-200 ease-in-out",
        customWidth ? customWidth : "w-full",
        !noBorder &&
          "border border-base-content rounded-md focus-within:ring-1 focus-within:ring-base-content",
      )}
    >
      {/* filter status */}
      <select
        defaultValue={defaultValue}
        className={cn(
          "text-base-content select w-full border-none outline-none rounded-md select-sm",
          fontWeight,
        )}
        onChange={handleChange}
      >
        <option disabled={true}>{placeholder}</option>
        {isLoading ? (
          <option disabled>Loading...</option>
        ) : listChoose?.length > 0 ? (
          <>
            {listChoose.map((item, index) => (
              <option key={index} value={item.value} className="py-2.5">
                {item.label}
              </option>
            ))}
            {listBtn?.map((item, index) => (
              <option
                key={index}
                value={item.value}
                onClick={item.handleClick}
                className="py-2.5"
              >
                {item.label}
              </option>
            ))}
          </>
        ) : (
          <option disabled>Tidak ada data</option>
        )}
      </select>
    </div>
  );
};

export default DropDown;
