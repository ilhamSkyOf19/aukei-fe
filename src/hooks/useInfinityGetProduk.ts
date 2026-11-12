import { useInfiniteQuery } from "@tanstack/react-query";
import { ProdukServices } from "../services/produk.service";

type Params = {
  search?: string;
  kategori?: string;
  pelangganId?: number;
  disabled?: boolean;
};
const useInfinityGetProduk = ({
  search,
  kategori,
  pelangganId,
  disabled,
}: Params) => {
  const {
    data,
    isLoading: isLoadingProduk,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["produk", search, kategori, pelangganId],

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

    enabled: !!pelangganId && !disabled,

    retry: false,

    refetchOnWindowFocus: false,
  });

  // gabungkan seluruh data dari semua halaman
  const dataProduk =
    data?.pages.flatMap((page) => page?.data?.data ?? []) ?? [];

  return {
    dataProduk,
    isLoadingProduk,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
};

export default useInfinityGetProduk;
