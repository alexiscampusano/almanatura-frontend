import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  useCreateInternalUser,
  useInternalUsers,
} from "@/hooks/use-admin-users";
import { getErrorMessage } from "@/lib/error-handler";
import { createUserSchema, type CreateUserSchema } from "@/lib/schemas";
import { useAuthStore } from "@/stores/auth.store";
import type { InternalRole } from "@/types/user";
import {
  AdminPage,
  adminListRegionClassName,
} from "@/components/admin/admin-page";

const ROLE_LABELS: Record<InternalRole, string> = {
  SUPER_USER: "Super usuario",
  EVENT_MANAGER: "Gestor de proyectos",
};

function roleBadgeVariant(role: InternalRole): "default" | "secondary" {
  return role === "SUPER_USER" ? "default" : "secondary";
}

export default function AdminUsersPage() {
  const user = useAuthStore((s) => s.user);
  const isSuperUser = user?.role === "SUPER_USER";

  const { data: users, isLoading, isError } = useInternalUsers();
  const createMutation = useCreateInternalUser();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "EVENT_MANAGER",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = (data: CreateUserSchema) => {
    createMutation.mutate(
      { ...data, enabled: true },
      {
        onSuccess: () => reset(),
        onError: (err) => {
          setError("root", {
            message: getErrorMessage(err, "No se pudo crear el usuario."),
          });
        },
      },
    );
  };

  if (isError) {
    return (
      <AdminPage>
        <h2 className="text-2xl font-semibold">Gestión de usuarios</h2>
        <p className="mt-4 text-destructive">
          No se pudieron cargar los usuarios internos.
        </p>
      </AdminPage>
    );
  }

  return (
    <AdminPage className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Gestión de usuarios</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Usuarios del panel administrativo (solo super usuario puede crear
          cuentas nuevas).
        </p>
      </div>

      {isSuperUser && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-lg border p-4 md:p-6"
          noValidate
        >
          <h3 className="text-lg font-medium">Crear usuario interno</h3>
          {errors.root && (
            <p className="text-sm text-destructive" role="alert">
              {errors.root.message}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-name">Nombre</Label>
              <Input
                id="new-name"
                maxLength={120}
                disabled={isSubmitting}
                className="h-11"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-email">Correo</Label>
              <Input
                id="new-email"
                type="email"
                maxLength={180}
                disabled={isSubmitting}
                className="h-11"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Contraseña</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                disabled={isSubmitting}
                className="h-11"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <Select
                value={selectedRole}
                onValueChange={(v) =>
                  setValue("role", v as InternalRole, { shouldValidate: true })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Seleccionar rol">
                    {ROLE_LABELS[selectedRole]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EVENT_MANAGER">
                    {ROLE_LABELS.EVENT_MANAGER}
                  </SelectItem>
                  <SelectItem value="SUPER_USER">
                    {ROLE_LABELS.SUPER_USER}
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-destructive">
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>
          <Button type="submit" className="gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="text-primary-foreground" />
                Creando…
              </>
            ) : (
              "Crear usuario"
            )}
          </Button>
        </form>
      )}

      {!isSuperUser && (
        <p className="rounded-md border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Solo los super usuarios pueden crear nuevas cuentas. Puedes ver el
          listado del equipo.
        </p>
      )}

      <div className={adminListRegionClassName}>
        <h3 className="mb-3 text-lg font-medium">Usuarios registrados</h3>
        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-muted" />
            ))}
          </div>
        )}
        {!isLoading && users && users.length === 0 && (
          <p className="text-sm text-muted-foreground">No hay usuarios.</p>
        )}
        {!isLoading && users && users.length > 0 && (
          <>
            <div className="hidden rounded-lg border md:block">
              <div className="overflow-x-auto">
                <table className="min-w-[520px] w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">
                        Nombre
                      </th>
                      <th className="px-4 py-3 text-left font-medium">
                        Correo
                      </th>
                      <th className="px-4 py-3 text-left font-medium">Rol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="px-4 py-3">{u.name}</td>
                        <td className="px-4 py-3">{u.email}</td>
                        <td className="px-4 py-3">
                          <Badge variant={roleBadgeVariant(u.role)}>
                            {ROLE_LABELS[u.role]}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <ul className="space-y-3 md:hidden">
              {users.map((u) => (
                <li
                  key={u.id}
                  className="flex flex-col gap-2 rounded-lg border p-4"
                >
                  <span className="font-medium">{u.name}</span>
                  <span className="text-sm text-muted-foreground break-words">
                    {u.email}
                  </span>
                  <Badge
                    className="w-fit mt-2"
                    variant={roleBadgeVariant(u.role)}
                  >
                    {ROLE_LABELS[u.role]}
                  </Badge>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </AdminPage>
  );
}
