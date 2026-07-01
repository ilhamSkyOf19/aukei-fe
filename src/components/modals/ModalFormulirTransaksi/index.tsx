import type { FC, RefObject } from "react";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import { cn } from "../../../utils/cn";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonSubmit from "../../ui/button/ButtonSubmit";
import { AlertCircle } from "lucide-react";
import useModalTransaksi from "./useModalTransaksi";
import type { DetailsForCreate } from "../../../models/transaction.model";
import type { ResponseProdukForKasirType } from "../../../models/produk.model";
import InputQty from "../../inputs/InputQty";
import InputPrice from "../../inputs/InputPrice";
import { formatRupiah } from "../../../helpers/helpers";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleAppend: (
    data: Pick<
      ResponseProdukForKasirType,
      | "nama"
      | "img"
      | "hargaJual"
      | "kode"
      | "hargaJualTerakhirTransaksi"
      | "id"
      | "stok"
    > & { subTotal: number; diskon: number; quantity: number },
  ) => void;
  handleCloseModal: () => void;
  data?: Pick<DetailsForCreate, "produkId" | "hargaJual" | "quantity"> &
    Omit<ResponseProdukForKasirType, "id"> & {
      diskon?: number;
    };
  index?: number;
};

const ModalFormulirTransaksi: FC<Props> = ({
  modalRef,
  handleCloseModal,
  data,
  handleAppend,
  index,
}) => {
  // call use
  const {
    handleSubmit,
    diskonController,
    hargaJualController,
    onSubmit,
    quantityController,
    subTotal,
  } = useModalTransaksi({ handleAppend, handleCloseModal, data });

  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div className="modal-box lg:w-3/4 max-w-5xl max-h-[85vh] bg-base-200 dark:border dark:border-base-content/10">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title="Formulir Transaksi"
              keterangan={`Formulir untuk ${index ? "mengubah" : "menambah"} Data Transaksi`}
            />
          </div>

          {/* data  */}
          <div className="w-full flex flex-row justify-start items-start gap-8">
            <div className="flex-1 flex flex-col justify-start items-start gap-4 mt-4">
              {/* img */}
              {data?.img && (
                <div className="w-full flex justify-center items-center group">
                  <img
                    src={data.img}
                    alt="wall panel"
                    className="w-full h-80 object-contain group-hover:scale-102 transition-all duration-300 origin-center"
                  />
                </div>
              )}

              {/* data */}
              <div className="w-full flex flex-col justify-start items-start gap-4">
                <div className="w-full flex flex-row justify-around items-start gap-4 pb-4 border-b border-base-content/10">
                  {/* nama produk */}
                  <Label label={`Nama Produk`} value={data?.nama || ""} bold />

                  {/* kode produk */}
                  <Label label={`Kode Produk`} value={data?.kode || ""} small />
                  <Label
                    label={`Stok Produk`}
                    value={data?.stok.toString() || ""}
                    small
                    lastIndex
                  />
                </div>

                <div className="w-full flex flex-row justify-around items-start gap-4">
                  {/* harga terakhir transaksi */}
                  <Label
                    label={`Harga Jual Terakhir Transaksi`}
                    value={formatRupiah(data?.hargaJualTerakhirTransaksi ?? "")}
                    small
                  />

                  {/* harga jual */}
                  <Label
                    label={`Harga Jual Patokan`}
                    value={formatRupiah(data?.hargaJual ?? "")}
                    small
                    lastIndex
                  />
                </div>
              </div>
            </div>

            {/* form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={cn(
                "flex-1 flex flex-col justify-start items-center mt-4",
              )}
            >
              {/* harga jual */}
              <InputPrice<DetailsForCreate>
                label={`Harga Jual`}
                required={true}
                controller={hargaJualController}
                placeholder={`Masukan harga jual`}
              />

              {/* diskon */}
              <InputPrice<DetailsForCreate>
                label={`Diskon`}
                controller={diskonController}
                placeholder={`Masukan diskon`}
              />

              {/* input quantity  */}
              <InputQty<DetailsForCreate>
                label={`Jumlah`}
                required={true}
                controller={quantityController}
              />

              {/* sub total */}
              <div className="w-full flex flex-col justify-start items-start gap-2 mt-2">
                <span className="text-sm text-base-content">Sub Total</span>
                <span className="text-base font-semibold text-base-content">
                  {formatRupiah(subTotal)}
                </span>
              </div>

              {/* alert */}
              <div className="w-full gap-2.5 flex flex-row justify-start items-center px-4 py-3 mt-4 rounded-lg bg-blue-600/5 border border-blue-600">
                <AlertCircle className="size-4 text-blue-600" />
                <span className="text-xs">
                  Pastikan data yang diinputkan sudah benar
                </span>
              </div>

              {/* action */}
              <div className="w-full mt-6 flex flex-row justify-end items-center gap-4">
                {/* button close */}
                <ButtonCloseText
                  handleClose={() => {
                    handleCloseModal();
                  }}
                  label="Batal"
                />
                {/* button submit */}
                <ButtonSubmit label={`Simpan`} />
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
  lastIndex?: boolean;
};
const Label = ({ label, value, bold, small, lastIndex }: LabelProps) => {
  return (
    <div
      className={cn(
        "w-full flex flex-row justify-start items-start",
        !lastIndex && "border-r border-base-content/10",
      )}
    >
      <div className="flex flex-col justify-start items-start gap-1">
        <span className="text-xs font-medium text-base-content/50">
          {label}
        </span>
        <span
          className={`text-base ${bold ? "font-bold" : "font-semibold"} ${small ? "text-sm" : "text-base"} text-base-content`}
        >
          {value}
        </span>
      </div>
    </div>
  );
};
export default ModalFormulirTransaksi;
