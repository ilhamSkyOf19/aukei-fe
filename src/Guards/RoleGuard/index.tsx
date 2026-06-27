import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import type { FC, JSX } from "react";
import type { RoleInternalType } from "../../types/constant.type";

type Props = {
  children: JSX.Element;
  allowedRoles: RoleInternalType[];
};

const RoleGuard: FC<Props> = ({ children, allowedRoles }) => {
  const pengguna = useAuthStore((s) => s.pengguna);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  // TUNGGU sampai initialized
  if (!isInitialized) {
    return null;
  }

  // Setelah initialized, cek user
  if (!pengguna) {
    return <Navigate to="/login" replace />;
  }

  // Role tidak sesuai
  if (!allowedRoles.includes(pengguna.role)) {
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default RoleGuard;
