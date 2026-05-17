import axios from "axios";
import axiosRetry from "axios-retry";

import { useAuthStore } from "@/stores/auth.store";
import { refreshAccessToken } from "@/services/auth.service";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

axiosRetry(apiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    if (!error.response) return true;
    const status = error.response.status;
    return status === 429 || status >= 500;
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

function processQueue(error: unknown | null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(undefined);
  });
  failedQueue = [];
}

apiClient.interceptors.request.use((config) => {
  const { accessToken, tokenType } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `${tokenType ?? "Bearer"} ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refreshToken } = useAuthStore.getState();

      if (!refreshToken) {
        useAuthStore.getState().clearSession();
        if (window.location.pathname !== "/admin/login") {
          window.location.assign("/admin/login");
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const response = await refreshAccessToken(refreshToken);
        useAuthStore.getState().updateTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          expiresIn: response.expiresIn,
        });

        processQueue(null);
        originalRequest.headers.Authorization = `${response.tokenType ?? "Bearer"} ${response.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        useAuthStore.getState().clearSession();
        if (window.location.pathname !== "/admin/login") {
          window.location.assign("/admin/login");
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
