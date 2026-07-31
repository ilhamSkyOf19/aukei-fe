import useSizeWindows from "../../../hooks/useSizeWindows";
import { useQuery } from "@tanstack/react-query";
import useFilterRangeDate from "../../../hooks/useFilterRangeDate";
import { StatistikServices } from "../../../services/statistik.service";
import { useMemo, useRef } from "react";
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
import {
  useLaporanStore,
  type LaporanPilihanType,
} from "../../../stores/laporanStore";

const pilihan: { key: LaporanPilihanType; label: string; icon: LucideIcon }[] =
  [
    {
      key: "semua",
      label: "Semua Laporan",
      icon: LineChart,
    },
    {
      key: "penjualan",
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
    {
      key: "topPelanggan",
      label: "Laporan Top Pelanggan",
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

  // laporan pilihan store
  const { selectedLaporan, setSelectedLaporan } = useLaporanStore(
    (state) => state,
  );

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
      selectedLaporan === "semua"
        ? dataStatistik
        : dataStatistik.filter((item) => item.category === selectedLaporan),
    [selectedLaporan, dataStatistik],
  );

  // handle refetch
  const handleRefresh = async () => {
    await refetch({
      throwOnError: true,
    });
    // await grafikLineRef.current?.refetchActive();
  };

  return {
    windowSize,
    isLoadingStatistik,
    pilihan,
    selectedLaporan,
    setSelectedLaporan,
    filteredStatistik,
    handleRefresh,
    grafikLineRef,

    startDate,
    endDate,
  };
};

export default useStatistikDetail;
