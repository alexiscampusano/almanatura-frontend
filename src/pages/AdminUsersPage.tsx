import type { FormEvent } from "react";
import { useState } from "react";
import { isAxiosError } from "axios";

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

import {
  useCreateInternalUser,
  useInternalUsers,
} from "@/hooks/use-admin-users";
import { useAuthStore } from "@/stores/auth.store";
import type { InternalRole } from "@/types/user";

const ROLE_LABELS: Record<InternalRole, string> = {
  SUPER_USER: "Super usuario",
  EVENT_MANAGER: "Gestor de proyectos",
};

function roleBadgeVariant(role: InternalRole): "default" | "secondary" {
  return role === "SUPER_USER" ? "default" : "secondary";
}

export function AdminUsersPage() {
  const user = useAuthStore((s) => s.user);
  const isSuperUser = user?.role === "SUPER_USER";

  const { data: users, isLoading, isError } = useInternalUsers();
  const createMutation = useCreateInternalUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<InternalRole>("EVENT_MANAGER");
  const [formError, setFormError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    createMutation.mutate(
      { name: name.trim(), email: email.trim(), password, role, enabled: true },
      {
        onSuccess: () => {
          setName("");
          setEmail("");
          setPassword("");
          setRole("EVENT_MANAGER");
        },
        onError: (err) => {
          if (!isAxiosError(err)) {
            setFormError("No se pudo crear el usuario.");
            return;
          }
          const status = err.response?.status;
          if (status === 403) {
            setFormError("No tienes permiso para crear usuarios.");
            return;
          }
          if (status === 409) {
            setFormError("Ya existe un usuario con ese correo.");
            return;
          }
          if (status === 400) {
            setFormError("Revisa los datos o la política de contraseña.");
            return;
          }
          setFormError("No se pudo crear el usuario.");
        },
      },
    );
  }

  if (isError) {
    return (
      <section className="mx-auto w-full max-w-4xl">
        <h2 className="text-2xl font-semibold">Gestión de usuarios</h2>
        <p className="mt-4 text-destructive">
          No se pudieron cargar los usuarios internos.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Gestión de usuarios</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Usuarios del panel administrativo (solo super usuario puede crear
          cuentas nuevas).
        </p>
      </div>

      {isSuperUser && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border p-4 md:p-6"
        >
          <h3 className="text-lg font-medium">Crear usuario interno</h3>
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-name">Nombre</Label>
              <Input
                id="new-name"
                required
                maxLength={120}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-email">Correo</Label>
              <Input
                id="new-email"
                type="email"
                required
                maxLength={180}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Contraseña</Label>
              <Input
                id="new-password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <Select
                value={role}
                onValueChange={(v) => {
                  if (v != null) setRole(v as InternalRole);
                }}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
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
            </div>
          </div>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creando…" : "Crear usuario"}
          </Button>
        </form>
      )}

      {!isSuperUser && (
        <p className="rounded-md border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Solo los super usuarios pueden crear nuevas cuentas. Puedes ver el
          listado del equipo.
        </p>
      )}

      <div>
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
          <div className="hidden overflow-hidden rounded-lg border md:block">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Nombre</th>
                  <th className="px-4 py-3 text-left font-medium">Correo</th>
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
        )}
        {!isLoading && users && users.length > 0 && (
          <ul className="space-y-2 md:hidden">
            {users.map((u) => (
              <li
                key={u.id}
                className="flex flex-col gap-1 rounded-lg border p-3"
              >
                <span className="font-medium">{u.name}</span>
                <span className="text-sm text-muted-foreground">{u.email}</span>
                <Badge className="w-fit" variant={roleBadgeVariant(u.role)}>
                  {ROLE_LABELS[u.role]}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
