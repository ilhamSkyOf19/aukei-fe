import type { FC, RefObject } from "react";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import { cn } from "../../../utils/cn";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import type { IProduk } from "../../../models/produk.model";
import InputPrice from "../../inputs/InputPrice";
import { formatRupiah } from "../../../helpers/helpers";
import AlertLabel from "../../messages/AlertLabel";
import { ArrowDown, ArrowUp, CircleDollarSign, RefreshCcw } from "lucide-react";
import ButtonText from "../../ui/button/ButtonText";
import useModalGenerateHargaJual from "./useModalGenerateHargaJual";
import ButtonWithIcon from "../../ui/button/ButtonWithIcon";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  data?: Partial<
    Pick<IProduk, "id" | "nama" | "img" | "hargaJual" | "kategori" | "kode">
  >;
  handleSetToast: (toast: string) => void;
  noInfo?: boolean;
};

const ModalGenerateHargaJual: FC<Props> = ({
  modalRef,
  handleCloseModal,
  data,
  handleSetToast,
  noInfo,
}) => {
  const {
    customLabaController,
    handleGenerateHargaJual,
    isPendingGetHargaModal,
    hasilGenerateHargaJual,
    handleBatal,
    handleUpdateHargaJual,
    isPendingUpdateHargaJual,
    handleBulatkanKeAtas,
    handleBulatkanKeBawah,
  } = useModalGenerateHargaJual({
    handleCloseModal,
    handleSetToast,
    fromDetail: noInfo,
  });

  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div
        className={cn(
          "modal-box max-w-3xl rounded-xl max-h-[90vh] bg-base-200 dark:border dark:border-base-content/10",
          noInfo ? "md:w-3/4 lg:w-4/12" : "lg:w-3/4",
        )}
      >
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title="Formulir Kalkulasi Harga Jual"
              keterangan={`Formulir untuk menghitung Harga Jual`}
              withIcon={{
                icon: CircleDollarSign,
              }}
            />
          </div>

          <div className="w-full flex flex-col md:flex-row justify-start items-start gap-2.5 md:gap-4">
            {/* data  */}
            {!noInfo && (
              <div className="w-full md:flex-2 flex flex-col justify-start items-start gap-4 mt-4">
                {/* img */}
                {data?.img && (
                  <div className="w-full flex justify-center items-center">
                    <img
                      src={data.img}
                      alt="wall panel"
                      className="w-full h-40 md:h-60 object-contain"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* data */}
                <div className="w-full flex flex-col justify-start items-start gap-2.5">
                  <div className="w-full flex flex-col justify-around items-start gap-2.5 md:pb-4">
                    {/* nama produk */}
                    <div className="w-full flex flex-row justify-start items-start gap-2.5">
                      <Label label={`Nama Produk`} value={data?.nama || ""} />

                      {/* kode produk */}
                      <Label
                        label={`Kode Produk`}
                        value={data?.kode || ""}
                        small
                      />
                    </div>

                    {/* harga jual */}
                    <Label
                      label={`Harga Jual`}
                      value={formatRupiah(data?.hargaJual ?? "")}
                      small
                    />
                  </div>
                </div>
              </div>
            )}

            {/* form */}
            <form
              className={cn(
                "w-full md:flex-2 flex flex-col justify-start items-center",
                noInfo && "mt-4",
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleGenerateHargaJual(data?.id);
                }
              }}
            >
              {/* harga jual */}
              <InputPrice<{ customLaba: number }>
                label={`Target Laba`}
                required={true}
                controller={customLabaController}
                placeholder={`Contoh: 10.000`}
                name="customLaba"
              />

              {/* button generate  */}
              <ButtonWithIcon
                label="Kalkulasi Harga Jual"
                icon={RefreshCcw}
                bgColor="bg-info"
                textColor="text-primary-white"
                customWidth="w-full"
                isLoading={isPendingGetHargaModal}
                handleBtn={() => handleGenerateHargaJual(data?.id)}
              />

              {/* sub total */}
              <div className="w-full flex flex-col justify-start items-start gap-2 mt-2">
                <span className="text-xs text-base-content">
                  Hasil Kalkulasi
                </span>
                <div className="flex flex-row justify-start items-center gap-8">
                  <span className="text-lg font-semibold text-base-content">
                    {isPendingGetHargaModal ? (
                      <div className="loading loading-sm text-base-content" />
                    ) : (
                      formatRupiah(hasilGenerateHargaJual.final)
                    )}
                  </span>

                  {/* aksi */}
                  <div className="flex flex-row justify-start items-center gap-2.5">
                    {/* button bulatkan ke atas  */}
                    <div className="tooltip" data-tip="Bulatkan ke atas">
                      <ButtonWithIcon
                        icon={ArrowUp}
                        noLabel
                        bgColor="bg-success"
                        textColor="text-primary-white"
                        handleBtn={() => handleBulatkanKeAtas()}
                      />
                    </div>

                    {/* button bulatkan ke bawah  */}
                    <div
                      className="tooltip tooltip-bottom"
                      data-tip="Bulatkan ke bawah"
                    >
                      <ButtonWithIcon
                        icon={ArrowDown}
                        noLabel
                        bgColor="bg-error"
                        textColor="text-primary-white"
                        handleBtn={() => handleBulatkanKeBawah()}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* alert */}
              <div className="w-full mt-4 flex flex-col justify-start items-start gap-2.5">
                <AlertLabel message="Hasil Kalkulasi sudah melewati proses pembulatan ke atas." />
                <AlertLabel message="Perhitungan menggunakan seluruh stok yang masih tersedia." />
                <AlertLabel message="Target keuntungan yang Anda masukkan akan dibagi secara merata ke setiap produk yang dipilih." />
              </div>

              {/* action */}
              <div className="w-full mt-6 flex flex-row justify-end items-center gap-4">
                {/* button close */}
                <ButtonCloseText
                  disabled={isPendingGetHargaModal}
                  handleClose={() => {
                    handleBatal();
                  }}
                  label="Batal"
                />
                {/* button submit */}
                <ButtonText
                  typeButton
                  disable={
                    isPendingGetHargaModal || hasilGenerateHargaJual.final === 0
                  }
                  isLoading={isPendingUpdateHargaJual}
                  handleClick={() => handleUpdateHargaJual(data?.id)}
                  label={`Simpan`}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
};

// label
type LabelProps = {
  label: string;
  value: string;
  bold?: boolean;
  small?: boolean;
  withCaption?: string;
};
const Label = ({ label, value, bold, small, withCaption }: LabelProps) => {
  return (
    <div
      className={cn(
        "w-full flex flex-row justify-start items-start border border-base-content/10 rounded-xl p-2.5 gap-0.5",
      )}
    >
      <div className="flex flex-col justify-start items-start gap-1">
        <span className="text-[0.625rem] font-medium text-base-content/80">
          {label}
        </span>
        <span
          className={`text-[0.625rem] md:text-xs ${bold ? "font-bold" : "font-semibold"} ${small ? "text-[0.625rem] md:text-sm" : "text-base"} text-base-content`}
        >
          {value}
        </span>

        {withCaption && (
          <span className="text-[0.625rem] text-base-content/80">
            {withCaption}
          </span>
        )}
      </div>
    </div>
  );
};
export default ModalGenerateHargaJual;
