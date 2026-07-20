import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseId } from "../../../helpers/helpers";
import { useQueries } from "@tanstack/react-query";
import { TempoService } from "../../../services/tempo.service";
import useSizeWindows from "../../../hooks/useSizeWindows";
import { useFilter } from "../../../hooks/useFilter";
import { useFilterSearch } from "../../../hooks/useFilterSearch";

const useKreditDetail = () => {
  // get id from params
  const { id } = useParams<{ id: string }>();

  //   window size
  const windowSize = useSizeWindows();

  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  const validatedId = parseId(id);

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
        queryKey: ["statistik-tempo-pelanggan", validatedId],
        queryFn: () => TempoService.statistikByPelanggan({ id: validatedId! }),
        enabled: !!validatedId,
        retry: false,
        refetchOnWindowFocus: false,
      },

      {
        queryKey: [
          "tempo-detail",
          limit,
          page,
          search,
          status,
          sort,
          validatedId,
        ],
        queryFn: () =>
          TempoService.findAllByPelanggan({
            id: validatedId!,
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
  const handleRedirectDetail = (id: number) => {
    return navigate(`${currentPathname}/tempo/${id}`);
  };

  return {
    windowSize,
    dataStatistikTempo,
    isLoadingStatistikTempo,
    navigate,
    status,
    setStatus,
    handleLimit,
    handlePage,
    dataTempo,
    isExistDataTempo,
    isLoadingDataTempo,
    setSearch,
    setSort,
    sort,
    handleRedirectDetail,
  };
};

export default useKreditDetail;
