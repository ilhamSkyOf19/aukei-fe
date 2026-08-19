import { useQuery } from "@tanstack/react-query";
import { KategoriProdukServices } from "../services/kategoriProduk.service";

const useKategoriForChoose = () => {
  const { data: dataKategori, isLoading: isLoadingKategori } = useQuery({
    queryKey: ["kategori"],
    queryFn: () => KategoriProdukServices.findAllForChoose(),
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    dataKategori,
    isLoadingKategori,
  };
};

export default useKategoriForChoose;
