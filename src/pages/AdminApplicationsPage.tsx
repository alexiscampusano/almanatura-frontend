import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

import {
  useAdminApplications,
  usePatchApplicationStatus,
} from "@/hooks/use-admin-applications";
import { useAdminProjects } from "@/hooks/use-admin-projects";
import {
  allowedNextStatuses,
  APPLICATION_STATUS_LABELS,
} from "@/lib/application-status";
import type {
  AdminApplicationResponse,
  ApplicationStatus,
} from "@/types/application";

const ALL_STATUSES: ApplicationStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "REJECTED",
  "NEEDS_INFO",
  "APPROVED",
  "REGISTERED_AS_ACTOR",
];

function statusBadgeVariant(
  status: ApplicationStatus,
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "REJECTED") return "destructive";
  if (status === "APPROVED" || status === "REGISTERED_AS_ACTOR")
    return "default";
  if (status === "SUBMITTED" || status === "UNDER_REVIEW") return "secondary";
  return "outline";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TransitionControls({ app }: { app: AdminApplicationResponse }) {
  const patchMutation = usePatchApplicationStatus();
  const options = allowedNextStatuses(app.status);
  const [target, setTarget] = useState<ApplicationStatus | "">("");

  if (options.length === 0) {
    return (
      <span className="text-sm text-muted-foreground">Sin transiciones</span>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Select
        value={target === "" ? undefined : target}
        onValueChange={(v) => {
          if (v != null) setTarget(v as ApplicationStatus);
        }}
      >
        <SelectTrigger className="h-10 w-full sm:w-[200px]">
          <SelectValue placeholder="Siguiente estado" />
        </SelectTrigger>
        <SelectContent>
          {options.map((s) => (
            <SelectItem key={s} value={s}>
              {APPLICATION_STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        className="h-10 gap-2"
        disabled={!target || patchMutation.isPending}
        onClick={() => {
          if (!target) return;
          patchMutation.mutate({ id: app.id, status: target });
        }}
      >
        {patchMutation.isPending ? (
          <>
            <Spinner size="sm" className="text-primary-foreground" />
            Aplicando
          </>
        ) : (
          "Aplicar"
        )}
      </Button>
    </div>
  );
}

export function AdminApplicationsPage() {
  const { data: projects } = useAdminProjects();
  const [projectId, setProjectId] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [searchName, setSearchName] = useState("");

  const params = useMemo(
    () => ({
      projectId:
        projectId === "all" ? undefined : Number.parseInt(projectId, 10),
      status: status === "all" ? undefined : (status as ApplicationStatus),
    }),
    [projectId, status],
  );

  const {
    data: applications,
    isLoading,
    isError,
  } = useAdminApplications(params);

  const filtered = useMemo(() => {
    if (!applications) return [];
    const q = searchName.trim().toLowerCase();
    if (!q) return applications;
    return applications.filter(
      (a) =>
        a.fullName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q),
    );
  }, [applications, searchName]);

  const projectTitleById = useMemo(() => {
    const m = new Map<number, string>();
    projects?.forEach((p) => m.set(p.id, p.title));
    return m;
  }, [projects]);

  if (isError && !applications) {
    return (
      <section className="mx-auto w-full max-w-6xl">
        <h2 className="text-2xl font-semibold">Solicitudes</h2>
        <p className="mt-4 text-destructive">
          No se pudieron cargar las solicitudes. ¿Tienes sesión iniciada?
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Solicitudes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Revisa postulaciones y actualiza el estado según el flujo definido.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="space-y-2 sm:min-w-[200px]">
          <Label>Proyecto</Label>
          <Select
            value={projectId}
            onValueChange={(v) => {
              if (v != null) setProjectId(v);
            }}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los proyectos</SelectItem>
              {projects?.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 sm:min-w-[200px]">
          <Label>Estado</Label>
          <Select
            value={status}
            onValueChange={(v) => {
              if (v != null) setStatus(v);
            }}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {ALL_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {APPLICATION_STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 sm:min-w-[220px] flex-1">
          <Label htmlFor="app-search">Buscar por nombre o correo</Label>
          <Input
            id="app-search"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Nombre o email"
            className="h-11"
          />
        </div>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">
          No hay solicitudes con estos filtros.
        </p>
      )}

      {!isLoading && filtered.length > 0 && (
        <>
          <div className="hidden overflow-hidden rounded-lg border md:block">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-3 py-3 text-left font-medium">
                    Solicitante
                  </th>
                  <th className="px-3 py-3 text-left font-medium">Proyecto</th>
                  <th className="px-3 py-3 text-left font-medium">Estado</th>
                  <th className="px-3 py-3 text-left font-medium">DNI</th>
                  <th className="px-3 py-3 text-left font-medium">Creada</th>
                  <th className="px-3 py-3 text-left font-medium">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-muted/30">
                    <td className="px-3 py-3">
                      <div className="font-medium">{app.fullName}</div>
                      <div className="text-xs text-muted-foreground">
                        {app.email}
                      </div>
                      {app.phone && (
                        <div className="text-xs text-muted-foreground">
                          {app.phone}
                        </div>
                      )}
                    </td>
                    <td className="max-w-[180px] px-3 py-3 align-top">
                      <span className="line-clamp-2">
                        {projectTitleById.get(app.projectId) ??
                          `#${app.projectId}`}
                      </span>
                    </td>
                    <td className="px-3 py-3 align-top">
                      <Badge variant={statusBadgeVariant(app.status)}>
                        {APPLICATION_STATUS_LABELS[app.status]}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 align-top font-mono text-xs">
                      {app.nationalId}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 align-top text-muted-foreground">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="px-3 py-3 align-top">
                      <TransitionControls
                        key={`${app.id}-${app.status}`}
                        app={app}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {filtered.map((app) => (
              <Card key={app.id}>
                <CardContent className="space-y-3 p-4 pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{app.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {app.email}
                      </p>
                    </div>
                    <Badge variant={statusBadgeVariant(app.status)}>
                      {APPLICATION_STATUS_LABELS[app.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {projectTitleById.get(app.projectId) ??
                      `Proyecto #${app.projectId}`}
                  </p>
                  <p className="font-mono text-xs">DNI: {app.nationalId}</p>
                  <TransitionControls
                    key={`${app.id}-${app.status}`}
                    app={app}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
