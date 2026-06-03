import { useEffect, useState, type ElementType } from "react";

import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../../stores/authStore";
import { ROLE_INTERNAL_TYPE } from "../../../types/constant.type";
import { NAVIGATION_LIST_OWNER } from "../../../utils/navigation";

const useSideBar = () => {
  // get auth context
  const pengguna = useAuthStore((state) => state.pengguna);

  // state navigasi
  const [isNavigation, setIsNavigation] = useState<
    { label: string; link: string; icon: ElementType }[]
  >([]);
  // get pathname
  const pathname = useLocation().pathname;

  // set is navigasi
  useEffect(() => {
    if (pengguna?.role) {
      switch (pengguna.role) {
        case ROLE_INTERNAL_TYPE.OWNER:
          setIsNavigation(NAVIGATION_LIST_OWNER);
          break;

        default:
          setIsNavigation([]);
          break;
      }
    }
  }, [pengguna?.role]);

  // clear localstorage
  const handleClearDataLocalStorage = () => {
    localStorage.removeItem("active-cluster");
  };

  return { isNavigation, pathname, handleClearDataLocalStorage };
};

export default useSideBar;
