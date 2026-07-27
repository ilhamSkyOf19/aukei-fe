import { useMemo } from "react";
import useFilterRangeDate from "../../../hooks/useFilterRangeDate";
import { useQuery } from "@tanstack/react-query";
import { StatistikServices } from "../../../services/statistik.service";
import useFilterState from "../../../services/useFilterState";

const useStatistikTopProduk = (params: { customLimit?: number }) => {
  const { customLimit } = params;
  // date
  const { endDate, startDate } = useFilterRangeDate();

  //  use filter statte
  const {
    handleKategori,
    kategori,
    limit,
    page,
    search,
    setLimit: handleLimit,
    setPage: handlePage,
    setSearch: handleSearch,
    setSort: handleSort,
    handleSortOmzet,
    handleSortQty,
    sortQty,
    sortOmzet,
  } = useFilterState();

  // use queries
  const {
    data: topProduk,
    isLoading: isLoadingTopProduk,
    isFetching: isFetchingTopProduk,
  } = useQuery({
    queryKey: [
      "top-produk",
      { startDate, endDate, limit, page, search, kategori, sortQty, sortOmzet },
    ],
    queryFn: () =>
      StatistikServices.statistikTopProduk({
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(sortOmzet && { sortOmzet }),
        ...(sortQty && { sortQty }),
        ...(page && { page }),
        ...(search && { search }),
        ...(kategori && { kategori }),
        ...((customLimit || limit) && {
          limit: customLimit?.toString() ?? limit,
        }),
      }),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!startDate && !!endDate,
  });

  const dataTopProduk = useMemo(() => {
    if (topProduk?.data) return topProduk?.data;
  }, [topProduk]);

  //   is loading
  const isLoading = useMemo(
    () => isLoadingTopProduk || isFetchingTopProduk,
    [isLoadingTopProduk, isFetchingTopProduk],
  );

  // is exist
  const isExistData = !isLoading && !!dataTopProduk?.data?.length;

  return {
    startDate,
    endDate,
    dataTopProduk,
    isLoading,

    limit,
    handleLimit,
    page,
    handlePage,
    search,
    handleSearch,

    sortQty,
    handleSortQty,
    sortOmzet,
    handleSortOmzet,
    handleSort,

    kategori,
    handleKategori,

    isExistData,
  };
};

export default useStatistikTopProduk;
