import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";

const useInventori = () => {
  //   is active Cluster inventori
  const [isActiveCluster, setIsActiveCluster] = useState<
    | "barangMasuk"
    | "pengajuanBarangMasuk"
    | "barangKeluar"
    | "pengajuanBarangKeluar"
    | ""
  >("");

  const [_searchParams, setSearchParams] = useSearchParams();

  // handle is active
  const handleActiveCluster = (
    Cluster:
      | "barangMasuk"
      | "pengajuanBarangMasuk"
      | "barangKeluar"
      | "pengajuanBarangKeluar"
      | "",
  ) => {
    const defaultStartDate = format(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 1,
        new Date().getDate(),
      ),
      "yyyy-MM-dd",
    );

    const defaultEndDate = format(new Date(), "yyyy-MM-dd");

    setSearchParams({
      "start-date": defaultStartDate,
      "end-date": defaultEndDate,
    });

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
        datalocalStorage as
          | "barangMasuk"
          | "barangKeluar"
          | "pengajuanBarangMasuk",
      );
    } else {
      setIsActiveCluster("barangMasuk");
    }
  }, []);

  //   use query

  return { isActiveCluster, handleActiveCluster };
};

export default useInventori;
