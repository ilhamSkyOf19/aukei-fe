import type { FC } from "react";
import {
  CircleDollarSign,
  CirclePercent,
  ReceiptText,
  Repeat,
  ShoppingBasket,
  Trash2,
  Undo2,
} from "lucide-react";
import type { UseControllerReturn, UseFormHandleSubmit } from "react-hook-form";

import LabelCardPelanggan from "../../LabelCardPelanggan";
import ButtonWithIcon from "../../button/ButtonWithIcon";
import ButtonUpdateTable from "../../button/ButtonUpdateTable";

import type {
  ITransactionDetailType,
  UpdateHargaAndDiskonAndQuantityForRequestType,
} from "../../../../models/transactionDetail.model";

import { formatNumber, formatRupiah } from "../../../../helpers/helpers";
import { cn } from "../../../../utils/cn";
import CardForm from "../../../inputs/CardForm";
import InputPrice from "../../../inputs/InputPrice";
import InputQty from "../../../inputs/InputQty";

type Props = {
  data: Omit<ITransactionDetailType, "createdAt" | "updatedAt" | "laba">;
  disabled?: boolean;
  handleAppend?: (params: {
    detailId: number;
    nama: string;
    kode?: string | null;
    img: string;
    hargaJual: number;
    maxQuantity: number;
    quantityWasRetur: number;
  }) => void;
  updateBooking?: {
    isFromActive?: {
      detailId: number;
      hargaJual: boolean;
      diskon: boolean;
      quantity: boolean;
    } | null;
    isPageBookingKasir: boolean;
    isUbahData: boolean;
    handleSetIsFromActive: (params: {
      detailId?: number;
      hargaJual?: {
        data: number;
      };
      diskon?: {
        data: number;
      };
      quantity?: {
        data: number;
      };
      reset?: boolean;
    }) => void;
    handleSubmit: UseFormHandleSubmit<
      UpdateHargaAndDiskonAndQuantityForRequestType,
      UpdateHargaAndDiskonAndQuantityForRequestType
    >;
    onSubmit: (
      data: UpdateHargaAndDiskonAndQuantityForRequestType,
    ) => Promise<void>;
    isPendingUpdate: boolean;
    formDiskon: {
      diskonController: UseControllerReturn<
        UpdateHargaAndDiskonAndQuantityForRequestType,
        "diskon"
      >;
      placeholder: string;
    };
    formHargaJual: {
      hargaJualController: UseControllerReturn<
        UpdateHargaAndDiskonAndQuantityForRequestType,
        "hargaJual"
      >;
      placeholder: string;
    };
    formQuantity: {
      quantityController: UseControllerReturn<
        UpdateHargaAndDiskonAndQuantityForRequestType,
        "quantity"
      >;
      placeholder: string;
    };

    disabledDelete?: boolean;

    handleDelete?: () => void;
    handleGantiProduk?: () => void;
  };
};

