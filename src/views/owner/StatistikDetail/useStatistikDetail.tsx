import useSizeWindows from "../../../hooks/useSizeWindows";
import { useQuery } from "@tanstack/react-query";
import useFilterRangeDate from "../../../hooks/useFilterRangeDate";
import { StatistikServices } from "../../../services/statistik.service";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Banknote,
  CalendarClock,
  LineChart,
  LucidePackage,
  PackagePlus,
  PackageSearch,
  type LucideIcon,
} from "lucide-react";
import useDataStatistik from "./useDataStatistik";
import type { ChildRef } from "../../../types/ref.type";

const pilihan: { key: string; label: string; icon: LucideIcon }[] = [
  {
    key: "semua",
    label: "Semua Statistik",
    icon: LineChart,
  },
  {
    key: "keuangan",
    label: "Statistik Keuangan",
    icon: Banknote,
  },
  {
    key: "booking",
    label: "Statistik Booking",
    icon: CalendarClock,
  },
  {
    key: "barang",
    label: "Statistik Barang",
    icon: LucidePackage,
  },
  {
    key: "pantauanStok",
    label: "Pantauan Stok",
    icon: PackageSearch,
  },
];

const useStatistikDetail = () => {
  // window size
  const windowSize = useSizeWindows();

  // buat use query client

  // grafik line
  const grafikLineRef = useRef<ChildRef | null>(null);

  // tambahkan grafik batang

  // state pilihan
  const [pilihanStatistik, setPilihanStatistik] = useState<string>("semua");

  // filter date
  const { startDate, endDate } = useFilterRangeDate();

  // use query
  const {
    data: statistik,
    isLoading: isLoadingStatistik,
    refetch,
  } = useQuery({
    queryKey: ["statistik", startDate, endDate],
    queryFn: () =>
      StatistikServices.findStatistikWithPersentase({
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      }),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!startDate && !!endDate,
  });

  const { dataStatistik } = useDataStatistik({ windowSize, statistik });

  const filteredStatistik = useMemo(
    () =>
      pilihanStatistik === "semua"
        ? dataStatistik
        : dataStatistik.filter((item) => item.category === pilihanStatistik),
    [pilihanStatistik, dataStatistik],
  );

  // handle refetch
  const handleRefresh = async () => {
    await refetch({
      throwOnError: true,
    });
    await grafikLineRef.current?.refetchActive();
  };

  return {
    windowSize,
    statistik,
    isLoadingStatistik,
    pilihan,
    pilihanStatistik,
    setPilihanStatistik,
    filteredStatistik,
    handleRefresh,
    grafikLineRef,
  };
};

export default useStatistikDetail;
