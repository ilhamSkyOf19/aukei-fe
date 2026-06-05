import "react-day-picker/style.css";

import { type DateRange, DayPicker } from "react-day-picker";
import { useEffect, useState } from "react";
import type { FieldValues, UseControllerReturn } from "react-hook-form";
import { endOfDay, startOfDay } from "date-fns";

type Props<T extends FieldValues> = {
  controller: UseControllerReturn<T>;
  label?: string;
  disabled?: boolean;
};

type DateRangeValue = {
  startDate: string;
  endDate: string;
};

export const InputDateRangeTime = <T extends FieldValues>({
  controller,
  label,
  disabled,
}: Props<T>) => {
  const {
    field,
    fieldState: { error },
  } = controller;

  const [range, setRange] = useState<DateRange>();

  useEffect(() => {
    if (!field.value) return;

    const value = field.value as DateRangeValue;

    const from = value.startDate ? new Date(value.startDate) : undefined;

    const to = value.endDate ? new Date(value.endDate) : undefined;

    setRange({
      from,
      to,
    });
  }, [field.value]);

  const updateValue = (from?: Date, to?: Date) => {
    field.onChange({
      startDate: from ? startOfDay(from).toISOString() : "",
      endDate: to ? endOfDay(to).toISOString() : "",
    });

    setRange({
      from,
      to,
    });
  };

  const handleRangeChange = (selected?: DateRange) => {
    if (!selected) return;

    updateValue(selected.from, selected.to);
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}

      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleRangeChange}
        disabled={disabled}
        className="my-calendar"
      />

      {error?.message && <p className="text-error text-sm">{error.message}</p>}
    </div>
  );
};
