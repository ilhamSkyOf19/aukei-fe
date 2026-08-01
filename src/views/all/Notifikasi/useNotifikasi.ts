import { CalendarClock, Package, type LucideIcon } from "lucide-react";
import { useRef } from "react";
import useFilterState from "../../../services/useFilterState";
import type { ChildRef } from "../../../types/ref.type";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores/authStore";
import { ROLE_INTERNAL_TYPE } from "../../../types/constant.type";
import { LOCAL_STORAGE_KEYS } from "../../../utils/localStorageKeys";
import {
  useNotifikasiStore,
  type NotifikasiPilihanType,
} from "../../../stores/notifikasiStore";

const pilihan: {
  key: NotifikasiPilihanType;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    key: "produk",
    label: "Notifikasi Produk",
    icon: Package,
  },
  {
    key: "tempo",
    label: "Notifikasi Jatuh Tempo",
    icon: CalendarClock,
  },

  {
    key: "pengajuanBarang",
    label: "Notifikasi Pengajuan Barang",
    icon: Package,
  },
];

const useNotifikasi = () => {
  // navigate
  const navigate = useNavigate();

  // pengguna
  const pengguna = useAuthStore((state) => state.pengguna);

  // filter state
  const {
    search,
    setSearch,
    sort,
    setSort,
    limit,
    setLimit,
    page,
    setPage,
    handleClear,
  } = useFilterState();

  // notifikasi produk ref
  const notifikasiProdukRef = useRef<ChildRef | null>(null);

  //   handle    refresh
  const handleRefresh = async () => {
    await notifikasiProdukRef.current?.refetchActive();
  };

  // get notifikasi store
  const { selectedNotifikasi, setSelectedNotifikasi } = useNotifikasiStore(
    (state) => state,
  );

  // handle redirect detail
  const handleRedirectDetail = (params: {
    pelangganId?: number;
    id?: number;
    barangMasukId?: number;
    barangKeluarId?: number;
  }) => {
    const { id, pelangganId, barangKeluarId, barangMasukId } = params;

    // clear
    handleClear();

    switch (selectedNotifikasi) {
      case "produk":
        if (pengguna?.role === ROLE_INTERNAL_TYPE.OWNER) {
          navigate(`/dashboard/produk/${id}`);
        } else {
          return;
        }
        break;
      case "tempo":
        navigate(`/dashboard/kredit/pelanggan/${pelangganId}/tempo/${id}`);
        break;
      case "pengajuanBarang":
        // set local storgae
        localStorage.setItem(LOCAL_STORAGE_KEYS.FROM_PENGAJUAN_BARANG, "true");

        if (barangMasukId) {
          if (pengguna?.role === ROLE_INTERNAL_TYPE.OWNER) {
            navigate(`/dashboard/inventori/barang-masuk/${barangMasukId}`);
          } else {
            navigate(`/dashboard/pengajuan-barang-masuk/${barangKeluarId}`);
          }
        } else {
          if (pengguna?.role === ROLE_INTERNAL_TYPE.OWNER) {
            navigate(`/dashboard/inventori/barang-keluar/${barangKeluarId}`);
          } else {
            navigate(`/dashboard/pengajuan-barang-keluar/${barangKeluarId}`);
          }
        }
        break;
    }
  };

  // handle pilihan
  const handleSelected = (pilihan: NotifikasiPilihanType) => {
    // clear
    handleClear();

    setSelectedNotifikasi(pilihan);
  };

  return {
    pilihan,
    selectedNotifikasi,
    handleSelected,
    search,
    setSearch,
    sort,
    setSort,
    limit,
    setLimit,
    page,
    setPage,
    handleRefresh,
    notifikasiProdukRef,
    handleRedirectDetail,
    pengguna,
  };
};

export default useNotifikasi;
