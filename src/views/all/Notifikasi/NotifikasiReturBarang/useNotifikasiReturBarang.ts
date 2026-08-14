import { useQuery } from "@tanstack/react-query";
import { NotifikasiGlobalServices } from "../../../../services/notifikasiGlobal.service";

const useNotifikasiReturBarang = (params: {
  search?: string;
  sort?: string;
  limit?: string;
  page?: string;
}) => {
  const { limit, page, search, sort } = params;
  // use query
  const {
    data: dataNotifikasiReturBarang,
    isLoading: isLoadingNotifikasiReturBarang,
    refetch: refetchNotifikasiReturBarang,
  } = useQuery({
    queryKey: ["notifikasi-retur-barang", { search, sort, limit, page }],
    queryFn: () =>
      NotifikasiGlobalServices.findNotifikasiReturn({
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
    await refetchNotifikasiReturBarang({
      throwOnError: true,
    });
  };

  // is existing
  const isExistDataNotifikasiReturBarang: boolean =
    !isLoadingNotifikasiReturBarang &&
    !!dataNotifikasiReturBarang?.data?.data?.length;

  return {
    dataNotifikasiReturBarang,
    handleRefresh,
    isExistDataNotifikasiReturBarang,
    isLoadingNotifikasiReturBarang,
  };
};

export default useNotifikasiReturBarang;
