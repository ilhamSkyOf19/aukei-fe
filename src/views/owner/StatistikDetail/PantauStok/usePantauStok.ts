import { useQueries } from "@tanstack/react-query";
import { ProdukServices } from "../../../../services/produk.service";
import useFilterState from "../../../../services/useFilterState";
import { StatistikServices } from "../../../../services/statistik.service";
import useDownloadLaporanStok from "../../../../hooks/useDownloadLaporanStok";

const usePantauStok = (params: {
  pilihan: string;
  handleSetToast: (value: string) => void;
  handleSetAlert: (value: string) => void;
}) => {
  const { pilihan, handleSetAlert, handleSetToast } = params;

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

  const data = useQueries({
    queries: [
      {
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
      },

      {
        queryKey: ["statistik-pantauan-stok", { kategori }],
        queryFn: () =>
          StatistikServices.statistikPantauanStok({
            ...(kategori && { kategori }),
          }),
        staleTime: Infinity,
        gcTime: Infinity,
        retry: false,
        refetchOnWindowFocus: false,
        enabled: pilihan === "pantauanStok",
      },
    ],
  });

  const [
    {
      data: dataProduk,
      isLoading: isLoadingDataProduk,
      refetch: refetchDataProduk,
      isRefetching: isRefetchingDataProduk,
    },
    {
      data: dataStatistik,
      isLoading: isLoadingStatistik,
      refetch: refetchStatistik,
      isRefetching: isRefetchingStatistik,
    },
  ] = data;

  //   is existing data
  const isExistDataProduk: boolean =
    !isLoadingDataProduk && !!dataProduk?.data?.data?.length;

  // download laporan stok
  const { handleDownloadLaporanStokPdf, isLoadingDownloadLaporanStokPdf } =
    useDownloadLaporanStok({ handleSetAlert, handleSetToast });

  // handle refetch
  const handleRefresh = async () => {
    await refetchDataProduk();
    await refetchStatistik();
  };

  // is loading
  const isLoading =
    isLoadingDataProduk ||
    isLoadingStatistik ||
    isRefetchingDataProduk ||
    isRefetchingStatistik;

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
    dataStatistik,
    isLoadingStatistik,

    handleDownloadLaporanStokPdf,
    isLoadingDownloadLaporanStokPdf,

    handleRefresh,

    isLoading,
  };
};

export default usePantauStok;
