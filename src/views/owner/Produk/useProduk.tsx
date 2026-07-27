import { useEffect, useState } from "react";
import { useToastAnimation } from "../../../hooks/useToast";
import { useSearchParams } from "react-router-dom";
import { useAlertAnimation } from "../../../hooks/useAlert";

// Key localStorage untuk menyimpan cluster inventori yang sedang aktif
const LOCAL_STORAGE_KEYS = {
  ACTIVE_CLUSTER: "active-cluster",
} as const;

// Cluster inventori yang tersedia pada halaman produk
type InventoriCluster = "produk" | "kategori" | "spesifikasi" | "";

const useProduk = () => {
  const [_searchParams, setSearchParams] = useSearchParams();

  const { toast, handleSetToast } = useToastAnimation();

  // alert
  const { alert, handleSetAlert } = useAlertAnimation();

  // Cluster inventori yang sedang aktif (produk/kategori/spesifikasi)
  const [isActiveCluster, setIsActiveCluster] = useState<InventoriCluster>("");

  // Ubah cluster aktif, reset search params, dan simpan pilihan ke localStorage
  const handleActiveCluster = (cluster: InventoriCluster) => {
    setIsActiveCluster(cluster);

    // Cluster berganti, params filter lama sudah tidak relevan
    setSearchParams({});

    localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVE_CLUSTER, cluster);
  };

  // Muat cluster aktif terakhir dari localStorage saat pertama kali render, default ke "produk"
  useEffect(() => {
    const datalocalStorage = localStorage.getItem(
      LOCAL_STORAGE_KEYS.ACTIVE_CLUSTER,
    );

    if (datalocalStorage) {
      setIsActiveCluster(datalocalStorage as InventoriCluster);
    } else {
      setIsActiveCluster("produk");
    }
  }, []);

  // Ekspos state & handler yang dibutuhkan oleh komponen UI daftar produk
  return {
    isActiveCluster,
    handleActiveCluster,
    toast,
    handleSetToast,
    alert,
    handleSetAlert,
  };
};

export default useProduk;
