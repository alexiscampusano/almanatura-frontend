import type { ActorResponse } from "@/types/actor";
import type { ProjectPillar } from "@/types/project";

import { apiClient } from "./api.client";

export type GetActorsParams = {
  pillar?: ProjectPillar;
};

export async function getActors(
  params?: GetActorsParams,
): Promise<ActorResponse[]> {
  const response = await apiClient.get<ActorResponse[]>("/admin/actors", {
    params: params?.pillar ? { pillar: params.pillar } : undefined,
  });
  return response.data;
}

export async function getActorById(id: number): Promise<ActorResponse> {
  const response = await apiClient.get<ActorResponse>(`/admin/actors/${id}`);
  return response.data;
}
