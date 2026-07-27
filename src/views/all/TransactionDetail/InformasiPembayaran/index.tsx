import { type Dispatch, type FC, type SetStateAction } from "react";
import AlertLabelList from "../../../../components/messages/AlertLabelList";
import {
  PAYMENT_METHOD_TYPE,
  TRANSACTION_STATUS_TYPE,
} from "../../../../types/constant.type";
import type { ResponseTransactionType } from "../../../../models/transaction.model";
import type { ResponseStructure } from "../../../../types/response.type";
import { formatRupiah, getWeekFromPeriod } from "../../../../helpers/helpers";
import useInformasiPembayaran from "./useInformasiPembayaran";
import {
  Banknote,
  CalendarClock,
  ChevronDown,
  CreditCard,
  FileDown,
  Landmark,
  Pencil,
  Printer,
  QrCode,
  X,
} from "lucide-react";
import { cn } from "../../../../utils/cn";
import CardPaymentTransaction from "../../../../components/ui/cards/CardPaymentTransaction";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import CardMetodePembayaran from "../../../../components/ui/cards/CardMetodePembayaran";
import ErrorMessage from "../../../../components/messages/ErrorMessage";
import ModalCashPayment from "../../../../components/modals/ModalCashPayment";
import ModalTempoPayment from "../../../../components/modals/ModalTempoPayment";
import { formatTanggalPanjang } from "../../../../helpers/formatDate";

