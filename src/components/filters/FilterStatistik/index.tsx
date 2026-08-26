import { FileText, Sheet } from "lucide-react";
import type { FC } from "react";
import ButtonWithIcon from "../../ui/button/ButtonWithIcon";
import InputSearch from "../../inputs/InputSearch";
import RangeDateLarge from "../RangeDateLarge";
import RangeDate from "../RangeDate";
import FilterSort from "../Sort";
import MetodePembayaran from "../MetodePembayaran";
import StatusTempo from "../StatusTempo";
import { cn } from "../../../utils/cn";
import listDateRange from "../../../utils/listDateRange";

type Props = {
  handleSearch: (value: string) => void;

  filterSort: {
    handleSort: (value: string) => void;
    value: string;
  };

  filterMetodePembayaran?: {
    handleMetodePembayaran: (value: string) => void;
    value: string;
  };

  filterTempo?: {
    handleTempo: (value: string) => void;
    value: string;
  };

  handleDownloadPdf?: () => void;

  handleDownloadExcel?: () => void;
};

const FilterStatistik: FC<Props> = ({
  handleSearch,
  filterMetodePembayaran,
  filterSort,
  filterTempo,
  handleDownloadExcel,
  handleDownloadPdf,
}) => {
  /**
   * Kondisi ketika hanya ada:
   * - Range Date
   * - Sort
   * - Metode Pembayaran
   *
   * Pada kondisi ini RangeDate mengambil 2 kolom.
   */
  const hasThreeFilters = !!filterMetodePembayaran && !filterTempo;

  return (
    <>
      {/* =====================================================
          SEARCH MOBILE
      ====================================================== */}
      <div className="w-full bg-base-100 p-2.5 shadow-sm border border-transparent dark:border-base-content/10 rounded-2xl md:rounded-xl md:hidden flex flex-col justify-start items-start gap-4">
        <InputSearch handleSearch={handleSearch} />
      </div>

      {/* =====================================================
          FILTER
      ====================================================== */}
      <div
        className={cn(
          "w-full grid grid-cols-2",
          "bg-base-100 shadow-sm",
          "border border-transparent dark:border-base-content/10",
          "rounded-2xl md:rounded-xl p-2.5 gap-2",
          hasThreeFilters
            ? "md:grid-cols-6 lg:gap-4"
            : "md:grid-cols-4 lg:gap-8",
        )}
      >
        {/* ===================================================
            SEARCH
        ==================================================== */}
        <div
          className={cn(
            "hidden md:flex flex-col justify-start items-start gap-2",
            hasThreeFilters ? "col-span-2" : "col-span-1",
          )}
        >
          <InputSearch handleSearch={handleSearch} withLabel />
        </div>

        {/* ===================================================
            RANGE DATE MOBILE
        ==================================================== */}
        <div className="col-span-2 md:hidden">
          <RangeDateLarge />
        </div>

        {/* ===================================================
            RANGE DATE DESKTOP
        ==================================================== */}
        <div
          className={cn(
            "hidden md:flex",
            hasThreeFilters ? "col-span-2" : "col-span-1",
          )}
        >
          <RangeDate listDate={listDateRange} customWidth="w-full" />
        </div>

        {/* ===================================================
            SORT
        ==================================================== */}
        <div className="col-span-1">
          <FilterSort
            setSort={filterSort.handleSort}
            customWidth="w-full"
            value={filterSort.value}
          />
        </div>

        {/* ===================================================
            METODE PEMBAYARAN
        ==================================================== */}
        {filterMetodePembayaran && (
          <div className="col-span-1 flex flex-row justify-start items-start gap-2">
            <MetodePembayaran
              setMetode={filterMetodePembayaran.handleMetodePembayaran}
              customWidth="w-full"
              value={filterMetodePembayaran.value}
            />
          </div>
        )}

        {/* ===================================================
            STATUS TEMPO MOBILE
        ==================================================== */}
        {filterMetodePembayaran &&
          filterMetodePembayaran.value === "tempo" &&
          filterTempo && (
            <div className="col-span-1 md:hidden">
              <StatusTempo
                setStatusTempo={filterTempo.handleTempo}
                value={filterTempo.value}
              />
            </div>
          )}
      </div>

      {/* =====================================================
          EXPORT MOBILE
      ====================================================== */}
      {handleDownloadPdf && handleDownloadExcel && (
        <div className="flex my-2 flex-row justify-end w-full items-center gap-2 md:hidden">
          <ButtonWithIcon
            icon={FileText}
            label="Export PDF"
            bgColor="bg-error"
            textColor="text-primary-white"
            handleBtn={handleDownloadPdf}
          />

          <ButtonWithIcon
            icon={Sheet}
            label="Export Excel"
            bgColor="bg-success"
            textColor="text-primary-white"
            handleBtn={handleDownloadExcel}
          />
        </div>
      )}
    </>
  );
};

export default FilterStatistik;
