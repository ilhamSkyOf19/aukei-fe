import { useQueries } from "@tanstack/react-query";
import { useFilter } from "../../../hooks/useFilter";
import { useFilterSearch } from "../../../hooks/useFilterSearch";
import useSizeWindows from "../../../hooks/useSizeWindows";
import { useAuthStore } from "../../../stores/authStore";
import { TransactionServices } from "../../../services/transaction.service";
import { useLocation, useNavigate } from "react-router-dom";
import { ROLE_INTERNAL_TYPE } from "../../../types/constant.type";

const useBooking = () => {
  // window size
  const windowSize = useSizeWindows();

  // get pengguna
  const pengguna = useAuthStore((state) => state.pengguna);

  //   navigate
  const navigate = useNavigate();

  //   current pathname
  const currentPathname = useLocation().pathname;

  // filter sort
  const { filter: sort, setFilter: setSort } = useFilter({
    paramName: "sort",
    allowQuery: ["asc", "desc"],
    defaultValueCustom: "desc",
  });

  // page filter
  const { filter: page, setFilter: handlePage } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  // limit filter
  const { filter: limit, setFilter: handleLimit } = useFilter({
    paramName: "limit",
    isNumber: true,
  });

  // filter search
  const { search, setSearch } = useFilterSearch("search");

  // use query
  const data = useQueries({
    queries: [
      {
        queryKey: ["statistik-booking"],
        queryFn: () => TransactionServices.statistikBooking(),
        enabled: pengguna?.role === ROLE_INTERNAL_TYPE.OWNER,
        retry: false,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: [
          "transaksi-booking",
          {
            limit,
            page,
            search,
            sort,
          },
        ],
        queryFn: () =>
          TransactionServices.findTransaksiBookingWithPelanggan({
            query: {
              ...(search && { search }),
              ...(page && { page }),
              ...(limit && { limit }),
              ...(sort && { sort }),
            },
          }),
        retry: false,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const [
    { data: dataStatistikBooking, isLoading: isLoadingStatistikBooking },
    { data: dataTransaksiBooking, isLoading: isLoadingDataTransaksiBooking },
  ] = data;

  // is existing data tempo
  const isExistDataTransaksiBooking: boolean =
    !isLoadingDataTransaksiBooking && dataTransaksiBooking?.data?.data
      ? dataTransaksiBooking?.data?.data?.length > 0
        ? true
        : false
      : false;

  //   handle redirect
  const handleRedirect = (pelangganId: number) => {
    return navigate(`${currentPathname}/pelanggan/${pelangganId}`);
  };

  return {
    windowSize,
    sort,
    setSort,
    setSearch,
    handleLimit,
    handlePage,
    isExistDataTransaksiBooking,
    pengguna,
    dataTransaksiBooking,
    isLoadingDataTransaksiBooking,
    handleRedirect,
    dataStatistikBooking,
    isLoadingStatistikBooking,
  };
};

export default useBooking;
