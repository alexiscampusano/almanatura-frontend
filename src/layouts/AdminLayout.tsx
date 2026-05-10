import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import almanaturaLogo from "@/assets/almanatura-logo.svg";
import { NavigationProgress } from "@/components/navigation-progress";
import { Button } from "@/components/ui/button";
import { useSyncCurrentUser } from "@/hooks/use-auth-me";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";

const adminNavigation = [
  { to: "/admin/projects", label: "Proyectos" },
  { to: "/admin/applications", label: "Solicitudes" },
  { to: "/admin/actors", label: "Actores" },
  { to: "/admin/reports", label: "Reportes" },
  { to: "/admin/notifications", label: "Notificaciones" },
  { to: "/admin/users", label: "Usuarios" },
];

export function AdminLayout() {
  useSyncCurrentUser();
  const navigate = useNavigate();
  const clearSession = useAuthStore((s) => s.clearSession);
  const user = useAuthStore((s) => s.user);

  function handleLogout() {
    clearSession();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <NavigationProgress />
      <header className="border-b border-border px-4 py-4 md:px-6">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold">Panel administrativo</h1>
            {user && (
              <p className="truncate text-xs text-muted-foreground">
                {user.name} · {user.email}
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={handleLogout}
            >
              Cerrar sesión
            </Button>
            <Link
              to="/"
              aria-label="Volver al inicio público"
              className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <img
                src={almanaturaLogo}
                alt="Logo AlmaNatura"
                className="h-6 w-auto"
              />
              <span>Ir al inicio</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-col md:flex-row">
        <aside className="border-b border-border md:w-64 md:border-b-0 md:border-r">
          <nav
            aria-label="Navegación del panel admin"
            className="flex gap-2 overflow-x-auto px-3 py-3 md:grid md:gap-1 md:px-4 md:py-5"
          >
            {adminNavigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "inline-flex min-h-11 items-center rounded-sm border border-transparent px-3 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 px-4 py-6 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
