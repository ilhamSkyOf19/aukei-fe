import { type FC } from "react";
import ShowProduk from "./ShowProduk";
import {
  Minus,
  Phone,
  Receipt,
  ShoppingCart,
  Trash2,
  UsersRound,
} from "lucide-react";
import { formatNumberPhone, formatRupiah } from "../../../../helpers/helpers";
import { useController, type Control } from "react-hook-form";
import type { DetailsForCreate } from "../../../../models/transaction.model";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import InputQtyInTable from "../../../../components/inputs/InputQtyInTable";
import InputNumberInTable from "../../../../components/inputs/InputNumberInTable";
import usePilihProduk from "./usePilihProduk";
import ModalChoosePelanggan from "../../../../components/modals/ModalChoosePelanggan";
import Alert from "../../../../components/messages/Alert";
import { ALERT_CONFIG_TRANSACTION } from "../../../../types/alert.types";
import { cn } from "../../../../utils/cn";
import Avatar from "../../../../components/ui/Avatar";

type Props = {
  step: number;
  handleSteps: (value: number) => void;
  handleToast: (value: string) => void;
};
const PilihProduk: FC<Props> = ({ handleSteps, step, handleToast }) => {
  // call use
  const {
    control,
    fieldsDetails,
    handleAppend,
    handleRemoveAll,
    handleSetPelanggan,
    handleStepsNext,
    isErrorsFormState,
    pelanggan,
    produkDetails,
    removeDetails,
    handleCloseModalChoosePelanggan,
    handleShowModalChoosePelanggan,
    modalChoosePelangganRef,
    alert,
    isUpdate,
    handleSimpanKeranjang,
    isPendingSimpanKeranjang,
  } = usePilihProduk({ handleSteps, step, handleToast });

  return (
    <div className="w-full flex flex-row justify-between items-start gap-4 p-4">
      {alert && (
        <Alert
          alert={alert?.id !== null}
          isAnimationOut={alert?.isAnimationOut || false}
          label={ALERT_CONFIG_TRANSACTION[alert.type].message}
        />
      )}

      {/* content left */}
      <div className="w-full flex-1 flex flex-col justify-start items-start gap-4">
        {/* pelanggan */}
        <div
          className={cn(
            "w-full flex flex-row justify-between items-center border rounded-lg py-2.5 px-3",
            isErrorsFormState.includes("pelanggan")
              ? "border-error"
              : "border-base-content/10",
          )}
        >
          {/* avatar, name, no telp */}
          <div className="flex-1 flex flex-row justify-start items-center gap-3">
            {pelanggan === null ? (
              <span className="text-sm text-base-content/80 font-medium">
                Silahkan pilih pelanggan
              </span>
            ) : (
              <>
                {/* avatar */}
                <Avatar nama={pelanggan.nama} />
                <div className="flex flex-col justify-start items-start gap-1">
                  {/* name */}
                  <span className="text-base-content font-medium text-sm">
                    {pelanggan.nama}
                  </span>
                  {/* no telp */}
                  <div className="w-full flex flex-row justify-start items-center gap-2">
                    <Phone className="size-3 text-base-content/50" />
                    <span className="text-base-content/50 font-semibold text-xs">
                      {formatNumberPhone(pelanggan.noWa)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* button */}
          <div className="flex-1 flex flex-row justify-end items-center">
            <ButtonWithIcon
              icon={UsersRound}
              label="Pilih Pelanggan"
              handleBtn={() => handleShowModalChoosePelanggan()}
            />
          </div>
        </div>

        {/* preview produk */}
        <div
          className={cn(
            "w-full flex flex-col justify-start items-start rounded-lg border",
            isErrorsFormState.includes("details")
              ? "border-error"
              : "border-base-content/10",
          )}
        >
          {/* header */}
          <div className="w-full flex flex-row justify-between items-center px-4 py-3">
            <h3 className="text-sm font-medium text-base-content">
              Data Transaksi
            </h3>

            {produkDetails.length > 0 && (
              <button
                type="button"
                className="py-1.5 px-2 flex flex-row justify-start items-center gap-2 border border-transparent hover:border-error rounded-md transition-all duration-150 ease-in-out"
                onClick={handleRemoveAll}
              >
                <Trash2 className="size-4 text-error" />
                <span className="text-[0.7rem] font-medium text-error">
                  Kosongkan Semua
                </span>
              </button>
            )}
          </div>

          {/* data */}
          <div className="w-full flex flex-col justify-start items-start pb-6">
            <div className="overflow-x-auto w-full">
              <table className="table table-xs">
                {/* head */}
                <thead>
                  <tr className="text-[0.625rem] bg-base-content/5 h-8">
                    <th>Gambar</th>
                    <th>Nama Produk</th>
                    <th>Harga Terakhir</th>
                    <th>Harga (Rp)</th>
                    <th>Diskon (Rp)</th>
                    <th>Jumlah</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  {fieldsDetails.length > 0 ? (
                    fieldsDetails.map((item, index) => (
                      <tr key={item.id} className="h-18">
                        <td>
                          <div className="avatar">
                            <div className="mask mask-squircle h-10 w-10">
                              <img
                                src={produkDetails[index].img}
                                alt="gambar produk"
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col justify-start items-start gap-px">
                            <p>{produkDetails[index].nama}</p>
                            <span className="font-medium text-base-content/50">
                              {produkDetails[index].kode}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="-translate-y-1/2">
                            {produkDetails[index].hargaJualTerakhirTransaksi
                              ? formatRupiah(
                                  produkDetails[index]
                                    .hargaJualTerakhirTransaksi,
                                )
                              : "-"}
                          </span>
                        </td>
                        <td>
                          <InputNumber
                            control={control}
                            index={index}
                            field="hargaJual"
                          />
                        </td>
                        <td>
                          <InputNumber
                            control={control}
                            index={index}
                            field="diskon"
                          />
                        </td>
                        <td>
                          <InputQty control={control} index={index} />
                        </td>
                        <td className="h-full">
                          <span className="-translate-y-1/2 font-medium text-base-content h-full flex flex-row justify-start items-start">
                            {formatRupiah(
                              produkDetails[index].subTotal -
                                produkDetails[index].diskon,
                            )}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="opacity-50 hover:opacity-100 transition-opacity duration-200 ease-in-out group p-px"
                            onClick={() => removeDetails(index)}
                          >
                            <Trash2 className="size-4 group-hover:text-error transition-color duration-200 ease-in-out" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8}>
                        <div className="w-full flex flex-row justify-center items-center pt-10">
                          <span className="text-sm text-base-content/50">
                            Silahkan pilih produk
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* total */}
        <div className="w-full flex flex-col justify-start items-start rounded-lg border border-base-content/10 px-3 py-4">
          {/* sub total & total diskon */}
          <div className="w-full flex flex-col justify-start items-start gap-2.5 pb-4 border-b border-base-content/10">
            {/* sub total */}
            <div className="w-full flex flex-row justify-between items-center">
              <span className="text-xs font-medium text-base-content/60">
                Subtotal
              </span>
              <span className="text-xs font-medium text-base-content">
                {formatRupiah(
                  produkDetails.reduce((a, b) => a + b.subTotal, 0),
                )}
              </span>
            </div>

            {/* total diskon */}
            <div className="w-full flex flex-row justify-between items-center">
              <span className="text-xs font-medium text-base-content/60">
                Total Diskon
              </span>
              <div className="flex flex-row justify-start items-center gap-1">
                {produkDetails.reduce((a, b) => a + b.diskon, 0) > 0 && (
                  <span className="text-xs font-medium text-error">
                    <Minus className="size-2" />
                  </span>
                )}

                <span className="text-xs font-medium text-error">
                  {formatRupiah(
                    produkDetails.reduce((a, b) => a + b.diskon, 0),
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* total */}
          <div className="w-full flex flex-row justify-between items-center pt-4 pb-1">
            <span className="text-sm font-medium text-base-content">Total</span>
            <span className="text-base font-medium text-emerald-600">
              {formatRupiah(
                produkDetails.reduce((a, b) => a + (b.subTotal - b.diskon), 0),
              )}
            </span>
          </div>
        </div>

        {/* button chart and transaksi */}
        <div className="w-full flex flex-row justify-between items-center gap-4">
          {/* button chart */}
          <button
            type="button"
            className="flex flex-row justify-center items-center gap-4 h-12 flex-1 rounded-lg border border-custom-primary hover-overlay hover:border-base-content/10"
            onClick={handleSimpanKeranjang}
          >
            {isPendingSimpanKeranjang ? (
              <div className="loading loading-sm text-base-content" />
            ) : (
              <>
                {/* icon */}
                <ShoppingCart className="size-5 text-base-content" />
                <span className="text-base-content text-xs font-semibold">
                  Masukan ke Keranjang
                </span>
              </>
            )}
          </button>
          <button
            type="button"
            className="flex flex-row justify-center items-center gap-4 h-12 border border-custom-primary flex-1 rounded-lg bg-custom-primary hover-overlay"
            onClick={handleStepsNext}
          >
            {/* icon */}
            <Receipt className="size-4 text-custom-secondary" />
            <span className="text-custom-secondary text-xs font-semibold">
              {isUpdate ? "Simpan Transaksi" : "Buat Transaksi"}
            </span>
          </button>
        </div>
      </div>

      {/* content right */}
      <ShowProduk
        handleAppend={handleAppend}
        step={step}
        pelangganId={pelanggan?.id}
      />

      {/* modal choose pelanggan  */}
      <ModalChoosePelanggan
        handleChoose={handleSetPelanggan}
        handleShowModal={handleShowModalChoosePelanggan}
        modalRef={modalChoosePelangganRef}
        handleCloseModal={handleCloseModalChoosePelanggan}
      />
    </div>
  );
};

type InputNumberProps = {
  control: Control<{ details: DetailsForCreate[] }>;
  field: "hargaJual" | "diskon";
  index: number;
};
// input
const InputNumber: FC<InputNumberProps> = ({ control, index, field }) => {
  const controller = useController({
    control,
    name: `details.${index}.${field}`,
  });

  return (
    <InputNumberInTable<{ details: DetailsForCreate[] }>
      controller={controller}
      required
    />
  );
};

// qty props
type QtyProps = {
  control: Control<{ details: DetailsForCreate[] }>;
  index: number;
};

// harga input qty
const InputQty: FC<QtyProps> = ({ control, index }) => {
  const controller = useController({
    control,
    name: `details.${index}.quantity`,
  });

  return (
    <InputQtyInTable<{ details: DetailsForCreate[] }>
      controller={controller}
      required
    />
  );
};

export default PilihProduk;
