import { isNotFoundError } from "@/lib/error-handler";
import {
  ArrowLeft,
  EnvelopeSimple,
  Phone,
  IdentificationCard,
} from "@phosphor-icons/react";
import { getAvatarColor, getInitials } from "@/lib/avatar";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/use-actors";
import { PILLAR_LABELS } from "@/lib/project";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/types/application";
import { AdminPage } from "@/components/admin/admin-page";

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
      <AdminPage>
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
      </AdminPage>
    );
  }

  if (isLoading) {
    return (
      <AdminPage>
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-8 h-32 w-full rounded-lg" />
      </AdminPage>
    );
  }

  if (notFound || (isError && !actor)) {
    return (
      <AdminPage className="space-y-4">
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
      </AdminPage>
    );
  }

  if (isError || !actor) {
    return (
      <AdminPage>
        <p className="text-destructive">
          No se pudo cargar el actor. Inténtalo nuevamente.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(0)}>
          Reintentar
        </Button>
      </AdminPage>
    );
  }

  return (
    <AdminPage className="space-y-8">
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
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-2xl font-semibold break-words">
            {actor.fullName}
          </h1>
          <p className="text-muted-foreground">{actor.region}</p>
        </div>
        {(actor.email || actor.phone || actor.nationalId) && (
          <div className="flex flex-col gap-3 text-sm text-muted-foreground border-t pt-6 sm:border-t-0 sm:border-l sm:pl-8 sm:pt-0">
            {actor.email && (
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <EnvelopeSimple size={18} weight="regular" />
                <a
                  href={`mailto:${actor.email}`}
                  className="hover:text-primary transition-colors"
                >
                  {actor.email}
                </a>
              </div>
            )}
            {actor.phone && (
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Phone size={18} weight="regular" />
                <a
                  href={`tel:${actor.phone}`}
                  className="hover:text-primary transition-colors"
                >
                  {actor.phone}
                </a>
              </div>
            )}
            {actor.nationalId && (
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <IdentificationCard size={18} weight="regular" />
                <span>{actor.nationalId}</span>
              </div>
            )}
          </div>
        )}
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
    </AdminPage>
  );
}
