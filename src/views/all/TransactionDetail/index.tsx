import type { FC } from "react";
import { cn } from "../../../utils/cn";
import { FileDown, Printer, type LucideIcon } from "lucide-react";
import { formatRupiah, getWeekFromPeriod } from "../../../helpers/helpers";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import RowJadwaTempo from "../../../components/ui/RowJadwalTempo";
import useTransactionDetail from "./useTransactionDetail";
import ButtonBackText from "../../../components/ui/button/ButtonBackText";
import HeaderTransactionDetail from "./HeaderTransactionDetail";
import InformasiStatusBooking from "./InformasiStatusBooking";

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
        <div className="flex-2 flex flex-col justify-start items-start gap-2.5">
          {/* detail produk */}
          <div
            className={cn(
              "w-full flex flex-col justify-start items-start rounded-lg border border-transparent dark:border-base-content/10 bg-base-100 shadow-sm",
            )}
          >
            {/* data */}
            <div className="w-full flex flex-col justify-start items-start">
              <div className="overflow-x-auto w-full">
                <table className="table table-xs">
                  {/* head */}
                  <thead>
                    <tr className="text-[0.625rem] bg-base-content/5 h-10">
                      <th>No</th>
                      <th>Gambar</th>
                      <th>Nama Produk</th>
                      <th>Harga (Rp)</th>
                      <th>Diskon (Rp)</th>
                      <th>Dipesan</th>
                      {isStatusBooking && (
                        <>
                          <th>Dikirim</th>
                          <th>Sisa</th>
                        </>
                      )}
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* row 1 */}
                    {isLoadingTransaction ? (
                      Array.from({ length: 4 }, (_, i) => i).map((item) => (
                        <tr key={item} className="h-18">
                          <td colSpan={7}>
                            <div className="w-full skeleton h-12" />
                          </td>
                        </tr>
                      ))
                    ) : isExistingDataTransaction ? (
                      <>
                        {dataTransaction?.data?.details.map((item, index) => (
                          <tr key={item.id} className="h-18 text-base-content">
                            <th className="px-3">{index + 1}</th>
                            <td>
                              <div className="avatar">
                                <div className="mask mask-squircle h-10 w-10">
                                  <img
                                    src={item.produk.img}
                                    alt="gambar produk"
                                  />
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="flex flex-col justify-start items-start gap-px">
                                <p className="xl:text-[0.7rem] text-base-content">
                                  {item.produk.nama}
                                </p>
                                <span className="xl:text-[0.7rem] font-medium text-base-content/70">
                                  {item.produk.kode}
                                </span>
                              </div>
                            </td>
                            <td>
                              {" "}
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
                              {" "}
                              <span className="xl:text-[0.7rem] text-base-content">
                                {/* qty */}
                                {item.quantity} Pcs
                              </span>
                            </td>
                            {isStatusBooking && (
                              <>
                                <td>
                                  <span className="xl:text-[0.7rem] text-base-content">
                                    {/* dikirim */}
                                    {item.quantityDelivered ?? 0} Pcs
                                  </span>
                                </td>
                                <td>
                                  <span className="xl:text-[0.7rem] text-base-content">
                                    {/* sisa */}
                                    {item.quantity -
                                      (item.quantityDelivered ?? 0)}{" "}
                                    Pcs
                                  </span>
                                </td>
                              </>
                            )}
                            <td>
                              <span className="font-medium h-full flex flex-row justify-start items-start xl:text-[0.7rem] text-base-content">
                                {formatRupiah(
                                  item.hargaJual * item.quantity - item.diskon,
                                )}
                              </span>
                            </td>
                          </tr>
                        ))}

                        <tr>
                          <td
                            colSpan={isStatusBooking ? 8 : 6}
                            className="h-10"
                          >
                            <span className="text-xs font-medium text-base-content/80">
                              Total {dataTransaction?.data?.details.length} Item
                            </span>
                          </td>
                          <td colSpan={1}>
                            <span className="text-xs font-semibold text-base-content">
                              {formatRupiah(
                                dataTransaction?.data?.totalBayar ?? 0,
                              )}
                            </span>
                          </td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td colSpan={7}>
                          <div className="w-full flex flex-row justify-center items-center pt-10">
                            <span className="text-sm text-base-content/70">
                              Produk tidak tersedia
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ringkasan kredit */}
          {dataTransaction?.data?.metodePembayaran === "TEMPO" && (
            <div className="w-full flex flex-col justify-start items-start p-4 rounded-lg border border-transparent dark:border-base-content/10 bg-base-100 shadow-sm">
              {/* header */}
              <h3 className="text-base-content font-medium text-xs">
                Ringkasan Kredit
              </h3>
              <div className="w-full h-auto flex flex-col justify-evenly items-start pt-6">
                {/* header */}
                <div className="w-full flex flex-row justify-evenly items-start pb-4 border-b gap-2.5 border-base-content/10">
                  {isLoadingTransaction ? (
                    Array.from({ length: 4 }, (_, i) => i).map((item) => (
                      <div
                        key={item}
                        className="flex flex-row justify-start items-start w-full"
                      >
                        <div className="w-35 h-9 skeleton" />
                      </div>
                    ))
                  ) : (
                    <>
                      <CardInformasiTransaksi
                        label="Periode"
                        value={`${dataTransaction?.data?.tempo?.periode ?? 0} Hari / ${getWeekFromPeriod(dataTransaction?.data?.tempo?.periode ?? 0)} Minggu`}
                        border
                      />

                      <CardInformasiTransaksi
                        label="Jumlah Cicilan"
                        value={`${dataTransaction?.data?.tempo?.jumlahCicilan ?? 0} Kali`}
                        border
                      />

                      <CardInformasiTransaksi
                        label="Tenor"
                        value={`${(dataTransaction?.data?.tempo?.periode ?? 0) * (dataTransaction?.data?.tempo?.jumlahCicilan ?? 0)} Hari / ${getWeekFromPeriod((dataTransaction?.data?.tempo?.periode ?? 0) * (dataTransaction?.data?.tempo?.jumlahCicilan ?? 0))} Minggu`}
                        border
                      />

                      <CardInformasiTransaksi
                        label="Sisa Tagihan"
                        value={`${formatRupiah(dataTransaction?.data?.tempo?.totalTagihan ?? 0)}`}
                        fontWeight="font-semibold"
                      />
                    </>
                  )}
                </div>

                {/* jadwal cicilan */}
                <div className="w-full mt-4">
                  <RowJadwaTempo
                    dataTempo={dataTransaction?.data?.tempo?.installments ?? []}
                    maxHeight="max-h-80"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// card infomrasi transaksi
type CardInformasiTransaksiProps = {
  textColor?: string;
  icon?: {
    icon: LucideIcon;
    bgColor: string;
    textColor: string;
  };
  label: string;
  value: string;
  border?: boolean;
  fontWeight?: string;
};
const CardInformasiTransaksi: FC<CardInformasiTransaksiProps> = ({
  textColor,
  label,
  value,
  icon,
  border,
  fontWeight,
}) => {
  return (
    <div
      className={cn(
        "w-full flex flex-col justify-start items-start gap-1",
        border && "border-r border-base-content/10",
      )}
    >
      {/* label */}
      <span className="text-[0.7rem] text-base-content/70 font-medium">
        {label}
      </span>
      <div className="flex flex-row justify-start items-center gap-2.5">
        {/* icon */}
        {icon && (
          <div
            className={cn(
              "w-7 h-7 flex justify-center items-center rounded-md shrink-0",
              icon.bgColor,
            )}
          >
            <icon.icon className={cn("size-3.5", icon.textColor)} />
          </div>
        )}
        <span
          className={cn(
            "text-[0.7rem]",
            textColor ? textColor : "text-base-content",
            fontWeight ? fontWeight : "font-medium",
          )}
        >
          {value}
        </span>
      </div>
    </div>
  );
};

export default TransactionDetail;
