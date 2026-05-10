import { useEffect, useState } from "react";

import { useAuthStore } from "@/stores/auth.store";

/** `true` cuando el persist de auth terminó de leer `sessionStorage` (evita flash de login / rutas). */
export function useAuthHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() =>
    useAuthStore.persist.hasHydrated(),
  );

  useEffect(() => {
    return useAuthStore.persist.onFinishHydration(() => {
      queueMicrotask(() => {
        setHydrated(true);
      });
    });
  }, []);

  return hydrated;
}
