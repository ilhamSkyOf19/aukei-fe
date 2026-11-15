import { useEffect, type FC } from "react";
import { Delete } from "lucide-react";
import CurrencyInput from "./CurrentInput";
import useCalculator from "./useCalculator";

type Props = {
  total?: number;
  isOpen: boolean;
  handlePay: (pay: number) => void;
  onPaymentChange?: (data: { amount: number; change: number }) => void;
};

const CalculatorInput: FC<Props> = ({
  total,
  handlePay,
  isOpen,
  onPaymentChange,
}) => {
  const { amount, append, backspace, clear, handleChange, change, canPay } =
    useCalculator({
      total,
      handlePay,
      isOpen,
    });

  useEffect(() => {
    onPaymentChange?.({
      amount,
      change,
    });
  }, [amount, change, onPaymentChange]);

  return (
    <div className="p-4 md:pt-2">
      {/* INPUT */}
      <div className="mb-5">
        <label className="label">
          <span className="label-text text-xs md:text-sm font-semibold text-base-content">
            Uang Diterima
          </span>
        </label>

        <div className="flex flex-row justify-start items-center gap-2 border border-base-content/50 rounded-xl w-full focus-within:ring-1 focus-within:ring-base-content focus-within:border-base-content transition-all duration-300 ease-in-out bg-base-100 mt-1 h-12 md:h-14 overflow-hidden">
          <CurrencyInput
            value={amount}
            onChange={(nominal) => handleChange(String(nominal))}
          />
        </div>
      </div>

      {/* CALCULATOR */}
      <div className="grid grid-cols-4 gap-2">
        {[7, 8, 9].map((n) => (
          <button
            key={n}
            type="button"
            className="btn h-12 md:h-14 text-lg md:text-xl"
            onClick={() => append(String(n))}
          >
            {n}
          </button>
        ))}

        <button
          type="button"
          className="btn btn-error btn-outline h-12 md:h-14"
          onClick={backspace}
        >
          <Delete />
        </button>

        {[4, 5, 6].map((n) => (
          <button
            key={n}
            type="button"
            className="btn h-12 md:h-14 text-lg md:text-xl"
            onClick={() => append(String(n))}
          >
            {n}
          </button>
        ))}

        <button
          type="button"
          className="btn btn-warning btn-outline h-12 md:h-14"
          onClick={clear}
        >
          CE
        </button>

        {[1, 2, 3].map((n) => (
          <button
            key={n}
            type="button"
            className="btn h-12 md:h-14 text-lg md:text-xl"
            onClick={() => append(String(n))}
          >
            {n}
          </button>
        ))}

        <button
          type="button"
          className="font-semibold bg-custom-primary rounded-lg text-custom-secondary row-span-2 h-full disabled:opacity-50 not-disabled:hover-overlay"
          disabled={!canPay}
          onClick={() => handlePay(amount)}
        >
          OK
        </button>

        <button
          type="button"
          className="btn h-16 md:h-20 text-xl md:text-2xl col-span-2"
          onClick={() => append("0")}
        >
          0
        </button>

        <button
          type="button"
          className="btn h-16 md:h-20 text-xl md:text-2xl"
          onClick={() => append("000")}
        >
          000
        </button>
      </div>

      <div className="hidden md:block mt-2.5 text-xs opacity-60 text-base-content">
        Gunakan keyboard angka 0-9, Backspace untuk hapus, Enter untuk
        konfirmasi.
      </div>
    </div>
  );
};

export default CalculatorInput;
