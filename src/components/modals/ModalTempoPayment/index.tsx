import type { FC, RefObject } from "react";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import { formatRupiah, getDaysFromWeeks } from "../../../helpers/helpers";
import {
  Banknote,
  BanknoteArrowDown,
  CalendarDays,
  HandCoins,
  Landmark,
  QrCode,
  ReceiptText,
} from "lucide-react";
import InputPrice from "../../inputs/InputPrice";
import type {
  CreateTempoType,
  DataTempoType,
} from "../../../models/tempo.model";
import useModalTempoPayment from "./useModalTempoPayment";
import InputChoose from "../../inputs/InputChoose";
import InputNumber from "../../inputs/InputNumber";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import RowJadwaTempo from "../../ui/RowJadwalTempo";
import ModalInputTanggalTempo from "../ModalInputTanggalTempo";
import ButtonWithIcon from "../../ui/button/ButtonWithIcon";
import CardMetodePembayaranSmall from "../../ui/cards/CardMetodePembayaranSmall";
import { PAYMENT_METHOD_TYPE } from "../../../types/constant.type";
import { cn } from "../../../utils/cn";
import ModalCashPayment from "../ModalCashPayment";
import ErrorMessage from "../../messages/ErrorMessage";
import ButtonText from "../../ui/button/ButtonText";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  data: {
    total: number;
    dp?: number;
  };
  handleCloseModal: () => void;
  handleShowModal: () => void;
  handleSetDataTempo: (data: DataTempoType) => void;
  booking?: true;
};

