import { isNotFoundError } from "@/lib/error-handler";
import { ArrowLeft, PencilSimple } from "@phosphor-icons/react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ProjectImpactSection } from "@/components/admin/ProjectImpactSection";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminProject } from "@/hooks/use-admin-project";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/datetime";
import { PILLAR_LABELS, STATUS_LABELS, STATUS_VARIANT } from "@/lib/project";
import { AdminPage } from "@/components/admin/admin-page";

export default function AdminProjectDetailPage() {
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

  const notFound = isError && isNotFoundError(error);

  function handleEdit() {
    if (!valid) return;
    navigate("/admin/projects", {
      state: { openEditForId: id },
    });
  }

  if (!valid) {
    return (
      <AdminPage>
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
      </AdminPage>
    );
  }

  if (isLoading) {
    return (
      <AdminPage>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-6 h-64 w-full rounded-lg" />
      </AdminPage>
    );
  }

  if (notFound || (isError && !project)) {
    return (
      <AdminPage className="space-y-4">
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
      </AdminPage>
    );
  }

  if (isError || !project) {
    return (
      <AdminPage>
        <p className="text-destructive">
          No se pudo cargar el proyecto. Inténtalo nuevamente.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(0)}>
          Reintentar
        </Button>
      </AdminPage>
    );
  }

  return (
    <AdminPage className="space-y-8">
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
    </AdminPage>
  );
}
