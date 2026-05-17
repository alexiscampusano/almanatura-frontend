import { isNotFoundError } from "@/lib/error-handler";
import { ArrowLeft } from "@phosphor-icons/react";
import { getAvatarColor, getInitials } from "@/lib/avatar";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActor } from "@/hooks/use-actors";
import { PILLAR_LABELS } from "@/lib/project";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/types/application";

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  SUBMITTED: "Enviada",
  UNDER_REVIEW: "En revisión",
  REJECTED: "Rechazada",
  NEEDS_INFO: "Requiere información",
  APPROVED: "Aprobada",
  REGISTERED_AS_ACTOR: "Registrado como actor",
};

const STATUS_VARIANT: Record<
  ApplicationStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  SUBMITTED: "secondary",
  UNDER_REVIEW: "secondary",
  REJECTED: "destructive",
  NEEDS_INFO: "outline",
  APPROVED: "default",
  REGISTERED_AS_ACTOR: "default",
};

export default function AdminActorDetailPage() {
  const { actorId: param } = useParams<{ actorId: string }>();
  const navigate = useNavigate();
  const id = Number(param);
  const valid = Number.isFinite(id) && id > 0;

  const { data: actor, isLoading, isError, error } = useActor(valid ? id : 0);

  const notFound = isError && isNotFoundError(error);

  if (!valid) {
    return (
      <section className="mx-auto w-full max-w-lg">
        <p className="text-destructive">Identificador no válido.</p>
        <Link
          to="/admin/actors"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-4 inline-flex",
          )}
        >
          Volver al directorio
        </Link>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-lg">
        <div className="h-10 w-64 animate-pulse rounded bg-muted" />
        <div className="mt-8 h-32 animate-pulse rounded-lg bg-muted" />
      </section>
    );
  }

  if (notFound || (isError && !actor)) {
    return (
      <section className="mx-auto w-full max-w-lg space-y-4">
        <h1 className="text-2xl font-semibold">Actor no encontrado</h1>
        <p className="text-muted-foreground">
          No existe o no tienes permiso para verlo.
        </p>
        <Link
          to="/admin/actors"
          className={cn(buttonVariants({ variant: "outline" }), "inline-flex")}
        >
          Volver al directorio
        </Link>
      </section>
    );
  }

  if (isError || !actor) {
    return (
      <section className="mx-auto w-full max-w-lg">
        <p className="text-destructive">
          No se pudo cargar el actor. Inténtalo nuevamente.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(0)}>
          Reintentar
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-2xl space-y-8">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground"
        onClick={() => navigate("/admin/actors")}
      >
        <ArrowLeft size={18} weight="bold" aria-hidden />
        Volver al directorio
      </Button>

      <div className="flex flex-col items-center gap-6 rounded-lg border p-8 text-center sm:flex-row sm:text-left">
        <span
          className={`inline-flex size-20 shrink-0 items-center justify-center rounded-full text-xl font-semibold text-white ${getAvatarColor(actor.fullName)}`}
        >
          {getInitials(actor.fullName)}
        </span>
        <div className="min-w-0 space-y-2">
          <h1 className="text-2xl font-semibold break-words">
            {actor.fullName}
          </h1>
          <p className="text-muted-foreground">{actor.region}</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Proyectos vinculados</h2>
        {actor.projects && actor.projects.length > 0 ? (
          <div className="mt-4 space-y-3">
            {actor.projects.map((project) => (
              <Card key={project.projectId}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">
                      <Link
                        to={`/admin/projects/${project.projectId}`}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        {project.projectTitle}
                      </Link>
                    </CardTitle>
                    <Badge variant="secondary">
                      {PILLAR_LABELS[project.pillar]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge variant={STATUS_VARIANT[project.applicationStatus]}>
                    {STATUS_LABELS[project.applicationStatus]}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Este actor no tiene proyectos vinculados.
          </p>
        )}
      </div>
    </section>
  );
}
