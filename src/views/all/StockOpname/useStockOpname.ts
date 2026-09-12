import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useFilter } from "../../../hooks/useFilter";
import useFilterRangeDate from "../../../hooks/useFilterRangeDate";
import { useToastAnimation } from "../../../hooks/useToast";
import { useFilterSearch } from "../../../hooks/useFilterSearch";
import { StockOpnameServices } from "../../../services/stockOpname.service";
import useSizeWindows from "../../../hooks/useSizeWindows";
import useModal from "../../../hooks/useModal";
import { useAuthStore } from "../../../stores/authStore";
import { PengajuanStockOpnameServices } from "../../../services/pengajuanStockOpname.service";
import { ROLE_INTERNAL_TYPE } from "../../../types/constant.type";

type ClusterType = "stockOpname" | "pengajuanStockOpname" | "";

const useStockOpname = (params: { fromPengajuan?: boolean }) => {
  const { fromPengajuan } = params;

  const [searchParams, setSearchParams] = useSearchParams();

  const windowSize = useSizeWindows();

  const navigate = useNavigate();

  const pengguna = useAuthStore((state) => state.pengguna);

  // current pathname
  const currentPathname = useLocation().pathname;
  const cluster = searchParams.get("cluster");

  useEffect(() => {
    if (!fromPengajuan) return;

    if (cluster === "pengajuanStockOpname") return;

    setSearchParams(
      (previousParams) => {
        const params = new URLSearchParams(previousParams);

        params.set("cluster", "pengajuanStockOpname");

        return params;
      },
      { replace: true },
    );
  }, [cluster, fromPengajuan, setSearchParams]);

  // ============================================
  // ACTIVE CLUSTER
  // ============================================

  const activeCluster =
    (searchParams.get("cluster") as ClusterType | null) ?? "";

  // ============================================
  // DEFAULT DATE
  // ============================================

  const getDefaultDate = () => {
    const today = format(new Date(), "yyyy-MM-dd");

    return {
      defaultStartDate: today,
      defaultEndDate: today,
    };
  };

  // ============================================
  // HANDLE ACTIVE CLUSTER
  // ============================================

  const handleActiveCluster = (cluster: ClusterType) => {
    const { defaultStartDate, defaultEndDate } = getDefaultDate();

    // SATU KALI setSearchParams
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      params.set("cluster", cluster);
      params.set("search", "");
      params.set("sort", "desc");
      params.set("limit", "8");
      params.set("page", "1");
      params.set("start-date", defaultStartDate);
      params.set("end-date", defaultEndDate);

      return params;
    });

    // local storage
    if (cluster) {
      localStorage.setItem("active-cluster", cluster);
    } else {
      localStorage.removeItem("active-cluster");
    }
  };

  // use modal
  const {
    modalRef: modalFormulirStockOpnameRef,
    handleCloseModal: handleCloseModalFormulirStockOpname,
    handleShowModal: handleShowModalFormulirStockOpname,
  } = useModal();

  // ============================================
  // INITIAL CLUSTER & DATE
  // ============================================

  useEffect(() => {
    const { defaultStartDate, defaultEndDate } = getDefaultDate();

    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);

        let isChanged = false;

        // cluster
        if (!params.get("cluster")) {
          params.set(
            "cluster",
            pengguna?.role === ROLE_INTERNAL_TYPE.OWNER
              ? "stockOpname"
              : "pengajuanStockOpname",
          );

          isChanged = true;
        }

        // start date
        if (!params.get("start-date")) {
          params.set("start-date", defaultStartDate);

          isChanged = true;
        }

        // end date
        if (!params.get("end-date")) {
          params.set("end-date", defaultEndDate);

          isChanged = true;
        }

        if (!isChanged) {
          return prev;
        }

        return params;
      },
      {
        replace: true,
      },
    );
  }, [setSearchParams]);

  // ============================================
  // FILTER SORT
  // ============================================

  const { filter: sort, setFilter: handleSort } = useFilter({
    paramName: "sort",
    allowQuery: ["asc", "desc"],
  });

  // ============================================
  // FILTER LIMIT
  // ============================================

  const { filter: limit, setFilter: handleLimit } = useFilter({
    paramName: "limit",
    isNumber: true,
  });

  // ============================================
  // FILTER PAGE
  // ============================================

  const { filter: page, setFilter: handlePage } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  // ============================================
  // FILTER SEARCH
  // ============================================

  const { search, setSearch: handleSearch } = useFilterSearch("search");

  // ============================================
  // FILTER RANGE DATE
  // ============================================

  const { endDate, startDate } = useFilterRangeDate();

  // ============================================
  // TOAST
  // ============================================

  const { toast } = useToastAnimation();

  // ============================================
  // QUERY READY
  // ============================================

  const isQueryReady = Boolean(startDate) && Boolean(endDate);

  // ============================================
  // QUERY
  // ============================================

  const {
    data: dataStockOpname,
    isLoading: isLoadingStockOpname,
    isFetching: isFetchingStockOpname,
  } = useQuery({
    queryKey: [
      fromPengajuan ? "stock-opname-by-author" : "stock-opname",
      search,
      sort,
      limit,
      page,
      startDate,
      endDate,
    ],

    queryFn: () => {
      if (fromPengajuan) {
        return StockOpnameServices.allByAuthor({
          ...(search && { search }),
          ...(sort && { sort }),
          ...(limit && { limit }),
          ...(page && { page }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        });
      } else {
        return StockOpnameServices.all({
          ...(search && { search }),
          ...(sort && { sort }),
          ...(limit && { limit }),
          ...(page && { page }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        });
      }
    },

    enabled: isQueryReady,

    retry: false,
    refetchOnWindowFocus: false,
  });

  // ============================================
  // QUERY
  // ============================================

  const {
    data: dataPengajuanStockOpname,
    isLoading: isLoadingPengajuanStockOpname,
    isFetching: isFetchingPengajuanStockOpname,
  } = useQuery({
    queryKey: [search, sort, limit, page, startDate, endDate],

    queryFn: () => {
      return PengajuanStockOpnameServices.findAll({
        ...(search && { search }),
        ...(sort && { sort }),
        ...(limit && { limit }),
        ...(page && { page }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });
    },

    enabled:
      pengguna?.role === ROLE_INTERNAL_TYPE.OWNER &&
      cluster === "pengajuanStockOpname",

    retry: false,
    refetchOnWindowFocus: false,
  });

  // handle redirect
  const handleRedirectDetail = (id: number) => {
    return navigate(`${currentPathname}/${id}`);
  };

  return {
    activeCluster,
    handleActiveCluster,

    toast,

    dataStockOpname,

    dataPengajuanStockOpname,

    isLoadingStockOpname:
      isLoadingStockOpname ||
      isFetchingStockOpname ||
      isLoadingPengajuanStockOpname ||
      isFetchingPengajuanStockOpname,

    windowSize,

    handleLimit,
    handlePage,
    handleSearch,
    handleSort,

    sort,

    modalFormulirStockOpnameRef,
    handleCloseModalFormulirStockOpname,
    handleShowModalFormulirStockOpname,

    handleRedirectDetail,

    pengguna,
  };
};

export default useStockOpname;
