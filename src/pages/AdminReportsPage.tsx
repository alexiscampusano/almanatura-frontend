import {
  useProjectApplicationReport,
  useReportsSummary,
} from "@/hooks/use-admin-reports";
import { formatDateShort } from "@/lib/datetime";
import { PILLAR_LABELS, STATUS_LABELS } from "@/lib/project";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AdminPage,
  adminListRegionClassName,
} from "@/components/admin/admin-page";

export default function AdminReportsPage() {
  const summary = useReportsSummary();
  const ranking = useProjectApplicationReport();

  const loading = summary.isLoading || ranking.isLoading;
  const error = summary.isError || ranking.isError;

  if (error) {
    return (
      <AdminPage>
        <h2 className="text-2xl font-semibold">Reportes</h2>
        <p className="mt-4 text-destructive">
          No se pudieron cargar los reportes.
        </p>
      </AdminPage>
    );
  }

  const s = summary.data;

  return (
    <AdminPage className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Reportes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen de la organización y proyectos con más solicitudes.
        </p>
      </div>

      <div className={adminListRegionClassName}>
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-lg" />
            ))}
          </div>
        )}

        {!loading && s && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
                    Impacto (Entradas)
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-semibold">
                  {s.totalImpactEntries}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Notificaciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-semibold">
                  {s.totalOutboundNotifications}
                </CardContent>
              </Card>

              {/* Nuevo Card para los estados */}
              <Card className="sm:col-span-2 lg:col-span-1 bg-muted/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Por Estado
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1.5 pt-1">
                  {s.projectsByStatus.length > 0 ? (
                    s.projectsByStatus.map((row) => (
                      <div
                        key={row.status}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-muted-foreground">
                          {STATUS_LABELS[row.status]}
                        </span>
                        <span className="font-semibold">{row.count}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Sin datos
                    </span>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              {ranking.data && ranking.data.length > 0 && (
                <Card className="overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b pb-4">
                    <CardTitle className="text-lg font-semibold">
                      Ranking de Solicitudes
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Proyectos ordenados por volumen de interés
                    </p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="hidden md:block w-full">
                      <table className="w-full text-sm">
                        <thead className="border-b bg-muted/10">
                          <tr>
                            <th className="px-5 py-4 text-left font-medium w-[35%]">
                              Proyecto
                            </th>
                            <th className="px-5 py-4 text-left font-medium w-[20%]">
                              Pilar Estratégico
                            </th>
                            <th className="px-5 py-4 text-left font-medium w-[15%]">
                              Estado
                            </th>
                            <th className="px-5 py-4 text-left font-medium w-[15%]">
                              Inicio
                            </th>
                            <th className="px-5 py-4 text-right font-medium w-[15%]">
                              Total Solicitudes
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {ranking.data.map((row, index) => (
                            <tr
                              key={row.id}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              <td className="px-5 py-4 align-top">
                                <div className="font-semibold break-words text-base flex items-start gap-2">
                                  <span className="text-muted-foreground text-sm font-normal pt-0.5">
                                    #{index + 1}
                                  </span>
                                  {row.title}
                                </div>
                              </td>
                              <td className="px-5 py-4 align-top text-muted-foreground">
                                {PILLAR_LABELS[row.pillar]}
                              </td>
                              <td className="px-5 py-4 align-top">
                                <Badge
                                  variant="outline"
                                  className="font-medium bg-background"
                                >
                                  {STATUS_LABELS[row.status]}
                                </Badge>
                              </td>
                              <td className="px-5 py-4 align-top text-muted-foreground">
                                {formatDateShort(row.startsAt)}
                              </td>
                              <td className="px-5 py-4 align-top text-right">
                                <span className="inline-flex items-center justify-center bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-base">
                                  {row.applicationCount}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="divide-y md:hidden">
                      {ranking.data.map((row, index) => (
                        <div key={row.id} className="p-4 space-y-3">
                          <div className="flex justify-between items-start gap-2">
                            <p className="font-semibold flex items-start gap-1.5">
                              <span className="text-muted-foreground text-sm font-normal">
                                #{index + 1}
                              </span>
                              {row.title}
                            </p>
                            <span className="inline-flex items-center justify-center bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded-full text-sm shrink-0">
                              {row.applicationCount}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                            <span>{PILLAR_LABELS[row.pillar]}</span>
                            <span>•</span>
                            <span>{formatDateShort(row.startsAt)}</span>
                          </div>
                          <Badge
                            variant="outline"
                            className="font-medium bg-background"
                          >
                            {STATUS_LABELS[row.status]}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {ranking.data && ranking.data.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aún no hay datos de ranking de solicitudes.
              </p>
            )}
          </>
        )}
      </div>
    </AdminPage>
  );
}
