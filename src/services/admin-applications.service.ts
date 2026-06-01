import type {
  AdminApplicationResponse,
  ApplicationHistoryResponse,
  ApplicationStatus,
} from "@/types/application";

import { apiClient } from "./api.client";

export type SearchApplicationsParams = {
  projectId?: number;
  status?: ApplicationStatus;
};

export async function searchApplications(
  params: SearchApplicationsParams,
): Promise<AdminApplicationResponse[]> {
  const response = await apiClient.get<AdminApplicationResponse[]>(
    "/admin/applications",
    {
      params: {
        ...(params.projectId != null ? { projectId: params.projectId } : {}),
        ...(params.status != null ? { status: params.status } : {}),
      },
    },
  );
  return response.data;
}

export async function getApplication(
  id: number,
): Promise<AdminApplicationResponse> {
  const response = await apiClient.get<AdminApplicationResponse>(
    `/admin/applications/${id}`,
  );
  return response.data;
}

export async function patchApplicationStatus(
  id: number,
  status: ApplicationStatus,
  notes?: string,
): Promise<AdminApplicationResponse> {
  const response = await apiClient.patch<AdminApplicationResponse>(
    `/admin/applications/${id}`,
    { status, notes },
  );
  return response.data;
}

export async function getApplicationHistory(
  id: number,
): Promise<ApplicationHistoryResponse[]> {
  const response = await apiClient.get<ApplicationHistoryResponse[]>(
    `/admin/applications/${id}/history`,
  );
  return response.data;
}
