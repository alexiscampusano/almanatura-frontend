import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { SearchApplicationsParams } from "@/services/admin-applications.service";
import {
  patchApplicationStatus,
  searchApplications,
} from "@/services/admin-applications.service";
import type { ApplicationStatus } from "@/types/application";

export function applicationQueryKey(params: SearchApplicationsParams) {
  return ["admin-applications", params] as const;
}

export function useAdminApplications(params: SearchApplicationsParams) {
  return useQuery({
    queryKey: applicationQueryKey(params),
    queryFn: () => searchApplications(params),
  });
}

export function usePatchApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ApplicationStatus }) =>
      patchApplicationStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
    },
  });
}
