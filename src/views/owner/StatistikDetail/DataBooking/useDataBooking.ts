import { useQueries, useQuery } from "@tanstack/react-query";
import { StatistikServices } from "../../../../services/statistik.service";
import type { ResponseStatistikKebutuhanBarangBookingType } from "../../../../models/statistik.model";
import { useMemo } from "react";
import useFilterState from "../../../../services/useFilterState";

const useDataBooking = (params: { pilihan: string }) => {
  const { pilihan } = params;

  const {
    handleKategori,
    kategori,
    limit,
    page,
    search,
    setLimit: handleLimit,
    setPage: handlePage,
    setSearch: handleSearch,
    setSort: handleSort,
    sort,
  } = useFilterState();

  const data = useQueries({
    queries: [
      {
        queryKey: [
          "daftar-kebutuhan-barang-booking",
          { sort, limit, page, search, kategori },
        ],
        queryFn: () =>
          StatistikServices.kebutuhanBarangBooking({
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
        enabled: pilihan === "booking",
      },
    ],
  });

  const [
    { data: daftarKebutuhanBarang, isLoading: isLoadingDaftarKebutuhanBarang },
  ] = data;

  //   is existing data
  const isExistDataKebutuhanBarang: boolean =
    !isLoadingDaftarKebutuhanBarang &&
    !!daftarKebutuhanBarang?.data?.data?.length;

  const statistikDaftarKebutuhanBarang: ResponseStatistikKebutuhanBarangBookingType =
    useMemo(() => {
      let totalProdukBooking = 0;
      let totalItemBooking = 0;
      let totalProdukPerluRestock = 0;
      let totalKebutuhanStok = 0;

      for (const item of daftarKebutuhanBarang?.data?.data || []) {
        totalProdukBooking++;
        totalItemBooking += item.stokBooking;
        totalKebutuhanStok += item.totalKebutuhanStok;

        if (item.totalKebutuhanStok > 0) {
          totalProdukPerluRestock++;
        }
      }

      return {
        totalProdukBooking,
        totalItemBooking,
        totalProdukPerluRestock,
        totalKebutuhanStok,
      };
    }, [daftarKebutuhanBarang]);

  return {
    daftarKebutuhanBarang,
    isLoadingDaftarKebutuhanBarang,
    isExistDataKebutuhanBarang,
    handleSort,
    handleLimit,
    handlePage,
    handleSearch,
    handleKategori,
    sort,
    kategori,
    statistikDaftarKebutuhanBarang,
  };
};

export default useDataBooking;
