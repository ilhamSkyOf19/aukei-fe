import { useState } from "react";
import useDataPelanggan from "../../../hooks/useDataPelanggan";
import { useFilterSearch } from "../../../hooks/useFilterSearch";

const useKeranjang = () => {
  //   state choose pelanggan
  const [isChoosePelanggan, setIsChoosePelanggan] = useState<number | null>(
    null,
  );

  //   use search filter
  const { search, setSearch: handleSearch } = useFilterSearch("search", "page");

  //   query pelanggan
  const { dataPelanggan, isLoadingPelanggan } = useDataPelanggan({ search });

  return {
    isChoosePelanggan,
    setIsChoosePelanggan,
    dataPelanggan,
    isLoadingPelanggan,
    handleSearch,
  };
};

export default useKeranjang;
