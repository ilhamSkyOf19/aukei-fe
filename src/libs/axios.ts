import axios, { type InternalAxiosRequestConfig } from "axios";
import { ENV_CONFIG } from "../types/env.types";
import { AuthServices } from "../services/auth.service";

const instanceAxios = axios.create({
  baseURL: ENV_CONFIG.API_URL,
  timeout: 1000 * 60,
  withCredentials: true,
});

const clearLocalStorage = () => {
  localStorage.removeItem("pelanggan");
  localStorage.removeItem("details");
  localStorage.removeItem("di-bayar");
  localStorage.removeItem("metode-pembayaran");
  localStorage.removeItem("is-update-keranjang");
  localStorage.removeItem("is-update-transaction");
  localStorage.removeItem("data-from-keranjang");
  localStorage.removeItem("data-tempo");
};

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<unknown> | null = null;

instanceAxios.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config as RetryConfig | undefined;
    const url = originalRequest?.url ?? "";

    // timeout
    if (error.code === "ECONNABORTED") {
      clearLocalStorage();
      window.location.href = "/";
      return;
    }

    // network error
    if (!error.response) {
      clearLocalStorage();
      window.location.href = "/error-network";
      return Promise.reject(error);
    }

    const status = error.response.status;

    const isAuthEndpoint =
      url.includes("/auth/login") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/logout");

    // unauthorized
    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = AuthServices.refresh().finally(() => {
            refreshPromise = null;
          });
        }

        await refreshPromise;

        return instanceAxios(originalRequest);
      } catch (refreshError) {
        clearLocalStorage();

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    // 403 berarti tidak punya izin, bukan otomatis token expired.
    if (status === 403) {
      clearLocalStorage();
      window.location.href = "/login";

      return Promise.reject(error);
    }

    // Jangan refresh berulang kali jika endpoint autentikasi gagal.
    if (status === 401 && isAuthEndpoint) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default instanceAxios;
