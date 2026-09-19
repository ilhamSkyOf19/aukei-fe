import { useEffect, useRef } from "react";

type UseInfiniteScrollParams = {
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  threshold?: number;
  rootMargin?: string;
};

const useInfiniteScroll = ({
  hasNextPage = false,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 0.1,
  rootMargin,
}: UseInfiniteScrollParams) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const loadMore = loadMoreRef.current;

    if (!container || !loadMore) {
      return;
    }

    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: container,
        threshold,
        rootMargin,
      },
    );

    observer.observe(loadMore);

    return () => {
      observer.unobserve(loadMore);
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, threshold, rootMargin]);

  return {
    containerRef,
    loadMoreRef,
  };
};

export default useInfiniteScroll;
