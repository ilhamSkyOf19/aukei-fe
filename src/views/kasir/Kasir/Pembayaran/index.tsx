import {
  Banknote,
  CalendarClock,
  CircleCheck,
  Landmark,
  Minus,
  Pencil,
  QrCode,
  X,
} from "lucide-react";
import TitleModalFormulir from "../../../../components/ui/TitleModalFormulir";
import usePembayaran from "./usePembayaran";
import type { FC } from "react";
import { cn } from "../../../../utils/cn";
import { formatRupiah, getWeekFromPeriod } from "../../../../helpers/helpers";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import ModalCashPayment from "../../../../components/modals/ModalCashPayment";
import ErrorMessage from "../../../../components/messages/ErrorMessage";
import ModalAlert from "../../../../components/modals/ModalAlert";
import ModalTempoPayment from "../../../../components/modals/ModalTempoPayment";
import { formatTanggalPanjang } from "../../../../helpers/formatDate";
import { PAYMENT_METHOD_TYPE } from "../../../../types/constant.type";
import HeaderPelangganForKasir from "../../../../components/ui/HeaderPelangganForKasir";
import type { PayloadPenggunaInternalType } from "../../../../models/penggunaInternal.model";
import CardMetodePembayaran from "../../../../components/ui/cards/CardMetodePembayaran";

type Props = {
  handleToast: (value: string) => void;
  kasir?: PayloadPenggunaInternalType | null;
};

