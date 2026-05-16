import axios from "axios";

import { useAuthStore } from "@/stores/auth.store";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

apiClient.interceptors.request.use((config) => {
  const { accessToken, tokenType } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `${tokenType ?? "Bearer"} ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore.getState().clearSession();
      if (window.location.pathname !== "/admin/login") {
        window.location.assign("/admin/login");
      }
    }

    return Promise.reject(error);
  },
);
