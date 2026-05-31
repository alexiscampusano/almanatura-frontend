import type { CreateUserPayload, UserSummary } from "@/types/user";

import { apiClient } from "./api.client";

export async function listInternalUsers(): Promise<UserSummary[]> {
  const response = await apiClient.get<UserSummary[]>("/admin/users");
  return response.data;
}

export async function createInternalUser(
  data: CreateUserPayload,
): Promise<UserSummary> {
  const response = await apiClient.post<UserSummary>("/admin/users", data);
  return response.data;
}

export async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(`/admin/users/${id}`);
}
