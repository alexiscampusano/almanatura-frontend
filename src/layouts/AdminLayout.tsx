import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  List,
  Folder,
  FileText,
  Users,
  UsersThree,
  ChartBar,
  Bell,
} from "@phosphor-icons/react";

import almanaturaLogo from "@/assets/almanatura-logo.svg";
import { getInitials } from "@/lib/avatar";
import { NavigationProgress } from "@/components/navigation-progress";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSyncCurrentUser } from "@/hooks/use-auth-me";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";

function roleLabel(role: string): string {
  if (role === "SUPER_USER") return "Super usuario";
  if (role === "EVENT_MANAGER") return "Gestor de proyectos";
  return role;
}

const adminNavigation = [
  { to: "/admin/projects", label: "Proyectos", icon: Folder },
  { to: "/admin/applications", label: "Solicitudes", icon: FileText },
  { to: "/admin/actors", label: "Actores", icon: UsersThree },
  { to: "/admin/reports", label: "Reportes", icon: ChartBar },
  { to: "/admin/notifications", label: "Notificaciones", icon: Bell },
  { to: "/admin/users", label: "Usuarios", icon: Users },
];

export function AdminLayout() {
  useSyncCurrentUser();
  const user = useAuthStore((s) => s.user);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-svh bg-background text-foreground flex flex-col">
      <NavigationProgress />
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md shadow-sm px-4 py-4 md:px-6">
        <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center gap-3">
          <h1 className="min-w-0 basis-full flex-1 text-lg font-semibold sm:basis-auto">
            Panel administrativo
          </h1>
          <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:ml-auto sm:w-auto sm:justify-end">
            <Link
              to="/"
              aria-label="Volver al inicio público"
              className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-[var(--text-size-sm)] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <img
                src={almanaturaLogo}
                alt="Logo AlmaNatura"
                className="h-6 w-auto"
              />
              <span className="hidden sm:inline">Ir al inicio</span>
            </Link>
            {user ? (
              <NavLink
                to="/admin/me"
                aria-label={`Mi cuenta, ${roleLabel(user.role)}`}
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-2 rounded-sm border px-2.5 py-2 text-[var(--text-size-sm)] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    isActive
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border bg-background hover:bg-muted/80",
                  )
                }
              >
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-[var(--text-size-xs)] font-semibold text-primary-foreground"
                  aria-hidden
                >
                  {getInitials(user.name)}
                </span>
                <Badge
                  variant="secondary"
                  className="max-w-[11rem] shrink truncate font-normal text-[var(--text-size-xs)] sm:max-w-[10rem] sm:text-[var(--text-size-xs)]"
                >
                  {roleLabel(user.role)}
                </Badge>
              </NavLink>
            ) : (
              <span
                className="inline-flex h-10 w-28 animate-pulse rounded-sm bg-muted"
                aria-hidden
              />
            )}
          </div>
        </div>
      </header>

      <div className="border-b border-border bg-card shadow-sm px-4 py-3 sm:hidden">
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <Button
            variant="outline"
            className="h-[var(--size-button-lg)] w-full justify-start gap-2 text-base font-medium"
            onClick={() => setMobileNavOpen(true)}
          >
            <List size={20} weight="bold" />
            Navegación admin
          </Button>
          <SheetContent side="bottom" className="max-h-[85vh]">
            <SheetHeader>
              <SheetTitle className="text-base">Navegación admin</SheetTitle>
              <SheetDescription>
                Accede rápido a las secciones del panel.
              </SheetDescription>
            </SheetHeader>

            <nav
              aria-label="Navegación del panel admin"
              className="space-y-2 overflow-y-auto px-4 py-2"
            >
              {adminNavigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex min-h-[var(--size-button-lg)] items-center rounded-md px-4 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        size={22}
                        weight={isActive ? "fill" : "regular"}
                        className="mr-3"
                      />
                      {item.label}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col md:flex-row">
        <aside className="hidden shrink-0 bg-zinc-950 text-zinc-400 md:block md:w-64">
          <nav
            aria-label="Navegación del panel admin"
            className="grid gap-1 py-5 pr-4"
          >
            {adminNavigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "inline-flex min-h-[var(--size-button-default)] items-center rounded-r-full px-5 text-[var(--text-size-sm)] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-white/10 hover:text-white",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={20}
                      weight={isActive ? "fill" : "regular"}
                      className="mr-3 shrink-0"
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 w-full flex-1 overflow-x-clip px-4 py-6 md:px-6">
          <Outlet />
          {/* MCP DevTools helper removed per user request */}
        </main>
      </div>
    </div>
  );
}
