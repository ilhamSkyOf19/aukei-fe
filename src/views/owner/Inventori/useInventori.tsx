import { useEffect, useState } from "react";

const useInventori = () => {
  //   is active Cluster inventori
  const [isActiveCluster, setIsActiveCluster] = useState<
    "barangMasuk" | "barangKeluar" | ""
  >("");

  // handle is active
  const handleActiveCluster = (
    Cluster: "barangMasuk" | "barangKeluar" | "",
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
