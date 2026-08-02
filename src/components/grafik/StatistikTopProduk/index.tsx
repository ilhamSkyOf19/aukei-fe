import { type FC } from "react";
import { formatNumberK, formatRupiahShort } from "../../../helpers/helpers";
import { ArrowRight, CircleAlert, PackageX } from "lucide-react";
import { formatTanggalPanjang } from "../../../helpers/formatDate";
import useStatistikTopProduk from "../../../hooks/useStatistikTopProduk";
import { cn } from "../../../utils/cn";

type Props = {
  rangeDate: {
    startDate: string;
    endDate: string;
  };
  customHeight?: string;
};
const StatistikTopProduk: FC<Props> = ({ rangeDate, customHeight }) => {
  const {
    dataTopProduk,
    isLoading,
    startDateEndDate: { endDate, startDate },
    handleSelectedLaporan,
  } = useStatistikTopProduk({
    customLimit: 5,
    customStartDateEndDate: rangeDate,
  });
  return (
    <div
      className={cn(
        "md:flex-1 md:h-full flex flex-col justify-start items-start bg-base-100 w-full shadow-sm border border-transparent dark:border-base-content/10 rounded-lg py-2.5 md:p-2.5 md:px-0",
        customHeight ?? "h-90",
      )}
    >
      {/* header */}
      <div className="w-full flex flex-row justify-start items-start mb-2 px-2.5 gap-2">
        <div className="w-full flex flex-col justify-start items-start gap-0.5">
          <h3 className="text-sm font-semibold text-base-content capitalize">
            Top 5 Produk Terlaris
          </h3>
          <span className="text-xs text-base-content">
            Data diurutkan berdasarkan jumlah item terjual terbanyak.
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
        ) : dataTopProduk?.data && dataTopProduk?.data?.length > 0 ? (
          <>
            {dataTopProduk.data.map((item) => (
              <CardTopProduk
                key={item.id}
                nama={item.nama}
                kode={item.kode}
                total={item.totalTerjual}
                totalBelanja={item.totalOmzet}
                value={item.value}
              />
            ))}

            <div className="w-full flex flex-row justify-center items-center pt-3">
              <button
                type="button"
                className="text-xs font-medium text-base-content/50 hover:text-base-content transition-colors duration-150 ease-in-out py-0.5 flex flex-row justify-start items-start gap-2"
                onClick={() => handleSelectedLaporan("topProduk")}
              >
                <span>Lihat Semua Produk</span>

                {/* icon */}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="w-full h-70 gap-4 flex flex-col justify-center items-center">
            <PackageX className="size-12 text-base-content" />
            <span className="text-xs font-medium text-base-content/50">
              Tidak ada Top Produk
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

type CardTopProdukProps = {
  nama: string;
  kode: string;
  total: number;
  totalBelanja: number;
  value: number;
};
const CardTopProduk: FC<CardTopProdukProps> = ({
  kode,
  nama,
  total,
  totalBelanja,
  value,
}) => {
  return (
    <button
      type="button"
      className=" w-full flex flex-col justify-start items-start gap-1 border-b border-base-content/10 py-2 px-2.5 hover:bg-custom-primary/50 transition-colors duration-150 ease-in-out"
    >
      {/* nama */}
      <div className="flex flex-row justify-between items-center w-full">
        <span className="text-xs font-medium text-base-content">{nama}</span>
        <span className="text-[0.625rem] font-semibold uppercase text-base-content/60">
          {kode}
        </span>
      </div>

      <div className="w-full flex flex-row justify-between items-center gap-1">
        <div className="flex-3 flex flex-row justify-start items-center gap-1">
          {/* total */}
          <span className="flex-1 text-[0.625rem] text-left font-medium text-base-content/60">
            {formatNumberK(total)} Pcs
          </span>

          <div className="flex-3 flex flex-row justify-start items-center">
            <progress
              className="progress border border-custom-secondary progress-custom-primary w-full h-2.5"
              value={value}
              max="100"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-row justify-end items-center">
          <span className="text-xs font-medium text-base-content">
            {formatRupiahShort(totalBelanja)}
          </span>
        </div>
      </div>
    </button>
  );
};

export default StatistikTopProduk;
