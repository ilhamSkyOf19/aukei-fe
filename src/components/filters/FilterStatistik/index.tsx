import { FileText, Sheet } from "lucide-react";
import ButtonWithIcon from "../../ui/button/ButtonWithIcon";
import type { FC } from "react";
import InputSearch from "../../inputs/InputSearch";
import RangeDateLarge from "../RangeDateLarge";
import RangeDate from "../RangeDate";
import listDateRangeLong from "../../../utils/listDateRangeLong";
import FilterSort from "../Sort";
import MetodePembayaran from "../MetodePembayaran";
import StatusTempo from "../StatusTempo";
import { cn } from "../../../utils/cn";

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
};

const FilterStatistik: FC<Props> = ({
  handleSearch,
  filterMetodePembayaran,
  filterSort,
  filterTempo,
}) => {
  return (
    <>
      {/* search */}
      <div className="w-full bg-base-100 p-2.5 shadow-sm border border-transparent dark:border-base-content/10 rounded-2xl md:rounded-xl md:hidden flex flex-col justify-start items-start gap-4">
        <InputSearch handleSearch={handleSearch} />
      </div>

      {/* filter */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 bg-base-100 shadow-sm border border-transparent dark:border-base-content/10 rounded-2xl md:rounded-xl p-2.5 gap-2 lg:gap-12">
        <div
          className={cn(
            " hidden md:flex flex-col justify-start items-start gap-2",
            filterMetodePembayaran && filterTempo ? "col-span-1" : "col-span-2",
          )}
        >
          <InputSearch handleSearch={handleSearch} withLabel />
        </div>

        <div className="col-span-2 md:hidden">
          <RangeDateLarge />
        </div>

        <div className="col-span-1 hidden md:flex">
          <RangeDate listDate={listDateRangeLong} customWidth="w-full" />
        </div>

        <div className="col-span-1">
          <FilterSort
            setSort={filterSort.handleSort}
            customWidth="w-full"
            value={filterSort.value}
          />
        </div>

        {filterMetodePembayaran && (
          <div className="col-span-1 flex flex-row justify-start items-start gap-2">
            <MetodePembayaran
              setMetode={filterMetodePembayaran.handleMetodePembayaran}
              customWidth="w-full"
              value={filterMetodePembayaran.value}
            />

            {filterMetodePembayaran.value === "tempo" && filterTempo && (
              <div className="hidden md:flex">
                <StatusTempo
                  setStatusTempo={filterTempo.handleTempo}
                  value={filterTempo.value}
                />
              </div>
            )}
          </div>
        )}

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

      <div className="flex my-2 flex-row justify-end w-full items-center gap-2 md:hidden">
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
      </div>
    </>
  );
};

export default FilterStatistik;
