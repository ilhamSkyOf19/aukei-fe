import { useLocation, useNavigate } from "react-router-dom";
import { useFilter } from "../../../hooks/useFilter";
import { TransactionServices } from "../../../services/transaction.service";
import { useQueries } from "@tanstack/react-query";
import useFilterRangeDate from "../../../hooks/useFilterRangeDate";
import { useFilterSearch } from "../../../hooks/useFilterSearch";
import { useAuthStore } from "../../../stores/authStore";
import { savePreviousPath } from "../../../helpers/previousPath";

const useRiwayatTransaksi = () => {
  // navigate
  const navigate = useNavigate();

  // current pathname
  const { pathname: currentPathname, search: searchParamsTransaksi } =
    useLocation();

  // search params

  // filter metode pembayaran
  const { filter: metodePembayaran, setFilter: handleSetMetodePembayaran } =
    useFilter({
      paramName: "metode-pembayaran",
      allowQuery: ["semua", "cash", "transfer", "qris", "tempo"],
      defaultValueCustom: "semua",
    });

  // get pengguna
  const pengguna = useAuthStore((state) => state.pengguna);

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
    defaultValueCustom: "desc",
  });

  // filter date
  const { endDate, startDate } = useFilterRangeDate();

  // query ringkasan statistik
  const data = useQueries({
    queries: [
      {
        queryKey: [
          "riwayat-transaksi",
          startDate,
          endDate,
          metodePembayaran,
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

  const [{ data: dataRiwayatTransaksi, isLoading: isLoadingRiwayatTransaksi }] =
    data;

  // is existing data riwayat transaksi
  const isExistDataRiwayatTransaksi: boolean =
    !isLoadingRiwayatTransaksi && dataRiwayatTransaksi?.data?.data
      ? dataRiwayatTransaksi?.data?.data?.length > 0
        ? true
        : false
      : false;

  // handle detail
  const handleRedirectDetail = (id: number) => {
    savePreviousPath(currentPathname, searchParamsTransaksi);

    navigate(`/dashboard/riwayat-transaksi/${id}`);
  };

  return {
    metodePembayaran,
    handleSetMetodePembayaran,
    handleRedirectDetail,
    isExistDataRiwayatTransaksi,
    dataRiwayatTransaksi,
    isLoadingRiwayatTransaksi,
    handleSearch,
    setPage,
    setLimit,
    pengguna,
    setSort,
    sort,
  };
};

export default useRiwayatTransaksi;
