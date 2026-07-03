import type { FC, RefObject } from "react";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import { formatRupiah, getDaysFromWeeks } from "../../../helpers/helpers";
import { CalendarDays, CircleDollarSign, Receipt } from "lucide-react";
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

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  data: {
    total: number;
  };
  handleCloseModal: () => void;
  handleSetDataTempo: (data: DataTempoType) => void;
};

const ModalTempoPayment: FC<Props> = ({
  modalRef,
  handleCloseModal,
  data,
  handleSetDataTempo,
}) => {
  // call use
  const {
    dataTempo,
    tenorController,
    uangMukaController,
    finalTotal,
    jumlahCicilanController,
    handleSimpan,
    isEmpty,
  } = useModalTempoPayment({ data, handleCloseModal, handleSetDataTempo });

  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div className="modal-box lg:w-3/6 max-w-5xl max-h-[95vh] bg-base-200 dark:border dark:border-base-content/10">
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
              <div className="w-full flex flex-row justify-start items-center gap-4 p-2 rounded-lg border border-base-content/10 hover:bg-custom-primary/5 hover:border-custom-primary transition-all duration-150 ease-in-out">
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
              <div className="w-full flex flex-row justify-start items-center gap-4 p-2 rounded-lg border border-base-content/10 hover:bg-custom-primary/5 hover:border-custom-primary transition-all duration-150 ease-in-out">
                {/* icon */}
                <div className="w-10 h-10 bg-custom-primary/50 rounded-lg flex flex-row justify-center items-center">
                  <CircleDollarSign className="size-4 text-custom-secondary" />
                </div>

                {/* info */}
                <div className="flex flex-col justify-start items-start gap-1">
                  {/* label */}
                  <span className="text-[0.625rem] font-semibold text-base-content/50">
                    Sisa Yang Harus Dibayar
                  </span>
                  <span className="text-sm font-semibold text-base-content">
                    {formatRupiah(finalTotal.sisa)}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-row justify-between items-start gap-4">
              {/* input uang muka */}
              <InputPrice<CreateTempoType>
                controller={uangMukaController}
                label="Uang Muka (Optional)"
                placeholder="Masukan uang muka"
                caption="Tambahkan uang muka jika pelanggan melakukan pembayaran di awal"
                max={data.total}
              />

              <div className="w-full flex flex-row justify-between gap-2 items-center">
                {/* jumlah cicilan */}
                <InputNumber<CreateTempoType>
                  controller={jumlahCicilanController}
                  label="Jumlah Cicilan"
                  placeholder="Contoh: 4"
                  required
                  max={12}
                />

                {/* choose tenor */}
                <InputChoose<CreateTempoType>
                  controller={tenorController}
                  chooseList={Array.from(
                    { length: 4 },
                    (_, index) => index,
                  ).map((item) => ({
                    label: `${item + 1} Minggu`,
                    value: getDaysFromWeeks(item + 1),
                  }))}
                  placeholder="Pilih Tenor"
                  label="Tenor"
                  required
                />
              </div>
            </div>
          </div>

          {/* jadwal tempo */}
          <RowJadwaTempo aksi={true} dataTempo={dataTempo} />
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
    </dialog>
  );
};

// rows
export default ModalTempoPayment;
