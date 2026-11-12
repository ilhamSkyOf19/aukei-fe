import { useFilterSearch } from "../../../../../hooks/useFilterSearch";
import { useFilter } from "../../../../../hooks/useFilter";
import useInfinityGetProduk from "../../../../../hooks/useInfinityGetProduk";

const useShowProduk = (params: { pelangganId?: number; step: number }) => {
  const { pelangganId } = params;

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
    dataProduk,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoadingProduk,
  } = useInfinityGetProduk({ kategori, pelangganId, search });

  // cek apakah ada produk
  const isExistDataProduk = dataProduk.length > 0;

  return {
    produk: dataProduk,

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
