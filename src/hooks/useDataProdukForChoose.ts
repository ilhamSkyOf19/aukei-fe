import { useQuery } from "@tanstack/react-query";
import { ProdukServices } from "../services/produk.service";

const useDataProdukForChoose = (params: {
  search: string;
  kategori?: number;
}) => {
  const { search, kategori } = params;

  const searchValue = search.trim();

  const { data: dataProdukForChoose, isLoading: isLoadingProdukForChoose } =
    useQuery({
      queryKey: ["produk-for-choose", searchValue, kategori],
      queryFn: () =>
        ProdukServices.findAllForChoose({
          search: searchValue,
          kategori: kategori?.toString(),
        }),
      enabled: !!searchValue,
      retry: false,
      refetchOnWindowFocus: false,
    });

  return {
    dataProdukForChoose,
    isLoadingProdukForChoose,
  };
};

export default useDataProdukForChoose;
