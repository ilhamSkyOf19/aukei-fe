import type { FC, RefObject } from "react";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import { formatRupiah, getDaysFromWeeks } from "../../../helpers/helpers";
import {
  CalendarDays,
  CalendarDaysIcon,
  CircleDollarSign,
  HandCoins,
  Receipt,
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
import ButtonSubmit from "../../ui/button/ButtonSubmit";
import RowJadwaTempo from "../../ui/RowJadwalTempo";
import ModalInputTanggalTempo from "../ModalInputTanggalTempo";
import ButtonWithIcon from "../../ui/button/ButtonWithIcon";

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
    tenorController,
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
  } = useModalTempoPayment({
    data,
    handleCloseModal,
    handleSetDataTempo,
    booking,
  });

  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div className="modal-box lg:w-3/6 rounded-xl max-w-5xl max-h-[95vh] bg-base-200 dark:border dark:border-base-content/10">
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
                  <Receipt className="size-4 text-custom-secondary" />
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
                  <CircleDollarSign className="size-4 text-custom-secondary" />
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
                  caption="Tambahkan uang muka jika pelanggan melakukan pembayaran di awal"
                  max={data.total}
                />
              )}

              <div className="w-full flex flex-row justify-between gap-2 items-center">
                {/* tenor */}
                <InputNumber<CreateTempoType>
                  controller={tenorController}
                  label="Tenor"
                  placeholder="Contoh: 4"
                  required
                  max={12}
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

          {/* show modal input tanggal */}
          <div className="w-full flex flex-row justify-start items-start mb-2.5">
            <ButtonWithIcon
              icon={CalendarDaysIcon}
              label="Custom Tanggal Mulai"
              handleBtn={() => {
                handleCloseModal();
                handleShowModalInputTanggal();
              }}
            />
          </div>

          {/* jadwal tempo */}
          <RowJadwaTempo dataTempo={dataTempo} />
        </div>

        {/* button batal dan simpan */}
        <div className="w-full flex flex-row justify-end items-center gap-4 mt-4">
          <ButtonCloseText handleClose={handleCloseModal} />
          <ButtonSubmit
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
    </dialog>
  );
};

// rows
export default ModalTempoPayment;
