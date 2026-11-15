import { type FC, type RefObject } from "react";
import {
  ReceiptText,
  Calculator,
  BanknoteArrowDownIcon,
  Coins,
} from "lucide-react";
import { formatRupiah } from "../../../helpers/helpers";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import useModalCashPayment from "./useModalCashPayment";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import CalculatorInput from "../../inputs/Calculator";

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
  const { payment, handleSetPayment } = useModalCashPayment();

  return (
    <dialog ref={modalRef} id="my_modal_3" className="modal">
      <div className="modal-box max-w-3xl rounded-xl max-h-[95vh] pb-12 md:pb-0 p-0 md:overflow-hidden">
        {/* HEADER */}
        <div className="border-b  border-base-content/10 px-6 py-3">
          <div className="flex items-center gap-4">
            <TitleModalFormulir
              title="Kalkulator Pembayaran Tunai"
              keterangan="Hitung pembayaran dan kembalian otomatis"
              withIcon={{
                icon: Calculator,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* LEFT */}
          <div className="p-6 pb-0 md:p-6 border-r border-base-content/10">
            {/* total tagihan */}
            <div className="flex items-center gap-3 border-b-2 border-base-content/30 border-dashed pb-4">
              <div className="flex-1 flex flex-row justify-start items-center gap-2.5 md:gap-4">
                <ReceiptText className="size-5 md:size-6 text-base-content" />
                <p className="text-xs md:text-sm font-medium text-base-content">
                  TOTAL TAGIHAN
                </p>
              </div>

              <div className="flex-1 flex flex-row justify-end items-center">
                <span className="font-semibold text-md md:text-xl text-base-content">
                  {formatRupiah(total)}
                </span>
              </div>
            </div>

            <div className="w-full flex flex-col justify-start items-start mt-2.5">
              <div className="w-full flex flex-row  justify-between items-center py-1 md:py-2">
                <div className=" flex flex-row justify-start items-center gap-4">
                  {/*icon  */}
                  <BanknoteArrowDownIcon className="size-5 md:size-6 text-base-content/80" />
                  <span className="text-xs md:text-sm font-medium text-base-content/80">
                    Uang diterima
                  </span>
                </div>

                <span className="text-sm md:text-lg font-medium text-info">
                  {formatRupiah(payment.amount)}
                </span>
              </div>

              <div className="w-full flex flex-row  justify-between items-center py-1 md:py-2">
                <div className="flex flex-row justify-start items-center gap-4">
                  {/*icon  */}
                  <Coins className="size-5 md:size-6 text-base-content/80" />
                  <span className="text-xs md:text-sm font-medium text-base-content/80">
                    Kembalian
                  </span>
                </div>

                <span className="text-sm md:text-lg font-medium text-success">
                  {formatRupiah(payment.change)}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <CalculatorInput
            total={total}
            isOpen={modalRef.current?.open ?? false}
            handlePay={handlePay}
            onPaymentChange={handleSetPayment}
          />
        </div>

        {/* FOOTER */}
        <div className="modal-action m-0 px-6 py-4 border-t border-base-content/10">
          <ButtonCloseText handleClose={handleCloseModal} />
        </div>
      </div>
    </dialog>
  );
};

export default ModalCashPayment;
