import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import route from "./routes/route";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MaintenancePage from "./pages/MaintenancePage";

// Create a client
const queryClient = new QueryClient();

const isMaintenance = import.meta.env.VITE_MAINTENANCE_MODE === "true";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    {isMaintenance ? <MaintenancePage /> : <RouterProvider router={route} />}
  </QueryClientProvider>,
);
