import {
  useProjectApplicationReport,
  useReportsSummary,
} from "@/hooks/use-admin-reports";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectPillar, ProjectStatus } from "@/types/project";

const PILLAR_LABELS: Record<ProjectPillar, string> = {
  TECHNOLOGY: "Tecnología",
  EDUCATION: "Educación",
  HEALTH: "Salud",
  ENTREPRENEURSHIP: "Emprendimiento",
  CULTURE: "Cultura",
};

const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicado",
  CANCELLED: "Cancelado",
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AdminReportsPage() {
  const summary = useReportsSummary();
  const ranking = useProjectApplicationReport();

  const loading = summary.isLoading || ranking.isLoading;
  const error = summary.isError || ranking.isError;

  if (error) {
    return (
      <section className="mx-auto w-full max-w-5xl">
        <h2 className="text-2xl font-semibold">Reportes</h2>
        <p className="mt-4 text-destructive">
          No se pudieron cargar los reportes.
        </p>
      </section>
    );
  }

  const s = summary.data;

  return (
    <section className="mx-auto w-full max-w-5xl space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Reportes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen de la organización y proyectos con más solicitudes.
        </p>
      </div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      )}

      {!loading && s && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Proyectos
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">
                {s.totalProjects}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Solicitudes
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">
                {s.totalApplications}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Indicadores de impacto
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">
                {s.totalImpactEntries}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Notificaciones (pendientes / cola)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">
                {s.totalOutboundNotifications}
              </CardContent>
            </Card>
          </div>

          {s.projectsByStatus.length > 0 && (
            <div>
              <h3 className="mb-2 text-lg font-medium">Proyectos por estado</h3>
              <div className="flex flex-wrap gap-2">
                {s.projectsByStatus.map((row) => (
                  <Badge key={row.status} variant="secondary" className="gap-1">
                    {PROJECT_STATUS_LABELS[row.status]}: {row.count}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {ranking.data && ranking.data.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-medium">
                Proyectos con más solicitudes
              </h3>
              <div className="hidden overflow-hidden rounded-lg border md:block">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-3 py-3 text-left font-medium">
                        Proyecto
                      </th>
                      <th className="px-3 py-3 text-left font-medium">Pilar</th>
                      <th className="px-3 py-3 text-left font-medium">
                        Estado
                      </th>
                      <th className="px-3 py-3 text-right font-medium">
                        Solicitudes
                      </th>
                      <th className="px-3 py-3 text-left font-medium">
                        Inicio
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {ranking.data.map((row) => (
                      <tr key={row.id}>
                        <td className="max-w-[200px] px-3 py-3 font-medium">
                          {row.title}
                        </td>
                        <td className="px-3 py-3 text-muted-foreground">
                          {PILLAR_LABELS[row.pillar]}
                        </td>
                        <td className="px-3 py-3">
                          <Badge variant="outline">
                            {PROJECT_STATUS_LABELS[row.status]}
                          </Badge>
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums">
                          {row.applicationCount}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                          {formatDate(row.startsAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="space-y-2 md:hidden">
                {ranking.data.map((row) => (
                  <li key={row.id} className="rounded-lg border p-3 text-sm">
                    <p className="font-medium">{row.title}</p>
                    <p className="text-muted-foreground">
                      {PILLAR_LABELS[row.pillar]} ·{" "}
                      {PROJECT_STATUS_LABELS[row.status]}
                    </p>
                    <p className="mt-1 font-semibold">
                      {row.applicationCount} solicitudes
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ranking.data && ranking.data.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Aún no hay datos de ranking de solicitudes.
            </p>
          )}
        </>
      )}
    </section>
  );
}
