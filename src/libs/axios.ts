import axios from "axios";
import { ENV_CONFIG } from "../types/env.types";

const instanceAxios = axios.create({
  baseURL: ENV_CONFIG.API_URL,
  timeout: 1000 * 60,
  withCredentials: true,
});

instanceAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // TIMEOUT
    if (error.code === "ECONNABORTED") {
      return (window.location.href = "/");
    }

    if (error?.response?.status === 404 || error?.response?.status === 400) {
      return Promise.reject(error);
    }

    // autorized
    if (
      error?.response &&
      (error.response?.status === 401 || error.response.status === 403) &&
      !error.config.url?.includes("/auth/me")
    ) {
      window.location.href = "/login";
    }

    if (!error.response) {
      console.error("Network error:", error.message);
      window.location.href = "/error-network";
      return;
    }

    return Promise.reject(error);
  },
);

export default instanceAxios;
