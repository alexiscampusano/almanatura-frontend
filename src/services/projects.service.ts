import type { Page } from "@/types/common";
import type { ProjectPillar, PublicProjectResponse } from "@/types/project";

import { apiClient } from "./api.client";

export async function getPublicProjects(
  pillar?: ProjectPillar,
  page: number = 0,
): Promise<Page<PublicProjectResponse>> {
  const response = await apiClient.get<Page<PublicProjectResponse>>(
    "/projects",
    {
      params: {
        ...(pillar ? { pillar } : {}),
        page,
        size: 6,
      },
    },
  );
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
