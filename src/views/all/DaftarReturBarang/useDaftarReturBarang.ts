import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useToastAnimation } from "../../../hooks/useToast";
import { useFilterSearch } from "../../../hooks/useFilterSearch";
import { useFilter } from "../../../hooks/useFilter";
import { useQuery } from "@tanstack/react-query";
import { parseId } from "../../../helpers/helpers";
import { ReturBarangServices } from "../../../services/returBarang.service";

const useDaftarReturBarang = () => {
  const navigate = useNavigate();

  // get current pathname
  const currentPathname = useLocation().pathname;

  // handle toast
  const { toast } = useToastAnimation();

  // get transaction id from params
  const { transactionId } = useParams<{ transactionId: string }>();

  // parse id
  const validatedTransactionId = parseId(transactionId);

  // filter search
  const { search, setSearch: handleSearch } = useFilterSearch("search");

  // filter page
  const { filter: page, setFilter: handlePage } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  // filter sort
  const { filter: sort, setFilter: handleSort } = useFilter({
    paramName: "sort",
    allowQuery: ["asc", "desc"],
    defaultValueCustom: "desc",
  });

  // filter limit
  const { filter: limit, setFilter: handleLimit } = useFilter({
    paramName: "limit",
    isNumber: true,
  });

  // filter status
  const { filter: status, setFilter: handleStatus } = useFilter({
    paramName: "status",
    allowQuery: ["unpaid", "paid", "overdue", "partial", "semua"],
    defaultValueCustom: "semua",
  });

  // use query
  const { data: daftarReturBarang, isLoading: isLoadingReturBarang } = useQuery(
    {
      queryKey: [
        "daftar-retur-barang",
        page,
        sort,
        limit,
        status,
        search,
        validatedTransactionId,
      ],
      queryFn: () =>
        ReturBarangServices.findAll({
          transactionId: validatedTransactionId!,
          query: {
            ...(page && { page }),
            ...(limit && { limit }),
            ...(sort && { sort }),
            ...(status && { status }),
            ...(search && { search }),
          },
        }),
      enabled: !!validatedTransactionId,
      refetchOnWindowFocus: false,
      retry: false,
    },
  );

  // is existing
  const isExistingDaftarReturBarang: boolean =
    !!daftarReturBarang && !!daftarReturBarang?.data?.data?.length;

  const handleBack = () => {
    return navigate(currentPathname.split("/").slice(0, -1).join("/"));
  };

  // handle redirect detail
  const handleRedirectDetail = (id: number) => {
    return navigate(`${currentPathname}/detail/${id}`);
  };

  return {
    toast,
    handleBack,
    handleSearch,
    handlePage,
    handleSort,
    sort,
    handleLimit,
    handleStatus,
    status,
    daftarReturBarang,
    isLoadingReturBarang,
    isExistingDaftarReturBarang,
    handleRedirectDetail,
  };
};

export default useDaftarReturBarang;