const Pembayaran: FC<Props> = ({ handleToast, kasir }) => {
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
    handleToast,
    kasir,
  });

  // perbaiki design nya

  return (
    <div className="w-full h-full grid grid-rows-9 gap-4">
      <div
        className={cn(
          "row-span-1 grid h-full gap-2.5 transition-all duration-300 ease-in-out grid-cols-7",
        )}
      >
        {/* header */}
        <div
          className={cn(
            "w-full h-15 flex flex-row justify-between items-center bg-base-100 p-4 rounded-xl border border-transparent dark:border-base-content/10 shadow-sm  transition-all duration-300 ease-in-out col-span-5",
            // metodePembayaran === PAYMENT_METHOD_TYPE.TEMPO
            // ? "col-span-5"
            // : "col-span-3",
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

        {/* data pelanggan */}
        <div
          className={
            "w-full  col-span-2 row-span-1 flex flex-col justify-start items-start gap-2"
          }
        >
          <HeaderPelangganForKasir kasir={kasir} pelanggan={pelanggan} />
        </div>
      </div>

      <div className={cn("h-full grid gap-2.5 grid-cols-7")}>
        {/* daftar produk */}
        <div className={cn("h-full col-span-5")}>
          <div
            className={cn(
              "w-full h-full overflow-y-auto row-span-2 rounded-xl border border-transparent bg-base-100 shadow-sm dark:border-base-content/10 pb-6",
            )}
          >
            <table className="table  table-zebra">
              {/* head */}
              <thead>
                <tr className="text-[0.7rem] h-12 bg-base-200">
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
                    <tr
                      key={item.produkId}
                      className="text-[0.7rem] text-base-content"
                    >
                      <td>
                        <div className="avatar">
                          <div className="mask mask-squircle h-10 w-10">
                            <img src={item.img} alt="gambar produk" />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col justify-start items-start gap-px">
                          <p className="xl:text-[0.7rem] font-medium">
                            {item.nama}
                          </p>
                          <span className="xl:text-[0.625rem] font-medium text-base-content/70">
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

        <div
          className={cn(
            "h-full col-span-2 gap-4 transition-all duration-200 ease-in-out flex-2",
          )}
        >
          {/* metode pembayaran */}
          <div className="w-full flex flex-col justify-start items-start">
            <div className="w-full flex flex-col justify-start items-start rounded-xl bg-base-100 border border-transparent dark:border-base-content/10 shadow-sm p-4 overflow-y-auto h-[85vh] scrollbar-thin">
              {/* title */}
              <TitleModalFormulir title="Ringkasan Pembayaran" keterangan="" />

              <div
                className={cn(
                  "w-full flex flex-col justify-start items-start gap-2.5 mt-4  border-base-content/10 pb-2.5",
                  metodePembayaran && "border-b",
                )}
              >
                {dataDetails && (
                  <>
                    {/* sub total & total diskon */}
                    <div className="w-full flex flex-col justify-start items-start gap-3 pb-4 border-b border-base-content/30 border-dashed">
                      {/* sub total */}
                      <div className="w-full flex flex-row justify-between items-center">
                        <span className="text-xs text-base-content/80">
                          Subtotal
                        </span>
                        <span className="text-xs font-medium text-base-content">
                          {formatRupiah(subTotalBeforeDiskon)}
                        </span>
                      </div>

                      {/* total diskon */}
                      <div className="w-full flex flex-row justify-between items-center">
                        <span className="text-xs text-base-content/80">
                          Total Diskon
                        </span>
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
                    <div className="w-full flex flex-col justify-start items-start gap-2.5">
                      <div className="w-full flex flex-row justify-between items-center border-b border-base-content/30 border-dashed pb-2.5">
                        <span className="text-xs font-medium text-base-content">
                          Total Pembayaran
                        </span>
                        <span className="text-sm font-semibold text-blue-400">
                          {formatRupiah(totalAfterDiskon)}
                        </span>
                      </div>

                      {/* total di bayar */}
                      {metodePembayaran && metodePembayaran !== "TEMPO" && (
                        <div className="w-full flex flex-row justify-between items-center">
                          <span className="text-xs text-base-content/80">
                            {metodePembayaran === "CASH" && "Tunai"}
                            {metodePembayaran === "QRIS" && "QRIS"}
                            {metodePembayaran === "TRANSFER" && "Transfer"}
                          </span>

                          <span className="text-xs font-semibold text-base-content">
                            {formatRupiah(dataDiBayar)}
                          </span>
                        </div>
                      )}

                      {/* cash */}
                      {metodePembayaran === "CASH" && (
                        <>
                          {/* kembalian */}
                          <div className="w-full flex flex-row justify-between items-center">
                            <span className="text-xs text-base-content/80">
                              Kembalian
                            </span>
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
                      {metodePembayaran === PAYMENT_METHOD_TYPE.TEMPO && (
                        <div className="w-full flex flex-col justify-start items-start">
                          <div className="w-full flex flex-col justify-start items-start gap-2 pb-2.5 border-b border-dashed border-base-content/30">
                            <div className="w-full flex flex-col justify-start items-start gap-2.5 border-b border-dashed border-base-content/30 pb-2.5">
                              {/* uang muka */}
                              <div className="w-full flex flex-row justify-between items-center">
                                <span className="text-xs text-base-content/70 font-medium">
                                  Uang Muka
                                </span>
                                <span className="text-[0.7rem] font-medium text-base-content">
                                  {dataTempo?.uangMuka
                                    ? formatRupiah(dataTempo.uangMuka)
                                    : "-"}
                                </span>
                              </div>

                              {/* metode pembayaran uang muka */}
                              <div className="w-full flex flex-row justify-between items-center">
                                <span className="text-xs text-base-content/70 font-medium">
                                  Metode Pembayaran Uang Muka
                                </span>
                                <span className="text-[0.7rem] font-medium text-base-content">
                                  {dataTempo?.metodePembayaranUangDp}
                                </span>
                              </div>

                              {/* metode pmebayaran uang muka cash */}
                              {dataTempo?.metodePembayaranUangDp === "CASH" && (
                                <>
                                  <div className="w-full flex flex-row justify-between items-center">
                                    <span className="text-xs text-base-content/70 font-medium">
                                      Dibayar
                                    </span>
                                    <span className="text-[0.7rem] font-medium text-base-content">
                                      {formatRupiah(dataTempo?.diBayar ?? 0)}
                                    </span>
                                  </div>
                                  <div className="w-full flex flex-row justify-between items-center">
                                    <span className="text-xs text-base-content/70 font-medium">
                                      Kembalian
                                    </span>
                                    <span className="text-[0.7rem] font-medium text-base-content">
                                      {formatRupiah(dataTempo?.kembalian ?? 0)}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* tenor */}
                            <div className="w-full flex flex-row justify-between items-center">
                              <span className="text-xs text-base-content/70 font-medium">
                                Tenor
                              </span>
                              <span className="text-[0.7rem] font-medium text-base-content">
                                {dataTempo?.periode
                                  ? `${dataTempo.periode * dataTempo.jumlahCicilan} Hari / ${getWeekFromPeriod(
                                      dataTempo.periode *
                                        dataTempo.jumlahCicilan,
                                    )} Minggu`
                                  : "-"}
                              </span>
                            </div>

                            {/* jumlah cicilan */}
                            <div className="w-full flex flex-row justify-between items-center">
                              <span className="text-xs text-base-content/70 font-medium">
                                Jumlah Cicilan
                              </span>
                              <span className="text-[0.7rem] font-medium text-base-content">
                                {dataTempo?.periode
                                  ? `${dataTempo.jumlahCicilan} Kali`
                                  : "-"}
                              </span>
                            </div>
                          </div>

                          <div className="w-full h-60 flex flex-col justify-start items-start rounded-xl border border-transparent bg-base-100 shadow-sm dark:border-base-content/10 px-3 py-4 mt-2.5">
                            {/* header */}
                            <div className="w-full flex flex-col justify-start items-start">
                              <span className="text-xs font-medium">
                                Jadwal Cicilan
                              </span>
                            </div>
                            {dataTempo ? (
                              <>
                                {/* jadwal cicilan */}
                                <div className="w-full flex flex-col justify-start items-center mt-2.5 pb-2 gap-2 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-custom-secondary">
                                  {dataTempo?.installments?.map((item) => (
                                    <div
                                      key={item.cicilanKe}
                                      className={cn(
                                        "w-full grid grid-cols-7 pb-1",
                                        item.cicilanKe !==
                                          dataTempo?.jumlahCicilan &&
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
                                          {formatTanggalPanjang(
                                            item.jatuhTempo,
                                          )}
                                        </span>
                                      </div>

                                      {/* nominal */}
                                      <div className="col-span-3 flex flex-row justify-end items-center pr-2.5">
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
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* metode pembayaran */}
              <div className="w-full flex flex-col justify-start items-start mt-4 gap-2">
                {/* header */}
                <p className="text-xs text-base-content/80 font-medium">
                  Metode Pembayaran
                </p>

                {/* card */}
                <div className="w-full flex flex-col justify-start items-start gap-3">
                  {/* cash */}
                  <div className="w-full flex flex-row justify-start items-center gap-2.5">
                    <CardMetodePembayaran
                      icon={Banknote}
                      bgColor="bg-emerald-50"
                      iconColor="text-emerald-500"
                      label="Tunai"
                      description="Bayar dengan uang tunai."
                      handleClick={() => handleMetodePembayaran("CASH")}
                      isActive={metodePembayaran === "CASH"}
                      isError={isErrors.includes("METODE_PEMBAYARAN_KOSONG")}
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
                      isError={isErrors.includes("METODE_PEMBAYARAN_KOSONG")}
                      noDeskripsi
                    />
                  </div>

                  <div className="w-full flex flex-row justify-start items-center gap-2.5">
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
                      isError={isErrors.includes("METODE_PEMBAYARAN_KOSONG")}
                      noDeskripsi
                    />
                  </div>
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

                  {isErrors.includes("DATA_DI_BAYAR_KOSONG") && (
                    <div className="mb-4">
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
                    <div className="mb-4">
                      <ErrorMessage
                        errorMessage={
                          isErrors.includes("DATA_TEMPO_KOSONG")
                            ? "Harap lakukan pengaturan tempo "
                            : ""
                        }
                      />
                    </div>
                  )}
                </div>
              )}

              {/* selesaikan transaksi */}
              <div
                className={cn(
                  "w-full",
                  metodePembayaran == "CASH" || metodePembayaran == "TEMPO"
                    ? "mt-2.5"
                    : "mt-6",
                )}
              >
                <ButtonWithIcon
                  ref={buttonBayarRef}
                  label="Selesaikan Transaksi"
                  handleBtn={handleTransaction}
                  customWidth="w-full"
                  icon={CircleCheck}
                  isLoading={isPendingTransaction}
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
