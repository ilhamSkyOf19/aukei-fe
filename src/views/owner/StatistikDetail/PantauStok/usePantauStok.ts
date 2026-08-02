import { useQueries } from "@tanstack/react-query";
import { ProdukServices } from "../../../../services/produk.service";
import useFilterState from "../../../../services/useFilterState";
import { StatistikServices } from "../../../../services/statistik.service";

const usePantauStok = (params: { pilihan: string }) => {
  const { pilihan } = params;

  const {
    limit,
    page,
    search,
    setLimit,
    setPage,
    setSearch,
    setSort,
    sort,
    handleKategori,
    kategori,
  } = useFilterState();

  const data = useQueries({
    queries: [
      {
        queryKey: ["pantauan-stok", { sort, limit, page, search, kategori }],
        queryFn: () =>
          ProdukServices.pantauanStok({
            ...(sort && { sort }),
            ...(limit && { limit }),
            ...(page && { page }),
            ...(search && { search }),
            ...(kategori && { kategori }),
          }),
        staleTime: Infinity,
        gcTime: Infinity,
        retry: false,
        refetchOnWindowFocus: false,
        enabled: pilihan === "pantauanStok",
      },

      {
        queryKey: ["statistik-pantauan-stok", { kategori }],
        queryFn: () =>
          StatistikServices.statistikPantauanStok({
            ...(kategori && { kategori }),
          }),
        staleTime: Infinity,
        gcTime: Infinity,
        retry: false,
        refetchOnWindowFocus: false,
        enabled: pilihan === "pantauanStok",
      },
    ],
  });

  const [
    { data: dataProduk, isLoading: isLoadingDataProduk },
    { data: dataStatistik, isLoading: isLoadingStatistik },
  ] = data;

  //   is existing data
  const isExistDataProduk: boolean =
    !isLoadingDataProduk && !!dataProduk?.data?.data?.length;

  return {
    isExistDataProduk,
    dataProduk,
    isLoadingDataProduk,
    handleSort: setSort,
    handleLimit: setLimit,
    handlePage: setPage,
    handleSearch: setSearch,
    handleKategori,
    sort,
    kategori,
    dataStatistik,
    isLoadingStatistik,
  };
};

export default usePantauStok;
