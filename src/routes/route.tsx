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
import PegawaiPage from "../pages/PegawaiPage";
import RoleGuard from "../Guards/RoleGuard";
import { ROLE_INTERNAL_TYPE } from "../types/constant.type";
import KasirPage from "../pages/KasirPage";
import KeranjangPage from "../pages/KeranjangPage";
import PelangganPage from "../pages/PelangganPage";
import StatistikDetailPage from "../pages/StatistikDetailPage";
import RiwayatTransaksiDetailPage from "../pages/RiwayatTransaksiDetailPage";
import RiwayatTransaksiPage from "../pages/RiwayatTransaksiPage";
import PengajuanBarangMasukDetailPage from "../pages/PengajuanBarangMasukDetailPage";
import PengajuanBarangKeluarDetailPage from "../pages/PengajuanBarangKeluarDetailPage";
import PengajuanBarangMasukPage from "../pages/PengajuanBarangMasukPage";
import PengajuanBarangKeluarPage from "../pages/PengajuanBarangKeluarPage";
import KreditPage from "../pages/KreditPage";
import BookingPage from "../pages/BookingPage";
import KreditDetailPage from "../pages/KreditDetailPage";

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
      localStorage.removeItem("pelanggan");
      localStorage.removeItem("details");
      localStorage.removeItem("di-bayar");
      localStorage.removeItem("metode-pembayaran");
      localStorage.removeItem("is-update-keranjang");
      localStorage.removeItem("is-update-transaction");
      localStorage.removeItem("data-from-keranjang");
      localStorage.removeItem("tempo");

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
            element: (
              <RoleGuard allowedRoles={[ROLE_INTERNAL_TYPE.OWNER]}>
                <ProdukPage />
              </RoleGuard>
            ),
          },
          {
            path: "tambah",
            element: (
              <RoleGuard allowedRoles={[ROLE_INTERNAL_TYPE.OWNER]}>
                <FormulirProdukPage />
              </RoleGuard>
            ),
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: (
                  <RoleGuard allowedRoles={[ROLE_INTERNAL_TYPE.OWNER]}>
                    <ProdukDetailPage />
                  </RoleGuard>
                ),
              },
              {
                path: "ubah",
                element: (
                  <RoleGuard allowedRoles={[ROLE_INTERNAL_TYPE.OWNER]}>
                    <FormulirProdukPage />
                  </RoleGuard>
                ),
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
            element: (
              <RoleGuard allowedRoles={[ROLE_INTERNAL_TYPE.OWNER]}>
                <InventoriPage />
              </RoleGuard>
            ),
          },
          {
            path: "barang-masuk/:id",
            element: (
              <RoleGuard allowedRoles={[ROLE_INTERNAL_TYPE.OWNER]}>
                <BarangMasukDetailPage />
              </RoleGuard>
            ),
          },
          {
            path: "pengajuan-barang-masuk/:id",
            element: (
              <RoleGuard allowedRoles={[ROLE_INTERNAL_TYPE.OWNER]}>
                <PengajuanBarangMasukDetailPage />
              </RoleGuard>
            ),
          },
          {
            path: "barang-keluar/:id",
            element: (
              <RoleGuard allowedRoles={[ROLE_INTERNAL_TYPE.OWNER]}>
                <BarangKeluarDetailPage />
              </RoleGuard>
            ),
          },
          {
            path: "pengajuan-barang-keluar/:id",
            element: (
              <RoleGuard allowedRoles={[ROLE_INTERNAL_TYPE.OWNER]}>
                <PengajuanBarangKeluarDetailPage />
              </RoleGuard>
            ),
          },
        ],
      },
      {
        path: "pegawai",
        children: [
          {
            index: true,
            element: (
              <RoleGuard allowedRoles={[ROLE_INTERNAL_TYPE.OWNER]}>
                <PegawaiPage />
              </RoleGuard>
            ),
          },
        ],
      },
      {
        path: "statistik",
        children: [
          {
            index: true,
            element: (
              <RoleGuard allowedRoles={[ROLE_INTERNAL_TYPE.OWNER]}>
                <StatistikDetailPage />
              </RoleGuard>
            ),
          },
        ],
      },
      {
        path: "riwayat-transaksi",
        children: [
          {
            index: true,
            element: (
              <RoleGuard allowedRoles={[ROLE_INTERNAL_TYPE.OWNER]}>
                <RiwayatTransaksiPage />
              </RoleGuard>
            ),
          },
          {
            path: "detail/:id",
            element: (
              <RoleGuard allowedRoles={[ROLE_INTERNAL_TYPE.OWNER]}>
                <RiwayatTransaksiDetailPage />
              </RoleGuard>
            ),
          },
        ],
      },

      {
        path: "pelanggan",
        children: [
          {
            index: true,
            element: (
              <RoleGuard allowedRoles={[ROLE_INTERNAL_TYPE.OWNER]}>
                <PelangganPage />
              </RoleGuard>
            ),
          },
        ],
      },

      // kasir
      {
        path: "kasir",
        children: [
          {
            index: true,
            element: <KasirPage />,
          },
        ],
      },
      {
        path: "keranjang",
        children: [
          {
            index: true,
            element: <KeranjangPage />,
          },
          {
            path: ":keranjangId",
            element: <KasirPage isUpdateKeranjang />,
          },
        ],
      },
      {
        path: "kredit",
        children: [
          {
            index: true,
            element: <KreditPage />,
          },
          {
            path: "detail/:id",
            element: <KreditDetailPage />,
          },
        ],
      },
      {
        path: "booking",
        children: [
          {
            index: true,
            element: <BookingPage />,
          },
        ],
      },
      {
        path: "pengajuan-barang-masuk",
        children: [
          {
            index: true,
            element: (
              <RoleGuard allowedRoles={[ROLE_INTERNAL_TYPE.KASIR]}>
                <PengajuanBarangMasukPage />
              </RoleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <RoleGuard allowedRoles={[ROLE_INTERNAL_TYPE.KASIR]}>
                <PengajuanBarangMasukDetailPage />
              </RoleGuard>
            ),
          },
        ],
      },
      {
        path: "pengajuan-barang-keluar",
        children: [
          {
            index: true,
            element: (
              <RoleGuard allowedRoles={[ROLE_INTERNAL_TYPE.KASIR]}>
                <PengajuanBarangKeluarPage />
              </RoleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <RoleGuard allowedRoles={[ROLE_INTERNAL_TYPE.KASIR]}>
                <PengajuanBarangKeluarDetailPage />
              </RoleGuard>
            ),
          },
        ],
      },
    ],
  },
]);

export default route;
