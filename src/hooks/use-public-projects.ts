import { useQuery } from "@tanstack/react-query";

import type { ProjectPillar } from "@/types/project";
import { getPublicProjects } from "@/services/projects.service";

export function usePublicProjects(pillar?: ProjectPillar) {
  return useQuery({
    queryKey: ["public-projects", pillar],
    queryFn: () => getPublicProjects(pillar),
  });
}
