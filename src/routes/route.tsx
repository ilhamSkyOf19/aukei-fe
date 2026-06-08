import { createBrowserRouter, redirect } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import { AuthServices } from "../services/auth.service";
import { useAuthStore } from "../stores/authStore";
import DashboardLayout from "../layouts/DashboardLayout";
import ProdukPage from "../pages/ProdukPage";
import ProdukDetailPage from "../pages/ProdukDetailPage";
import FormulirProdukPage from "../pages/FormulirProdukPage";
import DashboardPage from "../pages/DashboardPage";
import InventoriPage from "../pages/InventoriPage";
import BarangMasukDetailPage from "../pages/BarangMasukDetailPage";
import BarangKeluarDetailPage from "../pages/BarangKeluarDetailPage";

// ============================================================
// LOADER: cek auth di setiap masuk dashboard
// ============================================================
const dashboardLoader = async () => {
  try {
    // set dosen
    const result = await AuthServices.me();
    if (result && result.meta.statusCode === 200) {
      useAuthStore.getState().setPengguna(result.data);
    }

    return null;
  } catch (err: any) {
    console.log(err);
    if (err.response?.status === 401) {
      return redirect("/login");
    }

    return;
  }
};

// ============================================================
// LOADER: validasi params ID
// ============================================================
// const paramsLoader =
//   (fallbackPath: string, requiredParams: string[]) =>
//   async ({ params }: LoaderFunctionArgs) => {
//     const isInvalid = requiredParams.some((paramName) => {
//       const value = params[paramName];

//       return !value || isNaN(Number(value));
//     });

//     if (isInvalid) {
//       return redirect(fallbackPath);
//     }

//     return null;
//   };

// ============================================================
// ROUTE
// ============================================================
const route = createBrowserRouter([
  // ── Redirect root ────────────────────────────────────────
  {
    path: "/",
    loader: () => redirect("/dashboard"),
  },

  // ── Login ────────────────────────────────────────────────
  {
    path: "/login",
    element: <LoginPage />,
  },

  //   // ── 404 ─────────────────────────────────────────────────
  //   {
  //     path: "/404",
  //     element: <NotFoundPage />,
  //   },
  //   {
  //     path: "*",
  //     element: <NotFoundPage />,
  //   },

  //   //  ─── Forget Password───────────────────────────────────────────────────────────
  //   {
  //     path: "/forget-password",
  //     element: <ForgetPasswordPage />,
  //   },

  //   // activation code
  //   {
  //     path: "/activation-code",
  //     element: <ActivationCodePage />,
  //   },

  //   // reset the password
  //   {
  //     path: "/reset-password",
  //     element: <ResetPasswordPage />,
  //   },

  // ── Dashboard (protected) ────────────────────────────────
  {
    path: "/dashboard",
    loader: dashboardLoader,
    shouldRevalidate: () => false,
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "produk",
        children: [
          {
            index: true,
            element: <ProdukPage />,
          },
          {
            path: "tambah",
            element: <FormulirProdukPage />,
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: <ProdukDetailPage />,
              },
              {
                path: "ubah",
                element: <FormulirProdukPage />,
              },
            ],
          },
        ],
      },
      {
        path: "inventori",
        children: [
          {
            index: true,
            element: <InventoriPage />,
          },
          {
            path: "barang-masuk/:id",
            element: <BarangMasukDetailPage />,
          },
          {
            path: "barang-keluar/:id",
            element: <BarangKeluarDetailPage />,
          },
        ],
      },
    ],
  },
]);

export default route;