const CardProdukTransaksi: FC<Props> = ({
  data,
  disabled,
  handleAppend,
  updateBooking,
}) => {
  const { id, diskon, hargaJual, produk, quantity, totalHarga, totalRetur } =
    data;

  const activeField = updateBooking?.isFromActive;

  const isEditable =
    !!updateBooking?.isPageBookingKasir && !!updateBooking?.isUbahData;

  const isActiveHargaJual =
    activeField?.detailId === id && activeField.hargaJual && isEditable;

  const isActiveDiskon =
    activeField?.detailId === id && activeField.diskon && isEditable;

  const isActiveQuantity =
    activeField?.detailId === id && activeField.quantity && isEditable;

  return (
    <div className="w-full flex flex-col justify-start items-start bg-base-100 rounded-2xl shadow-sm border border-transparent dark:border-base-content/10 p-4 shrink-0 snap-center snap-always">
      {/* CONTENT 1 */}
      <div className="w-full flex flex-row gap-4 justify-start items-center pb-4 border-b border-base-content/10">
        <div className="flex justify-start items-start gap-4">
          <div className="w-12 h-12 overflow-hidden rounded-2xl">
            <img
              src={produk.img}
              alt={produk.nama}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col justify-start items-start gap-0.5">
          <span className="text-base-content font-semibold text-sm">
            {produk.nama}
          </span>
        </div>
      </div>

      {/* CONTENT 2 */}
      <div
        className={cn(
          "w-full flex flex-col md:flex-row justify-start items-start gap-2 py-2",
          handleAppend && "border-b border-base-content/10",
        )}
      >
        {/* HARGA JUAL */}
        <LabelCardPelanggan
          label="Harga Jual"
          icon={{
            icon: CircleDollarSign,
            bgColor: "bg-blue-100",
            iconColor: "text-blue-400",
          }}
        >
          {isActiveHargaJual && updateBooking ? (
            <CardForm<UpdateHargaAndDiskonAndQuantityForRequestType>
              handleResetForm={() =>
                updateBooking.handleSetIsFromActive({ reset: true })
              }
              handleSubmit={updateBooking.handleSubmit}
              onSubmit={updateBooking.onSubmit}
              isPending={updateBooking.isPendingUpdate}
              showForSm
              hAuto
            >
              <div className="w-35">
                <InputPrice<UpdateHargaAndDiskonAndQuantityForRequestType>
                  controller={updateBooking.formHargaJual.hargaJualController}
                  placeholder={updateBooking.formHargaJual.placeholder}
                  required
                  xs
                />
              </div>
            </CardForm>
          ) : (
            <div className="flex flex-row justify-start items-center gap-1.5">
              <span className="text-xs font-medium text-base-content">
                {formatRupiah(hargaJual)}
              </span>

              {isEditable && updateBooking && (
                <ButtonUpdateTable
                  handleClick={() =>
                    updateBooking.handleSetIsFromActive({
                      detailId: id,
                      hargaJual: {
                        data: hargaJual,
                      },
                    })
                  }
                />
              )}
            </div>
          )}
        </LabelCardPelanggan>

        {/* DISKON */}
        <LabelCardPelanggan
          label="Diskon"
          icon={{
            icon: CirclePercent,
            bgColor: "bg-rose-100",
            iconColor: "text-rose-400",
          }}
        >
          {isActiveDiskon && updateBooking ? (
            <CardForm<UpdateHargaAndDiskonAndQuantityForRequestType>
              handleResetForm={() =>
                updateBooking.handleSetIsFromActive({ reset: true })
              }
              handleSubmit={updateBooking.handleSubmit}
              onSubmit={updateBooking.onSubmit}
              isPending={updateBooking.isPendingUpdate}
              showForSm
              hAuto
            >
              <div className="w-35">
                <InputPrice<UpdateHargaAndDiskonAndQuantityForRequestType>
                  controller={updateBooking.formDiskon.diskonController}
                  placeholder={updateBooking.formDiskon.placeholder}
                  max={hargaJual}
                  required
                  xs
                />
              </div>
            </CardForm>
          ) : (
            <div className="flex flex-row justify-start items-center gap-1.5">
              <span className="text-xs font-medium text-base-content">
                {formatRupiah(diskon)}
              </span>

              {isEditable && updateBooking && (
                <ButtonUpdateTable
                  handleClick={() =>
                    updateBooking.handleSetIsFromActive({
                      detailId: id,
                      diskon: {
                        data: diskon,
                      },
                    })
                  }
                />
              )}
            </div>
          )}
        </LabelCardPelanggan>

        {/* QTY PESAN */}
        <LabelCardPelanggan
          label="Qty. Pesan"
          icon={{
            icon: ShoppingBasket,
            bgColor: "bg-emerald-100",
            iconColor: "text-emerald-400",
          }}
        >
          {isActiveQuantity && updateBooking ? (
            <CardForm<UpdateHargaAndDiskonAndQuantityForRequestType>
              handleResetForm={() =>
                updateBooking.handleSetIsFromActive({ reset: true })
              }
              handleSubmit={updateBooking.handleSubmit}
              onSubmit={updateBooking.onSubmit}
              isPending={updateBooking.isPendingUpdate}
              btnAksiPosition="top"
              showForSm
              hAuto
            >
              <div className="w-auto">
                <InputQty<UpdateHargaAndDiskonAndQuantityForRequestType>
                  controller={updateBooking.formQuantity.quantityController}
                  required
                  customHeight="h-10"
                  customWidth="w-25"
                  noButton
                />
              </div>
            </CardForm>
          ) : (
            <div className="flex flex-row justify-start items-center gap-1.5">
              <span className="text-xs font-medium text-base-content">
                {formatNumber(quantity)} Pcs
              </span>

              {isEditable && updateBooking && (
                <ButtonUpdateTable
                  handleClick={() =>
                    updateBooking.handleSetIsFromActive({
                      detailId: id,
                      quantity: {
                        data: quantity,
                      },
                    })
                  }
                />
              )}
            </div>
          )}
        </LabelCardPelanggan>

        {/* QTY RETUR */}
        <LabelCardPelanggan
          label="Qty. Retur"
          icon={{
            icon: Undo2,
            bgColor: "bg-rose-100",
            iconColor: "text-rose-400",
          }}
          valueSting={`${formatNumber(totalRetur)} Pcs`}
        />

        {/* TOTAL HARGA */}
        <LabelCardPelanggan
          label="Total Harga"
          icon={{
            icon: ReceiptText,
            bgColor: "bg-blue-100",
            iconColor: "text-blue-400",
          }}
          valuePrice={totalHarga}
        />
      </div>

      {/* HANDLE APPEND */}
      {(handleAppend || updateBooking) && (
        <div className="w-full mt-2.5 flex flex-row justify-end items-end gap-2.5">
          {handleAppend && (
            <ButtonWithIcon
              disabled={disabled}
              label="Retur"
              icon={Undo2}
              bgColor="bg-error"
              textColor="text-primary-white"
              handleBtn={() =>
                handleAppend({
                  detailId: id,
                  nama: produk.nama,
                  img: produk.img,
                  hargaJual,
                  maxQuantity: quantity,
                  quantityWasRetur: totalRetur,
                })
              }
            />
          )}

          {updateBooking &&
            updateBooking.handleGantiProduk &&
            updateBooking.handleDelete && (
              <>
                <ButtonWithIcon
                  label="Ganti Produk"
                  icon={Repeat}
                  bgColor="bg-info"
                  textColor="text-primary-white"
                  handleBtn={() => updateBooking.handleGantiProduk?.()}
                />
                <ButtonWithIcon
                  disabled={updateBooking.disabledDelete}
                  label="Hapus"
                  icon={Trash2}
                  bgColor="bg-error"
                  textColor="text-primary-white"
                  handleBtn={() => updateBooking.handleDelete?.()}
                />
              </>
            )}
        </div>
      )}
    </div>
  );
};

export default CardProdukTransaksi;
