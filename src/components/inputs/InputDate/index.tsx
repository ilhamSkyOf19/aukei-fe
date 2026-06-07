import "react-day-picker/style.css";

import { DayPicker } from "react-day-picker";
import { format, setHours, setMinutes } from "date-fns";
import { useEffect, useState } from "react";
import type { FieldValues, UseControllerReturn } from "react-hook-form";
import { cn } from "../../../utils/cn";
import { id } from "date-fns/locale";

type Props<T extends FieldValues> = {
  controller: UseControllerReturn<T>;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  xs?: boolean;
};

export const InputDate = <T extends FieldValues>({
  controller,
  label,
  disabled,
  required,
  xs,
}: Props<T>) => {
  const {
    field,
    fieldState: { error },
  } = controller;

  const [selected, setSelected] = useState<Date>();
  const [timeValue, setTimeValue] = useState("00:00");

  useEffect(() => {
    if (!field.value) return;

    const date = new Date(field.value);

    if (!isNaN(date.getTime())) {
      setSelected(date);
      setTimeValue(format(date, "HH:mm"));
    }
  }, [field.value]);

  const updateValue = (date: Date) => {
    setSelected(date);

    field.onChange(date.toISOString());
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;

    setTimeValue(time);

    if (!selected) return;

    const [hours, minutes] = time.split(":").map(Number);

    const newDate = setHours(setMinutes(selected, minutes), hours);

    updateValue(newDate);
  };

  const handleDaySelect = (date: Date | undefined) => {
    if (!date) return;

    const [hours, minutes] = timeValue.split(":").map(Number);

    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes,
    );

    updateValue(newDate);
  };

  return (
    <div className="gap-3 flex flex-col justify-start items-start w-full">
      {label && (
        <>
          <div className="flex-2 relative">
            <label
              className={cn(
                "capitalize",
                xs ? "text-xs" : "text-xs lg:text-sm",
              )}
            >
              {label}
            </label>

            <span className="absolute -top-1 ml-1 text-error">
              {required && "*"}
            </span>
          </div>
        </>
      )}

      <div
        className={cn(
          "flex flex-row justify-start items-center gap-2 border border-base-content/50 rounded-md w-40 focus-within:ring-1 focus-within:ring-base-content focus-within:border-base-content transition-all duration-300 ease-in-out bg-base-100 ",
          xs ? "h-7 lg:h-8 px-2.5" : "h-9 lg:h-10 px-3",
          error && "border-error",
          label && "mt-2",
        )}
      >
        <input
          type="time"
          value={timeValue}
          onChange={handleTimeChange}
          disabled={disabled}
          className={cn(
            "w-full font-medium text-base-content h-full border-none outline-none placeholder:text-base-content/50 placeholder:font-light",
            xs
              ? "text-[0.625rem] lg:text-xs placeholder:text-[0.625rem]  lg:placeholder:text-xs"
              : "text-xs lg:text-sm  placeholder:text-xs lg:placeholder:text-sm",
          )}
        />
      </div>

      <div className="scale-85 origin-top-left">
        <DayPicker
          mode="single"
          locale={id}
          selected={selected}
          onSelect={handleDaySelect}
        />
      </div>

      {selected && (
        <p className="text-xs lg:text-sm text-base-content font-medium -mt-8 py-2 px-3 border rounded-md border-base-content/50">
          Tanggal Pilih: {selected.toLocaleString()}
        </p>
      )}

      {error?.message && <p className="text-sm text-error">{error.message}</p>}
    </div>
  );
};
