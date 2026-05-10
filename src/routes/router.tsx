import { createBrowserRouter, Navigate } from "react-router-dom";

import { AdminLayout } from "@/layouts/AdminLayout";
import { AdminActorDetailPage } from "@/pages/AdminActorDetailPage";
import { AdminActorsPage } from "@/pages/AdminActorsPage";
import { AdminApplicationsPage } from "@/pages/AdminApplicationsPage";
import { AdminNotificationsPage } from "@/pages/AdminNotificationsPage";
import { AdminProjectDetailPage } from "@/pages/AdminProjectDetailPage";
import { AdminProjectsPage } from "@/pages/AdminProjectsPage";
import { AdminReportsPage } from "@/pages/AdminReportsPage";
import { AdminUsersPage } from "@/pages/AdminUsersPage";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AdminLoginPage } from "@/pages/AdminLoginPage";
import { PublicHomePage } from "@/pages/PublicHomePage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [{ index: true, element: <PublicHomePage /> }],
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
        element: <AdminProjectDetailPage />,
      },
      { path: "projects", element: <AdminProjectsPage /> },
      { path: "applications", element: <AdminApplicationsPage /> },
      {
        path: "actors/:actorId",
        element: <AdminActorDetailPage />,
      },
      { path: "actors", element: <AdminActorsPage /> },
      { path: "reports", element: <AdminReportsPage /> },
      { path: "notifications", element: <AdminNotificationsPage /> },
      { path: "users", element: <AdminUsersPage /> },
    ],
  },
]);
