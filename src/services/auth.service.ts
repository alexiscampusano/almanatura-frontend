import { apiClient } from "@/services/api.client";
import type { AuthLoginResponse, AuthUser } from "@/stores/auth.store";

type LoginPayload = {
  email: string;
  password: string;
};

export async function login(payload: LoginPayload): Promise<AuthLoginResponse> {
  const { data } = await apiClient.post<AuthLoginResponse>(
    "/auth/login",
    payload,
  );
  return data;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const { data } = await apiClient.get<AuthUser>("/auth/me");
  return data;
}
