import { Outlet } from "react-router-dom";

export function PublicLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="border-b border-border px-4 py-4">
        <p className="text-lg font-semibold">AlmaNatura</p>
      </header>
      <main className="flex-1 px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-border px-4 py-4 text-sm text-muted-foreground">
        Reactivamos lo rural.
      </footer>
    </div>
  );
}
