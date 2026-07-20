import { differenceInDays } from "date-fns";
import {
  formatRupiah,
  getJatuhTempoTextColor,
} from "../../../../helpers/helpers";
import { cn } from "../../../../utils/cn";
import { formatTanggalLengkap } from "../../../../helpers/formatDate";
import type { ITempoInstallmentType } from "../../../../models/tempoInstallment.model";
import type { FC } from "react";
import useCardPembayaran from "./useCardPembayaran";
import InputPrice from "../../../../components/inputs/InputPrice";
import type { CreateTempoPaymentType } from "../../../../models/tempoPayment.model";
import {
  Banknote,
  Landmark,
  QrCode,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { PAYMENT_METHOD_TYPE } from "../../../../types/constant.type";
import InputTextAreaNonIcon from "../../../../components/inputs/InputTextAreaNonIcon";
import ModalCashPayment from "../../../../components/modals/ModalCashPayment";
import ButtonSubmitWithIcon from "../../../../components/ui/button/ButtonSubmitWithIcon";
import ModalAlert from "../../../../components/modals/ModalAlert";

type Props = {
  jumlahCicilan?: number;
  dataPembayaran:
    | (Pick<
        ITempoInstallmentType,
        | "id"
        | "jatuhTempo"
        | "nominal"
        | "tanggalLunas"
        | "cicilanKe"
        | "status"
      > & { diBayar: number })
    | null;
  handleResetDataPembayaran: () => void;
  tempoId: number | null;
};
const CardPembayaran: FC<Props> = ({
  dataPembayaran,
  jumlahCicilan,
  handleResetDataPembayaran,
  tempoId,
}) => {
  const {
    errors,
    handleSubmit,
    isPendingPayment,
    nominalController,
    onSubmit,
    register,
    metodePembayaran,
    handleMetodePembayaran,
    buttonCalculatorRef,
    handleCloseModalCalculator,
    handleShowModalCalculator,
    modalCalculatorRef,
    dataModalCalculator,
    dataConfirm,
    handleCancelConfirmPembayaran,
    handleConfirmPembayaran,
    modalConfirmRef,
  } = useCardPembayaran({ dataPembayaran, handleResetDataPembayaran, tempoId });

  return (
    <div className="flex-1 bg-base-100 rounded-xl border border-transparent dark:border-base-content/10 shadow-sm hidden lg:flex mt-2.5 p-2.5 flex-col justify-start items-start min-h-70">
      {/* title */}
      <span className="text-xs font-semibold text-base-content">
        Bayar Angsuran
      </span>

      {dataPembayaran ? (
        <>
          <div className="w-full flex flex-row justify-between items-start mt-2.5 p-2.5 rounded-xl border border-base-content/10 gap-4">
            <div className="flex-1 flex flex-col justify-start items-start gap-2 border-r border-base-content/10">
              {/* label */}
              <span className="text-base-content/70 font-medium text-[0.625rem]">
                Cicilan Ke
              </span>
              <span className="text-base-content font-semibold text-base">
                {dataPembayaran.cicilanKe} / {jumlahCicilan}
              </span>
            </div>
            <div className="flex-2 flex flex-col justify-start items-start gap-2">
              {/* label */}
              <span className="text-base-content/70 font-medium text-[0.625rem]">
                Jatuh Tempo
              </span>
              <span className="text-base-content font-semibold text-xs">
                {formatTanggalLengkap(dataPembayaran.jatuhTempo)}
              </span>
              <span
                className={cn(
                  "font-semibold text-[0.625rem]",
                  getJatuhTempoTextColor(dataPembayaran.jatuhTempo),
                )}
              >
                (
                {differenceInDays(dataPembayaran.jatuhTempo, new Date()) > 0
                  ? `${differenceInDays(dataPembayaran.jatuhTempo, new Date())} Hari lagi`
                  : "Hari ini"}
                )
              </span>
            </div>
          </div>

          {/* sisa tagihan */}
          <div className="flex flex-col border-l border-base-content/10 pl-4 mt-4 justify-start items-start gap-1 py-1">
            {/* label */}
            <span className="text-[0.625rem] font-medium text-base-content/70">
              Sisa Tagihan
            </span>
            {/* value */}
            <span className="text-sm font-semibold text-error">
              {formatRupiah(dataPembayaran.nominal - dataPembayaran.diBayar)}
            </span>
          </div>

          {/* form pembayaran */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col justify-start items-start mt-2.5"
          >
            {/* nominal */}
            <InputPrice<Pick<CreateTempoPaymentType, "nominal" | "keterangan">>
              controller={nominalController}
              label="Nominal Pembayaran"
              max={dataPembayaran.nominal - dataPembayaran.diBayar}
              placeholder="Masukan nominal pembayaran"
              required
            />

            {/* metode pembayaran */}
            <div className="w-full grid grid-cols-2 gap-2.5">
              <div className="col-span-1">
                <CardMetodePembayaran
                  label="Transfer"
                  icon={{
                    icon: Landmark,
                    bgColor: "bg-blue-50",
                    iconColor: "text-blue-500",
                  }}
                  isActive={metodePembayaran === PAYMENT_METHOD_TYPE.TRANSFER}
                  handleClick={() => handleMetodePembayaran("TRANSFER")}
                />
              </div>
              <div className="col-span-1">
                <CardMetodePembayaran
                  label="QRIS"
                  icon={{
                    icon: QrCode,
                    bgColor: "bg-purple-50",
                    iconColor: "text-purple-500",
                  }}
                  isActive={metodePembayaran === PAYMENT_METHOD_TYPE.QRIS}
                  handleClick={() => handleMetodePembayaran("QRIS")}
                />
              </div>
              <div className="col-span-2">
                <CardMetodePembayaran
                  label="CASH"
                  icon={{
                    icon: Banknote,
                    bgColor: "bg-emerald-50",
                    iconColor: "text-emerald-500",
                  }}
                  isActive={metodePembayaran === PAYMENT_METHOD_TYPE.CASH}
                  handleClick={() => handleMetodePembayaran("CASH")}
                />
              </div>

              {metodePembayaran === "CASH" && (
                <div className="col-span-2 flex flex-col justify-start items-start">
                  <button
                    ref={buttonCalculatorRef}
                    type="button"
                    className={cn(
                      "w-full h-10 bg-emerald-600 rounded-lg flex flex-row hover-overlay justify-center items-center",
                      metodePembayaran === "CASH" ? "animate-pop-in" : "hidden",
                    )}
                    onClick={() => handleShowModalCalculator()}
                  >
                    <span className="text-xs font-medium text-primary-white">
                      Kalkulator
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* keterangan */}
            <div className="w-full mt-2.5">
              <InputTextAreaNonIcon
                register={register("keterangan")}
                name="keterangan"
                placeholder="Masukan keterangan"
                errorMessage={errors.keterangan?.message}
                rows={3}
                label="Keterangan (Opsional)"
              />
            </div>

            {/* submit */}
            <div className="w-full">
              <ButtonSubmitWithIcon
                label="Bayar Cicilan"
                customWidth="w-full"
                icon={Wallet}
                isLoading={isPendingPayment}
              />
            </div>
          </form>
        </>
      ) : (
        <div className="w-full h-50 flex justify-center items-center">
          <span className="text-xs font-medium text-base-content">
            Silahkan pilih cicilan
          </span>
        </div>
      )}

      <ModalCashPayment
        modalRef={modalCalculatorRef}
        handleCloseModal={handleCloseModalCalculator}
        handlePay={() => handleCloseModalCalculator()}
        total={dataModalCalculator?.nominal ?? 0}
      />

      {/* modal confirm */}
      <ModalAlert
        modalRef={modalConfirmRef}
        handleCloseModal={handleCancelConfirmPembayaran}
        handleConfirm={handleConfirmPembayaran}
        bigTitle={dataConfirm?.title ?? ""}
        smallTitle={dataConfirm?.deskripsi ?? ""}
      />
    </div>
  );
};

// card metode pembayaran

type CardMetodePembayaranProps = {
  isActive?: boolean;
  isError?: boolean;
  handleClick: () => void;
  icon: {
    icon: LucideIcon;
    bgColor: string;
    iconColor: string;
  };
  label: string;
};

const CardMetodePembayaran: FC<CardMetodePembayaranProps> = ({
  isActive,
  isError,
  handleClick,
  icon,
  label,
}) => {
  return (
    <button
      type="button"
      className={cn(
        "w-full flex flex-row justify-between items-center rounded-xl shadow-sm p-2.5 border  transition-all duration-150 ease-in-out",
        isActive
          ? "border-emerald-600 bg-emerald-600/10"
          : isError
            ? "border-rose-600 bg-rose-600/10"
            : "border-transparent hover:border-emerald-600",
      )}
      onClick={handleClick}
    >
      {/* content */}
      <div className="flex-2 flex flex-row justify-start items-center gap-4">
        {/* icon */}
        <div
          className={cn(
            "w-9 h-9 shrink-0 rounded-full flex flex-row justify-center items-center",
            icon.bgColor,
          )}
        >
          <icon.icon className={cn("size-4", icon.iconColor)} />
        </div>

        {/* label */}
        <div className="flex flex-col justify-start items-start gap-1">
          <span className="text-xs font-medium text-base-content text-left">
            {label}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-row justify-end items-center">
        <div
          className={cn(
            "w-6 h-6 rounded-full border flex flex-col justify-center items-center",
            isActive ? "border-emerald-600" : "border-base-content",
          )}
        >
          <div
            className={cn(
              "w-3 h-3 bg-emerald-600 rounded-full transition-all duration-150 ease-in-out",
              isActive ? "animate-radio-active" : "opacity-0 scale-0",
            )}
          />
        </div>
      </div>
    </button>
  );
};

export default CardPembayaran;
