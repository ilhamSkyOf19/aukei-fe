import axios from "axios";
import { ENV_CONFIG } from "../types/env.types";

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

instanceAxios.interceptors.response.use(
  (response) => response,
  (error) => {
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
      return;
    }

    // unauthorized
    if (
      (error.response.status === 401 || error.response.status === 403) &&
      !error.config.url?.includes("/auth/me")
    ) {
      clearLocalStorage();
      window.location.href = "/login";
      return;
    }

    // error lain serahkan ke caller
    return Promise.reject(error);
  },
);

export default instanceAxios;
