import { useEffect, useState } from "react";
import { Eye, PencilSimple, Plus, Trash } from "@phosphor-icons/react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProjectImpactSection } from "@/components/admin/ProjectImpactSection";
import {
  useAdminProjects,
  useCreateProject,
  useDeleteProject,
  useUpdateProject,
} from "@/hooks/use-admin-projects";
import { cn } from "@/lib/utils";
import { formatDateShort, toLocalDate } from "@/lib/datetime";
import { PILLAR_LABELS, STATUS_LABELS, STATUS_VARIANT } from "@/lib/project";
import {
  AdminPage,
  adminListRegionClassName,
} from "@/components/admin/admin-page";
import type {
  AdminProjectResponse,
  CreateProjectPayload,
  ProjectPillar,
  ProjectStatus,
  UpdateProjectPayload,
} from "@/types/project";

type FormData = {
  title: string;
  description: string;
  pillar: ProjectPillar;
  status: ProjectStatus;
  startsAt: string;
  endsAt: string;
  location: string;
  imageUrl: string;
};

const EMPTY_FORM: FormData = {
  title: "",
  description: "",
  pillar: "TECHNOLOGY",
  status: "DRAFT",
  startsAt: "",
  endsAt: "",
  location: "",
  imageUrl: "",
};

export default function AdminProjectsPage() {
  const { data: projects, isLoading, isError } = useAdminProjects();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();
  const location = useLocation();
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] =
    useState<AdminProjectResponse | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<AdminProjectResponse | null>(
    null,
  );

  function openCreate() {
    setEditingProject(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(project: AdminProjectResponse) {
    setEditingProject(project);
    setForm({
      title: project.title,
      description: project.description ?? "",
      pillar: project.pillar,
      status: project.status,
      startsAt: toLocalDate(project.startsAt),
      endsAt: toLocalDate(project.endsAt),
      location: project.location ?? "",
      imageUrl: project.imageUrl ?? "",
    });
    setDialogOpen(true);
  }

  useEffect(() => {
    const openId = (location.state as { openEditForId?: number } | null)
      ?.openEditForId;
    if (openId == null || !projects) return;
    const p = projects.find((x) => x.id === openId);
    navigate(".", { replace: true, state: {} });
    if (p) {
      queueMicrotask(() => {
        setEditingProject(p);
        setForm({
          title: p.title,
          description: p.description ?? "",
          pillar: p.pillar,
          status: p.status,
          startsAt: toLocalDate(p.startsAt),
          endsAt: toLocalDate(p.endsAt),
          location: p.location ?? "",
          imageUrl: p.imageUrl ?? "",
        });
        setDialogOpen(true);
      });
    }
  }, [location.state, projects, navigate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingProject) {
      const payload: UpdateProjectPayload = {
        title: form.title,
        description: form.description || undefined,
        pillar: form.pillar,
        status: form.status,
        startsAt: form.startsAt || undefined,
        endsAt: form.endsAt || undefined,
        location: form.location || undefined,
        imageUrl: form.imageUrl || undefined,
      };
      updateMutation.mutate(
        { id: editingProject.id, data: payload },
        { onSuccess: () => setDialogOpen(false) },
      );
    } else {
      const payload: CreateProjectPayload = {
        title: form.title,
        description: form.description || undefined,
        pillar: form.pillar,
        startsAt: form.startsAt || undefined,
        endsAt: form.endsAt || undefined,
        location: form.location || undefined,
        imageUrl: form.imageUrl || undefined,
      };
      createMutation.mutate(payload, {
        onSuccess: () => setDialogOpen(false),
      });
    }
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }

  const isMutating = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <AdminPage>
        <h2 className="text-2xl font-semibold">Gestión de proyectos</h2>
        <div className={`${adminListRegionClassName} mt-6 space-y-3`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </AdminPage>
    );
  }

  if (isError) {
    return (
      <AdminPage>
        <h2 className="text-2xl font-semibold">Gestión de proyectos</h2>
        <p className="mt-4 text-destructive">
          No se pudieron cargar los proyectos. Inténtalo nuevamente.
        </p>
      </AdminPage>
    );
  }

  return (
    <AdminPage>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-semibold">Gestión de proyectos</h2>
          <p className="mt-1 text-[var(--text-size-sm)] text-muted-foreground">
            {projects?.length ?? 0} proyectos registrados
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="shrink-0 gap-2 self-stretch sm:self-auto"
        >
          <Plus size={18} weight="bold" />
          Nuevo proyecto
        </Button>
      </div>

      <div className={adminListRegionClassName}>
        {projects && projects.length === 0 && (
          <p className="mt-8 text-center text-muted-foreground">
            Aún no hay proyectos creados.
          </p>
        )}

        {projects && projects.length > 0 && (
          <>
            {/* Desktop table */}
            <div className="mt-6 hidden rounded-lg border md:block">
              <div className="overflow-x-auto">
                <table className="min-w-[640px] w-full text-[var(--text-size-sm)]">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">
                        Título
                      </th>
                      <th className="px-4 py-3 text-left font-medium">Pilar</th>
                      <th className="px-4 py-3 text-left font-medium">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left font-medium">
                        Inicio
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {projects.map((project) => (
                      <tr key={project.id} className="hover:bg-muted/30">
                        <td className="max-w-[200px] truncate px-4 py-3 font-medium">
                          {project.title}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {PILLAR_LABELS[project.pillar]}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={STATUS_VARIANT[project.status]}>
                            {STATUS_LABELS[project.status]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatDateShort(project.startsAt)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Link
                              to={`/admin/projects/${project.id}`}
                              className={cn(
                                buttonVariants({
                                  variant: "ghost",
                                  size: "icon",
                                }),
                              )}
                              aria-label="Ver detalle"
                            >
                              <Eye size={18} />
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEdit(project)}
                              aria-label="Editar proyecto"
                            >
                              <PencilSimple size={18} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteTarget(project)}
                              aria-label="Eliminar proyecto"
                            >
                              <Trash size={18} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="mt-6 space-y-3 md:hidden">
              {projects.map((project) => (
                <div key={project.id} className="rounded-lg border p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{project.title}</p>
                    <p className="mt-1 text-[var(--text-size-xs)] text-muted-foreground">
                      {formatDateShort(project.startsAt)} ·{" "}
                      {PILLAR_LABELS[project.pillar]}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge
                        variant={STATUS_VARIANT[project.status]}
                        className="text-[var(--text-size-xs)]"
                      >
                        {STATUS_LABELS[project.status]}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Link
                      to={`/admin/projects/${project.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "default" }),
                        "h-[var(--size-button-default)] gap-2 px-3 text-[var(--text-size-sm)]",
                      )}
                      aria-label="Ver detalle"
                    >
                      <Eye size={18} />
                      Ver
                    </Link>
                    <Button
                      variant="outline"
                      className="h-[var(--size-button-default)] gap-2 px-3 text-[var(--text-size-sm)]"
                      onClick={() => openEdit(project)}
                      aria-label="Editar proyecto"
                    >
                      <PencilSimple size={18} />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      className="h-[var(--size-button-default)] gap-2 px-3 text-[var(--text-size-sm)] text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeleteTarget(project)}
                      aria-label="Eliminar proyecto"
                    >
                      <Trash size={18} />
                      Elim.
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className={cn(
            "max-h-[90vh] w-[calc(100vw-2rem)] overflow-x-hidden overflow-y-auto sm:w-auto",
            editingProject ? "sm:max-w-2xl" : "sm:max-w-lg",
          )}
        >
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Editar proyecto" : "Nuevo proyecto"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                required
                maxLength={255}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                rows={3}
                maxLength={10000}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Pilar *</Label>
                <Select
                  value={form.pillar}
                  onValueChange={(v) =>
                    setForm({ ...form, pillar: v as ProjectPillar })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar pilar">
                      {PILLAR_LABELS[form.pillar]}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PILLAR_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {editingProject && (
                <div className="space-y-2">
                  <Label>Estado *</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) =>
                      setForm({ ...form, status: v as ProjectStatus })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado">
                        {STATUS_LABELS[form.status]}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startsAt">Fecha inicio</Label>
                <Input
                  id="startsAt"
                  type="date"
                  value={form.startsAt}
                  onChange={(e) =>
                    setForm({ ...form, startsAt: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endsAt">Fecha fin</Label>
                <Input
                  id="endsAt"
                  type="date"
                  value={form.endsAt}
                  onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                maxLength={255}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL de imagen</Label>
              <Input
                id="imageUrl"
                type="url"
                maxLength={512}
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </div>

            {editingProject && (
              <ProjectImpactSection projectId={editingProject.id} />
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isMutating}>
                {isMutating
                  ? "Guardando..."
                  : editingProject
                    ? "Guardar cambios"
                    : "Crear proyecto"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará permanentemente &quot;{deleteTarget?.title}&quot;.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPage>
  );
}
