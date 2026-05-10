import { isAxiosError } from "axios";
import { ArrowLeft, PencilSimple } from "@phosphor-icons/react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ProjectImpactSection } from "@/components/admin/ProjectImpactSection";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAdminProject } from "@/hooks/use-admin-project";
import { cn } from "@/lib/utils";
import type { ProjectPillar, ProjectStatus } from "@/types/project";

const PILLAR_LABELS: Record<ProjectPillar, string> = {
  TECHNOLOGY: "Tecnología",
  EDUCATION: "Educación",
  HEALTH: "Salud",
  ENTREPRENEURSHIP: "Emprendimiento",
  CULTURE: "Cultura",
};

const STATUS_LABELS: Record<ProjectStatus, string> = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicado",
  CANCELLED: "Cancelado",
};

const STATUS_VARIANT: Record<
  ProjectStatus,
  "default" | "secondary" | "destructive"
> = {
  DRAFT: "secondary",
  PUBLISHED: "default",
  CANCELLED: "destructive",
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function AdminProjectDetailPage() {
  const { projectId: param } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const id = Number(param);
  const valid = Number.isFinite(id) && id > 0;

  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useAdminProject(valid ? id : 0);

  const notFound =
    isError && isAxiosError(error) && error.response?.status === 404;

  function handleEdit() {
    if (!valid) return;
    navigate("/admin/projects", {
      state: { openEditForId: id },
    });
  }

  if (!valid) {
    return (
      <section className="mx-auto w-full max-w-3xl">
        <p className="text-destructive">Identificador no válido.</p>
        <Link
          to="/admin/projects"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-4 inline-flex",
          )}
        >
          Volver al listado
        </Link>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-3xl">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-6 h-64 animate-pulse rounded-lg bg-muted" />
      </section>
    );
  }

  if (notFound || (isError && !project)) {
    return (
      <section className="mx-auto w-full max-w-3xl space-y-4">
        <h1 className="text-2xl font-semibold">Proyecto no encontrado</h1>
        <p className="text-muted-foreground">
          No existe o no tienes permiso para verlo.
        </p>
        <Link
          to="/admin/projects"
          className={cn(buttonVariants({ variant: "outline" }), "inline-flex")}
        >
          Volver al listado
        </Link>
      </section>
    );
  }

  if (isError || !project) {
    return (
      <section className="mx-auto w-full max-w-3xl">
        <p className="text-destructive">
          No se pudo cargar el proyecto. Inténtalo nuevamente.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(0)}>
          Reintentar
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground"
          onClick={() => navigate("/admin/projects")}
        >
          <ArrowLeft size={18} weight="bold" aria-hidden />
          Volver
        </Button>
        <div className="grow" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleEdit}
        >
          <PencilSimple size={18} weight="bold" aria-hidden />
          Editar en lista
        </Button>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold">{project.title}</h1>
          <Badge variant={STATUS_VARIANT[project.status]}>
            {STATUS_LABELS[project.status]}
          </Badge>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {PILLAR_LABELS[project.pillar]}
          {project.location ? ` · ${project.location}` : ""}
        </p>
      </div>

      {project.imageUrl && (
        <img
          src={project.imageUrl}
          alt=""
          className="max-h-80 w-full rounded-lg border object-cover object-center"
          loading="lazy"
        />
      )}

      {project.description && (
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">
            Descripción
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-base leading-relaxed">
            {project.description}
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">Inicio</h2>
          <p className="mt-1">{formatDate(project.startsAt)}</p>
        </div>
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">Fin</h2>
          <p className="mt-1">{formatDate(project.endsAt)}</p>
        </div>
      </div>

      <ProjectImpactSection projectId={project.id} />
    </section>
  );
}
