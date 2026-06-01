import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import type { SearchApplicationsParams } from "@/services/admin-applications.service";
import {
  patchApplicationStatus,
  searchApplications,
  getApplicationHistory,
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
    placeholderData: keepPreviousData,
  });
}

export function useApplicationHistory(id: number) {
  return useQuery({
    queryKey: ["application-history", id],
    queryFn: () => getApplicationHistory(id),
  });
}

export function usePatchApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: number;
      status: ApplicationStatus;
      notes?: string;
    }) => patchApplicationStatus(id, status, notes),
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
    onSettled: (_data, _error, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      void queryClient.invalidateQueries({
        queryKey: ["application-history", variables.id],
      });
    },
  });
}
