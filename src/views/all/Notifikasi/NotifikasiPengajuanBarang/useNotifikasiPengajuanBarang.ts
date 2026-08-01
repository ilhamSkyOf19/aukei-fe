import { useQuery } from "@tanstack/react-query";
import { NotifikasiGlobalServices } from "../../../../services/notifikasiGlobal.service";

const useNotifikasiPengajuanBarang = (params: {
  search?: string;
  sort?: string;
  limit?: string;
  page?: string;
}) => {
  const { limit, page, search, sort } = params;
  // use query
  const {
    data: dataNotifikasiPengajuanBarang,
    isLoading: isLoadingNotifikasiPengajuanBarang,
    refetch: refetchNotifikasiPengajuanBarang,
  } = useQuery({
    queryKey: ["notifikasi-pengajuan-barang", { search, sort, limit, page }],
    queryFn: () =>
      NotifikasiGlobalServices.findNotifikasiPengajuanBarang({
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
    await refetchNotifikasiPengajuanBarang({
      throwOnError: true,
    });
  };

  // is existing
  const isExistDataNotifikasiPengajuanBarang: boolean =
    !isLoadingNotifikasiPengajuanBarang &&
    !!dataNotifikasiPengajuanBarang?.data?.data?.length;

  return {
    dataNotifikasiPengajuanBarang,
    handleRefresh,
    isExistDataNotifikasiPengajuanBarang,
  };
};

export default useNotifikasiPengajuanBarang;
