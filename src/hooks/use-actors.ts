import { useQuery } from "@tanstack/react-query";

import { getActorById, getActors } from "@/services/actors.service";

const ACTORS_LIST_KEY = ["actors"] as const;

export function useActors() {
  return useQuery({
    queryKey: ACTORS_LIST_KEY,
    queryFn: getActors,
  });
}

export function useActor(actorId: number) {
  return useQuery({
    queryKey: [...ACTORS_LIST_KEY, actorId],
    queryFn: () => getActorById(actorId),
    enabled: Number.isFinite(actorId) && actorId > 0,
  });
}
