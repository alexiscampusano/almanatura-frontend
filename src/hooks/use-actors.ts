import { useQuery, keepPreviousData } from "@tanstack/react-query";

import type { GetActorsParams } from "@/services/actors.service";
import { getActorById, getActors } from "@/services/actors.service";

const ACTORS_LIST_KEY = ["actors"] as const;

export function useActors(params?: GetActorsParams) {
  return useQuery({
    queryKey: [...ACTORS_LIST_KEY, params?.pillar ?? "all"],
    queryFn: () => getActors(params),
    placeholderData: keepPreviousData,
  });
}

export function useActor(actorId: number) {
  return useQuery({
    queryKey: [...ACTORS_LIST_KEY, actorId],
    queryFn: () => getActorById(actorId),
    enabled: Number.isFinite(actorId) && actorId > 0,
  });
}
