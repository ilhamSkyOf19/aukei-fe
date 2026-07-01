import type { FC } from "react";
import useStruk from "./useStruk";
import { cn } from "../../../../utils/cn";
import { formatTanggalLengkap } from "../../../../helpers/formatDate";
import type { PaymentMethodType } from "../../../../types/constant.type";
import { Banknote, CalendarClock, Landmark, QrCode, Undo } from "lucide-react";
import { formatNumberPhone, formatRupiah } from "../../../../helpers/helpers";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";

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
  } = useStruk({ handleSteps });

  return (
    <div className="w-full flex flex-row justify-between items-start gap-4">
      {/* content left */}
      <div className="flex-1 flex flex-col justify-start items-start gap-4 pb-6">
        {/* informasi transaksi */}
        <div className="w-full flex flex-col justify-start items-start p-4 rounded-lg border border-transparent dark:border-base-content/10 bg-base-100 shadow-sm">
          {/* header */}
          <h3 className="text-base-content font-medium text-sm">
            Informasi Transaksi
          </h3>

          <div className="w-full flex flex-row justify-evenly items-start pt-6 pb-4 border-b border-base-content/10">
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
                />
                <CardInformasiTransaksi
                  label="Tanggal"
                  value={formatTanggalLengkap(
                    dataTransaction?.data?.createdAt || "-",
                  )}
                />
                <CardInformasiTransaksi
                  label="Kasir"
                  value={dataTransaction?.data?.kasir?.nama || "-"}
                />
                <CardInformasiMetodePembayaran
                  metodePembayaran={
                    dataTransaction?.data?.metodePembayaran ?? undefined
                  }
                />
              </>
            )}
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
                  label="Pelanggan"
                  value={dataTransaction?.data?.pelanggan?.nama || "-"}
                />
                <CardInformasiTransaksi
                  label="No. Whatsapp"
                  value={formatNumberPhone(
                    dataTransaction?.data?.pelanggan?.noWa || "-",
                  )}
                />
              </>
            )}
          </div>
        </div>

        {/* detail produk */}
        <div
          className={cn(
            "w-full flex flex-col justify-start items-start rounded-lg border border-transparent dark:border-base-content/10 bg-base-100 shadow-sm",
          )}
        >
          {/* header */}
          <div className="w-full flex flex-row justify-between items-center px-4 py-3">
            <h3 className="text-sm font-medium text-base-content">
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
                    <th>Jumlah</th>
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
                              <p>{item.produk.nama}</p>
                              <span className="font-medium text-base-content/50">
                                {item.produk.kode}
                              </span>
                            </div>
                          </td>
                          <td>{formatRupiah(item.hargaJual)}</td>
                          <td>{formatRupiah(item.diskon)}</td>
                          <td>{item.quantity}</td>
                          <td className="h-full">
                            <span className="-translate-y-1/2 font-medium text-base-content h-full flex flex-row justify-start items-start">
                              {formatRupiah(
                                item.hargaJual * item.quantity - item.diskon,
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}

                      <tr>
                        <td colSpan={6} className="h-10">
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
                          <span className="text-sm text-base-content/50">
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

        <div className="w-full flex flex-col justify-start items-start p-4 rounded-lg border border-transparent dark:border-base-content/10 bg-base-100 shadow-sm">
          {/* header */}
          <h3 className="text-base-content font-medium text-sm">
            Ringkasan Pembayaran
          </h3>
          <div className="w-full h-auto flex flex-row justify-evenly items-start pt-6">
            <div className="flex-2 flex flex-col justify-start items-start">
              <div className="w-full flex flex-col justify-start items-start gap-2 pb-2 border-b border-base-content/10">
                <div className="w-full flex flex-row justify-between items-center">
                  <span className="text-xs text-base-content/50 font-semibold">
                    Subtotal
                  </span>
                  {isLoadingTransaction ? (
                    <div className="w-30 h-4 skeleton" />
                  ) : (
                    <span className="text-xs text-base-content font-semibold">
                      {formatRupiah(300000)}
                    </span>
                  )}
                </div>
                <div className="w-full flex flex-row justify-between items-center">
                  <span className="text-xs text-base-content/50 font-semibold">
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
                <span className="text-sm text-base-content font-semibold">
                  Total Pembayaran
                </span>
                {isLoadingTransaction ? (
                  <div className="w-30 h-4 skeleton" />
                ) : (
                  <span className="text-sm text-info font-semibold">
                    {formatRupiah(dataTransaction?.data?.totalBayar ?? 0)}
                  </span>
                )}
              </div>
            </div>

            <div className="w-px h-25 bg-base-content/10 mx-8" />

            <div className="flex-2 flex flex-col justify-start items-start">
              <div className="w-full flex flex-row justify-between items-center pb-2 border-b border-base-content/10">
                <span className="text-xs text-base-content/50 font-semibold">
                  Dibayar
                </span>
                {isLoadingTransaction ? (
                  <div className="w-30 h-4 skeleton" />
                ) : (
                  <span className="text-xs text-base-content font-semibold">
                    {formatRupiah(dataTransaction?.data?.diBayar ?? 0)}
                  </span>
                )}
              </div>
              <div className="w-full flex flex-row justify-between items-center pt-2">
                <span className="text-xs text-base-content/50 font-semibold">
                  Kembalian
                </span>
                {isLoadingTransaction ? (
                  <div className="w-30 h-4 skeleton" />
                ) : (
                  <span className="text-xs text-emerald-600 font-semibold">
                    {formatRupiah(
                      (dataTransaction?.data?.diBayar ?? 0) -
                        (dataTransaction?.data?.totalBayar ?? 0),
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* button back */}
        <ButtonWithIcon
          icon={Undo}
          label="Kembali ke Transaksi"
          handleBtn={() => handleBackTransaksi()}
        />
      </div>

      <div className="flex-1 flex flex-col justify-start items-start gap-4"></div>
    </div>
  );
};

// card infomrasi transaksi
type CardInformasiTransaksiProps = {
  textColor?: string;
  label: string;
  value: string;
};
const CardInformasiTransaksi: FC<CardInformasiTransaksiProps> = ({
  textColor,
  label,
  value,
}) => {
  return (
    <div className="w-full flex flex-col justify-start items-start gap-1">
      {/* label */}
      <span className="text-[0.7rem] text-base-content/50 font-semibold">
        {label}
      </span>
      <span
        className={cn(
          "text-xs font-semibold",
          textColor ? textColor : "text-base-content",
        )}
      >
        {value}
      </span>
    </div>
  );
};

// card infomrasi transaksi
type CardInformasiMetodePembayaranProps = {
  metodePembayaran?: PaymentMethodType;
};
const CardInformasiMetodePembayaran: FC<CardInformasiMetodePembayaranProps> = ({
  metodePembayaran,
}) => {
  return (
    <div className="w-full flex flex-col justify-start items-start gap-1">
      {/* label */}
      <span className="text-[0.7rem] text-base-content/50 font-semibold">
        Metode Pembayaran
      </span>

      <div className="flex flex-row justify-start items-center gap-2">
        <div
          className={cn(
            "w-6 h-6 flex flex-col justify-center items-center rounded-full",
            metodePembayaran === "CASH" && "bg-emerald-50",
            metodePembayaran === "TRANSFER" && "bg-blue-50",
            metodePembayaran === "QRIS" && "bg-purple-50",
            metodePembayaran === "TEMPO" && "bg-amber-50",
          )}
        >
          {metodePembayaran === "CASH" && (
            <Banknote className="size-4 text-emerald-500" />
          )}
          {metodePembayaran === "TRANSFER" && (
            <Landmark className="size-4 text-blue-500" />
          )}
          {metodePembayaran === "QRIS" && (
            <QrCode className="size-4 text-purple-500" />
          )}
          {metodePembayaran === "TEMPO" && (
            <CalendarClock className="size-4 text-amber-500" />
          )}
        </div>
        <span className={cn("text-xs font-semibold text-base-content")}>
          {metodePembayaran === "CASH" && "Tunai"}
          {metodePembayaran === "QRIS" && "QRIS"}
          {metodePembayaran === "TEMPO" && "Kredit"}
          {metodePembayaran === "TRANSFER" && "Transfer"}
        </span>
      </div>
    </div>
  );
};

export default Struk;
