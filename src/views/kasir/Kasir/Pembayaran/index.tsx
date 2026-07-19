import {
  Banknote,
  CalendarClock,
  Coins,
  HandCoins,
  Landmark,
  Minus,
  Pencil,
  QrCode,
  ShoppingBasketIcon,
  ShoppingCart,
  Tag,
  X,
} from "lucide-react";
import TitleModalFormulir from "../../../../components/ui/TitleModalFormulir";
import usePembayaran from "./usePembayaran";
import type { FC } from "react";
import { cn } from "../../../../utils/cn";
import { formatRupiah } from "../../../../helpers/helpers";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import ModalCashPayment from "../../../../components/modals/ModalCashPayment";
import ErrorMessage from "../../../../components/messages/ErrorMessage";
import ModalAlert from "../../../../components/modals/ModalAlert";
import ButtonText from "../../../../components/ui/button/ButtonText";
import ModalTempoPayment from "../../../../components/modals/ModalTempoPayment";
import { formatTanggalPanjang } from "../../../../helpers/formatDate";
import { PAYMENT_METHOD_TYPE } from "../../../../types/constant.type";
import HeaderPelangganForKasir from "../../../../components/ui/HeaderPelangganForKasir";
import type { PayloadPenggunaInternalType } from "../../../../models/penggunaInternal.model";
import CardMetodePembayaran from "../../../../components/ui/cards/CardMetodePembayaran";

type Props = {
  handleSteps: (value: number) => void;
  handleToast: (value: string) => void;
  kasir?: PayloadPenggunaInternalType | null;
};

