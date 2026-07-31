import { FileText, Sheet } from "lucide-react";

import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import RangeDate from "../../../components/filters/RangeDate";
import GrafikBatang from "../../../components/grafik/GrafikBatang";
import GrafikLine from "../../../components/grafik/GrafikLine";
import GrafikPieMetodePembayaran from "../../../components/grafik/GrafikPieMetodePembayaran";
import listDateRangeLong from "../../../utils/listDateRangeLong";
import StatistikTopPelanggan from "../../../components/grafik/StatistikTopPelanggan";
import StatistikTopProduk from "../../../components/grafik/StatistikTopProduk";
import CardStatistik from "../../../components/ui/cards/CardStatistik";
import useStatistikDetail from "./useStatistikDetail";
import { cn } from "../../../utils/cn";
import DataBooking from "./DataBooking";
import PantauStok from "./PantauStok";
import ButtonRefresh from "./ButtonRefresh";
import TopProduk from "./TopProduk";
import TopPelanggan from "./TopPelanggan";

const StatistikDetail = () => {
  const {
    windowSize,
    isLoadingStatistik,
    pilihan,
    selectedLaporan,
    setSelectedLaporan,
    filteredStatistik,
    handleRefresh,
    grafikLineRef,
    endDate,
    startDate,
  } = useStatistikDetail();

  return (
    <div className="w-full">
      <div className="w-full flex flex-row justify-start items-stretch gap-2.5 px-2 pt-2.5">
        {/* pilihan */}
        <div className="flex-1 w-full flex flex-col justify-start items-start">
          <div className="bg-base-100 w-full shadow-sm border border-transparent dark:border-base-content/10 rounded-2xl md:rounded-xl p-2.5 gap-4 flex flex-col justify-start items-start sticky top-14 ">
            {/* title */}
            <div className="flex flex-col justify-start items-start gap-0.5">
              <h3 className="text-sm font-semibold text-base-content">
                Statistik
              </h3>

              <span className="text-[0.625rem] font-medium text-base-content/70">
                Silahkan pilih tipe statistik
              </span>
            </div>

            {/* pilihan */}
            <div className="w-full flex flex-col justify-start items-start gap-2.5">
              {/* btn */}
              {pilihan.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  className={cn(
                    "w-full h-12 rounded-2xl md:rounded-xl border flex flex-row justify-start items-center gap-2.5 px-2.5 transition-all duration-100 ease-in-out",
                    selectedLaporan === item.key
                      ? "border-custom-secondary bg-custom-primary shadow-md text-custom-secondary"
                      : "border-base-content/10 hover:border-custom-secondary text-base-content hover:bg-custom-primary/10",
                  )}
                  onClick={() => setSelectedLaporan(item.key)}
                >
                  {/* icon */}
                  <item.icon className={cn("size-5")} />

                  <span className="text-xs font-medium text-left">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* content */}
        <div className="flex-4 flex flex-col justify-start items-start gap-2.5">
          {selectedLaporan !== "pantauanStok" &&
            selectedLaporan !== "topProduk" &&
            selectedLaporan !== "topPelanggan" && (
              <>
                <div className="bg-base-100 w-full shadow-sm border border-transparent dark:border-base-content/10 rounded-2xl md:rounded-xl p-2.5 gap-4 flex flex-col justify-start items-start">
                  {/* aksi */}
                  <div className="w-full flex flex-row justify-between items-start gap-2">
                    {/* button filter */}
                    <RangeDate
                      customWidth="w-50 lg:w-70"
                      listDate={listDateRangeLong}
                      labelDown
                      noLabel
                      noLabelAll
                    />
                    {/* button export */}
                    <div className="md:flex flex-row justify-start items-center gap-2 hidden">
                      <ButtonWithIcon
                        icon={FileText}
                        label="Export PDF"
                        bgColor="bg-error"
                        textColor="text-primary-white"
                      />
                      <ButtonWithIcon
                        icon={Sheet}
                        label="Export Excel"
                        bgColor="bg-success"
                        textColor="text-primary-white"
                      />

                      {/* refresh */}
                      <ButtonRefresh handleRefresh={handleRefresh} />
                    </div>
                  </div>
                  <div
                    className={cn(
                      "w-full grid grid-cols-2 gap-2",
                      selectedLaporan === "booking"
                        ? "lg:grid-cols-3"
                        : selectedLaporan === "barang"
                          ? "lg:grid-cols-4"
                          : "lg:grid-cols-3",
                    )}
                  >
                    {isLoadingStatistik ? (
                      <>
                        <div className="skeleton h-24 col-span-1 rounded-2xl md:rounded-xl" />
                        <div className="skeleton h-24 col-span-1 rounded-2xl md:rounded-xl" />
                        <div className="skeleton h-24 col-span-1 rounded-2xl md:rounded-xl" />
                        <div className="skeleton h-24 col-span-1 rounded-2xl md:rounded-xl" />
                        <div className="skeleton h-24 col-span-1 rounded-2xl md:rounded-xl" />
                        <div className="skeleton h-24 col-span-1 rounded-2xl md:rounded-xl" />
                      </>
                    ) : (
                      filteredStatistik.map((item) => (
                        <CardStatistik
                          key={item.key}
                          isLoading={isLoadingStatistik}
                          icon={item.icon}
                          label={item.label}
                          value={item.value}
                          caption={item.caption}
                          minus={item.minus}
                          withAlert={item.withAlert}
                          detail={item.detail}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* grafik */}
                <div className="w-full gap-2.5 flex flex-col justify-between items-start md:gap-2.5">
                  {selectedLaporan !== "booking" && (
                    <>
                      <GrafikLine
                        ref={grafikLineRef}
                        windowSize={windowSize}
                        pilihan={selectedLaporan}
                      />

                      {/* graifk  */}
                      {(selectedLaporan === "barang" ||
                        selectedLaporan === "semua") && (
                        <GrafikBatang windowSize={windowSize} />
                      )}

                      {/* grafik pie */}
                      <div className="w-full gap-2.5 flex flex-col justify-between items-start md:gap-2.5">
                        <div className="w-full flex flex-row justify-start items-start gap-2.5">
                          {selectedLaporan === "semua" && (
                            <GrafikPieMetodePembayaran />
                          )}

                          {selectedLaporan === "semua" && (
                            <StatistikTopProduk
                              rangeDate={{
                                startDate,
                                endDate,
                              }}
                            />
                          )}
                        </div>

                        <div className="lg:flex-1 w-full flex flex-col md:flex-row justify-between items-start gap-2.5 md:gap-4 md:h-90 h-auto">
                          {selectedLaporan === "semua" && (
                            <>
                              <StatistikTopPelanggan
                                rangeDate={{ startDate, endDate }}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

          {selectedLaporan === "booking" && (
            <DataBooking pilihan={selectedLaporan} />
          )}

          {selectedLaporan === "pantauanStok" && (
            <PantauStok pilihan={selectedLaporan} />
          )}

          {selectedLaporan === "topProduk" && <TopProduk />}

          {selectedLaporan === "topPelanggan" && <TopPelanggan />}
        </div>
      </div>
    </div>
  );
};

export default StatistikDetail;
