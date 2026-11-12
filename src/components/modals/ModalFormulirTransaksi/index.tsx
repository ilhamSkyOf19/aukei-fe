import type { FC, RefObject } from "react";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import { cn } from "../../../utils/cn";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import useModalTransaksi from "./useModalTransaksi";
import type { DetailsForCreate } from "../../../models/transaction.model";
import type { ResponseProdukForKasirType } from "../../../models/produk.model";
import InputQty from "../../inputs/InputQty";
import InputPrice from "../../inputs/InputPrice";
import { formatNumber, formatRupiah } from "../../../helpers/helpers";
import AlertLabel from "../../messages/AlertLabel";
import { Repeat, ShoppingBasket, X } from "lucide-react";
import ButtonText from "../../ui/button/ButtonText";
import Alert from "../../messages/Alert";
import {
  ALERT_CONFIG_TRANSACTION,
  type Alert as AlertType,
} from "../../../types/alert.types";
import ButtonWithIcon from "../../ui/button/ButtonWithIcon";
import InputDiskonPersen from "../../inputs/InputDiskonPersen";
import InputSearch from "../../inputs/InputSearch";
import FilterKategori from "../../filters/Kategori";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  data?: Pick<DetailsForCreate, "produkId" | "hargaJual" | "quantity"> &
    Omit<ResponseProdukForKasirType, "id" | "kategori"> & {
      diskon?: number;
      detailId?: number;
      hargaModalRataRata: number;
      hargaJualOld?: number;
      transactionId?: number;
    };

  index?: number;
  handleSetAlert?: (data: string) => void;

  alert?: AlertType | null;

  existProduks?: { produkId: number }[];
  isBooking?: boolean;
  pelangganId?: number;
};

