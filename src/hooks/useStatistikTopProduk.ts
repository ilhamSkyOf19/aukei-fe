import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { StatistikServices } from "../services/statistik.service";
import useFilterState from "../services/useFilterState";
import { useLaporanStore } from "../stores/laporanStore";

const useStatistikTopProduk = (params: {
  customLimit?: number;
  customStartDateEndDate?: {
    startDate?: string;
    endDate?: string;
  };
}) => {
  const { customLimit, customStartDateEndDate } = params;

  // use filter state
  const {
    handleKategori,
    kategori,
    limit,
    page,
    search,
    setLimit: handleLimit,
    setPage: handlePage,
    setSearch: handleSearch,
    handleSortOmzet,
    handleSortQty,
    sortQty,
    sortOmzet,
    startDateEndDate,
    setStartDateEndDate,
  } = useFilterState();

  // selected
  const { setSelectedLaporan: handleSelectedLaporan } = useLaporanStore();

  // prioritaskan custom params
  const finalStartDate =
    customStartDateEndDate?.startDate ?? startDateEndDate?.startDate;

  const finalEndDate =
    customStartDateEndDate?.endDate ?? startDateEndDate?.endDate;

  const finalLimit = customLimit?.toString() ?? limit;

  // use queries
  const {
    data: topProduk,
    isLoading: isLoadingTopProduk,
    isFetching: isFetchingTopProduk,
  } = useQuery({
    queryKey: [
      "top-produk",
      {
        startDate: finalStartDate,
        endDate: finalEndDate,
        limit: finalLimit,
        page,
        search,
        kategori,
        sortQty,
        sortOmzet,
      },
    ],
    queryFn: () =>
      StatistikServices.statistikTopProduk({
        ...(finalStartDate && {
          startDate: finalStartDate,
        }),

        ...(finalEndDate && {
          endDate: finalEndDate,
        }),

        ...(sortOmzet && {
          sortOmzet,
        }),

        ...(sortQty && {
          sortQty,
        }),

        ...(page && {
          page,
        }),

        ...(search && {
          search,
        }),

        ...(kategori && {
          kategori,
        }),

        ...(finalLimit && {
          limit: finalLimit,
        }),
      }),

    retry: false,
    refetchOnWindowFocus: false,
  });

  const dataTopProduk = useMemo(() => {
    return topProduk?.data;
  }, [topProduk]);

  const isLoading = useMemo(
    () => isLoadingTopProduk || isFetchingTopProduk,
    [isLoadingTopProduk, isFetchingTopProduk],
  );

  const isExistData = !isLoading && !!dataTopProduk?.data?.length;

  return {
    startDateEndDate: {
      startDate: finalStartDate,
      endDate: finalEndDate,
    },
    setStartDateEndDate,

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

    kategori,
    handleKategori,

    isExistData,

    handleSelectedLaporan,
  };
};

export default useStatistikTopProduk;
