import { NavLink, Outlet } from "react-router-dom";

import { cn } from "@/lib/utils";

const adminNavigation = [
  { to: "/admin/eventos", label: "Eventos" },
  { to: "/admin/reportes", label: "Reportes" },
  { to: "/admin/cuentas", label: "Gestión de cuentas" },
];

export function AdminLayout() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b border-border px-4 py-4 md:px-6">
        <h1 className="text-lg font-semibold">Panel administrativo</h1>
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
