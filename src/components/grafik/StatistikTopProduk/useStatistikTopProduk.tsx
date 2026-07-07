import { useMemo } from "react";
import useFilterRangeDate from "../../../hooks/useFilterRangeDate";
import { useQuery } from "@tanstack/react-query";
import { StatistikServices } from "../../../services/statistik.service";

const useStatistikTopProduk = () => {
  // date
  const { endDate, startDate } = useFilterRangeDate();

  // use queries
  const {
    data: topProduk,
    isLoading: isLoadingTopProduk,
    isFetching: isFetchingTopProduk,
  } = useQuery({
    queryKey: ["top-produk", startDate, endDate],
    queryFn: () =>
      StatistikServices.statistikTopProduk({
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
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

  return {
    startDate,
    endDate,
    dataTopProduk,
    isLoading,
  };
};

export default useStatistikTopProduk;
