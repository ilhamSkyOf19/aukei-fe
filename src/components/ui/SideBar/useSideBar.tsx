import { useEffect, useState, type ElementType } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores/authStore";
import { ROLE_INTERNAL_TYPE } from "../../../types/constant.type";
import {
  NAVIGATION_LIST_KASIR,
  NAVIGATION_LIST_OWNER,
} from "../../../utils/navigation";
import useLogOut from "../../../hooks/useLogOut";
import useHasScroll from "../../../hooks/useHasScroll";
import useConfirm from "../../../hooks/useConfirm";
import { useStepStore } from "../../../stores/stepStore";
import { LOCAL_STORAGE_KEYS } from "../../../utils/localStorageKeys";

const useSideBar = () => {
  // get auth context
  const pengguna = useAuthStore((state) => state.pengguna);

  // currentPathname
  const pathname = useLocation().pathname;

  // navigate
  const navigate = useNavigate();

  // // clear localstorage
  // const handleClearDataActiveCluster = () => {
  //   localStorage.removeItem("active-cluster");
  // };

  // use confirm
  const {
    modalRef: modalConfirmRef,
    confirm,
    handleConfirm,
    handleCancel,
  } = useConfirm();

  const { resetStep } = useStepStore((state) => state);

  const clearTransactionStorage = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.PELANGGAN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.DETAILS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.DI_BAYAR);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.METODE_PEMBAYARAN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_UPDATE_KERANJANG);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_UPDATE_TRANSACTION);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.DATA_FROM_KERANJANG);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TEMPO);
  };

  const canLeaveTransaction = async (): Promise<boolean> => {
    // bukan kasir
    if (pengguna?.role !== ROLE_INTERNAL_TYPE.KASIR) {
      return true;
    }

    // get data local storage
    const activeTransaction =
      localStorage.getItem(LOCAL_STORAGE_KEYS.PELANGGAN) ||
      localStorage.getItem(LOCAL_STORAGE_KEYS.DETAILS);

    // tidak ada transaksi aktif
    if (!activeTransaction) {
      return true;
    }

    // tampilkan konfirmasi
    const isConfirm = await confirm();

    if (!isConfirm) {
      return false;
    }

    // hapus data transaksi
    clearTransactionStorage();

    // reset steps
    resetStep();

    return true;
  };

  const handleLink = async (link: string) => {
    if (!link) return;

    // const isUpdateKeranjang = localStorage.getItem("is-update-keranjang");

    // if (isUpdateKeranjang) {
    //   localStorage.removeItem("is-update-keranjang");
    // }

    // jika sedang berada di halaman yang sama
    if (link === "/dashboard/kasir" && pathname === "/dashboard/kasir") {
      return;
    }

    if (pathname === "/dashboard/kasir") {
      // cek apakah boleh keluar
      const canLeave = await canLeaveTransaction();

      if (!canLeave) {
        return;
      }
    }

    // check path keranjang
    if (pathname.includes("/dashboard/keranjang")) {
      // clear keranjang
      console.log("ok");
      clearTransactionStorage();
    }

    // check path owner
    if (
      pathname.includes("/dashboard/produk") ||
      pathname.includes("/dashboard/inventori")
    ) {
      // clear active cluster
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ACTIVE_CLUSTER);
    }

    // clear transaction and steps
    resetStep();
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TRANSACTION);

    // clear cluster
    // handleClearDataActiveCluster();

    // pindah halaman
    navigate(link);
  };

  // state navigasi
  const [isNavigation, setIsNavigation] = useState<
    { label: string; link: string; icon: ElementType }[]
  >([]);

  // set is navigasi
  useEffect(() => {
    if (pengguna?.role) {
      switch (pengguna.role) {
        case ROLE_INTERNAL_TYPE.OWNER:
          setIsNavigation(NAVIGATION_LIST_OWNER);
          break;

        default:
          setIsNavigation(NAVIGATION_LIST_KASIR);
          break;
      }
    }
  }, [pengguna?.role]);

  // auth

  const { handleLogout } = useLogOut({ redirectUrl: true });

  // use has scroll
  const { divRef, hasScroll } = useHasScroll();

  return {
    isNavigation,
    pathname,
    pengguna,
    handleLogout,
    divRef,
    hasScroll,
    modalConfirmRef,
    handleConfirm,
    handleCancel,
    handleLink,
  };
};

export default useSideBar;
