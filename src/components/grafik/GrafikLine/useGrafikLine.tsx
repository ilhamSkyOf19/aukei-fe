import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type ForwardedRef,
} from "react";
import useFilterRangeDate from "../../../hooks/useFilterRangeDate";
import { useQueries } from "@tanstack/react-query";
import { StatistikServices } from "../../../services/statistik.service";
import type { ChildRef } from "../../../types/ref.type";

const useGrafikLine = (params: {
  pilihan: string;
  ref: ForwardedRef<ChildRef>;
}) => {
  // state isChoose grafik
  const [isChoose, setIsChoose] = useState<string>("omzet");

  useEffect(() => {
    switch (params.pilihan) {
      case "semua":
        setIsChoose("omzet");
        break;
      case "keuangan":
        setIsChoose("omzet");
        break;
      case "barang":
        setIsChoose("kerugian");
        break;
    }
  }, [params.pilihan]);

  // date
  const { endDate, startDate } = useFilterRangeDate();

  // use queries
  const data = useQueries({
    queries: [
      {
        queryKey: ["chart-omzet", startDate, endDate, isChoose],
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
        queryKey: ["chart-modal", startDate, endDate, isChoose],
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
        queryKey: ["chart-laba", startDate, endDate, isChoose],
        queryFn: () =>
          StatistikServices.chartLaba({
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
          }),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: isChoose === "laba" && !!startDate && !!endDate,
      },
      {
        queryKey: ["chart-kas-masuk", startDate, endDate, isChoose],
        queryFn: () =>
          StatistikServices.chartKasMasuk({
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
          }),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: isChoose === "kasMasuk" && !!startDate && !!endDate,
      },
      {
        queryKey: ["chart-kerugian", startDate, endDate, isChoose],
        queryFn: () =>
          StatistikServices.chartKerugian({
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
          }),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: isChoose === "kerugian" && !!startDate && !!endDate,
      },
    ],
  });

  const [
    { data: dataOmzet, isLoading: isLoadingOmzet, isFetching: isFetchingOmzet },
    { data: dataModal, isLoading: isLoadingModal, isFetching: isFetchingModal },
    { data: dataLaba, isLoading: isLoadingLaba, isFetching: isFetchingLaba },
    {
      data: dataKasMasuk,
      isLoading: isLoadingKasMasuk,
      isFetching: isFetchingKasMasuk,
    },
    {
      data: dataKerugian,
      isLoading: isLoadingKerugian,
      isFetching: isFetchingKerugian,
    },
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
    if (isChoose === "kasMasuk") {
      return dataKasMasuk?.data ?? [];
    }
    if (isChoose === "kerugian") {
      return dataKerugian?.data ?? [];
    }
  }, [isChoose, dataOmzet, dataModal, dataLaba, dataKasMasuk, dataKerugian]);

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
    if (isChoose === "kasMasuk") {
      return isLoadingKasMasuk || isFetchingKasMasuk;
    }
    if (isChoose === "kerugian") {
      return isLoadingKerugian || isFetchingKerugian;
    }
  }, [
    isChoose,
    isLoadingOmzet,
    isFetchingOmzet,
    isLoadingModal,
    isFetchingModal,
    isLoadingLaba,
    isFetchingLaba,
    isLoadingKasMasuk,
    isFetchingKasMasuk,
    isLoadingKerugian,
    isFetchingKerugian,
  ]);

  const handleSetIsChoose = (value: string) => {
    setIsChoose(value);
  };

  const getOpsiGrafik = (kategori: string) => {
    switch (kategori) {
      case "keuangan":
      case "semua":
        return [
          { label: "Omzet Terjual", value: "omzet" },
          { label: "Modal", value: "modal" },
          { label: "Laba", value: "laba" },
          { label: "Kas Masuk", value: "kasMasuk" },
          { label: "Kerugian", value: "kerugian" },
        ];
      case "barang":
        return [{ label: "Kerugian", value: "kerugian" }];
      case "booking":
        return []; // sesuaikan
      default:
        return [];
    }
  };

  const filteredOpsiGrafik = getOpsiGrafik(params.pilihan);

  const activeQuery = useMemo(() => {
    switch (isChoose) {
      case "omzet":
        return data[0];

      case "modal":
        return data[1];

      case "laba":
        return data[2];

      case "kasMasuk":
        return data[3];

      case "kerugian":
        return data[4];

      default:
        return data[0];
    }
  }, [data, isChoose]);

  useImperativeHandle(
    params.ref,
    () => ({
      async refetchActive() {
        await activeQuery.refetch();
      },
    }),
    [activeQuery],
  );

  return {
    isChoose,
    handleSetIsChoose,
    isLoading,
    dataChart,
    startDate,
    endDate,
    filteredOpsiGrafik,
  };
};

export default useGrafikLine;