const ModalFormulirTransaksi: FC<Props> = ({
  modalRef,
  handleCloseModal,
  data,
  index,
  alert,
  handleSetAlert,
  isBooking,
  existProduks,
  pelangganId,
}) => {
  // call use
  const {
    handleSubmit,
    diskonController,
    hargaJualController,
    onSubmit,
    quantityController,
    subTotal,
    totalDiskon,
    hargaJual,
    isPendingTambahProduk,
    diskonPersenController,
    diskonType,
    handleDiskonType,
    totalDiskonPersen,
    isPendingUpdateBooking,
    produkContainerRef,
    dataProduk,

    isFetchingNextPage,
    isLoadingProduk,
    loadMoreRef,
    isExistDataProduk,
    bookingProduk,
    handleGantiProduk,
    existingProdukIds,
    handleKategori,
    setSearch,
    kategori,
    isShowChooseProduk,
    setIsShowChooseProduk,
  } = useModalTransaksi({
    handleCloseModal,
    data,
    handleSetAlert,
    isBooking,
    pelangganId,
    existProduks,
  });

  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      {alert && (
        <Alert
          alert={alert?.id !== null}
          isAnimationOut={alert?.isAnimationOut || false}
          label={ALERT_CONFIG_TRANSACTION[alert.type].message}
          full
        />
      )}

      <div
        className={cn(
          "modal-box rounded-xl max-h-[90vh] bg-base-200 dark:border dark:border-base-content/10 relative",
          isBooking
            ? "lg:max-w-7xl h-[90vh] overflow-hidden flex flex-col"
            : "lg:w-3/4 max-w-4xl",
        )}
      >
        {/* button x */}
        <button
          type="button"
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-base-300 duration-200"
          onClick={handleCloseModal}
        >
          <X className="size-5" />
        </button>

        <div className="w-full flex flex-col justify-start items-start gap-2 flex-1 min-h-0">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title="Formulir Transaksi"
              keterangan={`Formulir untuk ${index ? "mengubah" : "menambah"} Data Transaksi`}
              withIcon={{
                icon: ShoppingBasket,
              }}
            />
          </div>
          <div className="w-full flex flex-row justify-start items-stretch gap-8 flex-1 min-h-0">
            <div
              className={cn(
                "flex flex-col justify-start items-start min-h-0",
                isBooking ? "flex-4" : "w-full",
              )}
            >
              {/* data  */}
              <div className="w-full flex flex-col md:flex-row justify-start items-start gap-4">
                <div className="flex-3 w-full flex flex-col justify-start items-start gap-4 mt-4">
                  {/* img */}
                  {bookingProduk?.img && (
                    <div className="w-full flex justify-center items-center">
                      <img
                        src={bookingProduk.img}
                        alt="foto produk"
                        className="w-full h-40 md:h-60 object-contain"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* data */}
                  <div className="w-full flex flex-col justify-start items-start gap-2.5">
                    <div className="w-full flex flex-col md:flex-row justify-around items-stretch gap-2.5 pb-4 border-b border-base-content/10">
                      {/* nama produk */}
                      <div className="w-full md:w-[200%] flex flex-row justify-start items-stretch gap-2.5">
                        <Label
                          label={`Nama Produk`}
                          value={bookingProduk?.nama || ""}
                          small
                        />
                      </div>
                      <Label
                        label={`Stok Produk`}
                        value={bookingProduk?.stok.toString() || ""}
                        small
                      />
                    </div>

                    <div className="w-full flex flex-col md:flex-row justify-around items-stretch gap-2.5">
                      {/* harga jual */}
                      <Label
                        label={`Hrg. Jual`}
                        value={formatRupiah(
                          bookingProduk?.hargaJualOld ??
                            bookingProduk?.hargaJual ??
                            "",
                        )}
                        small
                      />

                      <div className="w-full md:w-[200%] flex flex-row justify-start items-stretch gap-2.5">
                        {/* harga jual */}
                        <Label
                          label={`Hrg. Jual + PPN`}
                          value={formatRupiah(bookingProduk?.hargaPpn ?? "")}
                          small
                        />

                        {/* harga terakhir transaksi */}
                        <Label
                          label={`Hrg. Terakhir Transaksi`}
                          value={formatRupiah(
                            bookingProduk?.hargaJualTerakhirTransaksi ?? "",
                          )}
                          small
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* form */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className={cn(
                    "w-full lg:flex-2 flex flex-col justify-start items-center",
                  )}
                >
                  {/* harga jual */}
                  <InputPrice<DetailsForCreate>
                    label={`Harga Jual`}
                    required={true}
                    controller={hargaJualController}
                    placeholder={`Masukan harga jual`}
                    name="hargaJual"
                  />
                  <div className="w-full gap-2.5 flex flex-row justify-between items-start">
                    {/* diskon */}
                    {diskonType === "RP" && (
                      <InputPrice<DetailsForCreate>
                        label={`Diskon - Rp`}
                        controller={diskonController}
                        placeholder={`Masukan diskon`}
                        name="diskon"
                        max={hargaJual}
                      />
                    )}

                    {diskonType === "PERCENT" && (
                      <InputDiskonPersen
                        controller={diskonPersenController}
                        label="Diskon - %"
                        max={100}
                      />
                    )}

                    {/* input quantity  */}
                    <InputQty<DetailsForCreate>
                      label={`Jumlah`}
                      required={true}
                      controller={quantityController}
                    />
                  </div>
                  <div className="w-full flex flex-row justify-start items-start pb-2 border-b border-base-content/30">
                    <ButtonWithIcon
                      customHeight="h-7.5"
                      label={`Ganti ke
                  ${diskonType === "PERCENT" ? "Diskon Rp" : " Diskon %"}`}
                      bgColor="bg-info"
                      textColor="text-primary-white"
                      handleBtn={() =>
                        handleDiskonType(
                          diskonType === "PERCENT" ? "RP" : "PERCENT",
                        )
                      }
                    />
                  </div>

                  {/* total diskon */}
                  <div className="w-full flex flex-row gap-2.5 mt-1">
                    <div className="w-full flex flex-col justify-start items-start gap-2 ">
                      <div className="w-full flex flex-col justify-start items-start gap-2 mt-2">
                        <span className="text-xs text-base-content font-medium">
                          Total Diskon - Rp
                        </span>
                        <span className="text-sm font-semibold text-base-content">
                          {formatRupiah(totalDiskon)}
                        </span>
                      </div>
                      <div className="w-full flex flex-col justify-start items-start gap-2 pt-2 border-t border-base-content/30">
                        <span className="text-xs text-base-content font-medium">
                          Total Diskon - %
                        </span>
                        <span className="text-sm font-semibold text-base-content">
                          {totalDiskonPersen} %
                        </span>
                      </div>
                    </div>

                    {/* sub total */}
                    <div className="w-full flex flex-col justify-start items-start gap-2 pl-2 mt-2 border-l border-base-content/30">
                      <span className="text-xs text-base-content font-medium">
                        Sub Total
                      </span>
                      <span className="text-base font-semibold text-base-content">
                        {formatRupiah(subTotal)}
                      </span>
                    </div>
                  </div>
                  {/* alert */}
                  <div className="w-full mt-4">
                    <AlertLabel message="Pastikan data yang diinputkan sudah benar" />
                  </div>
                  {/* action */}
                  <div className="w-full mt-6 flex flex-row justify-end items-center gap-4">
                    {/* button close */}
                    <ButtonCloseText
                      handleClose={() => {
                        handleCloseModal();
                      }}
                      disabled={isPendingTambahProduk || isPendingUpdateBooking}
                      label="Batal"
                    />
                    {/* button submit */}
                    <ButtonText
                      label={`Simpan`}
                      isLoading={
                        isPendingTambahProduk || isPendingUpdateBooking
                      }
                    />
                  </div>
                </form>
              </div>
            </div>
            {isBooking && (
              <div className="flex flex-col flex-2 min-h-0 h-full gap-2.5 border-l border-base-content/30">
                {isShowChooseProduk ? (
                  <>
                    <div className="w-full flex flex-row justify-between items-center gap-2.5 px-2.5">
                      <div className="flex-2">
                        <InputSearch
                          handleSearch={setSearch}
                          placeholder="Cari produk"
                        />
                      </div>

                      {/* filter */}
                      <FilterKategori
                        setKategori={handleKategori}
                        customWidth="w-full md:w-35"
                        noLabel
                        value={kategori}
                        enabled={isBooking && isShowChooseProduk}
                      />
                    </div>

                    <div
                      ref={produkContainerRef}
                      className="flex flex-col w-full min-h-0 h-full overflow-y-auto scrollbar-thin gap-2.5 p-2.5"
                    >
                      {isLoadingProduk ? (
                        Array.from({ length: 5 }, (_, i) => i + 1).map(
                          (item) => (
                            <div
                              key={item}
                              className=" shrink-0 flex rounded-xl flex-row justify-between items-center gap-2.5 p-2.5 bg-primary-white shadow-sm w-full h-14 skeleton"
                            />
                          ),
                        )
                      ) : isExistDataProduk ? (
                        <>
                          {dataProduk.map((item) => {
                            const terpilih =
                              bookingProduk?.produkId === item.id ||
                              existingProdukIds.some((id) => id === item.id);

                            return (
                              <div
                                key={item.id}
                                className=" shrink-0 flex rounded-xl flex-row justify-between items-center gap-2.5 p-2.5 bg-primary-white shadow-sm w-full"
                              >
                                <div className="flex flex-row justify-start items-start gap-2">
                                  <div className="w-12 h-12 rounded-xl overflow-hidden">
                                    <img
                                      src={item.img}
                                      alt="foto produk"
                                      loading="lazy"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>

                                  <div className="flex flex-col justify-start items-start">
                                    <span className="text-xs font-medium text-base-content ">
                                      {item.nama}
                                    </span>
                                    <span className="text-[0.625rem] text-base-content ">
                                      {item.kategori.nama}
                                    </span>

                                    <div className="flex flex-row justify-start items-center gap-8 mt-2">
                                      <span className="text-[0.625rem] font-medium text-base-content ">
                                        {formatRupiah(item.hargaJual)}
                                      </span>
                                      <span className="text-[0.625rem] font-medium text-base-content ">
                                        Stok : {formatNumber(item.stok)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <ButtonText
                                  disable={terpilih}
                                  label={terpilih ? "Terpilih" : "Pilih"}
                                  handleClick={() =>
                                    handleGantiProduk({
                                      id: item.id,
                                      kategori: item.kategori,
                                      hargaJual: item.hargaJual,
                                      hargaModalRataRata:
                                        item.hargaModalRataRata,
                                      hargaPpn: item.hargaPpn,
                                      img: item.img,
                                      nama: item.nama,
                                      stok: item.stok,
                                      hargaJualTerakhirTransaksi:
                                        item.hargaJualTerakhirTransaksi ??
                                        undefined,
                                    })
                                  }
                                />
                              </div>
                            );
                          })}
                          {/* trigger infinite scroll */}
                          <div
                            ref={loadMoreRef}
                            className="col-span-full w-full flex flex-row justify-center items-center py-3 min-h-10"
                          >
                            {isFetchingNextPage && (
                              <div className="loading loading-md" />
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex justify-center items-center">
                          <span className="text-sm font-medium">
                            Produk tidak ditemukan
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col justify-center items-center">
                    <ButtonWithIcon
                      icon={Repeat}
                      label="Ganti Produk"
                      handleBtn={() => setIsShowChooseProduk(true)}
                    />
                  </div>
                )}
              </div>
            )}
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
          className={`text-xs ${bold ? "font-bold" : "font-semibold"} ${small ? "text-sm" : "text-base"} text-base-content`}
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
export default ModalFormulirTransaksi;
