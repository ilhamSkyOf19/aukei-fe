import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { generatePageNumbers } from "../../../helpers/helpers";
import { cn } from "../../../utils/cn";
import DropDown from "../../inputs/DropDown";
import { usePaginationWindow } from "../../../hooks/usePaginationWindows";

interface PaginationAndLimitProps {
  currentPage: number | null;
  setPage: (value: string) => void;
  totalPage: number | null;
  setLimit?: (value: string) => void;
}

export default function PaginationAndLimit({
  currentPage = 1,
  totalPage = 1,
  setPage,
  setLimit,
}: PaginationAndLimitProps) {
  const windowSize = usePaginationWindow();

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
        "w-full flex flex-col gap-6 lg:gap-0 lg:flex-row justify-center items-center mt-10 relative",
        totalPage! < 2 && setLimit && "h-10",
      )}
    >
      {/* limit */}
      {setLimit && (
        <div className="block lg:absolute left-0 z-50 text-base-content">
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
        <nav
          aria-label="PaginationAndLimit"
          className="flex items-center gap-1 select-none font-sans "
        >
          {/* Prev Button */}
          <button
            onClick={() => goTo(currentPage! - 1)}
            disabled={!isPrev}
            aria-label="Previous page"
            className={[
              "flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-lg border transition-all duration-150 border-base-content/10 text-base-content/10",
              isPrev
                ? "hover:text-custom-primary hover:bg-custom-secondary active:scale-95"
                : " cursor-not-allowed",
            ].join(" ")}
          >
            <ChevronLeft size={16} strokeWidth={2.2} />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {pages.map((page, idx) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 text-sm text-base-content tracking-widest"
                >
                  ···
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => goTo(page as number)}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={[
                    "flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95",
                    currentPage === page
                      ? "bg-custom-secondary text-custom-primary shadow-sm shadow-slate-900/20"
                      : "text-base-content/60 hover:bg-primary-purple/20 hover:text-base-content",
                  ].join(" ")}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => goTo(currentPage! + 1)}
            disabled={!isNext}
            aria-label="Next page"
            className={[
              "flex border-primary-purple text-primary-purple  items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-lg border transition-all duration-150",
              isNext
                ? " hover:text-custom-primary hover:bg-custom-secondary active:scale-95"
                : "  cursor-not-allowed",
            ].join(" ")}
          >
            <ChevronRight size={16} strokeWidth={2.2} />
          </button>
        </nav>
      )}
    </div>
  );
}
