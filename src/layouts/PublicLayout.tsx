import { Link, Outlet } from "react-router-dom";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PublicLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      <header className="border-b border-border bg-card/80">
        <div className="mx-auto flex min-h-16 w-full max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link
            to="/"
            aria-label="Go to public home"
            className="text-xl font-semibold tracking-tight"
          >
            AlmaNatura
          </Link>
          <Link
            to="/admin/login"
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "h-11 px-4 text-sm",
            )}
          >
            Admin access
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
            Public cultural agenda for rural communities.
          </p>
        </div>
      </footer>
    </div>
  );
}
