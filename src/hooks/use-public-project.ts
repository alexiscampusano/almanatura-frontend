import { useQuery } from "@tanstack/react-query";

import { getPublicProjectById } from "@/services/projects.service";

export function usePublicProject(projectId: number) {
  return useQuery({
    queryKey: ["public-projects", projectId],
    queryFn: () => getPublicProjectById(projectId),
    enabled: Number.isFinite(projectId) && projectId > 0,
  });
}
