import { useQuery } from "@tanstack/react-query";
import { useFilterSearch } from "../../../../hooks/useFilterSearch";
import { useSearchParams } from "react-router-dom";
import { useFilter } from "../../../../hooks/useFilter";
import { PelangganServices } from "../../../../services/pelanggan.service";
import { handlePagination } from "../../../../helpers/helpers";

const useDataPelanggan = () => {
  // set params
  const [searchParams, setSearchParams] = useSearchParams();

  //   is choose pelanggan
  const isChoosePelanggan = Number(searchParams.get("pelangganId") ?? 0);

  const handleSetIsChoosePelanggan = (value: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("pelangganId", value.toString());
      return params;
    });
  };

  //   use search filter
  const { search, setSearch: handleSearch } = useFilterSearch("search", "page");

  //   use page filter
  const { filter: page, setFilter: handlePage } = useFilter({
    paramName: "page",
    isNumber: true,
    defaultValueCustom: "1",
  });

  //   query pelanggan
  const { data: dataPelanggan, isLoading: isLoadingPelanggan } = useQuery({
    queryKey: ["pelanggan", search, page],
    queryFn: () =>
      PelangganServices.findAllForKeranjang({
        ...(search && { search }),
        ...(page && { page }),
      }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  //   is existing produk
  const isExistDataProduk: boolean =
    !isLoadingPelanggan && dataPelanggan?.data
      ? dataPelanggan?.data?.data?.length > 0
        ? true
        : false
      : false;

  // handle pagination
  const { goTo, isNext, isPrev, pages } = handlePagination({
    setPage: handlePage,
    currentPage: dataPelanggan?.data?.meta?.currentPage,
    totalPage: dataPelanggan?.data?.meta?.totalPage,
  });

  return {
    isChoosePelanggan,
    dataPelanggan,
    isLoadingPelanggan,
    handleSearch,
    isExistDataProduk,
    handleSetIsChoosePelanggan,
    goTo,
    isNext,
    isPrev,
    pages,
  };
};

export default useDataPelanggan;