const ModalTempoPayment: FC<Props> = ({
  modalRef,
  handleCloseModal,
  data,
  handleSetDataTempo,
  booking,
  handleShowModal,
}) => {
  // call use
  const {
    dataTempo,
    jumlahCicilanController,
    uangMukaController,
    finalTotal,
    periodeController,
    handleSimpan,
    isEmpty,
    startDateController,
    setValue,
    handleCLoseModalInputTanggal,
    handleShowModalInputTanggal,
    modalInputTanggalRef,
    metodePembayaranUangMukaController,
    debouncedUangMuka,
    errors,
    metodePembayaranUangUangMukaWatch,
    startDateWatch,
    handleCloseModalCalculator,
    handleShowModalCalculator,
    modalCalculatorRef,
    isErrors,
    handlePay,
    pembayaranUangMukaCash,
  } = useModalTempoPayment({
    data,
    handleCloseModal,
    handleSetDataTempo,
    booking,
  });

  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div className="modal-box lg:w-3/6 rounded-xl max-w-5xl max-h-[95vh] bg-base-200 dark:border dark:border-base-content/10 scrollbar-thin scrollbar-thumb-custom-secondary">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title="Formulir Tempo Pembayaran"
              keterangan={`Atur Tempo Pembayaran untuk transaksi ini.`}
              withIcon={{
                icon: CalendarDays,
              }}
            />
          </div>

          {/* data  */}
          <div className="w-full flex flex-col justify-start items-start gap-1">
            {/* content 1 */}
            <div className="w-full mb-1 flex flex-row justify-between items-start gap-4 mt-4">
              {/* total tagihan */}
              {booking && (
                <div className="w-full flex flex-row justify-start items-center gap-4 p-2 rounded-xl border border-base-content/10 hover:bg-custom-primary/5 hover:border-custom-primary transition-all duration-150 ease-in-out">
                  {/* icon */}
                  <div className="w-10 h-10 bg-custom-primary/50 rounded-lg flex flex-row justify-center items-center">
                    <HandCoins className="size-4 text-custom-secondary" />
                  </div>

                  {/* info */}
                  <div className="flex flex-col justify-start items-start gap-1">
                    {/* label */}
                    <span className="text-[0.625rem] font-semibold text-base-content/50">
                      Uang Muka (DP)
                    </span>
                    <span className="text-sm font-semibold text-base-content">
                      {formatRupiah(data.dp ?? 0)}
                    </span>
                  </div>
                </div>
              )}

              {/* total tagihan */}
              <div className="w-full flex flex-row justify-start items-center gap-4 p-2 rounded-xl border border-base-content/10 hover:bg-custom-primary/5 hover:border-custom-primary transition-all duration-150 ease-in-out">
                {/* icon */}
                <div className="w-10 h-10 bg-custom-primary/50 rounded-lg flex flex-row justify-center items-center">
                  <ReceiptText className="size-4 text-custom-secondary" />
                </div>

                {/* info */}
                <div className="flex flex-col justify-start items-start gap-1">
                  {/* label */}
                  <span className="text-[0.625rem] font-semibold text-base-content/50">
                    Total Tagihan
                  </span>
                  <span className="text-sm font-semibold text-base-content">
                    {formatRupiah(finalTotal.totalTagihan)}
                  </span>
                </div>
              </div>

              {/* sisa belum terjadwal */}
              <div className="w-full flex flex-row justify-start items-center gap-4 p-2 rounded-xl border border-base-content/10 hover:bg-custom-primary/5 hover:border-custom-primary transition-all duration-150 ease-in-out">
                {/* icon */}
                <div className="w-10 h-10 bg-custom-primary/50 rounded-lg flex flex-row justify-center items-center">
                  <ReceiptText className="size-4 text-custom-secondary" />
                </div>

                {/* info */}
                <div className="flex flex-col justify-start items-start gap-1">
                  {/* label */}
                  <span className="text-[0.625rem] font-semibold text-base-content/50">
                    Sisa Tagihan
                  </span>
                  <span className="text-sm font-semibold text-base-content">
                    {formatRupiah(finalTotal.sisa)}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-row justify-between items-start gap-4">
              {/* input uang muka */}
              {!booking && (
                <InputPrice<CreateTempoType>
                  controller={uangMukaController}
                  label="Uang Muka (Optional)"
                  placeholder="Masukan uang muka"
                  max={data.total}
                  name="uangMuka"
                />
              )}

              <div className="w-full flex flex-row justify-between gap-2 items-center">
                {/* tenor */}
                <InputNumber<CreateTempoType>
                  controller={jumlahCicilanController}
                  label="Jumlah Cicilan"
                  placeholder="Contoh: 4"
                  required
                  max={12}
                  name="jumlahCicilan"
                />

                {/* choose periode */}
                <InputChoose<CreateTempoType>
                  controller={periodeController}
                  chooseList={Array.from(
                    { length: 4 },
                    (_, index) => index,
                  ).map((item) => ({
                    label: `${item + 1} Minggu`,
                    value: getDaysFromWeeks(item + 1),
                  }))}
                  placeholder="Pilih Periode"
                  label="Periode"
                  required
                />
              </div>
            </div>
          </div>

          {debouncedUangMuka > 0 && (
            <>
              <div className="w-full flex flex-col justify-start items-start mb-2.5 gap-2.5">
                {/* label */}
                <span className="text-xs font-medium text-base-content">
                  Pilih Metode Pembayaran Uang Muka
                </span>
                <div
                  className={cn(
                    "w-full flex flex-row justify-start items-center gap-2.5",
                  )}
                >
                  {/* cash */}
                  <CardMetodePembayaranSmall
                    icon={Banknote}
                    bgColor="bg-emerald-50"
                    iconColor="text-emerald-500"
                    label="Tunai"
                    description="Bayar dengan uang tunai."
                    handleClick={() =>
                      metodePembayaranUangMukaController.field.onChange("CASH")
                    }
                    isActive={
                      metodePembayaranUangUangMukaWatch ===
                      PAYMENT_METHOD_TYPE.CASH
                    }
                    isError={
                      errors?.metodePembayaranUangDp?.message !== undefined
                    }
                    noDeskripsi
                  />

                  {/* transfer */}
                  <CardMetodePembayaranSmall
                    icon={Landmark}
                    bgColor="bg-blue-50"
                    iconColor="text-blue-500"
                    label="Transfer Bank"
                    description="Bayar melalui transfer bank."
                    handleClick={() =>
                      metodePembayaranUangMukaController.field.onChange(
                        "TRANSFER",
                      )
                    }
                    isActive={
                      metodePembayaranUangUangMukaWatch ===
                      PAYMENT_METHOD_TYPE.TRANSFER
                    }
                    isError={
                      errors?.metodePembayaranUangDp?.message !== undefined
                    }
                    noDeskripsi
                  />

                  {/* qris */}
                  <CardMetodePembayaranSmall
                    icon={QrCode}
                    bgColor="bg-purple-50"
                    iconColor="text-purple-500"
                    label="QRIS"
                    description="Bayar melalui QRIS."
                    handleClick={() =>
                      metodePembayaranUangMukaController.field.onChange("QRIS")
                    }
                    isActive={
                      metodePembayaranUangUangMukaWatch ===
                      PAYMENT_METHOD_TYPE.QRIS
                    }
                    isError={
                      errors?.metodePembayaranUangDp?.message !== undefined
                    }
                    noDeskripsi
                  />
                </div>

                {errors?.metodePembayaranUangDp?.message && (
                  <span className="text-[0.625rem] text-rose-500">
                    {errors?.metodePembayaranUangDp?.message}
                  </span>
                )}
              </div>

              {metodePembayaranUangUangMukaWatch ===
                PAYMENT_METHOD_TYPE.CASH && (
                <div className="w-full flex flex-col justify-start items-start gap-0.5 mb-6 mt-1.5">
                  <div className="w-full flex flex-row justify-start items-center gap-2.5">
                    {/* button bayar */}
                    <div className="pr-4 flex flex-row justify-start items-center gap-2.5 border-r border-base-content/30">
                      <ButtonWithIcon
                        handleBtn={() => handleShowModalCalculator()}
                        label="Bayar"
                        icon={BanknoteArrowDown}
                      />
                    </div>

                    {/* ringkasan pembayaran cash uang masuk */}
                    <div className="flex flex-col justify-start items-center gap-1.5">
                      <div className="w-full grid grid-cols-3 gap-12">
                        {/* label */}
                        <span className="text-[0.625rem] col-span-1 text-base-content">
                          Uang Pembayaran
                        </span>

                        {/* value */}
                        <span className="text-[0.625rem] col-span-2 font-medium text-base-content">
                          {formatRupiah(pembayaranUangMukaCash)}
                        </span>
                      </div>
                      <div className="w-full grid grid-cols-3 gap-12">
                        {/* label */}
                        <span className="text-[0.625rem] col-span-1 text-base-content">
                          Kembalian
                        </span>

                        {/* value */}
                        <span className="text-[0.625rem] col-span-2 text-base-content font-medium">
                          {formatRupiah(
                            pembayaranUangMukaCash === 0
                              ? 0
                              : pembayaranUangMukaCash - debouncedUangMuka,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* error */}
                  {isErrors.includes("DATA_DI_BAYAR_KOSONG") && (
                    <div className="w-full justify-start items-start">
                      <ErrorMessage
                        xs
                        errorMessage="Harap melakukan pembayaran tunai"
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* jadwal tempo */}
          <RowJadwaTempo
            dataTempo={dataTempo}
            handleCustomTanggal={() => {
              handleCloseModal();
              handleShowModalInputTanggal();
            }}
            startDateWatch={startDateWatch}
            noAksi={true}
          />
        </div>

        {/* button batal dan simpan */}
        <div className="w-full flex flex-row justify-end items-center gap-4 mt-4">
          <ButtonCloseText handleClose={handleCloseModal} />
          <ButtonText
            handleClick={handleSimpan}
            label="Simpan"
            disable={isEmpty}
          />
        </div>
      </div>

      {/* modal range date */}
      <ModalInputTanggalTempo<CreateTempoType>
        modalRef={modalInputTanggalRef}
        handleCloseModal={() => {
          handleCLoseModalInputTanggal();
          handleShowModal();
        }}
        useControll={startDateController}
        handleReset={() => setValue("startDate", undefined)}
      />

      {/* modal cash payment */}
      <ModalCashPayment
        modalRef={modalCalculatorRef}
        handleCloseModal={() => {
          handleCloseModalCalculator();
          handleShowModal();
        }}
        handlePay={(value: number) => {
          handlePay(value);
          handleShowModal();
        }}
        total={debouncedUangMuka}
      />
    </dialog>
  );
};

// rows
export default ModalTempoPayment;
