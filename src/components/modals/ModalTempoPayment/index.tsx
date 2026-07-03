import type { FC, RefObject } from "react";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import { cn } from "../../../utils/cn";
import { formatRupiah, getDaysFromWeeks } from "../../../helpers/helpers";
import {
  CalendarDays,
  CalendarDaysIcon,
  CircleDollarSign,
  Receipt,
  Trash2,
} from "lucide-react";
import InputPrice from "../../inputs/InputPrice";
import type {
  CreateTempoType,
  DataTempoType,
} from "../../../models/tempo.model";
import useModalTempoPayment from "./useModalTempoPayment";
import InputChoose from "../../inputs/InputChoose";
import InputNumber from "../../inputs/InputNumber";
import { formatTanggalPanjang } from "../../../helpers/formatDate";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonSubmit from "../../ui/button/ButtonSubmit";

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
          <div className="w-full flex flex-col justify-start items-start gap-2">
            {/* title */}
            <h3 className="text-xs font-medium text-base-content">
              Jadwal Cicilan Tempo
            </h3>

            <div className="w-full flex flex-col justify-start items-start border overflow-hidden border-base-content/10 rounded-lg">
              {/* header */}
              <div className="w-full grid grid-cols-10 gap-2 px-4 py-3 bg-gray-200 sticky top-0 z-10">
                {/* number */}
                <div className="col-span-1 flex flex-row justify-start items-center">
                  <span className="text-xs font-semibold text-base-content/80">
                    No
                  </span>
                </div>

                <div className="col-span-4 flex flex-row justify-start items-center gap-4">
                  <span className="text-xs font-semibold text-base-content/80">
                    Tanggal Jatuh Tempo
                  </span>
                </div>

                {/* nominal */}
                <div className="col-span-3 flex flex-row justify-start items-center">
                  <span className="text-xs font-semibold text-base-content/80">
                    Nominal
                  </span>
                </div>

                <div className="col-span-2 flex flex-row justify-end items-center">
                  <span className="text-xs font-semibold text-base-content/80">
                    Aksi
                  </span>
                </div>
              </div>

              {/* rows data */}
              <div className="w-full flex flex-col justify-start items-start  max-h-60 overflow-y-auto scrollbar-thumb-custom-secondary">
                {dataTempo.length > 0 ? (
                  dataTempo.map((item) => (
                    <Rows
                      key={item.cicilanKe}
                      number={item.cicilanKe}
                      nominal={item.nominal}
                      jatuhTempo={item.jatuhTempo}
                      lastIndex={item.cicilanKe === dataTempo.length}
                    />
                  ))
                ) : (
                  <div className="col-span-10 flex flex-row w-full justify-center items-center py-12 px-4">
                    <span className="text-xs text-base-content/50">
                      Silahkan pilih jumlah cicilan dan tenor
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
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
type RowsType = {
  number: number;
  jatuhTempo: Date;
  nominal: number;
  lastIndex?: boolean;
};
const Rows: FC<RowsType> = ({ nominal, number, jatuhTempo, lastIndex }) => {
  return (
    <div
      className={cn(
        "w-full grid grid-cols-10 gap-2 px-4 py-3",
        !lastIndex && "border-b border-base-content/10",
      )}
    >
      {/* number */}
      <div className="col-span-1 flex flex-row justify-start items-center">
        <div className="w-6 h-6 flex flex-row justify-center items-center rounded-full bg-custom-primary/50">
          <span className="text-custom-secondary text-[0.625rem] font-medium">
            {number}
          </span>
        </div>
      </div>

      {/* date */}
      <div className="col-span-4 flex flex-row justify-start items-center gap-4">
        {/* icon */}
        <CalendarDaysIcon className="size-4 text-base-content" />

        {/* date */}
        <span className="text-xs font-medium text-base-content">
          {formatTanggalPanjang(jatuhTempo)}
        </span>
      </div>

      {/* nominal */}
      <div className="col-span-3 flex flex-row justify-start items-center">
        <span className="text-xs font-semibold text-info">
          {formatRupiah(nominal)}
        </span>
      </div>

      <div className="col-span-2 flex flex-row justify-end items-center">
        <button type="button" className="group">
          <Trash2 className="size-4 text-base-content/50 group-hover:text-error transition-all duration-150 ease-in-out" />
        </button>
      </div>
    </div>
  );
};
export default ModalTempoPayment;
