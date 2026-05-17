import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { Spinner } from "@/components/ui/spinner";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthStore } from "@/stores/auth.store";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const hasHydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);
  const expiresAt = useAuthStore((state) => state.expiresAt);

  const hasToken = Boolean(accessToken);
  const hasExpiry = typeof expiresAt === "number";
  const canAccess = hasToken && hasExpiry;

  if (!hasHydrated) {
    return (
      <div
        className="flex min-h-svh items-center justify-center bg-background"
        role="status"
        aria-busy="true"
        aria-label="Preparando sesión"
      >
        <Spinner size="lg" />
      </div>
    );
  }

  if (!canAccess) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <>{children}</>;
}
