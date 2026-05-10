import { Link, NavLink, Outlet } from "react-router-dom";

import almanaturaLogo from "@/assets/almanatura-logo.svg";
import { NavigationProgress } from "@/components/navigation-progress";
import { useSyncCurrentUser } from "@/hooks/use-auth-me";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

const adminNavigation = [
  { to: "/admin/projects", label: "Proyectos" },
  { to: "/admin/applications", label: "Solicitudes" },
  { to: "/admin/actors", label: "Actores" },
  { to: "/admin/reports", label: "Reportes" },
  { to: "/admin/notifications", label: "Notificaciones" },
  { to: "/admin/users", label: "Usuarios" },
  { to: "/admin/me", label: "Mi cuenta" },
];

export function AdminLayout() {
  useSyncCurrentUser();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-svh bg-background text-foreground">
      <NavigationProgress />
      <header className="border-b border-border px-4 py-4 md:px-6">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg font-semibold">Panel administrativo</h1>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            {user ? (
              <NavLink
                to="/admin/me"
                className={({ isActive }) =>
                  cn(
                    "inline-flex max-w-[min(100%,14rem)] items-center gap-2 rounded-sm border px-2 py-1.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:max-w-[min(100%,18rem)] sm:px-3 sm:py-2",
                    isActive
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border bg-background hover:bg-muted/80",
                  )
                }
              >
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
                  aria-hidden
                >
                  {getInitials(user.name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium leading-tight">
                    {user.name}
                  </span>
                  <span className="hidden truncate text-xs text-muted-foreground sm:block">
                    {user.email}
                  </span>
                </span>
              </NavLink>
            ) : (
              <span
                className="inline-flex h-9 w-32 animate-pulse rounded-sm bg-muted"
                aria-hidden
              />
            )}
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
              <span className="hidden sm:inline">Ir al inicio</span>
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
