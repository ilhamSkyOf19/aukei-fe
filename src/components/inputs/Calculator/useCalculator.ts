import { useEffect, useState } from "react";

type Params = {
  handlePay: (pay: number) => void;
  total?: number;
  isOpen: boolean;
};

const useCalculator = ({ handlePay, total = 0, isOpen }: Params) => {
  const [value, setValue] = useState<string>("");

  const amount = Number(value || 0);
  const change = Math.max(0, amount - total);

  const append = (val: string) => {
    setValue((prev) => {
      const result = prev + val;
      return String(Number(result));
    });
  };

  const backspace = () => {
    setValue((prev) => prev.slice(0, -1));
  };

  const clear = () => {
    setValue("");
  };

  const handleChange = (rawValue: string) => {
    const numericValue = rawValue.replace(/\D/g, "");
    setValue(numericValue);
  };

  // Inisialisasi nominal ketika kalkulator dibuka
  useEffect(() => {
    if (!isOpen) return;

    const diBayar = localStorage.getItem("di-bayar");

    if (diBayar) {
      try {
        setValue(String(JSON.parse(diBayar)));
      } catch {
        setValue("0");
      }
    } else {
      setValue("0");
    }
  }, [isOpen]);

  // Keyboard listener
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        append(e.key);
      }

      if (e.key === "Backspace") {
        backspace();
      }

      if (e.key === "Escape") {
        clear();
      }

      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();

        if (amount >= total) {
          handlePay(amount);
        }
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [amount, total, handlePay, isOpen]);

  return {
    amount,
    change,
    append,
    backspace,
    clear,
    handleChange,
    canPay: amount >= total,
  };
};

export default useCalculator;
