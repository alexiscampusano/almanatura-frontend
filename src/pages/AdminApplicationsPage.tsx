import { useMemo, useState } from "react";
import { CheckCircle, Clock, FileText } from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  AdminPage,
  adminListRegionClassName,
} from "@/components/admin/admin-page";
import { MobileFilterSheet } from "@/components/admin/mobile-filter-sheet";

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
        <SelectTrigger className="h-[var(--size-input-default)] w-full sm:w-[200px]">
          <SelectValue placeholder="Siguiente estado">
            {target ? APPLICATION_STATUS_LABELS[target] : null}
          </SelectValue>
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
        className="h-[var(--size-button-default)] gap-2"
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

export default function AdminApplicationsPage() {
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

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (projectId !== "all") count++;
    if (status !== "all") count++;
    if (searchName.trim() !== "") count++;
    return count;
  }, [projectId, status, searchName]);

  const filterContent = (
    <>
      <div className="space-y-2">
        <Label>Proyecto</Label>
        <Select
          value={projectId}
          onValueChange={(v) => {
            if (v != null) setProjectId(v);
          }}
        >
          <SelectTrigger className="h-[var(--size-input-default)] w-full">
            <SelectValue placeholder="Todos los proyectos">
              {projectId === "all"
                ? "Todos los proyectos"
                : (projects?.find((p) => String(p.id) === projectId)?.title ??
                  "Todos los proyectos")}
            </SelectValue>
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
      <div className="space-y-2">
        <Label>Estado</Label>
        <Select
          value={status}
          onValueChange={(v) => {
            if (v != null) setStatus(v);
          }}
        >
          <SelectTrigger className="h-[var(--size-input-default)] w-full">
            <SelectValue placeholder="Todos los estados">
              {status === "all"
                ? "Todos los estados"
                : APPLICATION_STATUS_LABELS[status as ApplicationStatus]}
            </SelectValue>
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
      <div className="space-y-2">
        <Label htmlFor="app-search">Buscar por nombre o correo</Label>
        <Input
          id="app-search"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Nombre o email"
          className="h-[var(--size-input-default)] w-full"
        />
      </div>
    </>
  );

  if (isError && !applications) {
    return (
      <AdminPage>
        <h2 className="text-2xl font-semibold">Solicitudes</h2>
        <p className="text-destructive">
          No se pudieron cargar las solicitudes. ¿Tienes sesión iniciada?
        </p>
      </AdminPage>
    );
  }

  return (
    <AdminPage>
      <div>
        <h2 className="text-2xl font-semibold">Solicitudes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Revisa postulaciones y actualiza el estado según el flujo definido.
        </p>
      </div>

      {applications && (
        <div className="mt-6 mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Solicitudes
              </CardTitle>
              <FileText size={20} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
              <CheckCircle size={20} className="text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  applications.filter(
                    (a) =>
                      a.status === "APPROVED" ||
                      a.status === "REGISTERED_AS_ACTOR",
                  ).length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock size={20} className="text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  applications.filter(
                    (a) =>
                      a.status === "SUBMITTED" || a.status === "UNDER_REVIEW",
                  ).length
                }
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Desktop filters (grid) */}
      <div className="hidden grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 [&_.space-y-2]:min-w-0 md:grid">
        {filterContent}
      </div>

      {/* Mobile filter sheet */}
      <MobileFilterSheet activeFilterCount={activeFilterCount}>
        {filterContent}
      </MobileFilterSheet>

      <div className={adminListRegionClassName}>
        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
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
            <div className="hidden rounded-lg border bg-card md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>DNI</TableHead>
                    <TableHead>Creada</TableHead>
                    <TableHead>Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div className="font-medium">{app.fullName}</div>
                        <div className="text-xs text-muted-foreground">
                          {app.email}
                        </div>
                        {app.phone && (
                          <div className="text-xs text-muted-foreground">
                            {app.phone}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[180px] align-top">
                        <span className="line-clamp-2">
                          {projectTitleById.get(app.projectId) ??
                            `#${app.projectId}`}
                        </span>
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge variant={statusBadgeVariant(app.status)}>
                          {APPLICATION_STATUS_LABELS[app.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-top font-mono text-xs">
                        {app.nationalId}
                      </TableCell>
                      <TableCell className="whitespace-nowrap align-top text-muted-foreground">
                        {formatDate(app.createdAt)}
                      </TableCell>
                      <TableCell className="align-top">
                        <TransitionControls
                          key={`${app.id}-${app.status}`}
                          app={app}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
      </div>
    </AdminPage>
  );
}
