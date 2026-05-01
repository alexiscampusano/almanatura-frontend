import { createBrowserRouter } from "react-router-dom";

import { AdminLayout } from "@/layouts/AdminLayout";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
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
    children: [{ index: true, element: <AdminDashboardPage /> }],
  },
]);
