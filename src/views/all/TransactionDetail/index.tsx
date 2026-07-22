import type { FC } from "react";
import { cn } from "../../../utils/cn";
import { CircleCheck, FileDown, Pencil, Printer, X } from "lucide-react";
import { formatRupiah } from "../../../helpers/helpers";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import useTransactionDetail from "./useTransactionDetail";
import ButtonBackText from "../../../components/ui/button/ButtonBackText";
import HeaderTransactionDetail from "./HeaderTransactionDetail";
import InformasiStatusBooking from "./InformasiStatusBooking";
import DaftarDetailProduk from "./DaftarDetailProduk";

type Props = {
  handleSteps?: (value: number) => void;
  transactionId?: number;
};
const TransactionDetail: FC<Props> = ({ handleSteps, transactionId }) => {
  // call use
  const {
    dataTransaction,
    isExistingDataTransaction,
    isLoadingTransaction,
    handleBackTransaksi,
    isNotFullBooking,
    transactionSummary,
    isStatusBooking,
    isPageBookingKasir,
    isUbahData,
    setIsUbahData,
  } = useTransactionDetail({ handleSteps, transactionId });

  return (
    <div
      className={cn(
        "w-full md:h-screen  overflow-y-auto h-full flex flex-col justify-start items-start p-2.5 gap-2.5",
        transactionId ? "pb-10" : "pb-20",
      )}
    >
      {/* back */}
      <ButtonBackText handleClick={() => handleBackTransaksi()} />
      {/* header */}
      <HeaderTransactionDetail
        nomorTransaksi={dataTransaction?.data?.nomorTransaksi}
        metodePembayaran={dataTransaction?.data?.metodePembayaran}
        pelanggan={dataTransaction?.data?.pelanggan}
        statusTransaction={dataTransaction?.data?.status}
        tanggalTransaksi={
          dataTransaction?.data?.completedAt ??
          dataTransaction?.data?.tanggalBooking
        }
        kasir={dataTransaction?.data?.kasir}
      />

      {/* data */}
      <div className="flex w-full flex-row justify-start items-start gap-2.5">
        {/* daftar produk and kredit detail */}
        <DaftarDetailProduk
          dataTransaction={dataTransaction}
          isExistingDataTransaction={isExistingDataTransaction}
          isLoadingTransaction={isLoadingTransaction}
          isStatusBooking={isStatusBooking}
          isPageBookingKasir={isPageBookingKasir}
          isUbahData={isUbahData}
        />

        <div className="flex-1 flex flex-col justify-start items-start gap-2.5">
          {/* informasi booking */}
          <InformasiStatusBooking
            isNotFullBooking={isNotFullBooking ?? false}
            isStatusBooking={isStatusBooking}
            totalJumlahBarangBooking={
              transactionSummary.totalJumlahBarangBooking
            }
            totalUangBarangBooking={transactionSummary.totalUangBarangBooking}
            totalJumlahBarangDikirim={
              transactionSummary.totalJumlahBarangDikirim
            }
            totalUangBarangDikirim={transactionSummary.totalUangBarangDikirim}
          />

          <div className="w-full flex flex-col justify-start items-start p-4 rounded-lg border border-transparent dark:border-base-content/10 bg-base-100 shadow-sm">
            {/* header */}
            <h3 className="text-base-content font-medium text-xs">
              Informasi Pembayaran
            </h3>
            <div className="w-full h-auto flex flex-col justify-evenly items-start py-4 border-b border-base-content/10">
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
                <div className="w-full flex flex-row justify-between items-center">
                  <span className="text-xs text-base-content/70 font-medium">
                    {dataTransaction?.data?.metodePembayaran === "TEMPO"
                      ? (isStatusBooking && !isNotFullBooking) ||
                        !isStatusBooking
                        ? "Uang Muka"
                        : "Dibayar"
                      : "Dibayar"}
                  </span>
                  {isLoadingTransaction ? (
                    <div className="w-30 h-4 skeleton" />
                  ) : (
                    <span className="text-xs text-base-content font-semibold">
                      {formatRupiah(
                        (dataTransaction?.data?.metodePembayaran === "TEMPO" &&
                        dataTransaction?.data?.status !== "BOOKING"
                          ? dataTransaction?.data?.tempo?.uangMuka
                          : dataTransaction?.data?.diBayar) ?? 0,
                      )}
                    </span>
                  )}
                </div>

                {dataTransaction?.data?.status === "BOOKING" &&
                  isNotFullBooking && (
                    <div className="w-full flex flex-row justify-between items-center">
                      <span className="text-xs text-base-content/70 font-medium">
                        Sisa Tagihan
                      </span>
                      {isLoadingTransaction ? (
                        <div className="w-30 h-4 skeleton" />
                      ) : (
                        <span className="text-xs text-error font-semibold">
                          {formatRupiah(
                            (dataTransaction?.data?.totalBayar ?? 0) -
                              (dataTransaction?.data?.diBayar ?? 0),
                          )}
                        </span>
                      )}
                    </div>
                  )}

                {dataTransaction?.data?.metodePembayaran === "CASH" && (
                  <div className="w-full flex flex-row justify-between items-center">
                    <span className="text-xs text-base-content/70 font-medium">
                      Kembalian
                    </span>
                    {isLoadingTransaction ? (
                      <div className="w-30 h-4 skeleton" />
                    ) : (
                      <span className="text-xs text-emerald-600 font-semibold">
                        {formatRupiah(dataTransaction?.data?.kembalian ?? 0)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

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
                    icon={CircleCheck}
                    customWidth="w-full"
                    label="Selesaikan"
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
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