type Props = {
  dataTransaction?: ResponseStructure<ResponseTransactionType | null>;
  isLoadingTransaction?: boolean;
  isStatusBooking?: boolean;
  transactionSummary: {
    totalQuantity: number;
    totalPembayaran: number;
    totalDiBayar: number | undefined;
    totalKembalian: number | undefined;
    sisaTagihan: number | undefined;
  };
  isPageBookingKasir?: boolean;
  isUbahData?: boolean;
  setIsUbahData: Dispatch<SetStateAction<boolean>>;
  siapKirim?: boolean;
};
const InformasiPembayaran: FC<Props> = ({
  dataTransaction,
  isStatusBooking,
  isLoadingTransaction,
  transactionSummary,
  isPageBookingKasir,
  isUbahData,
  setIsUbahData,
  siapKirim,
}) => {
  const {
    isOpenHistory,
    setIsOpenHistory,
    metodePembayaran,
    setMetodePembayaran,
    dataDiBayar,
    handlePay,
    buttonBayarRef,
    isErrors,
    handleShowModalCalculator,
    modalCalculatorRef,
    handleCloseModalCalculator,
    handleCloseModalTempo,
    handleShowModalTempo,
    modalTempoRef,
    dataTempo,
    setDataTempo,
    buttonAturTempoRef,
    handleTransaction,
    isPendingTransaction,
  } = useInformasiPembayaran({
    dataTransaction,
    transactionSummary,
    siapKirim,
  });

  return (
    <div className="flex-1 flex flex-col justify-start items-start gap-2.5">
      {/* informasi booking */}
      <div className="w-full flex flex-col justify-start items-start p-4 rounded-lg border border-transparent dark:border-base-content/10 bg-base-100 shadow-sm">
        {/* header */}
        <h3 className="text-base-content font-medium text-xs">
          Informasi Pembayaran
        </h3>
        <div className="w-full h-auto flex flex-col justify-evenly items-start py-4 border-b border-dashed border-base-content/30">
          <div className="w-full flex flex-col justify-start items-start gap-2 pb-2 border-b border-dashed border-base-content/30">
            <div className="w-full flex flex-row justify-between items-center">
              <span className="text-xs text-base-content/70 font-medium">
                Subtotal
              </span>
              {isLoadingTransaction ? (
                <div className="w-30 h-4 skeleton" />
              ) : (
                <span className="text-xs text-base-content font-semibold">
                  {formatRupiah(
                    dataTransaction?.data?.details?.reduce(
                      (a, b) => a + (b.hargaJual ?? 0) * (b.quantity ?? 0),
                      0,
                    ) ?? 0,
                  )}
                </span>
              )}
            </div>
            <div className="w-full flex flex-row justify-between items-center">
              <span className="text-xs text-base-content/70 font-medium">
                Total Diskon
              </span>
              {isLoadingTransaction ? (
                <div className="w-30 h-4 skeleton" />
              ) : (
                <span className="text-xs text-error font-semibold">
                  - {formatRupiah(dataTransaction?.data?.totalDiskon ?? 0)}
                </span>
              )}
            </div>
          </div>
          <div className="w-full flex flex-col justify-start items-start gap-2 py-4 border-b border-dashed border-base-content/30">
            {/* total bayar */}
            <div className="w-full flex flex-row justify-between items-center">
              <span className="text-xs text-base-content font-medium">
                Total Pembayaran
              </span>
              {isLoadingTransaction ? (
                <div className="w-30 h-4 skeleton" />
              ) : (
                <span className="text-xs text-info font-semibold">
                  {formatRupiah(dataTransaction?.data?.totalBayar ?? 0)}
                </span>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col justify-start items-start pt-4 gap-2.5">
            {/* Uang Muka - Hanya Booking & Tempo */}
            {(isStatusBooking ||
              dataTransaction?.data?.metodePembayaran === "TEMPO") && (
              <div className="w-full flex flex-row justify-between items-center">
                <span className="text-xs text-base-content/70 font-medium">
                  Uang Muka
                </span>

                {isLoadingTransaction ? (
                  <div className="w-30 h-4 skeleton" />
                ) : (
                  <span className="text-xs text-base-content font-semibold">
                    {formatRupiah(
                      (transactionSummary.totalDiBayar ?? 0) -
                        (transactionSummary.totalKembalian ?? 0),
                    )}
                  </span>
                )}
              </div>
            )}
            {/* Dibayar - Selalu tampil */}
            <div className="w-full flex flex-row justify-between items-center">
              <span className="text-xs text-base-content/70 font-medium">
                Dibayar
              </span>

              {isLoadingTransaction ? (
                <div className="w-30 h-4 skeleton" />
              ) : (
                <span className="text-xs text-base-content font-semibold">
                  {formatRupiah(transactionSummary.totalDiBayar ?? 0)}
                </span>
              )}
            </div>
            {/* kembalian */}
            {dataTransaction?.data?.metodePembayaran === "CASH" ||
              (dataTransaction?.data?.paymentTransactions?.some(
                (item) => item.metodePembayaran === "CASH",
              ) && (
                <div className="w-full flex flex-row justify-between items-center">
                  <span className="text-xs text-base-content/70 font-medium">
                    Kembalian
                  </span>
                  {isLoadingTransaction ? (
                    <div className="w-30 h-4 skeleton" />
                  ) : (
                    <span className="text-xs text-emerald-600 font-semibold">
                      {formatRupiah(transactionSummary.totalKembalian ?? 0)}
                    </span>
                  )}
                </div>
              ))}
            {dataTransaction?.data?.status === "BOOKING" && (
              <div className="w-full flex flex-row justify-between items-center">
                <span className="text-xs text-base-content/70 font-medium">
                  Sisa Tagihan
                </span>
                {isLoadingTransaction ? (
                  <div className="w-30 h-4 skeleton" />
                ) : (
                  <span className="text-xs text-error font-semibold">
                    {formatRupiah(
                      Math.abs(
                        (dataTransaction?.data?.totalBayar ?? 0) -
                          (dataTransaction?.data?.totalDiBayar ?? 0),
                      ),
                    )}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ringkasan pembayaran tempo */}
        {/* tempo */}
        {metodePembayaran === PAYMENT_METHOD_TYPE.TEMPO && (
          <div className="w-full flex flex-col justify-start items-start mt-2.5">
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
                        dataTempo.periode * dataTempo.jumlahCicilan,
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
                  {dataTempo?.periode ? `${dataTempo.jumlahCicilan} Kali` : "-"}
                </span>
              </div>
            </div>

            <div className="w-full h-60 flex flex-col justify-start items-start rounded-xl border border-transparent bg-base-100 shadow-sm dark:border-base-content/10 px-3 py-4 mt-2.5">
              {/* header */}
              <div className="w-full flex flex-col justify-start items-start">
                <span className="text-xs font-medium">Jadwal Cicilan</span>
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

        {/* ringkasan pembayaran cash */}
        {metodePembayaran === PAYMENT_METHOD_TYPE.CASH && (
          <div className="w-full flex flex-col justify-start items-start gap-2.5 mt-2.5 border-b border-base-content/10 pb-2.5">
            <span className="text-xs font-medium text-base-content">
              Ringkasan Pembayaran Cash
            </span>
            <div className="w-full flex flex-row justify-between items-center">
              <span className="text-xs font-medium text-base-content/70">
                Uang Diterima
              </span>
              {/* total */}
              <span className="text-xs font-semibold text-info">
                {formatRupiah(dataDiBayar)}
              </span>
            </div>
            <div className="w-full flex flex-row justify-between items-center">
              <span className="text-xs font-medium text-base-content/70">
                Uang Kembalian
              </span>
              {/* total */}
              <span className="text-xs font-semibold text-emerald-600">
                {formatRupiah(
                  dataDiBayar > 0
                    ? dataDiBayar - (transactionSummary.totalPembayaran ?? 0)
                    : 0,
                )}
              </span>
            </div>
          </div>
        )}

        {/* metode pembayaran pelunasan */}
        {isPageBookingKasir && (
          <div className="flex flex-col justify-start items-start gap-2.5 w-full mt-4">
            <div className="flex flex-col justify-start items-start gap-1">
              <span className="text-xs font-medium text-base-content">
                Metode Pembayaran
              </span>
              <span className="text-[0.625rem] text-base-content/70">
                Silahkan pilih metode pembayaran untuk melakukan pelunasan
              </span>
            </div>

            <div className="w-full flex flex-col justify-start items-start gap-2.5">
              <div className="w-full flex flex-row justify-between items-center gap-2.5">
                {/* cash */}
                <CardMetodePembayaran
                  icon={Banknote}
                  bgColor="bg-emerald-50"
                  iconColor="text-emerald-500"
                  label="Tunai"
                  description="Bayar dengan uang tunai."
                  handleClick={() => setMetodePembayaran("CASH")}
                  isActive={metodePembayaran === "CASH"}
                  isError={isErrors.length > 0 && !metodePembayaran}
                  noDeskripsi
                />

                {/* transfer */}
                <CardMetodePembayaran
                  icon={Landmark}
                  bgColor="bg-blue-50"
                  iconColor="text-blue-500"
                  label="Transfer Bank"
                  description="Bayar melalui transfer bank."
                  handleClick={() => setMetodePembayaran("TRANSFER")}
                  isActive={metodePembayaran === "TRANSFER"}
                  isError={isErrors.length > 0 && !metodePembayaran}
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
                  handleClick={() => setMetodePembayaran("QRIS")}
                  isActive={metodePembayaran === "QRIS"}
                  isError={isErrors.length > 0 && !metodePembayaran}
                  noDeskripsi
                />

                {/* tempo */}
                <CardMetodePembayaran
                  icon={CalendarClock}
                  bgColor="bg-amber-50"
                  iconColor="text-amber-500"
                  label="Kredit / Cicilan"
                  description="Bayar melalui kredit atau cicilan."
                  handleClick={() => setMetodePembayaran("TEMPO")}
                  isActive={metodePembayaran === "TEMPO"}
                  isError={isErrors.length > 0 && !metodePembayaran}
                  noDeskripsi
                />
              </div>

              {isErrors && !metodePembayaran && (
                <div className="w-full">
                  <ErrorMessage
                    errorMessage={
                      isErrors.includes("METODE_PEMBAYARAN_KOSONG")
                        ? "Silahkan pilih metode pembayaran"
                        : ""
                    }
                  />
                </div>
              )}

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
                        "w-full h-10 bg-emerald-600 rounded-xl flex flex-row hover-overlay justify-center items-center",
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
        )}

        {/* riwayat pembayaran */}
        {dataTransaction?.data?.paymentTransactions && (
          <div className="w-full flex flex-col justify-start items-start mt-2.5 gap-2.5">
            <div className="w-full flex flex-row justify-between items-center">
              <span className="text-xs font-medium text-base-content">
                Riwayat Pembayaran
              </span>

              <button
                type="button"
                onClick={() => setIsOpenHistory((prev) => !prev)}
                className="text-xs text-base-content flex flex-row justify-center items-center gap-1.5 hover:underline"
              >
                <span>
                  {isOpenHistory ? "Sembunyikan Riwayat" : "Lihat Riwayat"}
                </span>

                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    isOpenHistory && "rotate-180",
                  )}
                />
              </button>
            </div>
            <div
              className={cn(
                "w-full grid transition-all duration-300 ease-in-out",
                isOpenHistory
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-2.5 pt-2.5">
                  {/* card */}
                  {dataTransaction.data.paymentTransactions.map((item) => (
                    <CardPaymentTransaction
                      key={item.id}
                      paymentTransactions={item}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* aksi */}
        <div className="w-full flex flex-row justify-between items-start gap-2 mt-4">
          {isPageBookingKasir ? (
            <>
              {/* update */}
              {isUbahData ? (
                <ButtonWithIcon
                  icon={X}
                  bgColor="bg-error"
                  textColor="text-primary-white"
                  customWidth="w-full"
                  label="Tutup"
                  handleBtn={() => setIsUbahData(false)}
                />
              ) : (
                <ButtonWithIcon
                  icon={Pencil}
                  bgColor="bg-info"
                  textColor="text-primary-white"
                  customWidth="w-full"
                  label="Ubah Harga / Diskon"
                  handleBtn={() => setIsUbahData(true)}
                />
              )}

              {/* selesaikan */}
              <ButtonWithIcon
                disabled={!siapKirim}
                icon={CreditCard}
                customWidth="w-full"
                label="Selesaikan"
                isLoading={isPendingTransaction}
                handleBtn={() => handleTransaction()}
              />
            </>
          ) : (
            <>
              {/* cetak struk */}
              <ButtonWithIcon
                icon={Printer}
                customWidth="w-full"
                label="Cetak Struk"
              />

              {/* download struk */}
              <ButtonWithIcon
                icon={FileDown}
                customWidth="w-full"
                bgColor="bg-gray-400"
                label="Download PDF"
                textColor="text-primary-white"
              />
            </>
          )}
        </div>
      </div>

      {/* tempo payment */}
      {dataTransaction?.data?.metodePembayaran === "TEMPO" &&
        dataTransaction?.data?.status !== TRANSACTION_STATUS_TYPE.BOOKING && (
          <AlertLabelList
            message={[
              "Dibayar merupakan pembayaran yang diterima saat transaksi dibuat (uang muka)",
              "Pembayaran selanjutnya dapat dilihat pada Riwayat Pembayaran Tempo.",
            ]}
          />
        )}

      {/* modal cash payment */}
      <ModalCashPayment
        modalRef={modalCalculatorRef}
        handleCloseModal={handleCloseModalCalculator}
        handlePay={handlePay}
        total={Math.abs(
          (dataTransaction?.data?.totalBayar ?? 0) -
            (dataTransaction?.data?.totalDiBayar ?? 0),
        )}
      />

      {/* modal formulir tempo */}
      <ModalTempoPayment
        data={{
          total: Math.abs(
            (dataTransaction?.data?.totalBayar ?? 0) -
              (dataTransaction?.data?.totalDiBayar ?? 0),
          ),
        }}
        modalRef={modalTempoRef}
        handleCloseModal={handleCloseModalTempo}
        handleShowModal={handleShowModalTempo}
        handleSetDataTempo={setDataTempo}
      />
    </div>
  );
};

export default InformasiPembayaran;
