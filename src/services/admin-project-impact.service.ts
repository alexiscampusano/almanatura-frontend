import type {
  CreateProjectImpactEntryPayload,
  ProjectImpactEntryResponse,
} from "@/types/impact";

import { apiClient } from "./api.client";

export async function getProjectImpactEntries(
  projectId: number,
): Promise<ProjectImpactEntryResponse[]> {
  const response = await apiClient.get<ProjectImpactEntryResponse[]>(
    `/admin/projects/${projectId}/impact-entries`,
  );
  return response.data;
}

export async function createProjectImpactEntry(
  projectId: number,
  data: CreateProjectImpactEntryPayload,
): Promise<ProjectImpactEntryResponse> {
  const response = await apiClient.post<ProjectImpactEntryResponse>(
    `/admin/projects/${projectId}/impact-entries`,
    data,
  );
  return response.data;
}
