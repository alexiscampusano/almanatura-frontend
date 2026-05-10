import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { fetchCurrentUser } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

/** Refresca el usuario desde GET /auth/me cuando hay sesión (p. ej. rol o nombre actualizados en servidor). */
export function useSyncCurrentUser() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const updateUser = useAuthStore((s) => s.updateUser);

  const { data } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchCurrentUser,
    enabled: Boolean(accessToken),
    staleTime: 60_000,
    retry: false,
  });

  useEffect(() => {
    if (data) {
      updateUser(data);
    }
  }, [data, updateUser]);
}
