import useSizeWindows from "../../../hooks/useSizeWindows";
import { useQuery } from "@tanstack/react-query";
import useFilterRangeDate from "../../../hooks/useFilterRangeDate";
import { StatistikServices } from "../../../services/statistik.service";
import { useMemo, useRef, useState } from "react";
import {
  Banknote,
  CalendarClock,
  LineChart,
  LucidePackage,
  PackageSearch,
  Star,
  type LucideIcon,
} from "lucide-react";
import useDataStatistik from "./useDataStatistik";
import type { ChildRef } from "../../../types/ref.type";

const pilihan: { key: string; label: string; icon: LucideIcon }[] = [
  {
    key: "semua",
    label: "Semua Laporan",
    icon: LineChart,
  },
  {
    key: "keuangan",
    label: "Laporan Penjualan",
    icon: Banknote,
  },

  {
    key: "barang",
    label: "Laporan Barang",
    icon: LucidePackage,
  },
  {
    key: "booking",
    label: "Laporan Booking",
    icon: CalendarClock,
  },
  {
    key: "pantauanStok",
    label: "Laporan Stok",
    icon: PackageSearch,
  },
  {
    key: "topProduk",
    label: "Laporan Top Produk",
    icon: Star,
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
