import { useQuery } from "@tanstack/react-query";
import { useFilterSearch } from "../../../../../hooks/useFilterSearch";
import { useFilter } from "../../../../../hooks/useFilter";
import { ProdukServices } from "../../../../../services/produk.service";
import { handlePagination } from "../../../../../helpers/helpers";

const useShowProduk = (params: { pelangganId?: number; step: number }) => {
  const { pelangganId, step } = params;

  // search filter
  const { search, setSearch } = useFilterSearch("search", "page");

  // page filter
  const { filter: page, setFilter: setPage } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  // kategori filter
  const { filter: kategori, setFilter: handleKategori } = useFilter({
    paramName: "kategori",
    isNumber: true,
  });

  // query
  const { data: dataProduk, isLoading: isLoadingProduk } = useQuery({
    queryKey: ["produk", search, page, kategori, step, pelangganId],
    queryFn: () =>
      ProdukServices.findAllForKasir({
        ...(search && { search }),
        ...(page && { page }),
        ...(kategori && { kategori }),
        ...(pelangganId && { pelangganId }),
      }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  //   is existing produk
  const isExistDataProduk: boolean =
    !isLoadingProduk && dataProduk?.data
      ? dataProduk?.data?.data?.length > 0
        ? true
        : false
      : false;

  const currentPage = dataProduk?.data?.meta?.currentPage ?? 1;

  // pagination
  const { goTo, isNext, isPrev, pages } = handlePagination({
    setPage,
    currentPage,
    totalPage: dataProduk?.data?.meta?.totalPage,
  });

  //   handle page
  const handlePage = (val: "prev" | "next") => {
    if (val === "next") {
      if (
        Number(currentPage) >= 1 &&
        Number(currentPage) < dataProduk?.data?.meta?.totalPage!
      ) {
        return setPage((Number(currentPage) + 1).toString());
      } else {
        return;
      }
    } else if (val === "prev") {
      if (Number(currentPage) <= 1) {
        return;
      }
      return setPage((Number(currentPage) - 1).toString());
    }
  };

  return {
    dataProduk,
    isLoadingProduk,
    setSearch,
    handlePage,
    handleKategori,
    isExistDataProduk,
    goTo,
    isNext,
    isPrev,
    pages,
    kategori,
  };
};

export default useShowProduk;
