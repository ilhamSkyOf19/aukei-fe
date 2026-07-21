import type { FC } from "react";
import useStruk from "./useStruk";
import { cn } from "../../../../utils/cn";
import { formatTanggalLengkap } from "../../../../helpers/formatDate";
import { TRANSACTION_STATUS_TYPE } from "../../../../types/constant.type";
import {
  Calendar,
  CalendarDays,
  CircleAlert,
  FileDown,
  PhoneIcon,
  Printer,
  Receipt,
  Truck,
  Undo,
  UserRoundIcon,
  type LucideIcon,
} from "lucide-react";
import {
  formatNumber,
  formatNumberPhone,
  formatRupiah,
  getWeekFromPeriod,
} from "../../../../helpers/helpers";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import RowJadwaTempo from "../../../../components/ui/RowJadwalTempo";
import StatusTransaction from "../../../../components/ui/StatusTransaction";
import CardLabelMetodePembayaran from "../../../../components/ui/cards/CardLabelMetodePembayaran";

type Props = {
  handleSteps: (value: number) => void;
};
const Struk: FC<Props> = ({ handleSteps }) => {
  // call use
  const {
    dataTransaction,
    isExistingDataTransaction,
    isLoadingTransaction,
    handleBackTransaksi,
    isModeKasir,
    isNotFullBooking,
    transactionSummary,
    isStatusBooking,
  } = useStruk({ handleSteps });

  return (
    <div
      className={cn(
        "w-full flex flex-row justify-between items-start gap-4 overflow-y-auto",
      )}
    >
      {/* content left */}
      <div className="flex-1 flex flex-col justify-start items-start gap-2">
        {/* informasi transaksi */}
        <div className="w-full flex flex-col justify-start items-start p-4 rounded-lg border border-transparent dark:border-base-content/10 bg-base-100 shadow-sm">
          {/* header */}
          <h3 className="text-base-content font-medium text-xs">
            Informasi Transaksi
          </h3>

          <div className="w-full flex flex-row justify-evenly items-start pt-4 pb-4 border-b border-dashed border-base-content/30 gap-2.5">
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
                  label="No. Transaksi"
                  value={String(dataTransaction?.data?.nomorTransaksi)}
                  textColor="text-info"
                  icon={{
                    icon: Receipt,
                    bgColor: "bg-blue-50",
                    textColor: "text-blue-400",
                  }}
                />
                <CardInformasiTransaksi
                  label="Tanggal"
                  value={formatTanggalLengkap(
                    dataTransaction?.data?.createdAt || "-",
                  )}
                  icon={{
                    icon: CalendarDays,
                    bgColor: "bg-blue-50",
                    textColor: "text-blue-400",
                  }}
                />

                <CardLabelMetodePembayaran
                  metodePembayaran={
                    dataTransaction?.data?.metodePembayaran ?? undefined
                  }
                />
              </>
            )}
          </div>

          {/* status transaksi */}
          <div className="w-full flex flex-col justify-start items-start gap-1 py-4 border-b border-dashed border-base-content/30">
            {/* label */}
            <span className="text-[0.7rem] text-base-content/70 font-semibold">
              Status Transaksi
            </span>

            <div className="flex flex-row justify-start items-center gap-2">
              <div className="pr-4 border-r border-base-content/10">
                <StatusTransaction
                  status={
                    (dataTransaction?.data?.status ===
                      TRANSACTION_STATUS_TYPE.COMPLETED ||
                      dataTransaction?.data?.status ===
                        TRANSACTION_STATUS_TYPE.BOOKING) &&
                    !dataTransaction?.data?.tempo
                      ? dataTransaction?.data?.status
                      : undefined
                  }
                  statusTempo={
                    dataTransaction?.data?.status ===
                      TRANSACTION_STATUS_TYPE.COMPLETED &&
                    dataTransaction?.data?.tempo
                      ? dataTransaction?.data?.tempo.status
                      : undefined
                  }
                  uppercase
                  customPy="py-1.5"
                />
              </div>
              {/* keterangan */}
              <span className="text-[0.7rem] text-base-content/60 font-medium">
                {isStatusBooking &&
                  "Pesanan akan dikirim setelah stok tersedia."}
                {dataTransaction?.data?.status ===
                  TRANSACTION_STATUS_TYPE.COMPLETED &&
                !dataTransaction?.data?.tempo
                  ? "Pesanan selesai."
                  : "Pesanan berhasil dibuat"}
              </span>
            </div>
          </div>

          {/* pelanggan */}
          <div className="w-full flex flex-row justify-evenly items-start pt-4">
            {isLoadingTransaction ? (
              Array.from({ length: 2 }, (_, i) => i).map((item) => (
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
                  label="Kasir"
                  value={dataTransaction?.data?.kasir?.nama || "-"}
                  icon={{
                    icon: UserRoundIcon,
                    bgColor: "bg-emerald-50",
                    textColor: "text-emerald-400",
                  }}
                />

                <CardInformasiTransaksi
                  label="Pelanggan"
                  value={dataTransaction?.data?.pelanggan?.nama || "-"}
                  icon={{
                    icon: UserRoundIcon,
                    bgColor: "bg-purple-50",
                    textColor: "text-purple-400",
                  }}
                />
                <CardInformasiTransaksi
                  label="No. Whatsapp"
                  value={formatNumberPhone(
                    dataTransaction?.data?.pelanggan?.noWa || "-",
                  )}
                  icon={{
                    icon: PhoneIcon,
                    bgColor: "bg-emerald-50",
                    textColor: "text-emerald-400",
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* ringkasan pembayaran */}
        <div className="w-full flex flex-col justify-start items-start p-4 rounded-lg border border-transparent dark:border-base-content/10 bg-base-100 shadow-sm">
          {/* header */}
          <h3 className="text-base-content font-medium text-xs">
            Ringkasan Pembayaran
          </h3>
          <div className="w-full h-auto flex flex-row justify-evenly items-start pt-6">
            <div className="flex-2 flex flex-col justify-start items-start">
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

              {/* total bayar */}
              <div className="w-full flex flex-row justify-between items-center pt-4">
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

            <div className="border-r border-base-content/10 h-20 bg-base-content/10 mx-8" />

            <div className="flex-2 flex flex-col justify-start items-start">
              <div className="w-full flex flex-row justify-between items-center pb-2 border-b border-base-content/10">
                <span className="text-xs text-base-content/70 font-medium">
                  {dataTransaction?.data?.metodePembayaran === "TEMPO"
                    ? (isStatusBooking && !isNotFullBooking) || !isStatusBooking
                      ? "Uang Muka"
                      : "Dibayar"
                    : "Dibayar"}
                </span>
                {isLoadingTransaction ? (
                  <div className="w-30 h-4 skeleton" />
                ) : (
                  <span className="text-xs text-base-content font-semibold">
                    {formatRupiah(
                      (dataTransaction?.data?.metodePembayaran === "TEMPO"
                        ? dataTransaction?.data?.tempo?.uangMuka
                        : dataTransaction?.data?.diBayar) ?? 0,
                    )}
                  </span>
                )}
              </div>
              {dataTransaction?.data?.metodePembayaran === "CASH" && (
                <div className="w-full flex flex-row justify-between items-center pt-2">
                  <span className="text-xs text-base-content/70 font-medium">
                    Kembalian
                  </span>
                  {isLoadingTransaction ? (
                    <div className="w-30 h-4 skeleton" />
                  ) : (
                    <span className="text-xs text-emerald-600 font-semibold">
                      {formatRupiah(
                        (dataTransaction?.data?.totalBayar ?? 0) -
                          (dataTransaction?.data?.diBayar ?? 0),
                      )}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ringkasan tempo */}
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

        {/* button back */}
        <div
          className={cn(
            "w-full flex flex-row justify-start items-center",
            isModeKasir ? "pb-4" : "pb-12",
          )}
        >
          <ButtonWithIcon
            icon={Undo}
            label="Kembali ke Transaksi"
            handleBtn={() => handleBackTransaksi()}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-start items-start gap-4">
        {/* detail produk */}
        <div
          className={cn(
            "w-full flex flex-col justify-start items-start rounded-lg border border-transparent dark:border-base-content/10 bg-base-100 shadow-sm",
          )}
        >
          {/* header */}
          <div className="w-full flex flex-row justify-between items-center px-4 py-3">
            <h3 className="text-xs font-medium text-base-content">
              Detail Produk
            </h3>
          </div>

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
                        <tr key={item.id} className="h-18">
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
                              {item.quantity} x
                            </span>
                          </td>
                          {isStatusBooking && (
                            <>
                              <td>
                                <span className="xl:text-[0.7rem] text-base-content">
                                  {/* dikirim */}
                                  {item.quantityDelivered ?? 0}
                                </span>
                              </td>
                              <td>
                                <span className="xl:text-[0.7rem] text-base-content">
                                  {/* sisa */}
                                  {item.quantity -
                                    (item.quantityDelivered ?? 0)}
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
                        <td colSpan={isStatusBooking ? 8 : 6} className="h-10">
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

        {/* informasi booking */}
        {isStatusBooking && (
          <div
            className={cn(
              "w-full flex flex-col justify-start items-start rounded-lg border border-transparent dark:border-base-content/10 bg-base-100 shadow-sm py-2.5 gap-2.5",
            )}
          >
            {/* title */}
            <div className="w-full flex flex-row justify-between items-center px-2.5">
              <h3 className="text-xs font-medium text-base-content">
                Informasi Booking
              </h3>
            </div>

            <div className="w-full px-2.5">
              <div className="w-full flex flex-row justify-between items-center gap-2.5 h-18">
                <div className="flex flex-row justify-start items-start gap-2 bg-amber-50 border border-amber-400 flex-1 py-1.5 h-full rounded-xl px-2.5">
                  {/* icon */}
                  <CircleAlert className="size-4 text-amber-600" />

                  <div className=" w-full flex flex-col justify-start items-start gap-1">
                    {/* title */}
                    <span className="text-amber-600 text-[0.625rem] font-semibold">
                      Status
                    </span>

                    {/* total */}
                    <div className="flex flex-row justify-start items-start gap-1">
                      <span className="text-[0.625rem] font-medium">
                        {isNotFullBooking
                          ? "Sebagian Sudah Terkirim"
                          : "Full Booking"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row justify-start items-start gap-2 bg-emerald-50 border border-emerald-400 flex-1 py-1.5 rounded-xl h-full px-2.5">
                  {/* icon */}
                  <Truck className="size-4 text-emerald-600" />

                  <div className=" w-full flex flex-col justify-start items-start gap-1">
                    {/* title */}
                    <span className="text-emerald-600 text-[0.625rem] font-semibold">
                      Total Terkirim
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
                      <span className="text-xs font-semibold text-base-content">
                        {formatRupiah(
                          transactionSummary.totalUangBarangDikirim,
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row justify-start items-start gap-2 bg-blue-50 border border-blue-400 flex-1 py-1.5 rounded-xl px-2.5 h-full">
                  {/* icon */}
                  <Calendar className="size-4 text-blue-600" />

                  <div className=" w-full flex flex-col justify-start items-start gap-1">
                    {/* title */}
                    <span className="text-blue-600 text-[0.625rem] font-semibold">
                      Total Belum Terkirim
                    </span>

                    {/* total */}
                    <div className="flex flex-row justify-start items-start gap-1">
                      <span className="text-blue-600 font-semibold text-xs">
                        {transactionSummary.totalJumlahBarangBooking > 0
                          ? formatNumber(
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
                      <span className="text-xs font-semibold text-base-content">
                        {formatRupiah(
                          transactionSummary.totalUangBarangBooking,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* button aksi */}
        <div className="w-full flex flex-row justify-between items-start gap-2">
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

export default Struk;
