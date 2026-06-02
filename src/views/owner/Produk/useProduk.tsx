import { useEffect, useState } from "react";
import { useFilterSearch } from "../../../hooks/useFilterSearch";
import { useFilter } from "../../../hooks/useFilter";

const useProduk = () => {
  //   is active Cluster inventori
  const [isActiveCluster, setIsActiveCluster] = useState<
    "produk" | "kategori" | "spesifikasi" | ""
  >("");

  // handle is active
  const handleActiveCluster = (
    Cluster: "produk" | "kategori" | "spesifikasi" | "",
  ) => {
    // set state
    setIsActiveCluster(Cluster);

    //  set localstorage
    localStorage.setItem("activeCluster", Cluster);
  };

  useEffect(() => {
    // get localstorage
    const datalocalStorage = localStorage.getItem("activeCluster");

    // check
    if (datalocalStorage) {
      setIsActiveCluster(
        datalocalStorage as "produk" | "kategori" | "spesifikasi",
      );
    } else {
      setIsActiveCluster("produk");
    }
  }, []);

  // search filter
  const { search, setSearch: handleSearch } = useFilterSearch("search");

  // sort filter
  const { filter: sort, setFilter: handleSort } = useFilter({
    paramName: "sort",
    allowQuery: ["asc", "desc"],
  });

  // kategoru filter
  const { filter: kategori, setFilter: handleKategori } = useFilter({
    paramName: "kategori",
  });

  return {
    isActiveCluster,
    handleActiveCluster,
    handleSearch,
    handleSort,
    handleKategori,
  };
};

export default useProduk;
