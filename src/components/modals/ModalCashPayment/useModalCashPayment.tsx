import { useEffect, useState, type RefObject } from "react";

const useModalCashPayment = (params: {
  handlePay: (pay: number) => void;
  total: number;
  modalRef: RefObject<HTMLDialogElement | null>;
}) => {
  const { handlePay, total, modalRef } = params;

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

  useEffect(() => {
    if (!modalRef.current?.open) return;

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
          clear();
        }
      }
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, [modalRef?.current?.open, amount]);

  return { change, amount, append, backspace, clear };
};

export default useModalCashPayment;
