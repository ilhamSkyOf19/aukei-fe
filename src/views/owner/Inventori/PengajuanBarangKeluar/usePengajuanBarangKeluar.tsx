import { useQuery } from "@tanstack/react-query";
import { useFilterSearch } from "../../../../hooks/useFilterSearch";
import { useFilter } from "../../../../hooks/useFilter";
import { useToastAnimation } from "../../../../hooks/useToast";
import { useLocation, useNavigate } from "react-router-dom";
import useHighlight from "../../../../hooks/useHighlight";
import useFilterRangeDate from "../../../../hooks/useFilterRangeDate";
import useSizeWindows from "../../../../hooks/useSizeWindows";
import { useAuthStore } from "../../../../stores/authStore";
import { PengajuanBarangKeluarServices } from "../../../../services/pengajuanBarangkeluar.service";

const usePengajuanBarangKeluar = () => {
  // get pengguna
  const pengguna = useAuthStore((state) => state.pengguna);
  // get window size
  const windowSize = useSizeWindows();
  // navigate
  const navigate = useNavigate();
  // current pathname
  const currentPathname = useLocation().pathname;

  // filter search
  const { search, setSearch: handleSearch } = useFilterSearch("search");

  // highlight
  const {
    handleSetIsHighlight: handleSetIsActiveAksi,
    isHighlight: isActiveAksi,
    wrapperRef,
  } = useHighlight();

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
    isActiveAksi,
    handleSetIsActiveAksi,
    wrapperRef,
    handleRedirectDetail,
    windowSize,
    sort,
    pengguna,
  };
};

export default usePengajuanBarangKeluar;