const Pembayaran: FC<Props> = ({ handleSteps, handleToast, kasir }) => {
  // call use
  const {
    handleMetodePembayaran,
    metodePembayaran,
    dataDetails,
    pelanggan,
    handleCloseModalCalculator,
    handleShowModalCalculator,
    modalCalculatorRef,
    handlePay,
    dataDiBayar,
    subTotalBeforeDiskon,
    totalAfterDiskon,
    totalDiskon,
    handleTransaction,
    isPendingTransaction,
    isErrors,
    handleCancel,
    modalConfirmRef,
    buttonBayarRef,
    handleConfirm,
    handleUbahTransaction,
    handleBatalTransaction,
    buttonAturTempoRef,
    dataTempo,
    handleCloseModalTempo,
    handleShowModalTempo,
    modalTempoRef,
    handleSetDataTempo,
  } = usePembayaran({
    handleSteps,
    handleToast,
    kasir,
  });

  // perbaiki design nya

  return (
    <div className="w-full h-[95vh] grid grid-rows-9 gap-4">
      <div
        className={cn(
          "row-span-1 grid  gap-2.5 transition-all duration-300 ease-in-out",
          metodePembayaran === PAYMENT_METHOD_TYPE.TEMPO
            ? "grid-cols-6"
            : "grid-cols-5",
        )}
      >
        {/* data pelanggan */}
        <div
          className={
            "w-full col-span-2 row-span-1 flex flex-col justify-start items-start gap-2"
          }
        >
          <HeaderPelangganForKasir kasir={kasir} pelanggan={pelanggan} />
        </div>

        {/* header */}
        <div
          className={cn(
            "w-full h-15 flex flex-row justify-between items-center bg-base-100 p-4 rounded-xl border border-transparent dark:border-base-content/10 shadow-sm  transition-all duration-300 ease-in-out",
            metodePembayaran === PAYMENT_METHOD_TYPE.TEMPO
              ? "col-span-4"
              : "col-span-3",
          )}
        >
          {/* title */}
          <h3 className="text-sm font-medium text-base-content">
            Ringkasan Transaksi
          </h3>

          <div className="flex flex-row justify-end items-center gap-4">
            {/* button update transaksi */}
            <ButtonWithIcon
              handleBtn={() => handleBatalTransaction()}
              icon={X}
              bgColor="bg-error"
              textColor="text-primary-white"
              label="Batalkan Transaksi"
            />
            {/* button update transaksi */}
            <ButtonWithIcon
              handleBtn={() => handleUbahTransaction()}
              icon={Pencil}
              bgColor="bg-info"
              textColor="text-primary-white"
              label="Ubah Transaksi"
            />
          </div>
        </div>
      </div>

      <div
        className={cn(
          "row-span-8 grid gap-2.5",
          metodePembayaran === PAYMENT_METHOD_TYPE.TEMPO
            ? "grid-cols-6"
            : "grid-cols-5",
        )}
      >
        <div
          className={cn(
            "h-full col-span-2 gap-4 transition-all duration-200 ease-in-out",
            metodePembayaran === "TEMPO" ? "flex-2" : "flex-3",
          )}
        >
          {/* metode pembayaran */}
          <div className="w-full flex flex-row justify-start items-start">
            <div className="w-full flex flex-col justify-start items-start rounded-xl bg-base-100 border border-transparent dark:border-base-content/10 shadow-sm p-4">
              {/* title */}
              <TitleModalFormulir
                title="Pilih Metode Pembayaran"
                keterangan="Pilih metode pembayaran untuk menyelesaikan transaksi"
              />

              {/* metode pembayaran */}
              <div className="w-full flex flex-col justify-start items-start mt-4 gap-2">
                {/* header */}
                <p className="text-xs text-base-content/80 font-medium">
                  Metode Pembayaran
                </p>

                {/* card */}
                <div className="w-full flex flex-col justify-start items-start gap-3">
                  {/* cash */}
                  <CardMetodePembayaran
                    icon={Banknote}
                    bgColor="bg-emerald-50"
                    iconColor="text-emerald-500"
                    label="Tunai"
                    description="Bayar dengan uang tunai."
                    handleClick={() => handleMetodePembayaran("CASH")}
                    isActive={metodePembayaran === "CASH"}
                    isError={isErrors.includes("METODE_PEMBAYARAN_KOSONG")}
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
                    isError={isErrors.includes("METODE_PEMBAYARAN_KOSONG")}
                  />

                  {/* qris */}
                  <CardMetodePembayaran
                    icon={QrCode}
                    bgColor="bg-purple-50"
                    iconColor="text-purple-500"
                    label="QRIS"
                    description="Bayar melalui QRIS."
                    handleClick={() => handleMetodePembayaran("QRIS")}
                    isActive={metodePembayaran === "QRIS"}
                    isError={isErrors.includes("METODE_PEMBAYARAN_KOSONG")}
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
                    isError={isErrors.includes("METODE_PEMBAYARAN_KOSONG")}
                  />
                </div>

                {/* message error */}
                {isErrors.includes("METODE_PEMBAYARAN_KOSONG") && (
                  <ErrorMessage errorMessage="Harap pilih metode pembayaran" />
                )}
              </div>

              {/* button bayar */}
              {metodePembayaran === "CASH" && (
                <div className="w-full flex flex-col justify-start items-start">
                  <button
                    ref={buttonBayarRef}
                    type="button"
                    className={cn(
                      "w-full h-10 bg-emerald-600 rounded-lg flex flex-row hover-overlay justify-center items-center mt-4",
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

                  <ErrorMessage
                    errorMessage={
                      isErrors.includes("DATA_DI_BAYAR_KOSONG")
                        ? "Harap lakukan pembayaran terlebih dahulu"
                        : ""
                    }
                  />
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

                  <ErrorMessage
                    errorMessage={
                      isErrors.includes("DATA_TEMPO_KOSONG")
                        ? "Harap lakukan pengaturan tempo terlebih dahulu"
                        : ""
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* daftar produk */}
        <div
          className={cn(
            "h-full grid grid-rows-3 gap-2 min-h-0",
            metodePembayaran === PAYMENT_METHOD_TYPE.TEMPO
              ? "col-span-4"
              : "col-span-3",
          )}
        >
          <div
            className={cn(
              "overflow-y-auto row-span-2 rounded-xl border border-transparent bg-base-100 shadow-sm dark:border-base-content/10 pb-6",
            )}
          >
            <table className="table table-xs table-pin-rows table-pin-cols table-zebra">
              {/* head */}
              <thead className="bg-base-content/5 h-10">
                <tr className="text-[0.625rem]">
                  <th>Gambar</th>
                  <th>Nama Produk</th>
                  <th>Harga (Rp)</th>
                  <th>Diskon (Rp)</th>
                  <th>Jumlah</th>
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
                          <p className="xl:text-[0.7rem] text-base-content">
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
                        {" "}
                        <span className="xl:text-[0.7rem] text-base-content">
                          {formatRupiah(item.diskon)}
                        </span>
                      </td>
                      <td>
                        <span className="xl:text-[0.7rem] text-base-content">
                          {/* qty */}
                          {item.quantity} x
                        </span>
                      </td>
                      <td>
                        <span className=" xl:text-[0.7rem] text-base-content">
                          {formatRupiah(
                            item.hargaJual * item.quantity - item.diskon,
                          )}
                        </span>
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

          <div className="w-full flex flex-row row-span-1 justify-between items-center gap-4 ">
            {/* sub total */}
            <div className="w-full h-full flex flex-col justify-start items-start rounded-xl border border-transparent bg-base-100 shadow-sm dark:border-base-content/10 px-3 py-4">
              {dataDetails && (
                <>
                  {/* sub total & total diskon */}
                  <div className="w-full flex flex-col justify-start items-start gap-3 pb-4 border-b border-base-content/10">
                    {/* sub total */}
                    <div className="w-full flex flex-row justify-between items-center">
                      <div className="flex flex-row justify-start items-center gap-4">
                        {/* icon */}
                        <ShoppingBasketIcon className="size-4 text-base-content/60" />
                        <span className="text-xs font-medium text-base-content/60">
                          Subtotal
                        </span>
                      </div>
                      <span className="text-xs font-medium text-base-content">
                        {formatRupiah(subTotalBeforeDiskon)}
                      </span>
                    </div>

                    {/* total diskon */}
                    <div className="w-full flex flex-row justify-between items-center">
                      <div className="flex flex-row justify-start items-center gap-4">
                        {/* icon */}
                        <Tag className="size-4 text-base-content/60" />
                        <span className="text-xs font-medium text-base-content/60">
                          Total Diskon
                        </span>
                      </div>
                      <div className="flex flex-row justify-start items-center gap-1">
                        {totalDiskon > 0 && (
                          <span className="text-xs font-medium text-error">
                            <Minus className="size-2" />
                          </span>
                        )}

                        <span className="text-xs font-medium text-error">
                          {formatRupiah(totalDiskon)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* total */}
                  <div className="w-full flex flex-col justify-start items-start gap-3 pt-4">
                    <div className="w-full flex flex-row justify-between items-center">
                      <div className="flex flex-row justify-start items-center gap-4">
                        {/* icon */}
                        <ShoppingCart className="size-4 text-base-content/60" />
                        <span className="text-xs font-medium text-base-content/60">
                          Total
                        </span>
                      </div>
                      <span className="text-xs font-medium text-blue-400">
                        {formatRupiah(totalAfterDiskon)}
                      </span>
                    </div>

                    {/* total di bayar */}
                    {metodePembayaran && (
                      <div className="w-full flex flex-row justify-between items-center">
                        <div className="flex flex-row justify-start items-center gap-4">
                          {/* icon */}
                          <Banknote className="size-4 text-base-content/60" />
                          <span className="text-xs font-medium text-base-content/60">
                            {metodePembayaran === "CASH" && "Tunai"}
                            {metodePembayaran === "QRIS" && "QRIS"}
                            {metodePembayaran === "TRANSFER" && "Transfer"}
                            {metodePembayaran === "TEMPO" && "Kredit Selama"}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-base-content">
                          {metodePembayaran === "TEMPO"
                            ? dataTempo?.tenor
                              ? `${dataTempo?.tenor} Minggu`
                              : "-"
                            : formatRupiah(dataDiBayar)}
                        </span>
                      </div>
                    )}

                    {/* cash */}
                    {metodePembayaran === "CASH" && (
                      <>
                        {/* kembalian */}
                        <div className="w-full flex flex-row justify-between items-center">
                          <div className="flex flex-row justify-start items-center gap-4">
                            {/* icon */}
                            <Coins className="size-4 text-base-content/60" />
                            <span className="text-xs font-medium text-base-content/60">
                              Kembalian
                            </span>
                          </div>
                          <span className="text-xs font-medium text-emerald-600">
                            {formatRupiah(
                              dataDiBayar === 0
                                ? 0
                                : dataDiBayar - totalAfterDiskon,
                            )}
                          </span>
                        </div>
                      </>
                    )}

                    {/* tempo */}
                    {metodePembayaran === "TEMPO" && (
                      <>
                        {/* Uang Muka */}
                        <div className="w-full flex flex-row justify-between items-center">
                          <div className="flex flex-row justify-start items-center gap-4">
                            {/* icon */}
                            <HandCoins className="size-4 text-base-content/60" />
                            <span className="text-xs font-medium text-base-content/60">
                              Uang Muka
                            </span>
                          </div>
                          <span className="text-xs font-medium text-emerald-600">
                            {dataTempo?.uangMuka
                              ? formatRupiah(dataTempo?.uangMuka)
                              : "-"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* atur preview tempo */}
            {metodePembayaran === "TEMPO" && (
              <div className="w-full h-full flex flex-col justify-start items-start rounded-xl border border-transparent bg-base-100 shadow-sm dark:border-base-content/10 px-3 py-4">
                {/* header */}
                <div className="w-full flex flex-col justify-start items-start">
                  <span className="text-xs font-medium">
                    Ringkasan Jadwal Cicilan{" "}
                    <span>
                      {dataTempo?.tenor ? `(${dataTempo?.tenor}x)` : "-"}
                    </span>
                  </span>
                </div>
                {dataTempo ? (
                  <>
                    {/* jadwal cicilan */}
                    <div className="w-full flex flex-col justify-start items-center mt-2.5 pb-2 gap-2 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-custom-secondary">
                      {dataTempo?.installments.map((item) => (
                        <div
                          key={item.cicilanKe}
                          className={cn(
                            "w-full grid grid-cols-7 pb-1",
                            item.cicilanKe !== dataTempo?.tenor &&
                              "border-b border-base-content/10",
                          )}
                        >
                          {/* number */}
                          <div className="col-span-1 flex flex-row justify-start items-center">
                            <div className="w-5 h-5 flex flex-row justify-center items-center rounded-full bg-custom-primary/50">
                              <span className="text-[0.625rem] font-semibold text-custom-secondary">
                                {item.cicilanKe}
                              </span>
                            </div>
                          </div>
                          {/* tanggal */}
                          <div className="col-span-3 flex flex-row justify-start items-center">
                            <span className="text-[0.625rem] font-semibold text-base-content">
                              {formatTanggalPanjang(item.jatuhTempo)}
                            </span>
                          </div>

                          {/* nominal */}
                          <div className="col-span-3 flex flex-row justify-start items-center">
                            <span className="text-[0.625rem] font-semibold text-base-content">
                              {formatRupiah(item.nominal)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-row justify-center items-center">
                    <span className="text-xs font-medium text-base-content/50">
                      Silahkan atur tempo terlebih dahulu
                    </span>
                  </div>
                )}
              </div>
            )}
            {/* button selesaikan transaksi */}
            <ButtonText
              customHeight="h-full shrink-0"
              customWidth="w-40"
              label="Selesaikan Transaksi"
              handleClick={() => handleTransaction()}
              isLoading={isPendingTransaction}
              bgColor="bg-custom-primary rounded-lg"
              textColor="text-custom-secondary"
            />
          </div>
        </div>
      </div>

      {/* modal calculator */}
      <ModalCashPayment
        modalRef={modalCalculatorRef}
        handleCloseModal={handleCloseModalCalculator}
        handlePay={handlePay}
        total={totalAfterDiskon}
      />

      {/* modal confirm */}
      <ModalAlert
        modalRef={modalConfirmRef}
        handleCloseModal={handleCancel}
        handleConfirm={handleConfirm}
        bigTitle={"Apakah Anda yakin ingin memproses transaksi ini?"}
        smallTitle={
          "Pastikan data transaksi telah sesuai. Setelah diproses, transaksi akan disimpan dan siap untuk dicetak."
        }
      />

      {/* modal formulir tempo */}
      <ModalTempoPayment
        data={{ total: totalAfterDiskon }}
        modalRef={modalTempoRef}
        handleCloseModal={handleCloseModalTempo}
        handleShowModal={handleShowModalTempo}
        handleSetDataTempo={handleSetDataTempo}
      />
    </div>
  );
};

export default Pembayaran;
