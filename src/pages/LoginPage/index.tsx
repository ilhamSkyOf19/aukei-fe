import { type FC } from "react";
import HeaderPage from "../../layouts/HeaderPage";
import Login from "../../views/auth/Login";

const LoginPage: FC = () => {
  return (
    <main className="container mx-auto min-h-screen flex justify-center items-center px-4">
      {/* header page */}
      <HeaderPage title="Login | Sistem Manajemen Borang Akreditasi" />

      {/* view login */}
      <Login />
    </main>
  );
};

export default LoginPage;
