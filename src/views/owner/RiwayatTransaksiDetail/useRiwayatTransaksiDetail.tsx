import { useFilter } from "../../../hooks/useFilter";
import useSizeWindows from "../../../hooks/useSizeWindows";
import { TransactionServices } from "../../../services/transaction.service";
import { useQuery } from "@tanstack/react-query";
import useFilterRangeDate from "../../../hooks/useFilterRangeDate";
import { useFilterSearch } from "../../../hooks/useFilterSearch";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";

const useRiwayatTransaksiDetail = () => {
  // window size
  const windowSize = useSizeWindows();

  // get id from params
  const { pelangganId } = useParams<{ pelangganId: string }>();

  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  // parse
  const validatedId = parseId(pelangganId);

  // filter metode pembayaran
  const { filter: metodePembayaran, setFilter: handleSetMetodePembayaran } =
    useFilter({
      paramName: "metode-pembayaran",
      allowQuery: ["semua", "cash", "transfer", "qris"],
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
  const { data: dataRiwayatTransaksi, isLoading: isLoadingRiwayatTransaksi } =
    useQuery({
      queryKey: [
        "riwayat-transaksi",
        validatedId,
        startDate,
        endDate,
        metodePembayaran,
        page,
        limit,
        search,
        sort,
      ],
      queryFn: () =>
        TransactionServices.findRiwayatTransaksiCompletedNotTempoByPelanggan({
          id: validatedId!,
          query: {
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
            ...(metodePembayaran && {
              metodePembayaran: metodePembayaran.toLowerCase(),
            }),
            ...(page && { page }),
            ...(limit && { limit }),
            ...(search && { search }),
            ...(sort && { sort }),
          },
        }),
      retry: false,
      refetchOnWindowFocus: false,
      enabled: !!startDate && !!endDate && !!validatedId,
    });

  // is existing data riwayat transaksi
  const isExistDataRiwayatTransaksi: boolean =
    !isLoadingRiwayatTransaksi && dataRiwayatTransaksi?.data?.data
      ? true
      : false;

  // data pelanggan
  const pelanggan = dataRiwayatTransaksi?.data?.data?.pelanggan;

  // handle detail
  const handleRedirectDetail = (id: number) => {
    navigate(`${currentPathname}/transaksi/${id}`);
  };

  // handle back
  const handleBack = () => {
    return navigate(currentPathname.split("/").slice(0, -2).join("/"));
  };

  return {
    metodePembayaran,
    handleSetMetodePembayaran,
    windowSize,
    isExistDataRiwayatTransaksi,
    dataRiwayatTransaksi,
    isLoadingRiwayatTransaksi,
    handleSearch,
    setPage,
    setLimit,
    setSort,
    sort,
    pelanggan,
    handleRedirectDetail,
    handleBack,
  };
};

export default useRiwayatTransaksiDetail;
