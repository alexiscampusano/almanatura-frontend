import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FacebookLogo,
  InstagramLogo,
  Phone,
  EnvelopeSimple,
  YoutubeLogo,
  House,
} from "@phosphor-icons/react";

import almanaturaLogo from "@/assets/almanatura-logo.svg";
import { NavigationProgress } from "@/components/navigation-progress";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PublicLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <NavigationProgress />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-background focus:px-3 focus:py-2 focus:text-[var(--text-size-sm)] focus:font-medium focus:ring-2 focus:ring-ring"
      >
        Saltar al contenido principal
      </a>

      <header className="sticky top-0 z-40 border-b border-primary/40 bg-primary text-primary-foreground">
        <div className="mx-auto flex min-h-[4rem] w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 md:px-6">
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
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/"
              className="flex min-h-[var(--size-button-default)] items-center gap-2 rounded-sm px-2 text-[var(--text-size-sm)] font-medium text-primary-foreground/90 transition-colors hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70 sm:px-0"
            >
              <House size={24} weight="duotone" className="sm:hidden" />
              <span className="hidden sm:inline">Inicio</span>
            </Link>
            <a
              href="mailto:hola@almanatura.com"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "h-[var(--size-button-default)] min-w-0 shrink border-primary-foreground/60 bg-transparent px-4 text-[var(--text-size-sm)] font-medium text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:h-12 md:h-[var(--size-button-default)] gap-2",
              )}
            >
              <EnvelopeSimple size={20} weight="bold" />
              <span>Contacto</span>
            </a>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        className="mx-auto w-full max-w-5xl flex-1 overflow-x-clip px-5 py-6 md:px-6 md:py-8"
      >
        <Outlet />
      </main>

      <footer className="mt-auto border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto w-full max-w-5xl px-5 py-8 md:px-6 md:py-10">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {/* Mission */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold">Reactivamos lo rural.</h2>
              <p className="text-[0.95rem] leading-relaxed opacity-90">
                Impulsamos el desarrollo rural mediante cuatro ejes de
                intervención: empleo, educación, salud y tecnología, mejorando
                la calidad de vida en los pueblos.
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold">¿Necesitas ayuda?</h2>
              <ul className="space-y-3 text-base leading-relaxed">
                <li>
                  <a
                    href="tel:+34900000000"
                    className="flex min-h-[var(--size-button-default)] items-center gap-3 rounded-sm px-2 py-1.5 opacity-90 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70"
                  >
                    <Phone size={22} weight="duotone" className="shrink-0" />
                    <span>Llámanos: 900 000 000</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hola@almanatura.com"
                    className="flex min-h-[var(--size-button-default)] items-center gap-3 rounded-sm px-2 py-1.5 opacity-90 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70"
                  >
                    <EnvelopeSimple
                      size={22}
                      weight="duotone"
                      className="shrink-0"
                    />
                    <span>hola@almanatura.com</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Social & Admin */}
            <div className="space-y-4 sm:col-span-2 md:col-span-1">
              <h2 className="text-lg font-bold">Síguenos</h2>
              <div className="flex items-center gap-4">
                <a
                  href="https://facebook.com/almanatura"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-primary-foreground/10 p-3 transition-colors hover:bg-primary-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70"
                  aria-label="Facebook de Almanatura"
                >
                  <FacebookLogo size={30} weight="fill" />
                </a>
                <a
                  href="https://instagram.com/almanatura"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-primary-foreground/10 p-3 transition-colors hover:bg-primary-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70"
                  aria-label="Instagram de Almanatura"
                >
                  <InstagramLogo size={30} weight="fill" />
                </a>
                <a
                  href="https://youtube.com/almanatura"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-primary-foreground/10 p-3 transition-colors hover:bg-primary-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70"
                  aria-label="YouTube de Almanatura"
                >
                  <YoutubeLogo size={30} weight="fill" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/20 pt-6 text-[var(--text-size-sm)] opacity-80 sm:flex-row">
            <p>
              © {new Date().getFullYear()} AlmaNatura. Todos los derechos
              reservados.
            </p>
            <Link
              to="/admin"
              className="font-medium underline underline-offset-4 hover:text-primary-foreground hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70"
            >
              Acceso equipo administrador
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
