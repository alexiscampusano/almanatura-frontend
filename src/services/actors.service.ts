import type { ActorResponse } from "@/types/actor";

import { apiClient } from "./api.client";

export async function getActors(): Promise<ActorResponse[]> {
  const response = await apiClient.get<ActorResponse[]>("/admin/actors");
  return response.data;
}

export async function getActorById(id: number): Promise<ActorResponse> {
  const response = await apiClient.get<ActorResponse>(`/admin/actors/${id}`);
  return response.data;
}
