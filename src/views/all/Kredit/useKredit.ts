import { useQueries } from "@tanstack/react-query";
import { useFilter } from "../../../hooks/useFilter";
import { useFilterSearch } from "../../../hooks/useFilterSearch";
import useSizeWindows from "../../../hooks/useSizeWindows";
import { TempoService } from "../../../services/tempo.service";
import { useNavigate } from "react-router-dom";

const useKredit = () => {
  // window size
  const windowSize = useSizeWindows();

  // navigate
  const navigate = useNavigate();

  // filter sort
  const { filter: sort, setFilter: setSort } = useFilter({
    paramName: "sort",
    allowQuery: ["asc", "desc"],
    defaultValueCustom: "desc",
  });

  // filter status
  const { filter: status, setFilter: setStatus } = useFilter({
    paramName: "status",
    allowQuery: ["unpaid", "paid", "overdue", "partial", "semua"],
    defaultValueCustom: "semua",
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
        queryKey: ["statistik-tempo"],
        queryFn: () => TempoService.statistik(),
        retry: false,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["tempo", limit, page, search, status, sort],
        queryFn: () =>
          TempoService.findAll({
            ...(search && { search }),
            ...(page && { page }),
            ...(limit && { limit }),
            ...(status && { status }),
            ...(sort && { sort }),
          }),
        retry: false,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const [
    { data: dataStatistikTempo, isLoading: isLoadingStatistikTempo },
    { data: dataTempo, isLoading: isLoadingDataTempo },
  ] = data;

  // is existing data tempo
  const isExistDataTempo: boolean =
    !isLoadingDataTempo && dataTempo?.data?.data
      ? dataTempo?.data?.data?.length > 0
        ? true
        : false
      : false;

  // handle redirect
  const handelRedirectDetail = (id: number) => {
    return navigate(`/dashboard/kredit/detail/${id}`);
  };

  return {
    windowSize,
    sort,
    setSort,
    setSearch,
    status,
    setStatus,
    handleLimit,
    handlePage,
    dataTempo,
    dataStatistikTempo,
    isLoadingDataTempo,
    isLoadingStatistikTempo,
    isExistDataTempo,
    handelRedirectDetail,
  };
};

export default useKredit;
