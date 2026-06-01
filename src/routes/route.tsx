import { createBrowserRouter, redirect } from "react-router-dom";
import LoginPage from "../pages/LoginPage";

// ============================================================
// LOADER: cek auth di setiap masuk dashboard
// ============================================================
// const dashboardLoader = async () => {
//   try {
//     // set dosen
//     const result = await AuthService.me();
//     if (result && result.meta.statusCode === 200) {
//       useAuthStore.getState().setDosen(result.data);
//     }

//     // set periode
//     const periode = await PeriodeService.findActive();
//     if (periode && periode.meta.statusCode === 200) {
//       periodeStore.getState().setPeriode(periode.data);
//     }

//     // set timeline active
//     const timeline = await TimelineService.find();
//     if (timeline && timeline.meta.statusCode === 200) {
//       timelineStore.getState().setTimeline(timeline.data);
//       return null;
//     }

//     return null;
//   } catch (err: any) {
//     console.log(err);
//     if (err.response?.status === 401) {
//       return redirect("/login");
//     }
//     timelineStore.getState().setTimeline(null);
//     return;
//   }
// };

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
    loader: () => redirect("/login"),
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
  //   {
  //     path: "/dashboard",
  //     loader: dashboardLoader,
  //     shouldRevalidate: () => false,
  //     element: <DashboardLayout />,
  //   },
]);

export default route;
