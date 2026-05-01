import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/stores/auth.store";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const expiresAt = useAuthStore((state) => state.expiresAt);

  const hasToken = Boolean(accessToken);
  const hasExpiry = typeof expiresAt === "number";
  const canAccess = hasToken && hasExpiry;

  if (!canAccess) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
