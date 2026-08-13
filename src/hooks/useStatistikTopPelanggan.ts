import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { StatistikServices } from "../services/statistik.service";
import useFilterState from "../services/useFilterState";
import { useLaporanStore } from "../stores/laporanStore";
import useDownloadLaporanTopPelanggan from "./useDownloadLaporanTopPelanggan";

const useStatistikTopPelanggan = (params: {
  customLimit?: number;
  customStartDateEndDate?: {
    startDate?: string;
    endDate?: string;
  };
}) => {
  const { customLimit, customStartDateEndDate } = params;

  // use filter state
  const {
    limit,
    page,
    search,
    setLimit: handleLimit,
    setPage: handlePage,
    setSearch: handleSearch,
    handleSortTotalTransaksi,
    handleTotalNilaiTransaksi,
    sortTotalNilaiTransaksi,
    sortTotalTransaksi,
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
    data: topPelanggan,
    isLoading: isLoadingTopPelanggan,
    isFetching: isFetchingTopPelanggan,
    refetch: refetchTopPelanggan,
  } = useQuery({
    queryKey: [
      "top-pelanggan",
      {
        startDate: finalStartDate,
        endDate: finalEndDate,
        limit: finalLimit,
        page,
        search,
        sortTotalNilaiTransaksi,
        sortTotalTransaksi,
      },
    ],
    queryFn: () =>
      StatistikServices.statistikTopPelanggan({
        ...(finalStartDate && {
          startDate: finalStartDate,
        }),

        ...(finalEndDate && {
          endDate: finalEndDate,
        }),

        ...(sortTotalNilaiTransaksi && {
          sortTotalNilaiTransaksi,
        }),

        ...(sortTotalTransaksi && {
          sortTotalTransaksi,
        }),
        ...(page && {
          page,
        }),

        ...(search && {
          search,
        }),

        ...(finalLimit && {
          limit: finalLimit,
        }),
      }),

    retry: false,
    refetchOnWindowFocus: false,
  });

  const dataTopPelanggan = useMemo(() => {
    return topPelanggan?.data;
  }, [topPelanggan]);

  const isLoading = useMemo(
    () => isLoadingTopPelanggan || isFetchingTopPelanggan,
    [isLoadingTopPelanggan, isFetchingTopPelanggan],
  );

  const isExistData = !isLoading && !!dataTopPelanggan?.data?.length;

  // download
  const {
    handleDownloadLaporanTopPelangganPdf,
    isLoadingDownloadLaporanTopPelangganPdf,
  } = useDownloadLaporanTopPelanggan();

  return {
    startDateEndDate: {
      startDate: finalStartDate,
      endDate: finalEndDate,
    },
    setStartDateEndDate,

    dataTopPelanggan,
    isLoading,

    limit,
    handleLimit,

    page,
    handlePage,

    search,
    handleSearch,

    isExistData,

    handleSortTotalTransaksi,
    handleTotalNilaiTransaksi,
    sortTotalNilaiTransaksi,
    sortTotalTransaksi,

    handleSelectedLaporan,

    handleDownloadLaporanTopPelangganPdf,
    isLoadingDownloadLaporanTopPelangganPdf,

    refetchTopPelanggan,
  };
};

export default useStatistikTopPelanggan;
