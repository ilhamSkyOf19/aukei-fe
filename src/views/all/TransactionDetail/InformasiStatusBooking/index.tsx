import { type FC } from "react";
import { formatNumber, formatRupiah } from "../../../../helpers/helpers";
import { Calendar, CircleAlert, Truck } from "lucide-react";
import { cn } from "../../../../utils/cn";

type Props = {
  isStatusBooking: boolean;
  isNotFullBooking: boolean;
  totalJumlahBarangDikirim: number;
  totalUangBarangDikirim: number;
  totalJumlahBarangBooking: number;
  totalUangBarangBooking: number;
};
const InformasiStatusBooking: FC<Props> = ({
  isNotFullBooking,
  isStatusBooking,
  totalJumlahBarangDikirim,
  totalUangBarangDikirim,
  totalJumlahBarangBooking,
  totalUangBarangBooking,
}) => {
  return (
    <>
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

          <div className="w-full px-2.5 flex flex-col justify-start items-start gap-2.5">
            <div className="w-full flex flex-row justify-between items-center gap-2.5 min-h-18">
              <div className="flex flex-row justify-start items-start gap-2 bg-amber-50 dark:bg-amber-100 border border-amber-400 flex-1 py-1.5 h-full rounded-xl px-2.5">
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
                        ? "Barang sudah dikirim sebagian. Sisa pesanan masih dalam status booking. Lihat informasi di bawah untuk detail pengiriman."
                        : "Belum ada barang yang dikirim. Seluruh pesanan masih dalam status booking. Lihat informasi di bawah untuk detail booking."}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-row justify-between items-center gap-2.5 h-18">
              <div className="flex flex-row justify-start items-start gap-2 bg-emerald-50 dark:bg-emerald-100 border border-emerald-400 flex-1 py-1.5 rounded-xl h-full px-2.5">
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
                      {totalJumlahBarangDikirim > 0
                        ? formatNumber(totalJumlahBarangDikirim)
                        : 0}
                    </span>

                    <span className="text-[0.625rem] text-primary-black font-medium">
                      Pcs
                    </span>
                  </div>

                  {/* sub total */}
                  <div className="w-full flex flex-row justify-between items-center">
                    <span className="text-[0.625rem] font-medium text-primary-black">
                      Subtotal
                    </span>
                    <span className="text-[0.7rem] font-semibold text-primary-black">
                      {formatRupiah(totalUangBarangDikirim)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row justify-start items-start gap-2 bg-blue-50 dark:bg-blue-100 border border-blue-400 flex-1 py-1.5 rounded-xl px-2.5 h-full">
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
                      {totalJumlahBarangBooking > 0
                        ? formatNumber(totalJumlahBarangBooking)
                        : 0}
                    </span>

                    <span className="text-[0.625rem] text-primary-black font-medium">
                      Pcs
                    </span>
                  </div>

                  {/* sub total */}
                  <div className="w-full flex flex-row justify-between items-center">
                    <span className="text-[0.625rem] font-medium text-primary-black">
                      Subtotal
                    </span>
                    <span className="text-[0.7rem] font-semibold text-primary-black">
                      {formatRupiah(totalUangBarangBooking)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InformasiStatusBooking;
