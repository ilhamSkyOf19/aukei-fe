import type { FC, RefObject } from "react";
import { Banknote, HandCoins, Landmark, QrCode } from "lucide-react";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import { cn } from "../../../utils/cn";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonText from "../../ui/button/ButtonText";

import type { RequestUpdateUangMukaBookingType } from "../../../models/transaction.model";
import useModalUpdateUangMuka from "./useModalUpdateUangMuka";
import InputPrice from "../../inputs/InputPrice";
import CardMetodePembayaran from "../../ui/cards/CardMetodePembayaran";
import {
  PAYMENT_METHOD_TYPE,
  type PaymentMethodType,
} from "../../../types/constant.type";
import CalculatorInput from "../../inputs/Calculator";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  transactionId?: number;
  data?: Pick<RequestUpdateUangMukaBookingType, "uangMuka"> & {
    metodePembayaran: PaymentMethodType;
  };
};

const ModalUpdateUangMuka: FC<Props> = ({
  modalRef,
  handleCloseModal,
  data,
  transactionId,
}) => {
  // call use
  const {
    handleSubmit,
    onSubmit,
    isPendingUpdateUangMuka,
    handleSetMetodePembayaran,
    uangMukaController,
    metodePembayaranWatch,
    handleSetUangMuka,
  } = useModalUpdateUangMuka({
    handleCloseModal,
    data,
    transactionId,
  });

  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div
        className={cn(
          "modal-box w-11/12 max-w-5xl rounded-2xl bg-base-100 dark:border dark:border-base-content/10",
          metodePembayaranWatch === PAYMENT_METHOD_TYPE.CASH
            ? "lg:w-4xl"
            : "lg:w-xl",
        )}
      >
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title={`Formulir Ubah Uang Muka & Metode Pembayaran`}
              keterangan={`Formulir untuk mengubah Uang Muka atau Metode Pembayaran`}
              withIcon={{
                icon: HandCoins,
              }}
            />
          </div>

          {/* form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(
              "w-full flex flex-col justify-start items-center mt-4",
            )}
          >
            <div className="w-full flex flex-row justify-start items-start gap-2.5">
              <div
                className={cn(
                  "flex flex-col justify-start items-start gap-2.5",
                  metodePembayaranWatch === PAYMENT_METHOD_TYPE.CASH
                    ? "flex-1"
                    : "w-full",
                )}
              >
                <InputPrice controller={uangMukaController} label="Uang Muka" />

                <div className="w-full flex flex-col justify-start items-start gap-2.5">
                  <span className="text-xs text-base-content">
                    Metode Pembayaran
                  </span>
                  <div className="w-full flex flex-row justify-start items-start gap-2.5">
                    {/* cash */}
                    <CardMetodePembayaran
                      icon={Banknote}
                      bgColor="bg-emerald-50"
                      iconColor="text-emerald-500"
                      label="Tunai"
                      description="Bayar dengan uang tunai."
                      handleClick={() =>
                        handleSetMetodePembayaran(PAYMENT_METHOD_TYPE.CASH)
                      }
                      isActive={
                        metodePembayaranWatch === PAYMENT_METHOD_TYPE.CASH
                      }
                      noDeskripsi
                    />

                    {/* transfer */}
                    <CardMetodePembayaran
                      icon={Landmark}
                      bgColor="bg-blue-50"
                      iconColor="text-blue-500"
                      label="Transfer Bank"
                      description="Bayar melalui transfer bank."
                      handleClick={() =>
                        handleSetMetodePembayaran(PAYMENT_METHOD_TYPE.TRANSFER)
                      }
                      isActive={
                        metodePembayaranWatch === PAYMENT_METHOD_TYPE.TRANSFER
                      }
                      noDeskripsi
                    />
                    {/* qris */}
                    <CardMetodePembayaran
                      icon={QrCode}
                      bgColor="bg-purple-50"
                      iconColor="text-purple-500"
                      label="QRIS"
                      description="Bayar melalui QRIS."
                      handleClick={() =>
                        handleSetMetodePembayaran(PAYMENT_METHOD_TYPE.QRIS)
                      }
                      isActive={
                        metodePembayaranWatch === PAYMENT_METHOD_TYPE.QRIS
                      }
                      noDeskripsi
                    />
                  </div>
                </div>

                {/* action */}
                <div className="w-full mt-8 flex flex-row justify-end items-center gap-4">
                  {/* button close */}
                  <ButtonCloseText
                    handleClose={() => {
                      handleCloseModal();
                    }}
                    disabled={isPendingUpdateUangMuka}
                  />
                  {/* button submit */}
                  <ButtonText
                    label={`Simpan`}
                    isLoading={isPendingUpdateUangMuka}
                  />
                </div>
              </div>

              {metodePembayaranWatch === PAYMENT_METHOD_TYPE.CASH && (
                <div className="flex-2">
                  <CalculatorInput handlePay={handleSetUangMuka} isOpen />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalUpdateUangMuka;
