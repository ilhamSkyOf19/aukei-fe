import { useQuery } from "@tanstack/react-query";
import { useFilterSearch } from "../../../../hooks/useFilterSearch";
import { useFilter } from "../../../../hooks/useFilter";
import { useToastAnimation } from "../../../../hooks/useToast";
import { useLocation, useNavigate } from "react-router-dom";
import useFilterRangeDate from "../../../../hooks/useFilterRangeDate";
import { PengajuanBarangKeluarServices } from "../../../../services/pengajuanBarangkeluar.service";

const usePengajuanBarangKeluar = () => {
  // navigate
  const navigate = useNavigate();
  // current pathname
  const currentPathname = useLocation().pathname;

  // filter search
  const { search, setSearch: handleSearch } = useFilterSearch("search");

  // filter sort
  const { filter: sort, setFilter: handleSort } = useFilter({
    paramName: "sort",
    allowQuery: ["asc", "desc"],
  });

  // filter limit
  const { filter: limit, setFilter: handleLimit } = useFilter({
    paramName: "limit",
    isNumber: true,
  });

  // filter page
  const { filter: page, setFilter: handlePage } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  // filter range date
  const { endDate, startDate } = useFilterRangeDate();

  //   toast
  const { toast } = useToastAnimation();

  // query
  const {
    data: dataPengajuanBarangKeluar,
    isLoading: isLoadingPengajuanBarangKeluar,
  } = useQuery({
    queryKey: [
      "pengajuan-barang-keluar",
      search,
      sort,
      limit,
      page,
      startDate,
      endDate,
    ],
    queryFn: () =>
      PengajuanBarangKeluarServices.allWithAuthor({
        ...(search && { search }),
        ...(sort && { sort }),
        ...(limit && { limit }),
        ...(page && { page }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  //   is exist data
  const isExistDataPengajuanBarangKeluar: boolean =
    !isLoadingPengajuanBarangKeluar && dataPengajuanBarangKeluar?.data?.data
      ? dataPengajuanBarangKeluar?.data?.data?.length > 0
        ? true
        : false
      : false;

  // handle redirect detail
  const handleRedirectDetail = (id: number) => {
    navigate(`${currentPathname}/pengajuan-barang-keluar/${id}`);
  };

  return {
    dataPengajuanBarangKeluar,
    isLoadingPengajuanBarangKeluar,
    handleSearch,
    handleSort,
    handleLimit,
    handlePage,
    toast,
    isExistDataPengajuanBarangKeluar,
    handleRedirectDetail,
    sort,
  };
};

export default usePengajuanBarangKeluar;
