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
import { LOCAL_STORAGE_KEYS } from "../../../utils/localStorageKeys";
import { useNotifikasiStore } from "../../../stores/notifikasiStore";
import { useCartStore } from "../../../stores/useCartStore";
import { useQueryClient } from "@tanstack/react-query";
import { useTransactionComplate } from "../../../stores/useTransactionComplate";
import useConfirm from "../../../hooks/useConfirm";
import useCancelUpdateTransactionComplate from "../../../hooks/useCancelTransactionUpdateComplate";
import { removePreviousPath } from "../../../helpers/previousPath";

const useSideBar = () => {
  // get auth context
  const pengguna = useAuthStore((state) => state.pengguna);

  // currentPathname
  const pathname = useLocation().pathname;

  // navigate
  const navigate = useNavigate();

  const { resetCart, transactionId: transactionIdFormCart } = useCartStore(
    (state) => state,
  );

  // reset update transaction
  const {
    resetUpdate: resetUpdateTransaction,
    transactionId: transactionIdFormTransaction,
  } = useTransactionComplate((state) => state);

  // query client
  const queryClient = useQueryClient();

  // // clear localstorage
  // const handleClearDataActiveCluster = () => {
  //   localStorage.removeItem("active-cluster");
  // };

  // modal confirm
  const {
    modalRef: modalCancelRef,
    confirm,
    handleCancel: handleCancelConfirm,
    handleConfirm: handleConfirmConfirm,
    data: dataConfirm,
  } = useConfirm<{ bigTitle: string; smallTitle: string }>();

  // get use cancel update transaction complate
  const {
    handleCancelUpdate: handleCancelUpdateTransactionComplete,
    isPendingCancelUpdate: isPendingCancelUpdateTransactionComplete,
  } = useCancelUpdateTransactionComplate({
    linkBack: `/dashboard/riwayat-transaksi/${transactionIdFormTransaction}`,
  });

  // get method in notifikasi store
  const resetNotifikasi = useNotifikasiStore((state) => state.resetNotifikasi);

  const clearTransactionStorage = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_UPDATE_KERANJANG);
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

    // hapus data transaksi
    clearTransactionStorage();

    return true;
  };

  const handleLink = async (link: string) => {
    if (!link) return;

    // remove session
    removePreviousPath();

    const isKeranjangUpdate: boolean = transactionIdFormCart !== null;
    const isUpdateTransaction: boolean = transactionIdFormTransaction !== null;

    if (isKeranjangUpdate) {
      // clear keranjang
      resetCart();
    }

    if (isUpdateTransaction) {
      if (link === "/dashboard/riwayat-transaksi/:id/ubah-produk") return;

      const isConfirm = await confirm({
        bigTitle: "Peringatan",
        smallTitle:
          "Apakah anda yakin ingin keluar dari ubah produk ini, semua data yang belum disimpan akan hilang?",
      });

      if (!isConfirm) {
        return;
      }

      await handleCancelUpdateTransactionComplete(
        transactionIdFormTransaction ?? 0,
      );

      // clear keranjang
      resetUpdateTransaction();
    }

    if (isKeranjangUpdate || isUpdateTransaction) {
      if (pathname === "/dashboard/kasir") {
        queryClient.removeQueries({
          queryKey: ["transaksi-draft"],
        });
      }
    }

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

    // clear from pengajuan barang
    if (pathname.includes("pengajuan-barang") || pathname.includes("barang")) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.FROM_PENGAJUAN_BARANG);
    }

    if (pathname.includes("notifikasi")) {
      resetNotifikasi();
    }

    // clear transaction and steps

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
    handleLink,

    modalCancelRef,
    handleCancelConfirm,
    handleConfirmConfirm,
    dataConfirm,

    isPendingCancelUpdateTransactionComplete,
  };
};

export default useSideBar;
