import { ChevronLeft, ChevronRight } from "lucide-react";
import { type FC } from "react";
import { cn } from "../../../utils/cn";

type Props = {
  goTo: (page: number) => void;
  currentPage: number | null;
  isPrev: boolean;
  isNext: boolean;
  pages: (number | "...")[];
  xs?: boolean;
};
const Pagination: FC<Props> = ({
  goTo,
  currentPage,
  isPrev,
  isNext,
  pages,
  xs,
}) => {
  return (
    <nav
      aria-label="PaginationAndLimit"
      className="flex items-center gap-1 select-none font-sans"
    >
      {/* Prev Button */}
      <button
        onClick={() => goTo(currentPage! - 1)}
        disabled={!isPrev}
        aria-label="Previous page"
        className={[
          "flex items-center justify-center rounded-lg border transition-all duration-150",
          xs ? "w-6.5 h-6.5 lg:w-7.5 lg:h-7.5" : "w-8 h-8 lg:w-9 lg:h-9",
          isPrev
            ? "hover:text-custom-primary hover:bg-custom-secondary active:scale-95"
            : " cursor-not-allowed border-base-content/10 text-base-content/10",
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
              className={cn(
                "flex items-center justify-center  text-base-content tracking-widest",
                xs
                  ? "w-6.5 h-6.5 lg:w-7.5 lg:h-7.5 text-xs"
                  : "w-8 h-8 lg:w-9 lg:h-9 text-sm",
              )}
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
                "flex items-center justify-center rounded-lg font-medium transition-all duration-150 active:scale-95",
                xs
                  ? "w-6.5 h-6.5 lg:w-7.5 lg:h-7.5 text-xs"
                  : "w-8 h-8 lg:w-9 lg:h-9 text-sm",
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
          "flex border-primary-purple text-primary-purple  items-center justify-center rounded-lg border transition-all duration-150",
          xs ? "w-6.5 h-6.5 lg:w-7.5 lg:h-7.5" : "w-8 h-8 lg:w-9 lg:h-9",
          isNext
            ? " hover:text-custom-primary hover:bg-custom-secondary active:scale-95"
            : "  cursor-not-allowed border-base-content/10 text-base-content/10",
        ].join(" ")}
      >
        <ChevronRight size={16} strokeWidth={2.2} />
      </button>
    </nav>
  );
};

export default Pagination;
