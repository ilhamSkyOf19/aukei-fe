import { useInfiniteQuery } from "@tanstack/react-query";

import { ProdukServices } from "../services/produk.service";

const useDataProdukForChooseInfinity = (params: {
  search?: string;
  kategori?: string;
}) => {
  const { search, kategori } = params;

  const {
    data,
    isLoading: isLoadingProdukForChoose,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["produk-for-choose-infinity", search, kategori],

    queryFn: ({ pageParam }) =>
      ProdukServices.findAllForChooseInfinity({
        ...(search && { search }),
        ...(kategori && { kategori: kategori.toString() }),
        page: pageParam.toString(),
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      if (!lastPage.data?.meta.hasNextPage) {
        return undefined;
      }

      return lastPage.data.meta.currentPage + 1;
    },

    retry: false,
    refetchOnWindowFocus: false,
  });

  // Gabungan data produk untuk kebutuhan render
  const dataProduk = data?.pages.flatMap((page) => page.data?.data) ?? [];

  // Meta halaman terakhir
  const meta = data?.pages.at(-1)?.data?.meta;

  return {
    dataProduk,
    meta,

    isLoadingProdukForChoose,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
};

export default useDataProdukForChooseInfinity;
