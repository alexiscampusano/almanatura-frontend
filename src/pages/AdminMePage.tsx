import { SignOut } from "@phosphor-icons/react";
import { getInitials } from "@/lib/avatar";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth.store";

export default function AdminMePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
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

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
          Mi cuenta
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Datos de tu perfil en el panel.
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
              <CardTitle className="text-base font-semibold">
                {user.name}
              </CardTitle>
              <CardDescription className="break-all">
                {user.email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

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
