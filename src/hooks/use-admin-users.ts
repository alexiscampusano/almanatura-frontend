import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createInternalUser,
  listInternalUsers,
} from "@/services/admin-users.service";
import type { CreateUserPayload } from "@/types/user";

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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
