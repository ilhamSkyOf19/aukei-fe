import { type FC } from "react";
import { formatNumber, formatRupiah } from "../../../helpers/helpers";
import { ArrowRight, CircleAlert, UserRoundX } from "lucide-react";
import { formatTanggalPanjang } from "../../../helpers/formatDate";
import useStatistikTopPelanggan from "../../../hooks/useStatistikTopPelanggan";
import { cn } from "../../../utils/cn";

type Props = {
  rangeDate: {
    startDate: string;
    endDate: string;
  };
  customHeight?: string;
};
const StatistikTopPelanggan: FC<Props> = ({ rangeDate, customHeight }) => {
  const {
    dataTopPelanggan,
    isLoading,
    startDateEndDate: { endDate, startDate },
    handleSelectedLaporan,
  } = useStatistikTopPelanggan({
    customLimit: 5,
    customStartDateEndDate: rangeDate,
  });
  return (
    <div
      className={cn(
        "md:flex-1 md:h-full flex flex-col justify-start items-start bg-base-100 w-full shadow-sm border border-transparent dark:border-base-content/10 rounded-lg py-2.5 md:p-2.5 md:px-0",
        customHeight ?? " h-90",
      )}
    >
      {/* header */}
      <div className="w-full flex flex-row justify-start items-start gap-2 mb-2 px-2.5">
        <div className="flex flex-col justify-start items-start gap-0.5">
          <h3 className="text-sm font-semibold text-base-content capitalize">
            Top 5 Pelanggan
          </h3>
          <span className="text-xs text-base-content ">
            Data diurutkan berdasarkan jumlah transaksi terbanyak.
          </span>
        </div>
        <div
          className="tooltip z-30 tooltip-custom"
          data-tip={
            startDate && endDate
              ? `Data dari periode ${formatTanggalPanjang(startDate)} - ${formatTanggalPanjang(endDate)}`
              : "-"
          }
        >
          <button className="p-0.5">
            <CircleAlert className="size-4 text-base-content/50" />
          </button>
        </div>
      </div>

      {/* content */}
      <div className="w-full flex flex-col justify-start items-start overflow-y-auto px-2">
        {isLoading ? (
          <div className="w-full flex flex-col justify-start items-center gap-2">
            <div className="w-full h-12 skeleton" />
            <div className="w-full h-12 skeleton" />
            <div className="w-full h-12 skeleton" />
            <div className="w-full h-12 skeleton" />
            <div className="w-full h-12 skeleton" />
          </div>
        ) : dataTopPelanggan?.data && dataTopPelanggan.data.length > 0 ? (
          <>
            {dataTopPelanggan.data.map((item) => (
              <CardTopPelanggan
                key={item.id}
                nama={item.nama}
                totalTransaksi={item.totalTransaksi}
                totalBelanja={item.totalNilaiTransaksi}
              />
            ))}

            {/* button */}
            <div className="w-full flex flex-row justify-center items-center pt-3">
              <button
                type="button"
                className="text-xs font-medium text-base-content/50 hover:text-base-content transition-colors duration-150 ease-in-out py-0.5 flex flex-row justify-start items-start gap-2"
                onClick={() => handleSelectedLaporan("topPelanggan")}
              >
                <span>Lihat Semua Pelanggan</span>

                {/* icon */}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="w-full h-70 gap-4 flex flex-col justify-center items-center">
            <UserRoundX className="size-12 text-base-content" />
            <span className="text-xs font-medium text-base-content/50">
              Tidak ada Top Pelanggan
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

type CardTopPelangganProps = {
  nama: string;
  totalTransaksi: number;
  totalBelanja: number;
};
const CardTopPelanggan: FC<CardTopPelangganProps> = ({
  nama,
  totalBelanja,
  totalTransaksi,
}) => {
  return (
    <button
      type="button"
      className=" w-full flex flex-col justify-start items-start gap-1 border-b border-base-content/10 py-2 hover:bg-custom-primary/50 transition-colors duration-150 ease-in-out px-2.5"
    >
      {/* nama */}
      <div className="flex flex-row justify-between items-center w-full">
        <span className="text-xs font-medium text-base-content">{nama}</span>
      </div>

      <div className="w-full flex flex-row justify-between items-center gap-1">
        {/* total */}
        <span className="text-[0.625rem] font-medium text-base-content/60">
          {formatNumber(totalTransaksi)} Transaksi
        </span>

        <span className="text-xs font-medium text-base-content">
          {formatRupiah(totalBelanja)}
        </span>
      </div>
    </button>
  );
};

export default StatistikTopPelanggan;
