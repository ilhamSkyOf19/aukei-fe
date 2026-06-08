import { useQuery } from "@tanstack/react-query";
import { ProdukServices } from "../services/produk.service";

const useDataProdukForChoose = (params: { search: string }) => {
  const { search } = params;

  const { data: dataProdukForChoose, isLoading: isLoadingProdukForChoose } =
    useQuery({
      queryKey: ["produk-for-choose", search],
      queryFn: () =>
        ProdukServices.findAllForChoose({
          search,
        }),
      enabled: search !== "",
      retry: false,
      refetchOnWindowFocus: false,
    });

  return { dataProdukForChoose, isLoadingProdukForChoose };
};

export default useDataProdukForChoose;
