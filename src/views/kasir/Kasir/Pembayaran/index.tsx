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
  type LucideIcon,
} from "lucide-react";
import TitleModalFormulir from "../../../../components/ui/TitleModalFormulir";
import usePembayaran from "./usePembayaran";
import type { FC } from "react";
import { cn } from "../../../../utils/cn";
import { formatNumberPhone, formatRupiah } from "../../../../helpers/helpers";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import ModalCashPayment from "../../../../components/modals/ModalCashPayment";
import ErrorMessage from "../../../../components/messages/ErrorMessage";
import ModalAlert from "../../../../components/modals/ModalAlert";
import ButtonText from "../../../../components/ui/button/ButtonText";
import ModalTempoPayment from "../../../../components/modals/ModalTempoPayment";
import { formatTanggalPanjang } from "../../../../helpers/formatDate";

type Props = {
  handleSteps: (value: number) => void;
  handleToast: (value: string) => void;
};

const Pembayaran: FC<Props> = ({ handleSteps, handleToast }) => {
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
    isModeKasir,
    buttonAturTempoRef,
    dataTempo,
    handleCloseModalTempo,
    handleShowModalTempo,
    modalTempoRef,
    handleSetDataTempo,
  } = usePembayaran({
    handleSteps,
    handleToast,
  });

  return (
    <div className="w-full flex flex-row justify-start items-start gap-4">
      <div
        className={cn(
          "  flex flex-col justify-start items-start gap-2 transition-all duration-200 ease-in-out",
          metodePembayaran === "TEMPO" ? "flex-2" : "flex-3",
        )}
      >
        {/* data pelanggan */}

        <div className="w-full flex flex-col justify-start items-start gap-2">
          <div
            className={cn(
              "w-full flex flex-row justify-between items-center border rounded-lg py-3 px-4 border-transparent bg-base-100 shadow-sm dark:border-base-content/10 h-15",
            )}
          >
            <div className="flex-1 flex flex-row justify-start items-center">
              <p className="text-sm text-base-content font-medium">
                Data Pelanggan
              </p>
            </div>

            {/* name, no telp */}
            <div className="flex-2 flex flex-row justify-end items-center gap-3">
              {pelanggan === null ? (
                <span className="text-sm text-base-content/80 font-medium">
                  Tidak ada pelanggan
                </span>
              ) : (
                <div className="w-full flex flex-row justify-end items-start gap-4">
                  {/* name */}
                  <div className="w-25 flex flex-col justify-start items-start gap-0.5 border-r border-base-content/10">
                    <span className="text-base-content/50 font-semibold text-[0.625rem]">
                      Nama
                    </span>
                    <span className="text-base-content font-semibold text-xs">
                      {pelanggan.nama}
                    </span>
                  </div>
                  <div className="w-30 flex flex-col justify-start items-start gap-0.5">
                    <span className="text-base-content/50 font-semibold text-[0.625rem]">
                      No Whatsapp
                    </span>
                    <span className="text-base-content font-semibold text-xs">
                      {formatNumberPhone(pelanggan.noWa)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* metode pembayaran */}
        <div className="w-full flex flex-col justify-start items-start rounded-lg bg-base-100 border border-transparent dark:border-base-content/10 shadow-sm p-4">
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
                  "w-full h-10 bg-emerald-600 rounded-lg flex flex-row hover-overlay justify-center items-center mt-4",
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

      {/* daftar produk */}
      <div className="flex-4 flex h-full flex-col justify-start items-start gap-2">
        {/* header */}
        <div className="w-full h-15 flex flex-row justify-between items-center bg-base-100 p-4 rounded-lg border border-transparent dark:border-base-content/10 shadow-sm">
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

        <div className="w-full flex flex-col justify-start items-start">
          <div
            className={cn(
              "overflow-y-auto w-full rounded-lg border border-transparent bg-base-100 shadow-sm dark:border-base-content/10 pb-6",
              isModeKasir ? "xl:h-85" : "xl:h-74.5",
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
        </div>

        <div className="w-full h-45 flex flex-row justify-between items-center gap-4 ">
          {/* sub total */}
          <div className="w-full h-full flex flex-col justify-start items-start rounded-lg border border-transparent bg-base-100 shadow-sm dark:border-base-content/10 px-3 py-4">
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
                          {metodePembayaran === "TEMPO" && "Kredit"}
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
            <div className="w-full h-full flex flex-col justify-start items-start rounded-lg border border-transparent bg-base-100 shadow-sm dark:border-base-content/10 px-3 py-4">
              {/* header */}
              <div className="w-full flex flex-col justify-start items-start">
                <span className="text-xs font-medium">
                  Ringkasan Jadwal Cicilan{" "}
                  <span>
                    {dataTempo?.jumlahCicilan
                      ? `(${dataTempo?.jumlahCicilan}x)`
                      : "-"}
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
                          item.cicilanKe !== dataTempo?.jumlahCicilan &&
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
        handleSetDataTempo={handleSetDataTempo}
      />
    </div>
  );
};

// card metode pembayaran
type CardMetodePembayaranProps = {
  bgColor: string;
  iconColor: string;
  icon: LucideIcon;
  label: string;
  description: string;
  isActive: boolean;
  handleClick: () => void;
  isError?: boolean;
};

const CardMetodePembayaran: FC<CardMetodePembayaranProps> = ({
  icon: Icon,
  bgColor,
  iconColor,
  label,
  description,
  isActive,
  handleClick,
  isError,
}) => {
  return (
    <button
      type="button"
      className={cn(
        "w-full flex flex-row justify-between items-center rounded-lg shadow-sm p-3 border  transition-all duration-150 ease-in-out",
        isActive
          ? "border-emerald-600 bg-emerald-600/10"
          : isError
            ? "border-rose-600 bg-rose-600/10"
            : "border-transparent hover:border-emerald-600",
      )}
      onClick={handleClick}
    >
      {/* content */}
      <div className="flex-2 flex flex-row justify-start items-center gap-4">
        {/* icon */}
        <div
          className={cn(
            "w-10 h-10 rounded-full flex flex-row justify-center items-center",
            bgColor,
          )}
        >
          <Icon className={cn("size-5", iconColor)} />
        </div>

        {/* label */}
        <div className="flex flex-col justify-start items-start gap-1">
          <span className="text-xs font-medium text-base-content">{label}</span>
          <span className="text-[0.625rem] font-medium text-base-content/50">
            {description}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-row justify-end items-center">
        <div
          className={cn(
            "w-6 h-6 rounded-full border flex flex-col justify-center items-center",
            isActive ? "border-emerald-600" : "border-base-content",
          )}
        >
          <div
            className={cn(
              "w-3 h-3 bg-emerald-600 rounded-full transition-all duration-150 ease-in-out",
              isActive ? "animate-radio-active" : "opacity-0 scale-0",
            )}
          />
        </div>
      </div>
    </button>
  );
};

export default Pembayaran;
