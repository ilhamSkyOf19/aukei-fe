import {
  BadgeCheck,
  Banknote,
  CalendarClock,
  Coins,
  Landmark,
  Minus,
  Pencil,
  Phone,
  QrCode,
  ShoppingBasketIcon,
  ShoppingCart,
  Tag,
  type LucideIcon,
} from "lucide-react";
import TitleModalFormulir from "../../../../components/ui/TitleModalFormulir";
import usePembayaran from "./usePembayaran";
import type { FC } from "react";
import { cn } from "../../../../utils/cn";
import {
  formatNumberPhone,
  formatRupiah,
  highlightName,
} from "../../../../helpers/helpers";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import ModalCashPayment from "../../../../components/modals/ModalCashPayment";
import ErrorMessage from "../../../../components/messages/ErrorMessage";
import ModalAlert from "../../../../components/modals/ModalAlert";

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
  } = usePembayaran({
    handleSteps,
    handleToast,
  });

  return (
    <div className="w-full flex flex-row justify-between items-start gap-6 p-4">
      {/* metode pembayaran */}
      <div className="flex-3 flex flex-col justify-start items-start rounded-lg border border-base-content/10 p-4">
        {/* title */}
        <TitleModalFormulir
          title="Pilih Metode Pembayaran"
          keterangan="Pilih metode pembayaran untuk menyelesaikan transaksi"
        />

        {/* metode pembayaran */}
        <div className="w-full flex flex-col justify-start items-start mt-6 gap-2">
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
      </div>

      {/* daftar produk */}
      <div className="flex-4 flex flex-col justify-start items-start gap-4">
        {/* header */}
        <div className="w-full flex flex-row justify-between items-center">
          {/* title */}
          <h3 className="text-sm font-medium text-base-content">
            Ringkasan Transaksi
          </h3>

          {/* button update transaksi */}
          <ButtonWithIcon
            handleBtn={() => handleUbahTransaction()}
            icon={Pencil}
            bgColor="bg-info"
            textColor="text-primary-white"
            label="Ubah Transaksi"
          />
        </div>

        {/* data pelanggan */}
        <div
          className={cn(
            "w-full flex flex-row justify-between items-center border rounded-lg py-3 px-4 border-base-content/10",
          )}
        >
          {/* avatar, name, no telp */}
          <div className="flex-1 flex flex-row justify-start items-center gap-3">
            {pelanggan === null ? (
              <span className="text-sm text-base-content/80 font-medium">
                Tidak ada pelanggan
              </span>
            ) : (
              <div className="w-full flex flex-col justify-start items-start gap-2.5">
                {/* label */}
                <p className="text-sm text-base-content/50 font-medium">
                  Pelanggan
                </p>

                <div className="w-full flex flex-row justify-start items-center gap-3">
                  {/* avatar */}
                  <div className="avatar avatar-placeholder">
                    <div className="bg-custom-primary text-neutral-content w-10 rounded-full">
                      <span className="text-base text-custom-secondary font-medium uppercase">
                        {highlightName(pelanggan.nama)}
                      </span>
                    </div>
                  </div>
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
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col justify-start items-start gap-2">
          {/* header */}
          <p className="text-xs text-base-content/80 font-medium">
            Detail Produk ({dataDetails && dataDetails.length})
          </p>
          <div className="overflow-x-auto w-full rounded-lg border border-base-content/10 pb-6">
            <table className="table table-xs">
              {/* head */}
              <thead className="bg-base-content/5 h-10">
                <tr className="text-[0.625rem]">
                  <th>Gambar</th>
                  <th>Nama Produk</th>
                  <th>Harga (Rp)</th>
                  <th>Diskon (Rp)</th>
                  <th>Jumlah</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                {dataDetails && dataDetails.length > 0 ? (
                  dataDetails.map((item, index) => (
                    <tr key={index} className="h-15">
                      <td>
                        <div className="avatar">
                          <div className="mask mask-squircle h-10 w-10">
                            <img src={item.img} alt="gambar produk" />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col justify-start items-start gap-px">
                          <p>{item.nama}</p>
                          <span className="font-medium text-base-content/50">
                            {item.kode}
                          </span>
                        </div>
                      </td>
                      <td>{formatRupiah(item.hargaJual)}</td>
                      <td>{formatRupiah(item.diskon)}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <span className="font-medium text-base-content">
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

        {/* sub total */}
        <div className="w-full flex flex-col justify-start items-start rounded-lg border border-base-content/10 px-3 py-4">
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
                    <span className="text-sm font-medium text-base-content/60">
                      Total
                    </span>
                  </div>
                  <span className="text-sm font-medium text-blue-400">
                    {formatRupiah(totalAfterDiskon)}
                  </span>
                </div>

                {/* total di bayar */}
                {metodePembayaran && (
                  <div className="w-full flex flex-row justify-between items-center">
                    <div className="flex flex-row justify-start items-center gap-4">
                      {/* icon */}
                      <Banknote className="size-4 text-base-content/60" />
                      <span className="text-sm font-medium text-base-content/60">
                        {metodePembayaran === "CASH" && "Tunai"}
                        {metodePembayaran === "QRIS" && "QRIS"}
                        {metodePembayaran === "TRANSFER" && "Transfer"}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-base-content">
                      {formatRupiah(dataDiBayar)}
                    </span>
                  </div>
                )}

                {metodePembayaran === "CASH" && (
                  <>
                    {/* kembalian */}
                    <div className="w-full flex flex-row justify-between items-center">
                      <div className="flex flex-row justify-start items-center gap-4">
                        {/* icon */}
                        <Coins className="size-4 text-base-content/60" />
                        <span className="text-sm font-medium text-base-content/60">
                          Kembalian
                        </span>
                      </div>
                      <span className="text-sm font-medium text-emerald-600">
                        {formatRupiah(
                          dataDiBayar === 0
                            ? 0
                            : dataDiBayar - totalAfterDiskon,
                        )}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* button selesaikan transaksi */}
        <ButtonWithIcon
          icon={BadgeCheck}
          customClass="w-full"
          label="Selesaikan Transaksi"
          handleBtn={() => handleTransaction()}
          isLoading={isPendingTransaction}
        />
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
          ? "border-emerald-600 bg-emerald-600/5"
          : isError
            ? "border-rose-600 bg-rose-600/5"
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
