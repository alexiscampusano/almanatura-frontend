import { useLayoutEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { NavigationProgress } from "@/components/navigation-progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { login } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasHydrated = useAuthHydrated();
  const setSession = useAuthStore((state) => state.setSession);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const redirectTarget =
    (location.state as { from?: string } | null)?.from ?? "/admin/projects";

  useLayoutEffect(() => {
    if (!hasHydrated) return;
    if (accessToken) {
      navigate(redirectTarget, { replace: true });
    }
  }, [hasHydrated, accessToken, navigate, redirectTarget]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (isLoading) return;
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await login({ email, password });
      setSession(response);
      navigate(redirectTarget, { replace: true });
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        [400, 401, 403].includes(error.response?.status ?? 0)
      ) {
        setErrorMessage(
          "Credenciales inválidas. Revisa tu correo y contraseña.",
        );
      } else {
        setErrorMessage("No pudimos iniciar sesión. Inténtalo nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasHydrated) {
    return (
      <>
        <NavigationProgress />
        <main
          className="flex min-h-svh flex-col items-center justify-center gap-3 bg-muted/20 px-4"
          role="status"
          aria-busy="true"
          aria-label="Preparando sesión"
        >
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground">Preparando acceso…</p>
        </main>
      </>
    );
  }

  if (accessToken) {
    return (
      <>
        <NavigationProgress />
        <main
          className="flex min-h-svh flex-col items-center justify-center gap-3 bg-muted/20 px-4"
          role="status"
          aria-busy="true"
          aria-label="Redirigiendo al panel"
        >
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground">Entrando al panel…</p>
        </main>
      </>
    );
  }

  return (
    <>
      <NavigationProgress />
      <main className="flex min-h-svh items-center justify-center bg-muted/20 px-4 py-8">
        <section className="w-full max-w-md border border-border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Ingreso administrativo</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Solo usuarios internos autorizados pueden acceder.
          </p>
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="admin-login-email">Correo</Label>
              <Input
                id="admin-login-email"
                required
                type="email"
                autoComplete="email"
                disabled={isLoading}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 px-3 text-base md:text-xs"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-login-password">Contraseña</Label>
              <Input
                id="admin-login-password"
                required
                type="password"
                autoComplete="current-password"
                disabled={isLoading}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 px-3 text-base md:text-xs"
              />
            </div>
            {errorMessage && (
              <p className="text-sm text-destructive" role="alert">
                {errorMessage}
              </p>
            )}
            <Button
              type="submit"
              className="mt-2 h-11 gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="text-primary-foreground" />
                  Ingresando…
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm">
            <Link
              to="/"
              className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              Volver al inicio
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
