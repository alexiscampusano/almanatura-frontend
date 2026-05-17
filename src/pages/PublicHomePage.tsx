import { useState } from "react";
import {
  CalendarDots,
  MapPin,
  SquaresFour,
  ArrowDown,
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
  } = usePublicProjects(activePillar);

  const projects = data?.pages.flatMap((page) => page.content) ?? [];

  return (
    <section className="flex w-full flex-col gap-6 md:gap-8">
      <div>
        <h1 className="text-2xl font-bold leading-tight md:text-4xl">
          Proyectos activos
        </h1>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground md:text-lg">
          Iniciativas para fortalecer la vida rural. Elige una categoría o
          explora todos los proyectos disponibles.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground md:text-2xl">
          ¿Qué temas te interesan?
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-4">
          <Button
            variant={activePillar === undefined ? "default" : "outline"}
            className={cn(
              "flex h-24 flex-col items-center justify-center gap-2 whitespace-normal p-2 text-center transition-all",
              activePillar === undefined
                ? "shadow-md"
                : "bg-muted/30 hover:bg-muted/80",
            )}
            onClick={() => setActivePillar(undefined)}
          >
            <SquaresFour size={32} weight="duotone" aria-hidden />
            <span className="text-sm font-semibold sm:text-base">Todos</span>
          </Button>
          {ALL_PILLARS.map((pillar) => {
            const config = PILLAR_CONFIG[pillar];
            const Icon = config.icon;
            const isActive = activePillar === pillar;

            return (
              <Button
                key={pillar}
                variant={isActive ? "default" : "outline"}
                className={cn(
                  "flex h-24 flex-col items-center justify-center gap-2 whitespace-normal p-2 text-center transition-all",
                  isActive ? "shadow-md" : "bg-muted/30 hover:bg-muted/80",
                )}
                onClick={() => setActivePillar(pillar)}
              >
                <Icon size={32} weight="duotone" aria-hidden />
                <span className="text-sm font-semibold leading-tight sm:text-base">
                  {config.label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

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

      {isError && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-base font-medium text-destructive">
          No se pudieron cargar los proyectos. Inténtalo nuevamente.
        </p>
      )}

      {projects.length === 0 && !isLoading && !isError && (
        <p className="py-12 text-center text-lg text-muted-foreground">
          No hay proyectos publicados en esta categoría.
        </p>
      )}

      {projects.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
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
                    className="w-fit gap-1.5 px-2.5 py-1 text-xs font-medium"
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

                  <div className="space-y-1.5 text-sm text-muted-foreground">
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
                      buttonVariants({ variant: "outline", size: "default" }),
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

      {hasNextPage && (
        <div className="mt-4 flex justify-center pb-4">
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
    </section>
  );
}
