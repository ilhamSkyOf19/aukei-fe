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
import { Tooltip } from "react-tooltip";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import {
  ArrowLeftRight,
  Banknote,
  Calendar,
  CalendarClock,
  CircleX,
  Landmark,
  QrCode,
  Receipt,
  Save,
  Truck,
  X,
} from "lucide-react";
import CardMetodePembayaran from "../../../../components/ui/cards/CardMetodePembayaran";
import ModalTempoPayment from "../../../../components/modals/ModalTempoPayment";
import ModalCashPayment from "../../../../components/modals/ModalCashPayment";
import ErrorMessage from "../../../../components/messages/ErrorMessage";
import ModalAlert from "../../../../components/modals/ModalAlert";

type Props = {
  handleSteps: (value: number) => void;
  handleToast: (value: string) => void;
  kasir?: PayloadPenggunaInternalType | null;
};

const Booking: FC<Props> = ({ handleSteps, handleToast, kasir }) => {
  // call use
  const {
    dataDetails,
    pelanggan,
    handleSetData,
    setisOpenFormulirKirimStok,
    isOpenFormulirKirimStok,
    handleUbahTransaction,
    handleBatalTransaction,
    metodePembayaran,
    transactionSummary,
    handleMetodePembayaran,
    isErrors,
    buttonAturTempoRef,
    buttonBayarRef,
    handleCloseModalCalculator,
    handleCloseModalTempo,
    handleShowModalCalculator,
    handleShowModalTempo,
    modalCalculatorRef,
    modalTempoRef,
    setDataTempo,
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
  } = useBooking({ handleSteps, handleToast, kasir });
  return (
    <div className="w-full h-[95vh]  grid grid-cols-3 gap-2.5">
      <div className="col-span-2 grid grid-rows-10 min-h-0 gap-2.5">
        {/* pelanggan */}
        <div className="row-span-1 flex flex-row justify-between items-center">
          <HeaderPelangganForKasir pelanggan={pelanggan} kasir={kasir} />
        </div>
        <div className="row-span-7 grid grid-rows-9 bg-base-100 rounded-xl pb-1">
          {/* title */}
          <div className="w-full flex flex-row row-span-1 justify-between items-center p-2.5">
            <span className="text-xs text-base-content font-medium">
              Daftar Produk
            </span>

            <div className="flex flex-row justify-end items-center gap-2.5">
              <ButtonWithIcon
                customHeight="h-7"
                icon={X}
                bgColor="bg-error"
                textColor="text-primary-white"
                label="Batalkan Transaksi"
                handleBtn={handleBatalTransaction}
              />
              <ButtonWithIcon
                customHeight="h-7"
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
                  <th>Stok Dikirim</th>
                  <th>Subtotal</th>
                  <th>Kirim Stok</th>
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
                          {formatNumber(item.quantity)} x
                        </span>
                      </td>
                      <td>
                        <span
                          className={cn(
                            "xl:text-[0.7rem]",
                            item.stokTersedia === 0
                              ? "text-error"
                              : "text-base-content",
                          )}
                        >
                          {/* stok tersedia */}
                          {item.stokTersedia > 0
                            ? formatNumber(item.stokTersedia)
                            : 0}
                        </span>
                      </td>
                      <td>
                        <span
                          className={cn("xl:text-[0.7rem] text-base-content")}
                        >
                          {/* stok di kirim */}
                          {item.stokDikirim && item.stokDikirim > 0
                            ? formatNumber(item.stokDikirim)
                            : "-"}
                        </span>
                      </td>
                      <td>
                        <span className="xl:text-[0.7rem] text-base-content">
                          {formatRupiah(
                            item.hargaJual * item.quantity - item.diskon,
                          )}
                        </span>
                      </td>
                      <td>
                        <div
                          key={item.produkId}
                          data-tooltip-id={`stok-${item.produkId}`}
                          data-tooltip-place="left"
                          onClick={() =>
                            setisOpenFormulirKirimStok({
                              id: item.produkId,
                              status: true,
                            })
                          }
                        >
                          <button
                            type="button"
                            disabled={item.stokTersedia === 0}
                            className="px-2.5 h-7 rounded-lg bg-success font-medium text-primary-white hover-overlay disabled:opacity-50"
                            style={{
                              cursor:
                                item.stokTersedia === 0
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                            onClick={() =>
                              setisOpenFormulirKirimStok({
                                id: item.produkId,
                                status: true,
                              })
                            }
                          >
                            Atur
                          </button>
                        </div>
                        {isOpenFormulirKirimStok?.id === item.produkId && (
                          <FormTooltip
                            isOpenId={isOpenFormulirKirimStok?.id}
                            itemId={item.produkId}
                            maxStok={item.stokTersedia}
                            handleSetData={handleSetData}
                            handleClose={() => setisOpenFormulirKirimStok(null)}
                            defaultValue={item.stokDikirim}
                            jumlahPesan={item.quantity}
                          />
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8}></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row-span-2 border border-transparent dark:border-base-content/10 bg-base-100 rounded-xl flex flex-col justify-start items-start p-2.5 gap-2">
          {/* title */}
          <div className="w-full flex flex-row justify-between items-center">
            <p className="text-xs font-medium">
              Ringkasan Booking{" "}
              <span className="text-[0.625rem] font-normal">
                (Sudah dikurangi diskon)
              </span>
            </p>
            <p className="text-[0.625rem] font-medium">
              Total Diskon:{" "}
              <span className="text-[0.7rem] font-semibold">
                {dataDetails
                  ? formatRupiah(
                      dataDetails.reduce((acc, curr) => acc + curr.diskon, 0),
                    )
                  : 0}
              </span>
            </p>
          </div>
          <div className="w-full flex flex-row justify-start items-center gap-4">
            <div className="flex flex-row justify-start items-start gap-2 bg-emerald-50 border border-emerald-400 flex-1 py-1.5 rounded-xl px-2.5">
              {/* icon */}
              <Truck className="size-4 text-emerald-600" />

              <div className=" w-full flex flex-col justify-start items-start gap-1">
                {/* title */}
                <span className="text-emerald-600 text-[0.625rem] font-medium">
                  Total Kirim Sekarang
                </span>

                {/* total */}
                <div className="flex flex-row justify-start items-start gap-1">
                  <span className="text-emerald-600 font-semibold text-xs">
                    {transactionSummary.totalJumlahBarangDikirim > 0
                      ? formatRupiah(
                          transactionSummary.totalJumlahBarangDikirim,
                        )
                      : 0}
                  </span>

                  <span className="text-[0.625rem] text-base-content font-medium">
                    Pcs
                  </span>
                </div>

                {/* sub total */}
                <div className="w-full flex flex-row justify-between items-center">
                  <span className="text-[0.625rem] font-medium text-base-content">
                    Subtotal
                  </span>
                  <span className="text-[0.625rem] font-semibold text-base-content">
                    {transactionSummary.totalUangBarangDikirim > 0
                      ? formatRupiah(transactionSummary.totalUangBarangDikirim)
                      : 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-start items-start gap-2 bg-blue-50 border border-blue-400 flex-1 py-1.5 rounded-xl px-2.5">
              {/* icon */}
              <Calendar className="size-4 text-blue-600" />

              <div className=" w-full flex flex-col justify-start items-start gap-1">
                {/* title */}
                <span className="text-blue-600 text-[0.625rem] font-medium">
                  Total sisa yang akan dibooking
                </span>

                {/* total */}
                <div className="flex flex-row justify-start items-start gap-1">
                  <span className="text-blue-600 font-semibold text-xs">
                    {transactionSummary.totalJumlahBarangBooking > 0
                      ? formatRupiah(
                          transactionSummary.totalJumlahBarangBooking,
                        )
                      : 0}
                  </span>

                  <span className="text-[0.625rem] text-base-content font-medium">
                    Pcs
                  </span>
                </div>

                {/* sub total */}
                <div className="w-full flex flex-row justify-between items-center">
                  <span className="text-[0.625rem] font-medium text-base-content">
                    Subtotal
                  </span>
                  <span className="text-[0.625rem] font-semibold text-base-content">
                    {transactionSummary.totalUangBarangBooking > 0
                      ? formatRupiah(transactionSummary.totalUangBarangBooking)
                      : 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-start items-start gap-2 bg-custom-primary/10 border border-custom-primary flex-1 py-1.5 rounded-xl px-2.5">
              {/* icon */}
              <Receipt className="size-4 text-custom-secondary" />

              <div className=" w-full flex flex-col justify-start items-start gap-1">
                {/* title */}
                <span className="text-custom-secondary text-[0.625rem] font-medium">
                  Total keseluruhan
                </span>

                {/* total */}
                <div className="flex flex-row justify-start items-start gap-1">
                  <span className="text-custom-secondary font-semibold text-xs">
                    {transactionSummary.totalJumlahBarang > 0
                      ? formatRupiah(transactionSummary.totalJumlahBarang)
                      : 0}
                  </span>

                  <span className="text-[0.625rem] text-base-content font-medium">
                    Pcs
                  </span>
                </div>

                {/* sub total */}
                <div className="w-full flex flex-row justify-between items-center">
                  <span className="text-[0.625rem] font-medium text-base-content">
                    Subtotal
                  </span>
                  <span className="text-[0.625rem] font-semibold text-base-content">
                    {transactionSummary.totalUangTransaksi > 0
                      ? formatRupiah(transactionSummary.totalUangTransaksi)
                      : 0}
                  </span>
                </div>
              </div>
            </div>
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
            Disarankan jumlah DP minimal sama dengan nilai barang yang dikirim
            saat ini. Jika transaksi masih full booking (belum ada barang yang
            dikirim), DP disarankan minimal 20% dari total nilai booking.
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
            <div className="w-full flex flex-row justify-between items-center py-1 border-t border-base-content/10">
              {/* label */}
              <p className="text-[0.7rem] font-medium text-base-content">
                Saran DP{" "}
                <span className="text-[0.625rem] font-normal">
                  {transactionSummary.totalUangBarangDikirim >=
                  (transactionSummary?.dpTransaksi ?? 0)
                    ? `(Total Barang Dikirim)`
                    : `(DP 20% + Total Barang Dikirim)`}
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
            Metode Pembayaran
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
              />

              {/* tempo */}
              <CardMetodePembayaran
                icon={CalendarClock}
                bgColor="bg-amber-50"
                iconColor="text-amber-500"
                label="Kredit / Cicilan"
                description="Bayar melalui kredit atau cicilan."
                handleClick={() => handleMetodePembayaran("TEMPO")}
                isActive={metodePembayaran === "TEMPO"}
                noDeskripsi
              />
            </div>

            {/* ringkasan pembayaran */}
            <div className="w-full flex flex-col justify-start items-start gap-2.5 mt-2.5 border-b border-base-content/10 pb-2.5">
              <span className="text-sm font-medium text-base-content">
                Ringkasan Pembayaran
              </span>
              <div className="w-full flex flex-row justify-between items-center">
                <span className="text-xs font-medium text-base-content">
                  Uang Diterima
                </span>
                {/* total */}
                <span className="text-xs font-semibold text-info">
                  {formatRupiah(dataDiBayar)}
                </span>
              </div>
              <div className="w-full flex flex-row justify-between items-center">
                <span className="text-xs font-medium text-base-content">
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
                <div className="w-full flex flex-col justify-start items-start">
                  <button
                    ref={buttonAturTempoRef}
                    type="button"
                    className={cn(
                      "w-full h-10 bg-emerald-600 rounded-xl flex flex-row hover-overlay justify-center items-center mt-4",
                      metodePembayaran === "TEMPO"
                        ? isErrors.includes("DATA_TEMPO_KOSONG")
                          ? "animate-pop-in-active"
                          : "animate-pop-in"
                        : "hidden",
                    )}
                    onClick={() => handleShowModalTempo()}
                  >
                    <span className="text-xs font-medium text-primary-white">
                      Atur Tempo Cicilan
                    </span>
                  </button>

                  {isErrors.includes("DATA_TEMPO_KOSONG") && (
                    <ErrorMessage
                      errorMessage={
                        isErrors.includes("DATA_TEMPO_KOSONG")
                          ? "Harap lakukan pengaturan tempo terlebih dahulu"
                          : ""
                      }
                    />
                  )}
                </div>
              )}

              <div className="w-full flex flex-col justify-start items-start gap-1">
                <button
                  type="button"
                  className={cn(
                    "w-full h-10 bg-custom-primary rounded-xl flex flex-row hover-overlay justify-center items-center",
                  )}
                  onClick={() => handleTransaction()}
                >
                  {isPendingTransaction ? (
                    <div className="loading loading-xs text-custom-secondary" />
                  ) : (
                    <span className="text-xs font-medium text-custom-secondary">
                      Selesaikan Transaksi
                    </span>
                  )}
                </button>
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

      {/* modal formulir tempo */}
      <ModalTempoPayment
        data={{
          total: transactionSummary.totalUangTransaksi,
          dp: dataDp ?? transactionSummary.saranDp,
        }}
        modalRef={modalTempoRef}
        handleCloseModal={handleCloseModalTempo}
        handleShowModal={handleShowModalTempo}
        handleSetDataTempo={setDataTempo}
        booking
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

// content tooltip
type FormTooltipProps = {
  itemId?: number;
  isOpenId?: number | null;
  maxStok?: number;
  handleSetData: (stok: number) => void;
  handleClose: () => void;
  defaultValue?: number;
  jumlahPesan: number;
};
const FormTooltip: FC<FormTooltipProps> = ({
  isOpenId,
  itemId,
  maxStok,
  handleSetData,
  defaultValue,
  handleClose,
  jumlahPesan,
}) => {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    const value = defaultValue;

    if (value !== undefined && value !== null) {
      setDisplayValue(formatNumber(String(value)));
    } else {
      setDisplayValue("");
    }
  }, [defaultValue]);

  return (
    <Tooltip
      id={`stok-${itemId}`}
      isOpen={isOpenId === itemId}
      clickable
      place="left-start"
      opacity={1}
      className="bg-base-100! text-base-content! rounded-xl! shadow-xl! border! border-base-300!"
      render={() => {
        if (!isOpenId) return null;

        return (
          <div className="w-64 p-2 flex flex-col justify-start items-start relative">
            {/* button close */}
            <button
              type="button"
              className="absolute top-0 -right-2 opacity-50 hover:opacity-100 transition-opacity ease-in-out duration-150"
              onClick={() => handleClose()}
            >
              <CircleX className="size-4 text-base-content" />
            </button>

            <div className="w-full flex flex-col justify-start items-start gap-1.5 mt-2">
              {/* title */}
              <span className="font-medium">
                Silahkan masukan stok yang akan dikirim
              </span>

              <div className="flex gap-2.5 flex-row justify-between items-center w-full">
                <div className="flex flex-row justify-start items-center gap-2 border border-base-content/50 rounded-lg w-full focus-within:ring-1 focus-within:ring-base-content focus-within:border-base-content transition-all duration-300 ease-in-out bg-base-100 h-7.5 px-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    className="w-full font-medium text-base-content h-full border-none outline-none placeholder:text-base-content/50 placeholder:font-light text-xs lg:text-xs placeholder:text-xs lg:placeholder:text-xs"
                    value={displayValue}
                    onChange={(e) => {
                      const rawValue = unformatNumber(e.target.value);

                      if (!rawValue) {
                        setDisplayValue("");

                        return;
                      }

                      let numberValue = Number(rawValue);

                      if (
                        (maxStok && numberValue > maxStok) ||
                        numberValue > jumlahPesan
                      ) {
                        numberValue = jumlahPesan;
                      }

                      setDisplayValue(formatNumber(String(numberValue)));
                    }}
                  />
                </div>

                {/* aksi */}
                <div className="flex flex-row justify-end items-center">
                  <button
                    type="button"
                    className="h-7.5 px-2.5 gap-2 rounded-lg bg-custom-primary hover-overlay text-custom-secondary text-[0.625rem] flex flex-row justify-center items-center"
                    onClick={() => handleSetData(Number(displayValue))}
                  >
                    <Save className="size-3" />
                    <span className="font-medium">Simpan</span>
                  </button>
                </div>
              </div>

              <span className="text-[0.625rem] text-base-content">
                Stok tersedia: {maxStok}
              </span>
            </div>
          </div>
        );
      }}
    />
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
