import { useInfiniteQuery } from "@tanstack/react-query";

import { useFilterSearch } from "../../../../../hooks/useFilterSearch";
import { useFilter } from "../../../../../hooks/useFilter";
import { ProdukServices } from "../../../../../services/produk.service";

const useShowProduk = (params: { pelangganId?: number; step: number }) => {
  const { pelangganId, step } = params;

  // search filter
  const { search, setSearch } = useFilterSearch("search", "page");

  // kategori filter
  const { filter: kategori, setFilter: handleKategori } = useFilter({
    paramName: "kategori",
    isNumber: true,
    resetPage: true,
  });

  // query infinite scroll
  const {
    data: dataProduk,
    isLoading: isLoadingProduk,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["produk", search, kategori, step, pelangganId],

    queryFn: ({ pageParam }) =>
      ProdukServices.findAllForKasir({
        ...(search && { search }),
        page: pageParam.toString(),
        ...(kategori && { kategori }),
        ...(pelangganId && { pelangganId }),
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.data?.meta?.currentPage ?? 1;
      const totalPage = lastPage?.data?.meta?.totalPage ?? 1;

      if (currentPage < totalPage) {
        return currentPage + 1;
      }

      return undefined;
    },

    enabled: !!pelangganId,

    retry: false,

    refetchOnWindowFocus: false,
  });

  // gabungkan seluruh data dari semua halaman
  const produk =
    dataProduk?.pages.flatMap((page) => page?.data?.data ?? []) ?? [];

  // cek apakah ada produk
  const isExistDataProduk = produk.length > 0;

  return {
    produk,

    dataProduk,

    isLoadingProduk,

    isFetchingNextPage,

    fetchNextPage,

    hasNextPage,

    setSearch,

    handleKategori,

    isExistDataProduk,

    kategori,
  };
};

export default useShowProduk;
