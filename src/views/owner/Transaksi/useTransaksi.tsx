import { useNavigate } from "react-router-dom";
import { useFilter } from "../../../hooks/useFilter";
import useSizeWindows from "../../../hooks/useSizeWindows";
import { TransactionServices } from "../../../services/transaction.service";
import { useQueries } from "@tanstack/react-query";
import useFilterRangeDate from "../../../hooks/useFilterRangeDate";
import { useFilterSearch } from "../../../hooks/useFilterSearch";
import { StatistikServices } from "../../../services/statistik.service";

const useTransaksi = () => {
  // window size
  const windowSize = useSizeWindows();

  // navigate
  const navigate = useNavigate();

  // filter metode pembayaran
  const { filter: metodePembayaran, setFilter: handleSetMetodePembayaran } =
    useFilter({
      paramName: "metode-pembayaran",
      allowQuery: ["semua", "CASH", "TRANSFER", "QRIS", "TEMPO"],
      defaultValueCustom: "semua",
    });

  // filter status tempo
  const { filter: tempo, setFilter: setTempo } = useFilter({
    paramName: "status-tempo",
    allowQuery: ["semua", "UNPAID", "PAID", "OVERDUE"],
    defaultValueCustom: "semua",
  });

  // filter search
  const { search, setSearch: handleSearch } = useFilterSearch("search");

  // filter page
  const { filter: page, setFilter: setPage } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  // filter limit
  const { filter: limit, setFilter: setLimit } = useFilter({
    paramName: "limit",
    isNumber: true,
  });

  // filter sort
  const { filter: sort, setFilter: setSort } = useFilter({
    paramName: "sort",
    allowQuery: ["asc", "desc"],
    defaultValueCustom: "asc",
  });

  // filter date
  const { endDate, startDate } = useFilterRangeDate();

  // query ringkasan statistik
  const data = useQueries({
    queries: [
      {
        queryKey: ["ringkasan-statistik", startDate, endDate, metodePembayaran],
        queryFn: () =>
          StatistikServices.ringkasanStatistik({
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
            ...(metodePembayaran && {
              metodePembayaran: metodePembayaran.toLowerCase(),
            }),
          }),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !!startDate && !!endDate,
      },
      {
        queryKey: [
          "ringkasan-statistik",
          startDate,
          endDate,
          metodePembayaran,
          tempo,
          page,
          limit,
          search,
          sort,
        ],
        queryFn: () =>
          TransactionServices.findRiwayatTransaksi({
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
            ...(metodePembayaran && {
              metodePembayaran: metodePembayaran.toLowerCase(),
            }),
            ...(tempo && { statusTempo: tempo.toLowerCase() }),
            ...(page && { page }),
            ...(limit && { limit }),
            ...(search && { search }),
            ...(sort && { sort }),
          }),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !!startDate && !!endDate,
      },
    ],
  });

  const [
    { data: ringkasanStatistik, isLoading: isLoadingRingkasanStatistik },
    { data: dataRiwayatTransaksi, isLoading: isLoadingRiwayatTransaksi },
  ] = data;

  // is existing data riwayat transaksi
  const isExistDataRiwayatTransaksi: boolean =
    !isLoadingRiwayatTransaksi && dataRiwayatTransaksi?.data?.data
      ? dataRiwayatTransaksi?.data?.data?.length > 0
        ? true
        : false
      : false;

  // handle detail
  const handleRedirectDetail = () => {
    navigate(`/dashboard/transaksi/statistik`);
  };

  return {
    metodePembayaran,
    handleSetMetodePembayaran,
    setTempo,
    windowSize,
    handleRedirectDetail,
    ringkasanStatistik,
    isLoadingRingkasanStatistik,
    isExistDataRiwayatTransaksi,
    dataRiwayatTransaksi,
    isLoadingRiwayatTransaksi,
    handleSearch,
    setPage,
    setLimit,
    setSort,
  };
};

export default useTransaksi;
