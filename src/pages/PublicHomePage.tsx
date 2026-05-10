import { useState } from "react";
import {
  CalendarDots,
  GraduationCap,
  Heartbeat,
  Laptop,
  MapPin,
  MusicNotes,
  Rocket,
} from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PublicApplicationDialog } from "@/components/PublicApplicationForm";

import { usePublicProjects } from "@/hooks/use-public-projects";
import type { ProjectPillar } from "@/types/project";

const PILLAR_CONFIG: Record<
  ProjectPillar,
  { label: string; icon: typeof Laptop; bg: string }
> = {
  TECHNOLOGY: { label: "Tecnología", icon: Laptop, bg: "bg-sky-100" },
  EDUCATION: { label: "Educación", icon: GraduationCap, bg: "bg-amber-100" },
  HEALTH: { label: "Salud", icon: Heartbeat, bg: "bg-emerald-100" },
  ENTREPRENEURSHIP: {
    label: "Emprendimiento",
    icon: Rocket,
    bg: "bg-violet-100",
  },
  CULTURE: { label: "Cultura", icon: MusicNotes, bg: "bg-rose-100" },
};

const ALL_PILLARS: ProjectPillar[] = [
  "TECHNOLOGY",
  "EDUCATION",
  "HEALTH",
  "ENTREPRENEURSHIP",
  "CULTURE",
];

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "Sin fecha";
  return date.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function PublicHomePage() {
  const [activePillar, setActivePillar] = useState<ProjectPillar | undefined>(
    undefined,
  );
  const {
    data: projects,
    isLoading,
    isError,
  } = usePublicProjects(activePillar);

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

      {/* Horizontal scroll on mobile, wrap on desktop */}
      <div className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:gap-3 md:overflow-visible md:px-0 md:pb-0">
        <Button
          variant={activePillar === undefined ? "default" : "outline"}
          className="h-12 shrink-0 px-5 text-sm font-medium md:h-11"
          onClick={() => setActivePillar(undefined)}
        >
          Todos
        </Button>
        {ALL_PILLARS.map((pillar) => {
          const config = PILLAR_CONFIG[pillar];
          const Icon = config.icon;
          return (
            <Button
              key={pillar}
              variant={activePillar === pillar ? "default" : "outline"}
              className="h-12 shrink-0 gap-2 px-4 text-sm font-medium md:h-11 md:px-5"
              onClick={() => setActivePillar(pillar)}
            >
              <Icon size={20} weight="bold" aria-hidden />
              {config.label}
            </Button>
          );
        })}
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

      {projects && projects.length === 0 && (
        <p className="py-12 text-center text-lg text-muted-foreground">
          No hay proyectos publicados en esta categoría.
        </p>
      )}

      {projects && projects.length > 0 && (
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
                        {formatDate(project.startsAt)} —{" "}
                        {formatDate(project.endsAt)}
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

                <CardFooter className="border-t border-border/60 px-5 pb-5 pt-4 md:px-6">
                  <PublicApplicationDialog
                    projectId={project.id}
                    projectTitle={project.title}
                  />
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
