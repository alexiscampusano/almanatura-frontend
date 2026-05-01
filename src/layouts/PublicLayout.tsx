import { Link, Outlet } from "react-router-dom";

import almanaturaLogo from "@/assets/almanatura-logo.svg";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PublicLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-ring"
      >
        Saltar al contenido principal
      </a>

      <header className="border-b border-primary/40 bg-primary text-primary-foreground">
        <div className="mx-auto flex min-h-16 w-full max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link
            to="/"
            aria-label="Ir al inicio público"
            className="inline-flex items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70"
          >
            <img
              src={almanaturaLogo}
              alt="Logo AlmaNatura"
              className="h-9 w-auto"
            />
          </Link>
          <Link
            to="/admin/login"
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "h-11 border-primary-foreground/60 bg-transparent px-4 text-sm text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
            )}
          >
            Acceso administrador
          </Link>
        </div>
      </header>

      <main
        id="main-content"
        className="mx-auto w-full max-w-5xl flex-1 px-4 py-8"
      >
        <Outlet />
      </main>

      <footer className="border-t border-border bg-card/80">
        <div className="mx-auto grid w-full max-w-5xl gap-1 px-4 py-5">
          <p className="text-sm font-medium text-foreground">
            Reactivamos lo rural.
          </p>
          <p className="text-sm text-muted-foreground">
            Agenda cultural publica para comunidades rurales.
          </p>
        </div>
      </footer>
    </div>
  );
}
