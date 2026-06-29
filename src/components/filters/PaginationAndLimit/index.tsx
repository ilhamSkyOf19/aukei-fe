import { generatePageNumbers } from "../../../helpers/helpers";
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
}

export default function PaginationAndLimit({
  currentPage = 1,
  totalPage = 1,
  setPage,
  setLimit,
  emptyData,
  customPositionPagination,
  customWindowSize,
}: PaginationAndLimitProps) {
  const windowSize = customWindowSize
    ? customWindowSize
    : usePaginationWindow();

  const pages = generatePageNumbers(currentPage!, totalPage!, windowSize);

  const goTo = (page: number) => {
    if (page < 1 || page > totalPage!) return;
    setPage(String(page));
  };

  const isPrev = currentPage! > 1;
  const isNext = currentPage! < totalPage!;

  return (
    <div
      className={cn(
        "w-full flex flex-col gap-6 md:gap-0 md:flex-row items-center mt-10 relative",
        totalPage! < 2 && setLimit && "h-10",
        customPositionPagination === "end" ? "justify-end" : "justify-center",
      )}
    >
      {/* limit */}
      {setLimit && !emptyData && (
        <div className="block md:absolute left-0 z-40 text-base-content">
          <DropDown
            listChoose={[
              {
                label: "8 / Halaman",
                value: "8",
              },
              {
                label: "16 / Halaman",
                value: "16",
              },
              {
                label: "24 / Halaman",
                value: "24",
              },
            ]}
            placeholder="Pilih data per halaman"
            handleChange={(e) => setLimit(e.target.value)}
            customWidth="w-50"
          />
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
