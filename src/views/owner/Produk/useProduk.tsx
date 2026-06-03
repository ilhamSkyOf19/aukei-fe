import { useEffect, useState } from "react";
import { useFilterSearch } from "../../../hooks/useFilterSearch";
import { useFilter } from "../../../hooks/useFilter";
import { useQuery } from "@tanstack/react-query";
import { ProdukServices } from "../../../services/produk.service";
import { useLocation, useNavigate } from "react-router-dom";

const useProduk = () => {
  // current pathname
  const currentPathname = useLocation().pathname;

  // navigate
  const navigate = useNavigate();

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
    localStorage.setItem("active-cluster", Cluster);
  };

  useEffect(() => {
    // get localstorage
    const datalocalStorage = localStorage.getItem("active-cluster");

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

  // kategori filter
  const { filter: kategori, setFilter: handleKategori } = useFilter({
    paramName: "kategori",
  });

  // page filter
  const { filter: page, setFilter: handlePage } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  // limit filter
  const { filter: limit, setFilter: handleLimit } = useFilter({
    paramName: "limit",
    isNumber: true,
  });

  // use query
  const { data: dataProduk, isLoading: isLoadingProduk } = useQuery({
    queryKey: ["produk", { search, sort, kategori, limit, page }],
    queryFn: () =>
      ProdukServices.findAll({
        ...(search && { search }),
        ...(sort && { sort }),
        ...(kategori && { kategori }),
        ...(limit && { limit }),
        ...(page && { page }),
      }),
    refetchOnWindowFocus: false,
    retry: false,
  });

  // is exist data
  const isExistDataProduk =
    !isLoadingProduk && dataProduk?.data?.data
      ? dataProduk?.data?.data?.length > 0
        ? true
        : false
      : false;

  // handle redirect detail
  const handleRedirectDetail = (id: number) => {
    navigate(`${currentPathname}/${id}`);
  };

  // handle redirect tambah
  const handleRedirectTambah = () => {
    navigate(`${currentPathname}/tambah`);
  };

  return {
    handleRedirectDetail,
    handleRedirectTambah,
    isActiveCluster,
    handleActiveCluster,
    handleSearch,
    handleSort,
    handleKategori,
    handleLimit,
    handlePage,
    dataProduk,
    isLoadingProduk,
    isExistDataProduk,
  };
};

export default useProduk;
