import { useQuery } from "@tanstack/react-query";
import { KategoriProdukServices } from "../services/kategoriProduk.service";

type Props = {
  enabled?: boolean;
};
const useKategoriForChoose = ({ enabled }: Props) => {
  const { data: dataKategori, isLoading: isLoadingKategori } = useQuery({
    queryKey: ["kategori"],
    queryFn: () => KategoriProdukServices.findAllForChoose(),
    enabled,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    dataKategori,
    isLoadingKategori,
  };
};

export default useKategoriForChoose;
