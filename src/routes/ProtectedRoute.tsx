import type { ReactNode } from "react";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/stores/auth.store";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { accessToken, isSessionExpired, validateSession, clearSession } =
    useAuthStore((state) => ({
      accessToken: state.accessToken,
      isSessionExpired: state.isSessionExpired,
      validateSession: state.validateSession,
      clearSession: state.clearSession,
    }));

  useEffect(() => {
    validateSession();
  }, [validateSession]);

  if (!accessToken || isSessionExpired) {
    if (isSessionExpired) {
      clearSession();
    }
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
