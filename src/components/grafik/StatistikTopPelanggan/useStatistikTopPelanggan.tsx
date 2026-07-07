import { useMemo } from "react";
import useFilterRangeDate from "../../../hooks/useFilterRangeDate";
import { useQuery } from "@tanstack/react-query";
import { StatistikServices } from "../../../services/statistik.service";

const COLORS = [
  "oklch(70.7% 0.165 254.624)",
  "oklch(76.5% 0.177 163.223)",
  "oklch(82.8% 0.189 84.429)",
  "oklch(71.4% 0.203 305.504)",
];

const useStatistikTopPelanggan = () => {
  // date
  const { endDate, startDate } = useFilterRangeDate();

  // use queries
  const {
    data: topPelanggan,
    isLoading: isLoadingTopPelanggan,
    isFetching: isFetchingTopPelanggan,
  } = useQuery({
    queryKey: ["top-pelanggan", startDate, endDate],
    queryFn: () =>
      StatistikServices.statistikTopPelanggan({
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      }),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!startDate && !!endDate,
  });

  const dataTopPelanggan = useMemo(() => {
    if (topPelanggan?.data) return topPelanggan?.data;
  }, [topPelanggan]);

  const isLoading = useMemo(
    () => isLoadingTopPelanggan || isFetchingTopPelanggan,
    [isLoadingTopPelanggan, isFetchingTopPelanggan],
  );

  return {
    startDate,
    endDate,
    dataTopPelanggan,
    isLoading,
  };
};

export default useStatistikTopPelanggan;
