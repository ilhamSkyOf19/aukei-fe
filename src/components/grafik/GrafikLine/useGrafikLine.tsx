import { useMemo, useState } from "react";
import useFilterRangeDate from "../../../hooks/useFilterRangeDate";
import { useQueries } from "@tanstack/react-query";
import { StatistikServices } from "../../../services/statistik.service";

const useGrafikLine = () => {
  // state isChoose grafik
  const [isChoose, setIsChoose] = useState<string>("omzet");

  // date
  const { endDate, startDate } = useFilterRangeDate();

  // use queries
  const data = useQueries({
    queries: [
      {
        queryKey: ["chart-omzet", startDate, endDate],
        queryFn: () =>
          StatistikServices.chartOmzet({
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
          }),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: isChoose === "omzet" && !!startDate && !!endDate,
      },
      {
        queryKey: ["chart-modal", startDate, endDate],
        queryFn: () =>
          StatistikServices.chartModal({
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
          }),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: isChoose === "modal" && !!startDate && !!endDate,
      },
      {
        queryKey: ["chart-laba", startDate, endDate],
        queryFn: () =>
          StatistikServices.chartLaba({
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
          }),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: isChoose === "laba" && !!startDate && !!endDate,
      },
    ],
  });

  const [
    { data: dataOmzet, isLoading: isLoadingOmzet, isFetching: isFetchingOmzet },
    { data: dataModal, isLoading: isLoadingModal, isFetching: isFetchingModal },
    { data: dataLaba, isLoading: isLoadingLaba, isFetching: isFetchingLaba },
  ] = data;

  // data chart
  const dataChart = useMemo(() => {
    if (isChoose === "omzet") {
      return dataOmzet?.data ?? [];
    }
    if (isChoose === "modal") {
      return dataModal?.data ?? [];
    }
    if (isChoose === "laba") {
      return dataLaba?.data ?? [];
    }
  }, [isChoose, dataOmzet, dataModal, dataLaba]);

  // loading chart aktif
  const isLoading = useMemo(() => {
    if (isChoose === "omzet") {
      return isLoadingOmzet || isFetchingOmzet;
    }
    if (isChoose === "modal") {
      return isLoadingModal || isFetchingModal;
    }
    if (isChoose === "laba") {
      return isLoadingLaba || isFetchingLaba;
    }
  }, [
    isChoose,
    isLoadingOmzet,
    isFetchingOmzet,
    isLoadingModal,
    isFetchingModal,
    isLoadingLaba,
    isFetchingLaba,
  ]);

  const handleSetIsChoose = (value: string) => {
    setIsChoose(value);
  };

  return {
    isChoose,
    handleSetIsChoose,
    isLoading,
    dataChart,
    startDate,
    endDate,
  };
};

export default useGrafikLine;
