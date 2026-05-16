/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import { ErrorBoundary } from "@/components/error-boundary";
import { Spinner } from "@/components/ui/spinner";
import { AdminLayout } from "@/layouts/AdminLayout";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AdminLoginPage } from "@/pages/AdminLoginPage";
import { PublicHomePage } from "@/pages/PublicHomePage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

const AdminActorDetailPage = lazy(() => import("@/pages/AdminActorDetailPage"));
const AdminActorsPage = lazy(() => import("@/pages/AdminActorsPage"));
const AdminApplicationsPage = lazy(
  () => import("@/pages/AdminApplicationsPage"),
);
const AdminMePage = lazy(() => import("@/pages/AdminMePage"));
const AdminNotificationsPage = lazy(
  () => import("@/pages/AdminNotificationsPage"),
);
const AdminProjectDetailPage = lazy(
  () => import("@/pages/AdminProjectDetailPage"),
);
const AdminProjectsPage = lazy(() => import("@/pages/AdminProjectsPage"));
const AdminReportsPage = lazy(() => import("@/pages/AdminReportsPage"));
const AdminUsersPage = lazy(() => import("@/pages/AdminUsersPage"));
const PublicProjectDetailPage = lazy(
  () => import("@/pages/PublicProjectDetailPage"),
);

const PageLoader = () => (
  <div
    className="flex min-h-[50vh] items-center justify-center"
    role="status"
    aria-label="Cargando página"
  >
    <Spinner size="lg" />
  </div>
);

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

const withErrorBoundary = (element: React.ReactNode) => (
  <ErrorBoundary>{element}</ErrorBoundary>
);

const withSafeLoading = (element: React.ReactNode) =>
  withErrorBoundary(withSuspense(element));

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <PublicHomePage /> },
      {
        path: "projects/:projectId",
        element: withSafeLoading(<PublicProjectDetailPage />),
      },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="projects" replace /> },
      {
        path: "projects/:projectId",
        element: withSafeLoading(<AdminProjectDetailPage />),
      },
      { path: "projects", element: withSafeLoading(<AdminProjectsPage />) },
      {
        path: "applications",
        element: withSafeLoading(<AdminApplicationsPage />),
      },
      {
        path: "actors/:actorId",
        element: withSafeLoading(<AdminActorDetailPage />),
      },
      { path: "actors", element: withSafeLoading(<AdminActorsPage />) },
      { path: "reports", element: withSafeLoading(<AdminReportsPage />) },
      {
        path: "notifications",
        element: withSafeLoading(<AdminNotificationsPage />),
      },
      { path: "users", element: withSafeLoading(<AdminUsersPage />) },
      { path: "me", element: withSafeLoading(<AdminMePage />) },
    ],
  },
]);
