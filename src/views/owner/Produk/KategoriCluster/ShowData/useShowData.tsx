import { useFilterSearch } from "../../../../../hooks/useFilterSearch";
import { useFilter } from "../../../../../hooks/useFilter";
import { useQuery } from "@tanstack/react-query";
import { KategoriProdukServices } from "../../../../../services/kategoriProduk.service";

const useShowData = () => {
  // search filter
  const { search, setSearch: handleSearch } = useFilterSearch("search");

  // sort filter
  const { filter: sort, setFilter: handleSort } = useFilter({
    paramName: "sort",
    allowQuery: ["asc", "desc"],
  });

  // page filter
  const { filter: page, setFilter: handlePage } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  // limit filter
  const { filter: limit, setFilter: handleLimit } = useFilter({
    paramName: "limit",
    isNumber: true,
  });

  // use query
  const { data: dataKategoriProduk, isLoading: isLoadingKategoriProduk } =
    useQuery({
      queryKey: ["kategori-produk", { search, sort, limit, page }],
      queryFn: () =>
        KategoriProdukServices.findAll({
          ...(search && { search }),
          ...(sort && { sort }),
          ...(limit && { limit }),
          ...(page && { page }),
        }),
      refetchOnWindowFocus: false,
      retry: false,
    });

  // is exist data
  const isExistDataKategoriProduk =
    !isLoadingKategoriProduk && dataKategoriProduk?.data?.data
      ? dataKategoriProduk?.data?.data?.length > 0
        ? true
        : false
      : false;

  return {
    handleSearch,
    handleSort,
    handleLimit,
    handlePage,
    dataKategoriProduk,
    isLoadingKategoriProduk,
    isExistDataKategoriProduk,
  };
};

export default useShowData;
