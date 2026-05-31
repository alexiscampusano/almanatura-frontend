import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createInternalUser,
  listInternalUsers,
} from "@/services/admin-users.service";
import type { CreateUserPayload, UserSummary } from "@/types/user";

const QUERY_KEY = ["admin-users"] as const;

export function useInternalUsers() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: listInternalUsers,
  });
}

export function useCreateInternalUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserPayload) => createInternalUser(data),
    onMutate: async (newUser) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previous = queryClient.getQueryData(QUERY_KEY);

      queryClient.setQueryData(QUERY_KEY, (old: UserSummary[]) => [
        ...(old ?? []),
        { ...newUser, id: Date.now() } satisfies Partial<UserSummary>,
      ]);

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEY, context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteInternalUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      import("@/services/admin-users.service").then((m) => m.deleteUser(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
