import { useQuery } from "@tanstack/react-query";

import { getAdminProjectById } from "@/services/admin-projects.service";

const adminProjectKey = (id: number) => ["admin-projects", id] as const;

export function useAdminProject(projectId: number) {
  return useQuery({
    queryKey: adminProjectKey(projectId),
    queryFn: () => getAdminProjectById(projectId),
    enabled: Number.isFinite(projectId) && projectId > 0,
  });
}
