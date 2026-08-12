import { useEffect, useState, type FC } from "react";
import useBooking from "./useBooking";
import type { PayloadPenggunaInternalType } from "../../../../models/penggunaInternal.model";
import HeaderPelangganForKasir from "../../../../components/ui/HeaderPelangganForKasir";
import { cn } from "../../../../utils/cn";
import {
  formatNumber,
  formatRupiah,
  maxValue,
  unformatNumber,
  unformatRupiah,
} from "../../../../helpers/helpers";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import {
  ArrowLeftRight,
  Banknote,
  Check,
  Landmark,
  QrCode,
  X,
} from "lucide-react";
import CardMetodePembayaran from "../../../../components/ui/cards/CardMetodePembayaran";
import ModalCashPayment from "../../../../components/modals/ModalCashPayment";
import ErrorMessage from "../../../../components/messages/ErrorMessage";
import ModalAlert from "../../../../components/modals/ModalAlert";
import { PAYMENT_METHOD_TYPE } from "../../../../types/constant.type";

type Props = {
  handleToast: (value: string) => void;
  kasir?: PayloadPenggunaInternalType | null;
};

const Booking: FC<Props> = ({ handleToast, kasir }) => {
  // call use
  const {
    dataDetails,
    pelanggan,
    handleUbahTransaction,
    handleBatalTransaction,
    metodePembayaran,
    transactionSummary,
    handleMetodePembayaran,
    isErrors,
    buttonBayarRef,
    handleCloseModalCalculator,
    handleShowModalCalculator,
    modalCalculatorRef,
    handlePay,

    handleTransaction,

    handleCancel,
    handleConfirm,
    modalConfirmRef,
    dataConfirm,

    isPendingTransaction,

    dataDiBayar,

    setDataDp,

    dataDp,
  } = useBooking({ handleToast, kasir });
  return (
    <div className="w-full h-[95vh]  grid grid-cols-3 gap-2.5">
      <div className="col-span-2 grid grid-rows-10 min-h-0 gap-2.5">
        {/* pelanggan */}
        <div className="row-span-1 flex flex-row justify-between items-center">
          <HeaderPelangganForKasir
            pelanggan={pelanggan}
            kasir={kasir}
            label={{
              bigTitle: "Booking",
              smallTitle: "Silahkan lengkapi data untuk melakukan booking",
            }}
          />
        </div>
        <div className="row-span-9 grid grid-rows-9 bg-base-100 rounded-xl pb-1">
          {/* title */}
          <div className="w-full flex flex-row row-span-1 justify-between items-center p-2.5">
            <span className="text-xs text-base-content font-medium">
              Daftar Produk
            </span>

            <div className="flex flex-row justify-end items-center gap-2.5">
              <ButtonWithIcon
                icon={X}
                bgColor="bg-error"
                textColor="text-primary-white"
                label="Batalkan Transaksi"
                handleBtn={handleBatalTransaction}
              />
              <ButtonWithIcon
                icon={ArrowLeftRight}
                bgColor="bg-info"
                textColor="text-primary-white"
                label="Ubah Produk"
                handleBtn={handleUbahTransaction}
              />
            </div>
          </div>

          {/* daftar produk */}
          <div
            className={cn(
              "overflow-y-auto scrollbar-thin scrollbar-thumb-custom-secondary pb-6 w-full flex flex-row row-span-9 justify-between items-start",
            )}
          >
            <table className="table table-xs table-zebra">
              {/* head */}
              <thead className="bg-base-content/5 h-10">
                <tr className="text-[0.625rem]">
                  <th>Gambar</th>
                  <th>Nama Produk</th>
                  <th>Harga (Rp)</th>
                  <th>Diskon (Rp)</th>
                  <th>Jumlah Pesan</th>
                  <th>Stok Tersedia</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                {dataDetails && dataDetails.length > 0 ? (
                  dataDetails.map((item) => (
                    <tr key={item.produkId} className="h-15">
                      <td>
                        <div className="avatar">
                          <div className="mask mask-squircle h-10 w-10">
                            <img src={item.img} alt="gambar produk" />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col justify-start items-start gap-px">
                          <p className="xl:text-[0.625rem] text-base-content">
                            {item.nama}
                          </p>
                          <span className="xl:text-[0.625rem] font-medium text-base-content/50">
                            {item.kode}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="xl:text-[0.7rem] text-base-content">
                          {/* harga jual */}
                          {formatRupiah(item.hargaJual)}
                        </span>
                      </td>
                      <td>
                        <span className="xl:text-[0.7rem] text-base-content">
                          {formatRupiah(item.diskon)}
                        </span>
                      </td>
                      <td>
                        <span className="xl:text-[0.7rem] text-base-content">
                          {/* qty */}
                          {formatNumber(item.quantity)} Pcs
                        </span>
                      </td>
                      <td>
                        <span
                          className={cn(
                            "xl:text-[0.7rem]",
                            item?.stokTersedia && item.stokTersedia <= 0
                              ? "text-error"
                              : "text-base-content",
                          )}
                        >
                          {/* stok tersedia */}
                          {item?.stokTersedia && item.stokTersedia > 0
                            ? formatNumber(item?.stokTersedia)
                            : 0}{" "}
                          Pcs
                        </span>
                      </td>
                      <td>
                        <span className="xl:text-[0.7rem] text-base-content">
                          {formatRupiah(
                            item.hargaJual * item.quantity - item.diskon,
                          )}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  // perbaiki
                  <tr>
                    <td colSpan={8}></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="col-span-1 min-h-0 bg-base-100 flex flex-col justify-start rounded-xl border border-transparent dark:border-base-content/10 items-start p-2.5 gap-2.5 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-custom-secondary">
        {/* alert */}
        <div className="flex flex-col justify-start items-start bg-blue-50 gap-1 border border-blue-400 rounded-xl w-full p-2.5">
          <span className="text-base-content text-xs font-medium">
            Peringatan
          </span>

          {/* content */}
          <p className="text-[0.625rem] leading-5 font-medium text-base-content">
            DP minimal yang disarankan adalah 20% dari total nilai booking.
            Pembayaran di bawah nominal tersebut tetap dapat dilakukan sesuai
            kebijakan toko dan kesepakatan dengan pelanggan.
          </p>
        </div>

        <div className="flex flex-col justify-start items-start gap-2.5 w-full mt-2.5">
          <span className="text-sm font-medium text-base-content">
            Total Transaksi
          </span>

          <div className="flex w-full flex-col justify-start items-start">
            {/* sub total */}
            <div className="w-full flex flex-row justify-between items-center py-1">
              {/* label */}
              <span className="text-[0.7rem] font-medium text-base-content">
                Sub Total
              </span>
              {/* total */}
              <span className="text-xs font-medium text-base-content">
                {transactionSummary.totalUangSubTotal > 0
                  ? formatRupiah(transactionSummary.totalUangSubTotal)
                  : 0}
              </span>
            </div>

            {/* total diskon */}
            <div className="w-full flex flex-row justify-between items-center py-1 border-b border-base-content/10">
              {/* label */}
              <span className="text-[0.7rem] font-medium text-base-content">
                Total Diskon
              </span>
              {/* total */}
              <span className="text-xs font-medium text-base-content">
                {transactionSummary.totalUangDiskon > 0
                  ? formatRupiah(transactionSummary.totalUangDiskon)
                  : 0}
              </span>
            </div>

            {/* total  */}
            <div className="w-full flex flex-row justify-between items-center py-2.5">
              {/* label */}
              <span className="text-xs font-medium text-base-content">
                Total Keseluruhan
              </span>
              {/* total */}
              <span className="text-sm font-semibold text-base-content">
                {transactionSummary.totalUangTransaksi > 0
                  ? formatRupiah(transactionSummary.totalUangTransaksi)
                  : 0}
              </span>
            </div>

            {/* saran dp */}
            <div className="w-full flex flex-row justify-between items-center py-1 border-t border-base-content/10 pt-2.5">
              {/* label */}
              <p className="text-[0.7rem] font-medium text-base-content">
                Saran DP{" "}
                <span className="text-[0.625rem] font-normal">
                  (20% dari total keseluruhan)
                </span>
              </p>
              {/* total */}
              <span className="text-xs font-medium text-base-content">
                {transactionSummary.saranDp > 0
                  ? formatRupiah(transactionSummary.saranDp)
                  : 0}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col justify-start items-start gap-2.5 mt-2.5">
          <span className="text-sm font-medium text-base-content">
            Masukkan Uang DP
          </span>

          <div className="w-full flex flex-col justify-start items-start gap-1">
            {/* form uang dp */}
            <FormUangDp
              defaultValue={
                transactionSummary.saranDp > 0
                  ? transactionSummary.saranDp
                  : undefined
              }
              maxTotal={
                transactionSummary.totalUangTransaksi > 0
                  ? transactionSummary.totalUangTransaksi
                  : undefined
              }
              handleBayar={setDataDp}
            />

            <span className="text-[0.7rem] text-base-content">
              Anda dapat mengatur uang DP sesuai kesepakatan dengan customer
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-start items-start gap-2.5 w-full mt-2.5">
          <span className="text-sm font-medium text-base-content">
            Metode Pembayaran Uang DP
          </span>

          <div className="w-full flex flex-col justify-start items-start gap-2.5">
            <div className="w-full flex flex-row justify-between items-center gap-2.5">
              {/* cash */}
              <CardMetodePembayaran
                icon={Banknote}
                bgColor="bg-emerald-50"
                iconColor="text-emerald-500"
                label="Tunai"
                description="Bayar dengan uang tunai."
                handleClick={() => handleMetodePembayaran("CASH")}
                isActive={metodePembayaran === "CASH"}
                noDeskripsi
                isError={isErrors?.includes("METODE_PEMBAYARAN_KOSONG")}
              />

              {/* transfer */}
              <CardMetodePembayaran
                icon={Landmark}
                bgColor="bg-blue-50"
                iconColor="text-blue-500"
                label="Transfer Bank"
                description="Bayar melalui transfer bank."
                handleClick={() => handleMetodePembayaran("TRANSFER")}
                isActive={metodePembayaran === "TRANSFER"}
                noDeskripsi
                isError={isErrors?.includes("METODE_PEMBAYARAN_KOSONG")}
              />
            </div>
            <div className="w-full flex flex-row justify-between items-center gap-2.5">
              {/* qris */}
              <CardMetodePembayaran
                icon={QrCode}
                bgColor="bg-purple-50"
                iconColor="text-purple-500"
                label="QRIS"
                description="Bayar melalui QRIS."
                handleClick={() => handleMetodePembayaran("QRIS")}
                isActive={metodePembayaran === "QRIS"}
                noDeskripsi
                isError={isErrors?.includes("METODE_PEMBAYARAN_KOSONG")}
              />
            </div>

            {isErrors?.includes("METODE_PEMBAYARAN_KOSONG") && (
              <ErrorMessage errorMessage="Silahkan pilih metode pembayaran" />
            )}

            {/* ringkasan pembayaran */}
            {metodePembayaran === PAYMENT_METHOD_TYPE.CASH && (
              <div className="w-full flex flex-col justify-start items-start gap-2.5 mt-2.5 border-b border-dashed border-base-content/30 pb-2.5">
                <span className="text-sm font-medium text-base-content">
                  Ringkasan Pembayaran Tunai
                </span>
                <div className="w-full flex flex-row justify-between items-center">
                  <span className="text-[0.7rem] font-medium text-base-content">
                    Uang Diterima
                  </span>
                  {/* total */}
                  <span className="text-xs font-semibold text-info">
                    {formatRupiah(dataDiBayar)}
                  </span>
                </div>
                <div className="w-full flex flex-row justify-between items-center">
                  <span className="text-[0.7rem] font-medium text-base-content">
                    Uang Kembalian
                  </span>
                  {/* total */}
                  <span className="text-xs font-semibold text-emerald-600">
                    {dataDiBayar !== 0
                      ? formatRupiah(
                          dataDiBayar - (dataDp ?? transactionSummary.saranDp),
                        )
                      : formatRupiah(0)}
                  </span>
                </div>
              </div>
            )}
            {/* button */}
            <div className="w-full flex flex-col justify-start items-center gap-1 mt-2.5">
              {/* button bayar */}
              {metodePembayaran === "CASH" && (
                <div className="w-full flex flex-col justify-start items-start">
                  <button
                    ref={buttonBayarRef}
                    type="button"
                    className={cn(
                      "w-full h-10 bg-emerald-600 rounded-xl flex flex-row hover-overlay justify-center items-center",
                      metodePembayaran === "CASH"
                        ? isErrors.includes("DATA_DI_BAYAR_KOSONG")
                          ? "animate-pop-in-active"
                          : "animate-pop-in"
                        : "hidden",
                    )}
                    onClick={() => handleShowModalCalculator()}
                  >
                    <span className="text-xs font-medium text-primary-white">
                      Bayar
                    </span>
                  </button>

                  {isErrors.includes("DATA_DI_BAYAR_KOSONG") && (
                    <div className="w-full mb-2">
                      <ErrorMessage
                        errorMessage={
                          isErrors.includes("DATA_DI_BAYAR_KOSONG")
                            ? "Harap lakukan pembayaran terlebih dahulu"
                            : ""
                        }
                      />
                    </div>
                  )}
                </div>
              )}

              {/* button tempo */}
              {metodePembayaran === "TEMPO" && (
                <div className="w-full flex flex-col justify-start items-start mb-2.5">
                  <div className="flex flex-col justify-start items-start bg-blue-50 gap-1 border border-blue-400 rounded-xl w-full p-2.5">
                    <span className="text-base-content text-xs font-medium">
                      Peringatan
                    </span>

                    {/* content */}
                    <p className="text-[0.625rem] leading-5 font-medium text-base-content">
                      Tempo diatur saat barang siap dikirim kepada pelanggan.
                    </p>
                  </div>
                </div>
              )}

              <div className="w-full flex flex-col justify-start items-start gap-1">
                <ButtonWithIcon
                  label="Selesaikan Transaksi"
                  customWidth="w-full"
                  icon={Check}
                  isLoading={isPendingTransaction}
                  handleBtn={() => handleTransaction()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* modal calculator */}
      <ModalCashPayment
        modalRef={modalCalculatorRef}
        handleCloseModal={handleCloseModalCalculator}
        handlePay={handlePay}
        total={dataDp ?? transactionSummary.saranDp}
      />

      {/* modal confirm */}
      <ModalAlert
        modalRef={modalConfirmRef}
        handleCloseModal={handleCancel}
        handleConfirm={handleConfirm}
        bigTitle={dataConfirm?.title ?? ""}
        smallTitle={dataConfirm?.deskripsi ?? ""}
      />
    </div>
  );
};

// form uang dp
type FormUangDpProps = {
  defaultValue?: number;
  maxTotal?: number;
  handleBayar: (value: number) => void;
};

const FormUangDp: FC<FormUangDpProps> = ({
  defaultValue,
  maxTotal,
  handleBayar,
}) => {
  const [displayValue, setDisplayValue] = useState<string>("");

  useEffect(() => {
    if (defaultValue !== undefined && defaultValue !== null) {
      setDisplayValue(formatRupiah(String(defaultValue)));
    } else {
      setDisplayValue("");
    }
  }, [defaultValue]);

  return (
    <div className="flex gap-2.5 flex-row justify-between items-center w-full">
      <div className="flex flex-row justify-start items-center gap-2 border border-base-content/50 rounded-xl w-full focus-within:ring-1 focus-within:ring-base-content focus-within:border-base-content transition-all duration-300 ease-in-out bg-base-100 h-12 px-3">
        <input
          type="text"
          inputMode="numeric"
          className="w-full font-semibold text-base-content h-full border-none outline-none placeholder:text-base-content/50 placeholder:font-light text-sm"
          value={displayValue}
          onChange={(e) => {
            const raw = unformatRupiah(e.target.value);

            const value = maxValue(raw, maxTotal ?? 10000000);

            setDisplayValue(formatRupiah(value));
          }}
          onBlur={() => handleBayar(Number(unformatNumber(displayValue)))}
        />
      </div>
    </div>
  );
};

export default Booking;
