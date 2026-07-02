import useIsModeKasirStore from "../../../stores/iseModaKasirStore";
import { useAuthStore } from "../../../stores/authStore";
import { useLocation, useNavigate } from "react-router-dom";

const useHeaderKasir = () => {
  const navigate = useNavigate();

  // currentPathname
  const currentPathname = useLocation().pathname;

  // is kasir
  const isKasirPage = currentPathname.includes("kasir");

  // handle navigation
  const handleNavigation = () => {
    if (isKasirPage) {
      navigate("/dashboard/keranjang");
    } else {
      navigate("/dashboard/kasir");
    }

    // clear local storage
    localStorage.removeItem("details");
    localStorage.removeItem("is-update-keranjang");
    localStorage.removeItem("pelanggan");
  };

  // get is mode kasir from store
  const { isModeKasir, setIsModeKasir } = useIsModeKasirStore((state) => state);

  // get pengguna from store
  const pengguna = useAuthStore((state) => state.pengguna);

  return {
    isModeKasir,
    setIsModeKasir,
    pengguna,
    isKasirPage,
    handleNavigation,
    currentPathname,
  };
};

export default useHeaderKasir;
