import { useEffect } from "react";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";

type ClusterType =
  | "barangMasuk"
  | "pengajuanBarangMasuk"
  | "barangKeluar"
  | "pengajuanBarangKeluar"
  | "";

const useInventori = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // active cluster dari URL
  const activeCluster =
    (searchParams.get("cluster") as ClusterType | null) ?? "";

  // helper default date
  const getDefaultDate = () => {
    const defaultStartDate = format(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 1,
        new Date().getDate(),
      ),
      "yyyy-MM-dd",
    );

    const defaultEndDate = format(new Date(), "yyyy-MM-dd");

    return {
      defaultStartDate,
      defaultEndDate,
    };
  };

  // handle active cluster
  const handleActiveCluster = (cluster: ClusterType) => {
    const { defaultStartDate, defaultEndDate } = getDefaultDate();

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      // reset cluster
      params.set("cluster", cluster);

      // reset range date
      params.set("start-date", defaultStartDate);
      params.set("end-date", defaultEndDate);

      return params;
    });

    // local storage
    if (cluster) {
      localStorage.setItem("active-cluster", cluster);
    } else {
      localStorage.removeItem("active-cluster");
    }
  };

  // initial setup
  useEffect(() => {
    const { defaultStartDate, defaultEndDate } = getDefaultDate();

    const clusterFromStorage = localStorage.getItem(
      "active-cluster",
    ) as ClusterType | null;

    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);

        let isChanged = false;

        // set cluster jika belum ada
        if (!params.get("cluster")) {
          params.set("cluster", clusterFromStorage || "barangMasuk");

          isChanged = true;
        }

        // set start date jika belum ada
        if (!params.get("start-date")) {
          params.set("start-date", defaultStartDate);

          isChanged = true;
        }

        // set end date jika belum ada
        if (!params.get("end-date")) {
          params.set("end-date", defaultEndDate);

          isChanged = true;
        }

        // jika tidak ada perubahan
        if (!isChanged) {
          return prev;
        }

        return params;
      },
      {
        replace: true,
      },
    );
  }, [setSearchParams]);

  return {
    activeCluster,
    handleActiveCluster,
  };
};

export default useInventori;
