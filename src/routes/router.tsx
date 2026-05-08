import { createBrowserRouter, Navigate } from "react-router-dom";

import { AdminLayout } from "@/layouts/AdminLayout";
import { AdminActorsPage } from "@/pages/AdminActorsPage";
import { AdminApplicationsPage } from "@/pages/AdminApplicationsPage";
import { AdminLoginPage } from "@/pages/AdminLoginPage";
import { AdminProjectsPage } from "@/pages/AdminProjectsPage";
import { AdminReportsPage } from "@/pages/AdminReportsPage";
import { AdminUsersPage } from "@/pages/AdminUsersPage";
import { PublicLayout } from "@/layouts/PublicLayout";
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
      { path: "projects", element: <AdminProjectsPage /> },
      { path: "applications", element: <AdminApplicationsPage /> },
      { path: "actors", element: <AdminActorsPage /> },
      { path: "reports", element: <AdminReportsPage /> },
      { path: "users", element: <AdminUsersPage /> },
    ],
  },
]);
