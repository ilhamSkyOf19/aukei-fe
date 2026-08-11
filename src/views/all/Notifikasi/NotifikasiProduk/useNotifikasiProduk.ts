import { useQuery } from "@tanstack/react-query";
import { NotifikasiGlobalServices } from "../../../../services/notifikasiGlobal.service";

const useNotifikasiProduk = (params: {
  search?: string;
  sort?: string;
  limit?: string;
  page?: string;
}) => {
  const { limit, page, search, sort } = params;
  // use query
  const {
    data: dataNotifikasiProduk,
    isLoading: isLoadingNotifikasiProduk,
    refetch: refetchNotifikasiProduk,
  } = useQuery({
    queryKey: ["notifikasi-produk", { search, sort, limit, page }],
    queryFn: () =>
      NotifikasiGlobalServices.findNotifikasiProduk({
        ...(search && { search }),
        ...(sort && { sort }),
        ...(limit && { limit: limit }),
        ...(page && { page: page }),
      }),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  //   handle refresh
  const handleRefresh = async () => {
    await refetchNotifikasiProduk({
      throwOnError: true,
    });
  };

  // is existing
  const isExistDataNotifikasiProduk: boolean =
    !isLoadingNotifikasiProduk && !!dataNotifikasiProduk?.data?.data?.length;

  return {
    dataNotifikasiProduk,
    handleRefresh,
    isExistDataNotifikasiProduk,
    isLoadingNotifikasiProduk,
  };
};

export default useNotifikasiProduk;
