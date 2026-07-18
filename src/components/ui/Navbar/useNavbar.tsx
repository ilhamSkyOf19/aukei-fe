import { useQuery } from "@tanstack/react-query";
import useLogOut from "../../../hooks/useLogOut";
import { NotifikasiGlobalServices } from "../../../services/notifikasiGlobal.service";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useNavbar = () => {
  const { handleLogout } = useLogOut({ redirectUrl: true });

  // state show count notifikasi
  const [isShowCountNotifikasi, setIsShowCountNotifikasi] =
    useState<boolean>(true);

  // navigate
  const navigate = useNavigate();

  // current pathname
  const currentPathname = useLocation().pathname;

  // query notifikasi global
  const {
    data: notifikasiGlobal,
    isLoading: isLoadingNotifikasiGlobal,
    refetch: refetchNotifikasi,
  } = useQuery({
    queryKey: ["notifikasi-global"],
    queryFn: () => NotifikasiGlobalServices.findAll(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  // data notifikasi produk
  const dataNotifikasiProduk = notifikasiGlobal?.data?.notifikasiProduk;

  return {
    handleLogout,
    notifikasiGlobal,
    isLoadingNotifikasiGlobal,
    dataNotifikasiProduk,
    refetchNotifikasi,
    isShowCountNotifikasi,
    setIsShowCountNotifikasi,
    navigate,
    currentPathname,
  };
};

export default useNavbar;
