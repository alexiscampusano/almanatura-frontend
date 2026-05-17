import { useInfiniteQuery } from "@tanstack/react-query";

import type { ProjectPillar } from "@/types/project";
import { getPublicProjects } from "@/services/projects.service";

export function usePublicProjects(pillar?: ProjectPillar) {
  return useInfiniteQuery({
    queryKey: ["public-projects", pillar],
    queryFn: ({ pageParam = 0 }) => getPublicProjects(pillar, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.number + 1;
    },
  });
}
