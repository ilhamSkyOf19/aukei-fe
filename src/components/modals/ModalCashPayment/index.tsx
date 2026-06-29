import { type FC, type RefObject } from "react";
import {
  ReceiptText,
  Delete,
  Calculator,
  BanknoteArrowDownIcon,
  Coins,
} from "lucide-react";
import { formatRupiah } from "../../../helpers/helpers";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import useModalCashPayment from "./useModalCashPayment";

type Props = {
  total: number;
  handleCloseModal: () => void;
  handlePay: (pay: number) => void;
  modalRef: RefObject<HTMLDialogElement | null>;
};

const ModalCashPayment: FC<Props> = ({
  total,
  handleCloseModal,
  handlePay,
  modalRef,
}) => {
  const { change, amount, append, backspace, clear } = useModalCashPayment({
    handlePay,
    total,
    modalRef,
  });

  return (
    <dialog ref={modalRef} id="my_modal_3" className="modal">
      <div className="modal-box max-w-3xl max-h-[95vh] p-0 overflow-hidden">
        {/* HEADER */}
        <div className="border-b  border-base-content/10 px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="w-16 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calculator className="size-6 text-primary" />
            </div>

            <TitleModalFormulir
              title="Kalkulator Pembayaran Tunai"
              keterangan="Hitung pembayaran dan kembalian otomatis"
            />
          </div>
        </div>

        <div className="grid grid-cols-2">
          {/* LEFT */}
          <div className="p-6 border-r border-base-content/10">
            {/* total tagihan */}
            <div className="flex items-center gap-3 border-b border-base-content/10 pb-4">
              <div className="flex-1 flex flex-row justify-start items-center gap-4">
                <ReceiptText className="size-6 text-base-content" />
                <p className="text-sm font-medium">TOTAL TAGIHAN</p>
              </div>

              <div className="flex-1 flex flex-row justify-end items-center">
                <span className="font-semibold text-xl">
                  {formatRupiah(total)}
                </span>
              </div>
            </div>

            <div className="w-full flex flex-col justify-start items-start mt-4">
              <div className="w-full flex flex-row  justify-between items-center py-2">
                <div className=" flex flex-row justify-start items-center gap-4">
                  {/*icon  */}
                  <BanknoteArrowDownIcon className="size-6 text-base-content/80" />
                  <span className="text-sm font-medium text-base-content/80">
                    Uang diterima
                  </span>
                </div>

                <span className="text-lg font-medium">
                  {formatRupiah(amount)}
                </span>
              </div>

              <div className="w-full flex flex-row  justify-between items-center py-2">
                <div className="flex flex-row justify-start items-center gap-4">
                  {/*icon  */}
                  <Coins className="size-6 text-base-content/80" />
                  <span className="text-sm font-medium text-base-content/80">
                    Kembalian
                  </span>
                </div>

                <span className="text-lg font-medium">
                  {formatRupiah(change)}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="p-6">
            {/* INPUT */}
            <div className="mb-5">
              <label className="label">
                <span className="label-text text-sm font-semibold">
                  Uang Diterima
                </span>
              </label>

              <div className="flex flex-row justify-start items-center gap-2 border border-base-content/50 rounded-md w-full focus-within:ring-1 focus-within:ring-base-content focus-within:border-base-content transition-all duration-300 ease-in-out bg-base-100 mt-1 h-14 overflow-hidden">
                <input
                  readOnly
                  value={`${formatRupiah(amount)}`}
                  className="input w-full h-full text-xl font-semibold mt-1 text-base-content border-none outline-none"
                />
              </div>
            </div>

            {/* CALCULATOR */}
            <div className="grid grid-cols-4 gap-2">
              {[7, 8, 9].map((n) => (
                <button
                  key={n}
                  className="btn h-16 text-xl"
                  onClick={() => append(String(n))}
                >
                  {n}
                </button>
              ))}

              <button
                className="btn btn-error btn-outline h-16"
                onClick={backspace}
              >
                <Delete />
              </button>

              {[4, 5, 6].map((n) => (
                <button
                  key={n}
                  className="btn h-16 text-xl"
                  onClick={() => append(String(n))}
                >
                  {n}
                </button>
              ))}

              <button
                className="btn btn-warning btn-outline h-16"
                onClick={clear}
              >
                CE
              </button>

              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  className="btn h-16 text-xl"
                  onClick={() => append(String(n))}
                >
                  {n}
                </button>
              ))}

              <button
                className="btn btn-primary row-span-2 h-full"
                disabled={amount < total}
                onClick={() => {
                  handlePay(amount);
                  clear();
                }}
              >
                OK
              </button>

              <button
                className="btn h-20 text-2xl col-span-2"
                onClick={() => append("0")}
              >
                0
              </button>

              <button
                className="btn h-20 text-2xl"
                onClick={() => append("000")}
              >
                000
              </button>
            </div>

            <div className="mt-5 text-xs opacity-60">
              Gunakan keyboard angka 0-9, Backspace untuk hapus, Enter untuk
              konfirmasi.
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="modal-action m-0 px-6 py-4 border-t border-base-content/10">
          <button className="btn" onClick={handleCloseModal}>
            Tutup
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ModalCashPayment;
