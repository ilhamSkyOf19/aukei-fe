import { useQuery } from "@tanstack/react-query";
import { ProdukServices } from "../services/produk.service";

const useDataProdukForChoose = (params: {
  search: string;
  kategori?: number;
}) => {
  const { search, kategori } = params;

  const { data: dataProdukForChoose, isLoading: isLoadingProdukForChoose } =
    useQuery({
      queryKey: ["produk-for-choose", search, kategori],
      queryFn: () =>
        ProdukServices.findAllForChoose({
          search: search.trim(),
          kategori: kategori?.toString(),
        }),
      retry: false,
      refetchOnWindowFocus: false,
    });

  return { dataProdukForChoose, isLoadingProdukForChoose };
};

export default useDataProdukForChoose;
