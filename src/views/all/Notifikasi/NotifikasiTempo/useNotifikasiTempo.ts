import { useQuery } from "@tanstack/react-query";
import { NotifikasiGlobalServices } from "../../../../services/notifikasiGlobal.service";

const useNotifikasiTempo = (params: {
  search?: string;
  sort?: string;
  limit?: string;
  page?: string;
}) => {
  const { limit, page, search, sort } = params;

  // use query
  const {
    data: dataNotifikasiTempo,
    isLoading: isLoadingNotifikasiTempo,
    refetch: refetchNotifikasiTempo,
  } = useQuery({
    queryKey: ["notifikasi-tempo", { search, sort, limit, page }],
    queryFn: () =>
      NotifikasiGlobalServices.findNotifikasiTempo({
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
    await refetchNotifikasiTempo({
      throwOnError: true,
    });
  };

  // is existing
  const isExistDataNotifikasiTempo: boolean =
    !isLoadingNotifikasiTempo && !!dataNotifikasiTempo?.data?.data?.length;

  return {
    dataNotifikasiTempo,
    handleRefresh,
    isExistDataNotifikasiTempo,
    isLoadingNotifikasiTempo,
  };
};

export default useNotifikasiTempo;
