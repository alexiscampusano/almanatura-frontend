import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createProjectImpactEntry,
  getProjectImpactEntries,
} from "@/services/admin-project-impact.service";
import type { CreateProjectImpactEntryPayload } from "@/types/impact";

const impactEntriesKey = (projectId: number) =>
  ["admin-projects", projectId, "impact-entries"] as const;

export function useProjectImpactEntries(projectId: number | null) {
  const enabled = projectId != null && projectId > 0;
  return useQuery({
    queryKey:
      enabled && projectId != null
        ? impactEntriesKey(projectId)
        : ["admin-projects", "impact", "idle"],
    queryFn: () => getProjectImpactEntries(projectId!),
    enabled,
  });
}

export function useCreateProjectImpactEntry(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectImpactEntryPayload) =>
      createProjectImpactEntry(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: impactEntriesKey(projectId) });
      queryClient.invalidateQueries({ queryKey: ["admin-reports", "summary"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-projects", projectId],
      });
    },
  });
}
