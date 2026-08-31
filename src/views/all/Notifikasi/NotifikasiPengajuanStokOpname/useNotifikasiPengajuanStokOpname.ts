import { useQuery } from "@tanstack/react-query";
import { NotifikasiGlobalServices } from "../../../../services/notifikasiGlobal.service";

const useNotifikasiPengajuanStockOpname = (params: {
  search?: string;
  sort?: string;
  limit?: string;
  page?: string;
}) => {
  const { limit, page, search, sort } = params;
  // use query
  const {
    data: dataNotifikasiStockOpname,
    isLoading: isLoadingNotifikasiStockOpname,
    refetch: refetchNotifikasiStockOpname,
  } = useQuery({
    queryKey: ["notifikasi-stock-opname", { search, sort, limit, page }],
    queryFn: () =>
      NotifikasiGlobalServices.findNotifikasiStockOpname({
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
    await refetchNotifikasiStockOpname({
      throwOnError: true,
    });
  };

  // is existing
  const isExistDataNotifikasiStockOpname: boolean =
    !isLoadingNotifikasiStockOpname &&
    !!dataNotifikasiStockOpname?.data?.data?.length;

  return {
    dataNotifikasiStockOpname,
    handleRefresh,
    isExistDataNotifikasiStockOpname,
    isLoadingNotifikasiStockOpname,
  };
};

export default useNotifikasiPengajuanStockOpname;
