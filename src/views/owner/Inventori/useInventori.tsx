import { useEffect, useState } from "react";
import { useResetParams } from "../../../hooks/useResetParams";
import { useSearchParams } from "react-router-dom";

const useInventori = () => {
  //   is active Cluster inventori
  const [isActiveCluster, setIsActiveCluster] = useState<
    "barangMasuk" | "barangKeluar" | ""
  >("");

  const [_searchParams, setSearchParams] = useSearchParams();

  // handle is active
  const handleActiveCluster = (
    Cluster: "barangMasuk" | "barangKeluar" | "",
  ) => {
    //
    useResetParams(setSearchParams);

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
        datalocalStorage as "barangMasuk" | "barangKeluar" | "",
      );
    } else {
      setIsActiveCluster("barangMasuk");
    }
  }, []);

  //   use query

  return { isActiveCluster, handleActiveCluster };
};

export default useInventori;
