import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useQueries } from "@tanstack/react-query";
import useSizeWindows from "../../../hooks/useSizeWindows";
import { useFilter } from "../../../hooks/useFilter";
import { useFilterSearch } from "../../../hooks/useFilterSearch";
import { TransactionServices } from "../../../services/transaction.service";
import { useAuthStore } from "../../../stores/authStore";

const useBookingByPelanggan = () => {
  // get id from params
  const { pelangganId } = useParams<{ pelangganId: string }>();

  //   get pengguna
  const pengguna = useAuthStore((state) => state.pengguna);

  //   window size
  const windowSize = useSizeWindows();

  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  const validatedId = parseId(pelangganId);

  //   filter status
  const { filter: status, setFilter: setStatus } = useFilter({
    paramName: "status",
    allowQuery: ["semua", "paid", "unpaid"],
    defaultValueCustom: "semua",
  });

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

  const data = useQueries({
    queries: [
      {
        queryKey: ["statistik-booking-pelanggan", validatedId],
        queryFn: () =>
          TransactionServices.statistikBookingByPelanggan({ id: validatedId! }),
        enabled: !!validatedId,
        retry: false,
        refetchOnWindowFocus: false,
      },

      {
        queryKey: [
          "booking-by-pelanggan",
          limit,
          page,
          search,
          status,
          sort,
          validatedId,
        ],
        queryFn: () =>
          TransactionServices.findTransaksiBookingByPelanggan({
            pelangganId: validatedId!,
            query: {
              ...(search && { search }),
              ...(page && { page }),
              ...(limit && { limit }),
              ...(status && { status }),
              ...(sort && { sort }),
            },
          }),
        enabled: !!validatedId,
        retry: false,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const [
    {
      data: dataStatistikBookingByPelanggan,
      isLoading: isLoadingStatistikBookingByPelanggan,
    },
    {
      data: dataBookingByPelanggan,
      isLoading: isLoadingDataBookingByPelanggan,
    },
  ] = data;

  // is existing data tempo
  const isExistDataBookingByPelanggan: boolean =
    !isLoadingDataBookingByPelanggan &&
    dataBookingByPelanggan?.data?.data?.transaksi
      ? dataBookingByPelanggan?.data?.data?.transaksi?.length > 0
        ? true
        : false
      : false;

  // handle redirect
  const handleRedirectDetail = (id: number) => {
    return navigate(`${currentPathname}/detail/${id}`);
  };

  return {
    windowSize,
    navigate,
    status,
    setStatus,
    handleLimit,
    handlePage,
    isExistDataBookingByPelanggan,
    setSearch,
    setSort,
    sort,
    handleRedirectDetail,
    dataStatistikBookingByPelanggan,
    isLoadingStatistikBookingByPelanggan,
    dataBookingByPelanggan,
    isLoadingDataBookingByPelanggan,
    pengguna,
  };
};

export default useBookingByPelanggan;
