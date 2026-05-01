import { Link, Outlet } from "react-router-dom";

export function AdminLayout() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b border-border px-4 py-4">
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link to="/admin">Eventos</Link>
          <span className="text-muted-foreground">Reportes</span>
          <span className="text-muted-foreground">Gestión de cuentas</span>
        </nav>
      </header>
      <main className="px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
