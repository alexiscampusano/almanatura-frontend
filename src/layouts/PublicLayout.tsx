import { Link, Outlet } from "react-router-dom";

import almanaturaLogo from "@/assets/almanatura-logo.svg";
import { NavigationProgress } from "@/components/navigation-progress";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PublicLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <NavigationProgress />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-ring"
      >
        Saltar al contenido principal
      </a>

      <header className="sticky top-0 z-40 border-b border-primary/40 bg-primary text-primary-foreground">
        <div className="mx-auto flex min-h-[4rem] w-full max-w-5xl items-center justify-between gap-3 px-5 py-3 md:px-6">
          <Link
            to="/"
            aria-label="Ir al inicio público"
            className="inline-flex shrink-0 items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70"
          >
            <img
              src={almanaturaLogo}
              alt="Logo AlmaNatura"
              className="h-10 w-auto md:h-9"
            />
          </Link>
          <Link
            to="/admin"
            aria-label="Acceso administrador al panel interno"
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "h-11 min-w-0 shrink border-primary-foreground/60 bg-transparent px-4 text-xs font-medium text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:h-12 sm:text-sm md:h-11",
            )}
          >
            <span className="sm:hidden">Admin</span>
            <span className="hidden sm:inline">Acceso administrador</span>
          </Link>
        </div>
      </header>

      <main
        id="main-content"
        className="mx-auto w-full max-w-5xl flex-1 overflow-x-clip px-5 py-6 md:px-6 md:py-8"
      >
        <Outlet />
      </main>

      <footer className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto grid w-full max-w-5xl gap-1 px-5 py-6 md:px-6">
          <p className="text-base font-medium">Reactivamos lo rural.</p>
          <p className="text-sm opacity-80">
            Cuatro ejes de intervención: empleo, educación, salud y tecnología.
          </p>
        </div>
      </footer>
    </div>
  );
}
