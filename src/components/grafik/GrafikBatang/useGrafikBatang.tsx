import { useMemo, useState } from "react";
import useFilterRangeDate from "../../../hooks/useFilterRangeDate";
import { useQueries } from "@tanstack/react-query";
import { StatistikServices } from "../../../services/statistik.service";

const useGrafikBatang = () => {
  // state isChoose grafik
  const [isChoose, setIsChoose] = useState<string>("produk");

  // date
  const { endDate, startDate } = useFilterRangeDate();

  // use queries
  const data = useQueries({
    queries: [
      {
        queryKey: ["chart-produk", startDate, endDate],
        queryFn: () =>
          StatistikServices.chartProduk({
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
          }),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: isChoose === "produk" && !!startDate && !!endDate,
      },
      {
        queryKey: ["chart-item", startDate, endDate],
        queryFn: () =>
          StatistikServices.chartItem({
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
          }),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: isChoose === "item" && !!startDate && !!endDate,
      },
    ],
  });

  const [
    {
      data: dataProduk,
      isLoading: isLoadingProduk,
      isFetching: isFetchingProduk,
    },
    { data: dataItem, isLoading: isLoadingItem, isFetching: isFetchingItem },
  ] = data;

  // data chart
  const chartData = useMemo(() => {
    if (isChoose === "produk") {
      return dataProduk?.data ?? [];
    }
    if (isChoose === "item") {
      return dataItem?.data ?? [];
    }
  }, [isChoose, dataProduk, dataItem]);

  // loading chart aktif
  const isLoading = useMemo(() => {
    if (isChoose === "produk") {
      return isLoadingProduk || isFetchingProduk;
    }
    if (isChoose === "item") {
      return isLoadingItem || isFetchingItem;
    }
  }, [
    isChoose,
    isLoadingProduk,
    isFetchingProduk,
    isLoadingItem,
    isFetchingItem,
  ]);

  const handleSetIsChoose = (value: string) => {
    setIsChoose(value);
  };

  return {
    isChoose,
    handleSetIsChoose,
    isLoading,
    chartData,
    startDate,
    endDate,
  };
};

export default useGrafikBatang;
