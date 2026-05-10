import { useNavigation } from "react-router-dom";

import { cn } from "@/lib/utils";

/**
 * Barra superior durante la navegación SPA (p. ej. inicio ↔ acceso admin ↔ panel).
 * Debe montarse dentro del árbol de rutas (layout).
 */
export function NavigationProgress() {
  const { state } = useNavigation();
  const busy = state !== "idle";

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[100] h-1 overflow-hidden bg-muted/80 transition-opacity duration-150",
        busy ? "opacity-100" : "opacity-0",
      )}
      aria-hidden={!busy}
    >
      <div
        className={cn(
          "h-full w-1/3 bg-primary motion-safe:animate-nav-indeterminate",
          !busy && "motion-safe:animate-none",
        )}
      />
    </div>
  );
}
