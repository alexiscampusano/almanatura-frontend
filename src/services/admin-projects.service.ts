import type {
  AdminProjectResponse,
  CreateProjectPayload,
  UpdateProjectPayload,
} from "@/types/project";

import { apiClient } from "./api.client";

export async function getAdminProjects(): Promise<AdminProjectResponse[]> {
  const response =
    await apiClient.get<AdminProjectResponse[]>("/admin/projects");
  return response.data;
}

export async function createProject(
  data: CreateProjectPayload,
): Promise<AdminProjectResponse> {
  const response = await apiClient.post<AdminProjectResponse>(
    "/admin/projects",
    data,
  );
  return response.data;
}

export async function updateProject(
  id: number,
  data: UpdateProjectPayload,
): Promise<AdminProjectResponse> {
  const response = await apiClient.put<AdminProjectResponse>(
    `/admin/projects/${id}`,
    data,
  );
  return response.data;
}

export async function deleteProject(id: number): Promise<void> {
  await apiClient.delete(`/admin/projects/${id}`);
}
