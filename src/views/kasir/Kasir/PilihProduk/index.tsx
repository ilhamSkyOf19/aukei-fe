import React, { type FC } from "react";
import ShowProduk from "../ShowProduk";
import { Minus, Receipt, ShoppingCart, Trash2, UsersRound } from "lucide-react";
import { formatRupiah, highlightName } from "../../../../helpers/helpers";
import {
  useController,
  type Control,
  type FieldArrayWithId,
  type UseFieldArrayRemove,
} from "react-hook-form";
import type {
  CreateTransactionForRequestType,
  DetailsForCreate,
  UpdateTransactionForRequestType,
} from "../../../../models/transaction.model";
import type { ResponseProdukForKasirType } from "../../../../models/produk.model";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import InputQtyInTable from "../../../../components/inputs/InputQtyInTable";
import InputNumberInTable from "../../../../components/inputs/InputNumberInTable";
import DataEmpty from "../../../../components/messages/DataEmpty";

type Props = {
  fieldsDetails: FieldArrayWithId<
    UpdateTransactionForRequestType | CreateTransactionForRequestType,
    "details",
    "id"
  >[];
  handleAppend: (
    produk: Pick<DetailsForCreate, "hargaJual" | "quantity" | "produkId"> &
      Omit<ResponseProdukForKasirType, "id">,
  ) => void;
  removeDetails: UseFieldArrayRemove;
  produkDetails: (Pick<
    ResponseProdukForKasirType,
    "hargaJual" | "id" | "nama" | "kode" | "img" | "hargaJualTerakhirTransaksi"
  > & {
    subTotal: number;
    diskon: number;
  })[];
  control: Control<
    UpdateTransactionForRequestType | CreateTransactionForRequestType,
    any,
    UpdateTransactionForRequestType | CreateTransactionForRequestType
  >;
  handleStepsNext: () => void;
};

const PilihProduk: FC<Props> = ({
  control,
  fieldsDetails,
  handleAppend,
  produkDetails,
  removeDetails,
  handleStepsNext,
}) => {
  return (
    <div className="w-full flex flex-row justify-between items-start gap-4 p-4">
      {/* content left */}
      <div className="w-full flex-1 flex flex-col justify-start items-start gap-4">
        {/* pelanggan */}
        <div className="w-full flex flex-row justify-between items-center border border-base-content/10 rounded-lg p-2.5">
          {/* avatar, name, no telp */}
          <div className="flex-1 flex flex-row justify-start items-center gap-2">
            {/* avatar */}
            <div className="avatar avatar-placeholder">
              <div className="bg-custom-primary text-neutral-content w-11 rounded-full">
                <span className="text-base text-custom-secondary font-medium uppercase">
                  {highlightName("Budi Santoso")}
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-1">
              {/* name */}
              <span className="text-base-content font-medium text-sm">
                Budi Santoso
              </span>
              {/* no telp */}
              <span className="text-base-content/50 font-semibold text-xs">
                08123456789
              </span>
            </div>
          </div>

          {/* button */}
          <div className="flex-1 flex flex-row justify-end items-center">
            <ButtonWithIcon
              icon={UsersRound}
              label="Ganti Pelanggan"
              handleBtn={() => {}}
            />
          </div>
        </div>

        {/* preview produk */}
        <div className="w-full flex flex-col justify-start items-start rounded-lg border border-base-content/10">
          {/* header */}
          <div className="w-full flex flex-row justify-start items-center px-2.5 py-4">
            <h3 className="text-sm font-medium text-base-content">
              Data Transaksi
            </h3>
          </div>

          {/* data */}
          <div className="w-full flex flex-col justify-start items-start">
            <div className="overflow-x-auto w-full">
              <table className="table table-xs">
                {/* head */}
                <thead>
                  <tr className="text-[0.625rem]">
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
                      <tr key={item.id}>
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
                          <span>
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
                        <td>
                          <span className="font-medium text-base-content">
                            {formatRupiah(
                              produkDetails[index].subTotal -
                                produkDetails[index].diskon,
                            )}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="opacity-50 hover:opacity-100 transition-opacity duration-200 ease-in-out group"
                            onClick={() => removeDetails(index)}
                          >
                            <Trash2 className="size-4 group-hover:text-error" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <td colSpan={8}>
                      <div className="w-full flex flex-row justify-center items-center pt-10">
                        <span className="text-sm text-base-content/50">
                          Silahkan pilih produk
                        </span>
                      </div>
                    </td>
                  )}
                </tbody>
              </table>
            </div>

            {/* button delete all */}
            <div className="w-full flex flex-row justify-start items-start pt-8 pb-4 px-2">
              {produkDetails.length > 0 && (
                <button
                  type="button"
                  className="py-1.5 px-2 flex flex-row justify-start items-center gap-2 bg-error btn btn-sm hover-overlay"
                >
                  <Trash2 className="size-4 text-primary-white" />
                  <span className="text-[0.7rem] font-medium text-primary-white">
                    Kosongkan Semua
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* total */}
        <div className="w-full flex flex-col justify-start items-start rounded-lg border border-base-content/10 px-2.5 py-4">
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
          >
            {/* icon */}
            <ShoppingCart className="size-5 text-base-content" />
            <span className="text-base-content text-xs font-semibold">
              Masukan ke Keranjang
            </span>
          </button>
          <button
            type="button"
            className="flex flex-row justify-center items-center gap-4 h-12 border border-custom-primary flex-1 rounded-lg bg-custom-primary hover-overlay"
            onClick={handleStepsNext}
          >
            {/* icon */}
            <Receipt className="size-4 text-custom-secondary" />
            <span className="text-custom-secondary text-xs font-semibold">
              Buat Transaksi
            </span>
          </button>
        </div>
      </div>

      {/* content right */}
      <ShowProduk handleAppend={handleAppend} />
    </div>
  );
};

type InputNumberProps = {
  control: Control<
    UpdateTransactionForRequestType | CreateTransactionForRequestType
  >;
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
    <InputNumberInTable<
      UpdateTransactionForRequestType | CreateTransactionForRequestType
    >
      controller={controller}
      required
    />
  );
};

// qty props
type QtyProps = {
  control: Control<
    UpdateTransactionForRequestType | CreateTransactionForRequestType
  >;
  index: number;
};

// harga input qty
const InputQty: FC<QtyProps> = ({ control, index }) => {
  const controller = useController({
    control,
    name: `details.${index}.quantity`,
  });

  return (
    <InputQtyInTable<
      UpdateTransactionForRequestType | CreateTransactionForRequestType
    >
      controller={controller}
      required
    />
  );
};

export default PilihProduk;
