import clsx from "clsx";
import type { FieldValues, UseControllerReturn } from "react-hook-form";
import { cn } from "../../../utils/cn";
import ErrorMessage from "../../messages/ErrorMessage";

type Props<T extends FieldValues = any> = {
  label?: string;
  chooseList: { label: string; value: number | string | boolean }[];
  typeValueIsBoolean?: boolean;
  required: boolean;
  controller: UseControllerReturn<T>;
  placeholder: string;
  disabled?: boolean;
  isLoading?: boolean;
  xs?: boolean;
};

export default function InputChoose<T extends FieldValues = any>({
  chooseList,
  controller,
  label,
  placeholder,
  required,
  disabled,
  typeValueIsBoolean,
  isLoading,
  xs,
}: Props<T>) {
  // field
  const { field, fieldState } = controller;

  return (
    <div
      className={cn(
        "w-full flex flex-col justify-start items-start",
        fieldState.error && "mb-3",
      )}
    >
      {/* label */}
      <div className="w-full text-base relative flex flex-row justify-between items-center">
        {label && (
          <div className="flex-2 relative">
            <label
              htmlFor={""}
              className="capitalize text-xs lg:text-sm text-base-content"
            >
              {label}
            </label>

            <span className="absolute -top-1 ml-1 text-error">
              {required && !disabled && "*"}
            </span>
          </div>
        )}
      </div>

      <div
        className={clsx(
          "flex flex-row justify-start items-start gap-2 border border-base-content/40 rounded-md w-full focus-within:ring-1 focus-within:ring-base-content transition-all duration-300 ease-in-out overflow-hidden bg-base-100",
          label && "mt-2 ",
          xs ? "h-7 lg:h-8" : "h-9 lg:h-10",
          fieldState.error && "border-error",
          disabled && "cursor-not-allowed border-primary-black/10",
          typeValueIsBoolean &&
            (field.value !== undefined && String(field.value)
              ? "text-primary-black"
              : "text-primary-black/50"),
          !typeValueIsBoolean &&
            (field.value ? "text-base-content" : "text-base-content/50"),
        )}
      >
        <select
          className={cn(
            "select w-full outline-none border-none rounded-md",
            xs
              ? "text-[0.7rem] lg:text-xs h-7 lg:h-8"
              : "h-9 lg:h-10 text-xs lg:text-sm",
          )}
          value={
            typeValueIsBoolean && field.value !== undefined
              ? String(field.value)
              : field.value || ""
          }
          onChange={(e) => {
            const val = e.target.value;

            const selected = chooseList.find(
              (item) => String(item.value) === val,
            );

            field.onChange(selected?.value);
          }}
          disabled={disabled}
        >
          {/* place holder */}
          <option
            value=""
            disabled
            className={cn(
              "text-base-content/50",
              xs ? "text-[0.7rem] lg:text-xs" : "text-xs lg:text-sm",
            )}
          >
            {placeholder}
          </option>

          {isLoading && (
            <option
              value=""
              disabled
              className={cn(
                "w-full flex justify-center items-center text-base-content/50",
                xs ? "text-[0.7rem] lg:text-xs" : "text-xs lg:text-sm",
              )}
            >
              loading...
            </option>
          )}

          {!isLoading && (
            <>
              {chooseList.map((item, idx) => (
                <option
                  key={idx}
                  value={`${item.value}`}
                  className={cn(
                    "text-base-content",
                    xs ? "text-[0.7rem] lg:text-xs" : "text-xs lg:text-sm",
                  )}
                >
                  {item.label}
                </option>
              ))}
            </>
          )}
        </select>
      </div>

      {/* error message */}
      <ErrorMessage errorMessage={fieldState.error?.message} />
    </div>
  );
}
