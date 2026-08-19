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
        queryKey: ["chart-produk", startDate, endDate, isChoose],
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
        queryKey: ["chart-item", startDate, endDate, isChoose],
        queryFn: () =>
          StatistikServices.chartItem({
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
          }),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: isChoose === "item" && !!startDate && !!endDate,
      },
      {
        queryKey: ["chart-barang-rusak", startDate, endDate, isChoose],
        queryFn: () =>
          StatistikServices.chartBarangRusak({
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
          }),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: isChoose === "rusak" && !!startDate && !!endDate,
      },
      {
        queryKey: ["chart-barang-hilang", startDate, endDate, isChoose],
        queryFn: () =>
          StatistikServices.chartBarangHilang({
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
          }),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: isChoose === "hilang" && !!startDate && !!endDate,
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
    {
      data: dataBarangRusak,
      isLoading: isLoadingBarangRusak,
      isFetching: isFetchingBarangRusak,
    },
    {
      data: dataBarangHilang,
      isLoading: isLoadingBarangHilang,
      isFetching: isFetchingBarangHilang,
    },
  ] = data;

  // data chart
  const chartData = useMemo(() => {
    if (isChoose === "produk") {
      return dataProduk?.data ?? null;
    }
    if (isChoose === "item") {
      return dataItem?.data ?? null;
    }
    if (isChoose === "rusak") {
      return dataBarangRusak?.data ?? null;
    }
    if (isChoose === "hilang") {
      return dataBarangHilang?.data ?? null;
    }
  }, [isChoose, dataProduk, dataItem, dataBarangRusak, dataBarangHilang]);

  // loading chart aktif
  const isLoading = useMemo(() => {
    if (isChoose === "produk") {
      return isLoadingProduk || isFetchingProduk;
    }
    if (isChoose === "item") {
      return isLoadingItem || isFetchingItem;
    }
    if (isChoose === "rusak") {
      return isLoadingBarangRusak || isFetchingBarangRusak;
    }
    if (isChoose === "hilang") {
      return isLoadingBarangHilang || isFetchingBarangHilang;
    }
  }, [
    isChoose,
    isLoadingProduk,
    isFetchingProduk,
    isLoadingItem,
    isFetchingItem,
    isLoadingBarangRusak,
    isFetchingBarangRusak,
    isLoadingBarangHilang,
    isFetchingBarangHilang,
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
