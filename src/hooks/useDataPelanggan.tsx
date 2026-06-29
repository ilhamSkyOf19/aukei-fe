import { useQuery } from "@tanstack/react-query";
import { PelangganServices } from "../services/pelanggan.service";

const useDataPelanggan = (params: { search?: string; page?: string }) => {
  const { search, page } = params;

  const { data: dataPelanggan, isLoading: isLoadingPelanggan } = useQuery({
    queryKey: ["pelanggan", search, page],
    queryFn: () =>
      PelangganServices.findAll({
        ...(search && { search }),
        ...(page && { page }),
      }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { dataPelanggan, isLoadingPelanggan };
};

export default useDataPelanggan;
