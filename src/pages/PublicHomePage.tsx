import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDots,
  MapPin,
  SquaresFour,
  ArrowDown,
  ArrowUp,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PublicApplicationDialog } from "@/components/PublicApplicationForm";

import { usePublicProjects } from "@/hooks/use-public-projects";
import { formatDateLong } from "@/lib/datetime";
import { ALL_PILLARS, PILLAR_CONFIG } from "@/lib/project";
import { cn } from "@/lib/utils";
import type { ProjectPillar } from "@/types/project";

function PillarButton({
  pillar,
  activePillar,
  onClick,
  compact = false,
}: {
  pillar?: ProjectPillar;
  activePillar: ProjectPillar | undefined;
  onClick: () => void;
  compact?: boolean;
}) {
  const isActive = activePillar === pillar;
  const config = pillar ? PILLAR_CONFIG[pillar] : null;
  const Icon = config?.icon ?? SquaresFour;
  const label = config?.label ?? "Todos";

  if (compact) {
    return (
      <Button
        variant={isActive ? "default" : "outline"}
        className={cn(
          "w-full justify-start gap-3 text-[var(--text-size-sm)] font-medium transition-all",
          isActive ? "shadow-sm" : "bg-muted/20 hover:bg-muted/50",
        )}
        onClick={onClick}
      >
        <Icon size={20} weight="duotone" aria-hidden />
        {label}
      </Button>
    );
  }

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      className={cn(
        "h-[var(--size-button-default)] shrink-0 gap-2 px-4 text-[var(--text-size-sm)] font-medium transition-all",
        isActive ? "shadow-sm" : "bg-muted/20 hover:bg-muted/50",
      )}
      onClick={onClick}
    >
      <Icon size={18} weight="duotone" aria-hidden />
      {label}
    </Button>
  );
}

