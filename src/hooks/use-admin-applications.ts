import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { SearchApplicationsParams } from "@/services/admin-applications.service";
import {
  patchApplicationStatus,
  searchApplications,
} from "@/services/admin-applications.service";
import type {
  AdminApplicationResponse,
  ApplicationStatus,
} from "@/types/application";

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
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["admin-applications"] });
      const previous = queryClient.getQueryData(["admin-applications"]);

      queryClient.setQueryData(
        ["admin-applications"],
        (old: AdminApplicationResponse[]) =>
          old?.map((app) => (app.id === id ? { ...app, status } : app)),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["admin-applications"], context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
    },
  });
}
