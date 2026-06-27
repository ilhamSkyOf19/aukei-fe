import { useQuery } from "@tanstack/react-query";
import { useFilterSearch } from "../../../../hooks/useFilterSearch";
import { useFilter } from "../../../../hooks/useFilter";
import { ProdukServices } from "../../../../services/produk.service";
import { useSearchParams } from "react-router-dom";

const useShowProduk = (params: { pelangganId?: number }) => {
  const { pelangganId } = params;

  //   get current page form search params
  const [searchParams] = useSearchParams();

  const currentPage = searchParams.get("page") ?? "";

  // search filter
  const { search, setSearch } = useFilterSearch("search", "page");

  // page filter
  const { filter: page, setFilter } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  //   handle page
  const handlePage = (val: "prev" | "next") => {
    if (val === "next") {
      if (Number(currentPage) > 1) {
        setFilter((Number(currentPage) + 1).toString());
      } else {
        return;
      }
    } else if (val === "prev") {
      if (Number(currentPage) <= 1) {
        return;
      }
      setFilter((Number(currentPage) - 1).toString());
    }
  };

  // kategori filter
  const { filter: kategori, setFilter: handleKategori } = useFilter({
    paramName: "kategori",
    isNumber: true,
  });

  // query
  const { data: dataProduk, isLoading: isLoadingProduk } = useQuery({
    queryKey: ["produk", search, page, kategori],
    queryFn: () =>
      ProdukServices.findAllForKasir({
        ...(search && { search }),
        ...(page && { page }),
        ...(kategori && { kategori }),
        ...(pelangganId && { pelangganId }),
      }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  //   is existing produk
  // is exist data
  const isExistDataProduk: boolean =
    !isLoadingProduk && dataProduk?.data
      ? dataProduk?.data?.data?.length > 0
        ? true
        : false
      : false;

  return {
    dataProduk,
    isLoadingProduk,
    setSearch,
    handlePage,
    handleKategori,
    isExistDataProduk,
  };
};

export default useShowProduk;
