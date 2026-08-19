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

const useGrafikPieMetodePembayaran = () => {
  // date
  const { endDate, startDate } = useFilterRangeDate();

  // use queries
  const {
    data: chartMetodePembayaran,
    isLoading: isLoadingMetodePembayaran,
    isFetching: isFetchingMetodePembayaran,
  } = useQuery({
    queryKey: ["chart-metode-pembayaran", startDate, endDate],
    queryFn: () =>
      StatistikServices.chartMetodePembayaran({
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      }),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!startDate && !!endDate,
  });

  const dataChart = useMemo(() => {
    if (chartMetodePembayaran)
      return chartMetodePembayaran.data?.map((item) => ({
        ...item,
        fill:
          item.label === "CASH"
            ? COLORS[1]
            : item.label === "TRANSFER"
              ? COLORS[0]
              : item.label === "QRIS"
                ? COLORS[3]
                : COLORS[2],
      }));
  }, [chartMetodePembayaran]);

  const isLoading = useMemo(
    () => isLoadingMetodePembayaran || isFetchingMetodePembayaran,
    [isLoadingMetodePembayaran, isFetchingMetodePembayaran],
  );

  // is data empty
  const isEmptyData = useMemo(() => {
    if (dataChart) return dataChart.every((item) => item.value === 0);
  }, [dataChart]);

  return {
    startDate,
    endDate,
    dataChart,
    isLoading,
    isEmptyData,
  };
};

export default useGrafikPieMetodePembayaran;
