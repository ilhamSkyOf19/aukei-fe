import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import { AuthServices } from "../services/auth.service";

const useLogOut = (params: { redirectUrl?: boolean }) => {
  const { redirectUrl } = params;

  const logout = useAuthStore((state) => state.logout);

  // navigate
  const navigate = useNavigate();

  // use mutation
  const { mutateAsync: handleLogout } = useMutation({
    mutationFn: async () => AuthServices.logout(),
    onSuccess: async () => {
      logout();

      if (redirectUrl) {
        navigate("/login", { replace: true });
      }
    },

    onError: async () => {
      navigate("/login", { replace: true });
    },
  });

  return {
    handleLogout,
  };
};

export default useLogOut;
