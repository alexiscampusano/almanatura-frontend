import { isAxiosError } from "axios";
import { ArrowLeft, CalendarDots, MapPin } from "@phosphor-icons/react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { PublicApplicationDialog } from "@/components/PublicApplicationForm";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePublicProject } from "@/hooks/use-public-project";
import { cn } from "@/lib/utils";
import type { ProjectPillar } from "@/types/project";

const PILLAR_CONFIG: Record<ProjectPillar, { label: string; bg: string }> = {
  TECHNOLOGY: { label: "Tecnología", bg: "bg-sky-100" },
  EDUCATION: { label: "Educación", bg: "bg-amber-100" },
  HEALTH: { label: "Salud", bg: "bg-emerald-100" },
  ENTREPRENEURSHIP: {
    label: "Emprendimiento",
    bg: "bg-violet-100",
  },
  CULTURE: { label: "Cultura", bg: "bg-rose-100" },
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "Sin fecha";
  return date.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function PublicProjectDetailPage() {
  const { projectId: param } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const id = Number(param);
  const valid = Number.isFinite(id) && id > 0;

  const {
    data: project,
    isLoading,
    isError,
    error,
  } = usePublicProject(valid ? id : 0);

  const notFound =
    isError && isAxiosError(error) && error.response?.status === 404;

  if (!valid) {
    return (
      <section className="mx-auto w-full max-w-3xl py-8">
        <p className="text-destructive">Identificador de proyecto no válido.</p>
        <Link
          to="/"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-4 inline-flex",
          )}
        >
          Volver al inicio
        </Link>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-3xl py-6">
        <div className="mb-6 h-10 w-40 animate-pulse rounded bg-muted" />
        <div className="h-64 w-full animate-pulse rounded-lg bg-muted" />
      </section>
    );
  }

  if (notFound || (isError && !project)) {
    return (
      <section className="mx-auto w-full max-w-3xl py-8">
        <h1 className="text-2xl font-semibold">Proyecto no disponible</h1>
        <p className="mt-2 text-muted-foreground">
          No existe o ya no está publicado.
        </p>
        <Link
          to="/"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-6 inline-flex",
          )}
        >
          Volver al listado
        </Link>
      </section>
    );
  }

  if (isError || !project) {
    return (
      <section className="mx-auto w-full max-w-3xl py-8">
        <p className="text-destructive">
          No se pudo cargar el proyecto. Inténtalo nuevamente.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(0)}>
          Reintentar
        </Button>
      </section>
    );
  }

  const config = PILLAR_CONFIG[project.pillar];

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Button
        type="button"
        variant="ghost"
        className="-ml-3 w-fit gap-2 px-3 text-muted-foreground hover:text-foreground"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} weight="bold" aria-hidden />
        Volver
      </Button>

      <Card className="overflow-hidden shadow-sm">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt=""
            className="aspect-video w-full object-cover md:max-h-[22rem]"
            loading="lazy"
          />
        ) : (
          <div
            className={`flex aspect-video max-h-80 w-full items-center justify-center md:aspect-[21/9] ${config.bg}`}
          />
        )}

        <CardHeader className="gap-3 px-5 pt-6 md:px-8">
          <Badge variant="secondary" className="w-fit px-2.5 py-1 text-xs">
            {config.label}
          </Badge>
          <CardTitle className="text-2xl font-bold leading-tight md:text-3xl">
            {project.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 px-5 md:px-8">
          <p className="whitespace-pre-wrap text-base leading-relaxed text-muted-foreground md:text-lg">
            {project.description}
          </p>

          <div className="space-y-2 text-muted-foreground">
            <p className="flex items-start gap-2 text-sm md:text-base">
              <CalendarDots
                size={22}
                weight="bold"
                className="mt-0.5 shrink-0 text-primary/70"
                aria-hidden
              />
              <span>
                {formatDate(project.startsAt)} — {formatDate(project.endsAt)}
              </span>
            </p>
            {project.location && (
              <p className="flex items-start gap-2 text-sm md:text-base">
                <MapPin
                  size={22}
                  weight="bold"
                  className="mt-0.5 shrink-0 text-primary/70"
                  aria-hidden
                />
                <span>{project.location}</span>
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t border-border/60 bg-muted/15 px-5 py-5 md:px-8 sm:flex-row sm:items-center sm:justify-end">
          <PublicApplicationDialog
            projectId={project.id}
            projectTitle={project.title}
            triggerClassName="w-full justify-center sm:w-auto"
          />
        </CardFooter>
      </Card>
    </section>
  );
}
