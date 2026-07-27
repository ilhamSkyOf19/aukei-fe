import { useQuery } from "@tanstack/react-query";
import { ProdukServices } from "../../../../services/produk.service";
import { useState } from "react";
import useFilterState from "../../../../services/useFilterState";

const usePantauStok = (params: { pilihan: string }) => {
  const { pilihan } = params;

  const {
    limit,
    page,
    search,
    setLimit,
    setPage,
    setSearch,
    setSort,
    sort,
    handleKategori,
    kategori,
  } = useFilterState();

  const { data: dataProduk, isLoading: isLoadingDataProduk } = useQuery({
    queryKey: ["pantauan-stok", { sort, limit, page, search, kategori }],
    queryFn: () =>
      ProdukServices.pantauanStok({
        ...(sort && { sort }),
        ...(limit && { limit }),
        ...(page && { page }),
        ...(search && { search }),
        ...(kategori && { kategori }),
      }),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: pilihan === "pantauanStok",
  });

  //   is existing data
  const isExistDataProduk: boolean =
    !isLoadingDataProduk && !!dataProduk?.data?.data?.length;

  return {
    isExistDataProduk,
    dataProduk,
    isLoadingDataProduk,
    handleSort: setSort,
    handleLimit: setLimit,
    handlePage: setPage,
    handleSearch: setSearch,
    handleKategori,
    sort,
    kategori,
  };
};

export default usePantauStok;
