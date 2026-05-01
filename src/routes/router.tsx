import { createBrowserRouter, Navigate } from "react-router-dom";

import { AdminLayout } from "@/layouts/AdminLayout";
import { AdminAccountsPage } from "@/pages/AdminAccountsPage";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AdminEventsPage } from "@/pages/AdminEventsPage";
import { AdminLoginPage } from "@/pages/AdminLoginPage";
import { AdminReportsPage } from "@/pages/AdminReportsPage";
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
      { index: true, element: <Navigate to="eventos" replace /> },
      { path: "eventos", element: <AdminEventsPage /> },
      { path: "reportes", element: <AdminReportsPage /> },
      { path: "cuentas", element: <AdminAccountsPage /> },
    ],
  },
]);
