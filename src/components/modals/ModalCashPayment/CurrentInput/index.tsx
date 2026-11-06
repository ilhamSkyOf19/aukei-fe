import { useEffect, useRef, useState } from "react";
import { formatRupiah } from "../../../../helpers/helpers";

type Props = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
};

const CurrencyInput = ({ value, onChange, disabled, className }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef<number | null>(null);

  const [displayValue, setDisplayValue] = useState(formatRupiah(value));

  // Sinkronisasi jika nilai berubah dari luar input.
  useEffect(() => {
    setDisplayValue(formatRupiah(value));
  }, [value]);

  // Kembalikan posisi cursor setelah format diperbarui.
  useEffect(() => {
    const input = inputRef.current;
    const cursor = cursorRef.current;

    if (input && cursor !== null) {
      input.setSelectionRange(cursor, cursor);
      cursorRef.current = null;
    }
  }, [displayValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const oldValue = input.value;
    const oldCursor = input.selectionStart ?? oldValue.length;

    // Hitung jumlah digit sebelum cursor.
    const digitsBeforeCursor = oldValue
      .slice(0, oldCursor)
      .replace(/\D/g, "").length;

    // Ambil angka saja.
    const rawValue = oldValue.replace(/\D/g, "");

    const numberValue = rawValue ? Number(rawValue) : 0;

    // Format ulang angka.
    const formattedValue = rawValue ? formatRupiah(numberValue) : "";

    // Hitung posisi cursor berdasarkan jumlah digit.
    let newCursor = 0;
    let digitCount = 0;

    while (
      newCursor < formattedValue.length &&
      digitCount < digitsBeforeCursor
    ) {
      if (/\d/.test(formattedValue[newCursor])) {
        digitCount++;
      }

      newCursor++;
    }

    cursorRef.current = newCursor;

    setDisplayValue(formattedValue);
    onChange(numberValue);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      readOnly={disabled}
      value={displayValue}
      onChange={handleChange}
      className={
        className ??
        "input w-full h-full text-base md:text-xl font-semibold text-base-content border-none outline-none"
      }
    />
  );
};

export default CurrencyInput;
