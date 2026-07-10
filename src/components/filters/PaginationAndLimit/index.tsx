import { handlePagination } from "../../../helpers/helpers";
import { cn } from "../../../utils/cn";
import DropDown from "../../inputs/DropDown";
import { usePaginationWindow } from "../../../hooks/usePaginationWindows";
import Pagination from "../../ui/Pagination";

interface PaginationAndLimitProps {
  currentPage: number | null;
  setPage: (value: string) => void;
  totalPage: number | null;
  setLimit?: (value: string) => void;
  emptyData?: boolean;
  customWindowSize?: 3 | 5 | 7;
  customPositionPagination?: "end" | "start";
  limit?: number;
  isLoading?: boolean;
}

export default function PaginationAndLimit({
  currentPage = 1,
  totalPage = 1,
  setPage,
  setLimit,
  emptyData,
  customPositionPagination,
  customWindowSize,
  limit,
  isLoading,
}: PaginationAndLimitProps) {
  const windowSize = customWindowSize
    ? customWindowSize
    : usePaginationWindow();

  // handle pagination
  const { goTo, isNext, isPrev, pages } = handlePagination({
    setPage,
    currentPage,
    totalPage,
    windowSize,
  });

  return (
    <div
      className={cn(
        "w-full flex flex-col gap-4 bg-base-100 border border-transparent dark:border-base-content/10 shadow-sm md:gap-0 md:flex-row items-center mt-2 relative p-2 rounded-lg shrink-0",
        totalPage! < 2 && setLimit && "h-15",
        customPositionPagination === "end" ? "justify-end" : "justify-center",
        emptyData && "hidden",
      )}
    >
      {/* limit */}
      {setLimit && !emptyData && (
        <div className="flex md:absolute md:left-4 z-30 text-base-content flex-row justify-center items-center gap-2">
          <span className="text-xs text-base-content/50">Tampilkan</span>

          <DropDown
            isLoading={isLoading}
            listChoose={[
              {
                label: "8",
                value: "8",
              },
              {
                label: "16",
                value: "16",
              },
              {
                label: "24",
                value: "24",
              },
            ]}
            placeholder="-"
            handleChange={(e) => setLimit(e.target.value)}
            customWidth="w-15"
            value={limit?.toString() || "*"}
          />

          <span className="text-xs text-base-content/50">Halaman</span>
        </div>
      )}

      {/* pagiantion */}
      {totalPage! > 1 && (
        <Pagination
          currentPage={currentPage}
          goTo={goTo}
          isNext={isNext}
          isPrev={isPrev}
          pages={pages}
        />
      )}
    </div>
  );
}
