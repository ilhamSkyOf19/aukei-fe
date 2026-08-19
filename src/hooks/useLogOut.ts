import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import { AuthServices } from "../services/auth.service";
import { LOCAL_STORAGE_KEYS } from "../utils/localStorageKeys";

const useLogOut = (params: { redirectUrl?: boolean }) => {
  const { redirectUrl } = params;

  const logout = useAuthStore((state) => state.logout);

  // navigate
  const navigate = useNavigate();

  const clearLogoutStorage = () => {
    Object.values(LOCAL_STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  // use mutation
  const { mutateAsync: handleLogout, isPending: isPendingLogout } = useMutation(
    {
      mutationFn: async () => AuthServices.logout(),
      onSuccess: async () => {
        logout();

        // clear
        clearLogoutStorage();

        if (redirectUrl) {
          navigate("/login", { replace: true });
        }
      },

      onError: async () => {
        navigate("/login", { replace: true });
      },
    },
  );

  return {
    handleLogout,
    isPendingLogout,
  };
};

export default useLogOut;