export function PublicHomePage() {
  const [activePillar, setActivePillar] = useState<ProjectPillar | undefined>(
    undefined,
  );
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = usePublicProjects(activePillar);

  const projects = useMemo(
    () => data?.pages.flatMap((page) => page.content) ?? [],
    [data],
  );

  const topFiltersRef = useRef<HTMLDivElement>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const asideRef = useRef<HTMLElement | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileFiltersDimmed, setMobileFiltersDimmed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setSidebarVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" },
    );

    const el = topFiltersRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  // Ensure that when the sidebar is hidden (aria-hidden) its focusable children
  // are not tabbable. Use a small effect to set `inert` where supported and
  // fallback to removing tabindex from focusable elements.
  useEffect(() => {
    const aside = asideRef.current;
    if (!aside) return;

    // prefer native inert
    try {
      // cast to a shaped type to avoid explicit any
      const a = aside as HTMLElement & { inert?: boolean };
      a.inert = !sidebarVisible;
    } catch {
      // ignore if inert not supported
    }

    const focusable = aside.querySelectorAll<HTMLElement>(
      "a[href], button, input, select, textarea, [tabindex]",
    );

    focusable.forEach((el) => {
      if (!sidebarVisible) {
        if (el.hasAttribute("tabindex")) {
          el.setAttribute(
            "data-prev-tabindex",
            el.getAttribute("tabindex") || "",
          );
        }
        el.setAttribute("tabindex", "-1");
      } else {
        if (el.hasAttribute("data-prev-tabindex")) {
          const prev = el.getAttribute("data-prev-tabindex");
          if (prev === "") el.removeAttribute("tabindex");
          else el.setAttribute("tabindex", prev || "0");
          el.removeAttribute("data-prev-tabindex");
        } else {
          el.removeAttribute("tabindex");
        }
      }
    });
  }, [sidebarVisible]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowBackToTop(scrollY > 300);
      setMobileFiltersDimmed(scrollY > 120);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activePillar]);

  const isEmpty = !isLoading && projects.length === 0 && !isError;
  const isTransitioning = isFetching && !isLoading;

  const allPillars = [undefined, ...ALL_PILLARS];

  return (
    <section className="flex w-full flex-col gap-6 md:gap-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold leading-tight md:text-4xl">
          Proyectos activos
        </h1>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground md:text-lg">
          Iniciativas para fortalecer la vida rural. Elige una categoría o
          explora todos los proyectos disponibles.
        </p>
      </div>

      {/* Desktop top filters (single horizontal line) */}
      <div ref={topFiltersRef} className="hidden md:block">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {allPillars.map((pillar) => (
            <PillarButton
              key={pillar ?? "all"}
              pillar={pillar}
              activePillar={activePillar}
              onClick={() => setActivePillar(pillar)}
            />
          ))}
        </div>
      </div>

      {/* Content area: sidebar + projects (desktop) */}
      <div className="relative flex gap-8 md:min-h-[16rem]">
        {/* Desktop sticky sidebar */}
        <aside
          ref={asideRef}
          className={cn(
            "hidden w-44 shrink-0 flex-col gap-2 transition-all duration-300 md:flex",
            sidebarVisible
              ? "sticky top-24 self-start opacity-100"
              : "opacity-0",
          )}
          aria-hidden={!sidebarVisible}
        >
          <p className="mb-1 text-[var(--text-size-xs)] font-semibold uppercase tracking-wider text-muted-foreground">
            Filtrar
          </p>
          {allPillars.map((pillar) => (
            <PillarButton
              key={`sidebar-${pillar ?? "all"}`}
              pillar={pillar}
              activePillar={activePillar}
              onClick={() => setActivePillar(pillar)}
              compact
            />
          ))}
        </aside>

        {/* Projects area */}
        <div className="min-w-0 flex-1">
          <div className="relative min-h-[16rem] transition-all duration-300">
            {/* Subtle loading bar during transitions */}
            {isTransitioning && (
              <div className="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden rounded-full bg-primary/10">
                <div className="h-full w-1/3 animate-shimmer rounded-full bg-primary/60" />
              </div>
            )}

            {/* Initial loading skeleton */}
            {isLoading && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-44 w-full rounded-t-lg bg-muted md:h-48" />
                    <CardHeader>
                      <div className="h-5 w-1/3 rounded bg-muted" />
                      <div className="mt-3 h-6 w-3/4 rounded bg-muted" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 w-full rounded bg-muted" />
                        <div className="h-4 w-2/3 rounded bg-muted" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Error state */}
            {isError && (
              <p className="rounded-lg bg-destructive/10 px-4 py-3 text-base font-medium text-destructive">
                No se pudieron cargar los proyectos. Inténtalo nuevamente.
              </p>
            )}

            {/* Empty state - friendly */}
            {isEmpty && (
              <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border/60 bg-muted/20 py-16 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                  <MagnifyingGlass
                    size={32}
                    weight="duotone"
                    className="text-primary/70"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-foreground">
                    No hay proyectos en esta categoría todavía
                  </p>
                  <p className="text-[var(--text-size-sm)] text-muted-foreground">
                    Explora otra categoría o vuelve más tarde para ver
                    novedades.
                  </p>
                </div>
              </div>
            )}

            {/* Projects grid */}
            {projects.length > 0 && (
              <div
                className={cn(
                  "grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 transition-opacity duration-200",
                  isTransitioning && "opacity-40",
                )}
              >
                {projects.map((project) => {
                  const config = PILLAR_CONFIG[project.pillar];
                  const PillarIcon = config.icon;

                  return (
                    <Card
                      key={project.id}
                      className="flex flex-col overflow-hidden shadow-sm transition-shadow hover:shadow-md"
                    >
                      {project.imageUrl ? (
                        <img
                          src={project.imageUrl}
                          alt=""
                          className="h-44 w-full object-cover md:h-48"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className={`flex h-44 w-full items-center justify-center md:h-48 ${config.bg}`}
                        >
                          <PillarIcon
                            size={56}
                            weight="duotone"
                            className="text-foreground/25"
                            aria-hidden
                          />
                        </div>
                      )}

                      <CardHeader className="gap-2 px-5 pt-5 md:px-6">
                        <Badge
                          variant="secondary"
                          className="w-fit gap-1.5 px-2.5 py-1 text-[var(--text-size-xs)] font-medium"
                        >
                          <PillarIcon size={14} weight="bold" aria-hidden />
                          {config.label}
                        </Badge>
                        <CardTitle className="text-lg font-bold leading-snug md:text-xl">
                          {project.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="flex-1 space-y-3 px-5 md:px-6">
                        <p className="line-clamp-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                          {project.description}
                        </p>

                        <div className="space-y-1.5 text-[var(--text-size-sm)] text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <CalendarDots
                              size={18}
                              weight="bold"
                              className="shrink-0 text-primary/70"
                              aria-hidden
                            />
                            <span>
                              {formatDateLong(project.startsAt)} —{" "}
                              {formatDateLong(project.endsAt)}
                            </span>
                          </p>
                          {project.location && (
                            <p className="flex items-center gap-2">
                              <MapPin
                                size={18}
                                weight="bold"
                                className="shrink-0 text-primary/70"
                                aria-hidden
                              />
                              <span>{project.location}</span>
                            </p>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter className="grid w-full min-w-0 gap-3 border-t border-border/60 bg-muted/20 px-4 py-4 sm:grid-cols-2 md:px-6">
                        <Link
                          to={`/projects/${project.id}`}
                          className={cn(
                            buttonVariants({
                              variant: "outline",
                              size: "default",
                            }),
                            "min-w-0 w-full justify-center",
                          )}
                        >
                          Ver detalle
                        </Link>
                        <PublicApplicationDialog
                          projectId={project.id}
                          projectTitle={project.title}
                          triggerClassName="min-w-0 w-full justify-center"
                        />
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop load more button */}
          {hasNextPage && (
            <div className="mt-6 flex justify-center pb-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full max-w-sm h-14 text-base font-semibold shadow-sm gap-2"
              >
                {isFetchingNextPage ? (
                  "Cargando..."
                ) : (
                  <>
                    <ArrowDown size={20} weight="bold" />
                    Cargar más proyectos
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile floating filter bar (sticky bottom, stops before footer) */}
      <div
        className={cn(
          "sticky bottom-0 z-40 -mx-5 mt-8 border-t px-5 py-4 backdrop-blur-xl transition-all duration-300 md:hidden",
          mobileFiltersDimmed
            ? "border-border/50 bg-background/78 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]"
            : "border-border bg-background/95 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]",
        )}
      >
        <p className="mb-3 text-[var(--text-size-xs)] font-semibold text-muted-foreground">
          Filtrar por tema:
        </p>
        <div className="grid grid-cols-3 gap-2">
          {allPillars.map((pillar) => {
            const config = pillar ? PILLAR_CONFIG[pillar] : null;
            const Icon = config?.icon ?? SquaresFour;
            const label = config?.label ?? "Todos";
            const isActive = activePillar === pillar;

            return (
              <Button
                key={`mobile-${pillar ?? "all"}`}
                variant={isActive ? "default" : "outline"}
                className={cn(
                  "h-10 gap-1.5 px-3 text-[var(--text-size-xs)] font-semibold",
                  isActive ? "shadow-sm" : "bg-muted/20 hover:bg-muted/50",
                )}
                onClick={() => setActivePillar(pillar)}
              >
                <Icon size={16} weight="duotone" aria-hidden />
                {label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          "fixed right-4 z-50 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          showBackToTop
            ? "bottom-20 opacity-100 md:bottom-8"
            : "bottom-8 opacity-0 pointer-events-none",
        )}
        aria-label="Volver al inicio"
      >
        <ArrowUp size={24} weight="bold" />
      </button>
    </section>
  );
}
