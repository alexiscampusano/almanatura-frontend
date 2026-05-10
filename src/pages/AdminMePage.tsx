import { SignOut, UserCircle } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth.store";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function roleLabel(role: string): string {
  if (role === "SUPER_USER") return "Super usuario";
  if (role === "EVENT_MANAGER") return "Gestor de proyectos";
  return role;
}

function formatSessionExpiry(expiresAt: number | null): string | null {
  if (expiresAt == null) return null;
  const date = new Date(expiresAt);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminMePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const expiresAt = useAuthStore((s) => s.expiresAt);
  const clearSession = useAuthStore((s) => s.clearSession);

  function handleLogout() {
    clearSession();
    navigate("/admin/login", { replace: true });
  }

  if (!user) {
    return (
      <div className="max-w-lg">
        <p className="text-sm text-muted-foreground">Cargando perfil…</p>
      </div>
    );
  }

  const expiryText = formatSessionExpiry(expiresAt);

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
          Mi cuenta
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tu sesión en el panel y datos básicos del perfil.
        </p>
      </div>

      <Card>
        <CardHeader className="border-b border-border pb-4">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <span
              className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground"
              aria-hidden
            >
              {getInitials(user.name)}
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start sm:justify-between">
                <CardTitle className="text-base font-semibold">
                  {user.name}
                </CardTitle>
                <Badge variant="secondary" className="shrink-0 font-normal">
                  {roleLabel(user.role)}
                </Badge>
              </div>
              <CardDescription className="break-all">
                {user.email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <div className="flex gap-3 rounded-sm border border-border bg-muted/30 px-4 py-3">
            <UserCircle
              className="size-5 shrink-0 text-muted-foreground"
              weight="duotone"
              aria-hidden
            />
            <div className="min-w-0 text-xs leading-relaxed">
              <p className="font-medium text-foreground">
                Sesión en este navegador
              </p>
              <p className="mt-1 text-muted-foreground">
                Al cerrar sesión se borra el acceso guardado en este
                dispositivo.
                {expiryText ? (
                  <>
                    {" "}
                    Renovación prevista antes del{" "}
                    <span className="text-foreground">{expiryText}</span>.
                  </>
                ) : null}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2 sm:flex-row sm:justify-stretch">
          <Button
            type="button"
            variant="destructive"
            size="lg"
            className="h-10 w-full gap-2 sm:justify-center"
            onClick={handleLogout}
          >
            <SignOut size={18} weight="bold" aria-hidden />
            Cerrar sesión
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
