import type { ProjectPillar, PublicProjectResponse } from "@/types/project";

import { apiClient } from "./api.client";

export async function getPublicProjects(
  pillar?: ProjectPillar,
): Promise<PublicProjectResponse[]> {
  const response = await apiClient.get<PublicProjectResponse[]>("/projects", {
    params: pillar ? { pillar } : undefined,
  });
  return response.data;
}

export async function getPublicProjectById(
  id: number,
): Promise<PublicProjectResponse> {
  const response = await apiClient.get<PublicProjectResponse>(
    `/projects/${id}`,
  );
  return response.data;
}
