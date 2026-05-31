import { useLayoutEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { NavigationProgress } from "@/components/navigation-progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { getErrorMessage } from "@/lib/error-handler";
import { loginSchema, type LoginSchema } from "@/lib/schemas";
import { login } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasHydrated = useAuthHydrated();
  const setSession = useAuthStore((state) => state.setSession);
  const accessToken = useAuthStore((state) => state.accessToken);
  const redirectTarget =
    (location.state as { from?: string } | null)?.from ?? "/admin/projects";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useLayoutEffect(() => {
    if (!hasHydrated) return;
    if (accessToken) {
      navigate(redirectTarget, { replace: true });
    }
  }, [hasHydrated, accessToken, navigate, redirectTarget]);

  const onSubmit = async (data: LoginSchema) => {
    try {
      const response = await login(data);
      setSession(response);
      navigate(redirectTarget, { replace: true });
    } catch (error) {
      setError("root", {
        message: getErrorMessage(
          error,
          "No pudimos iniciar sesión. Inténtalo nuevamente.",
        ),
      });
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
          <p className="text-[var(--text-size-sm)] text-muted-foreground">
            Preparando acceso…
          </p>
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
          <p className="text-[var(--text-size-sm)] text-muted-foreground">
            Entrando al panel…
          </p>
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
          <p className="mt-2 text-[var(--text-size-sm)] text-muted-foreground">
            Solo usuarios internos autorizados pueden acceder.
          </p>
          <form
            className="mt-6 grid gap-4"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="grid gap-2">
              <Label htmlFor="admin-login-email">Correo</Label>
              <Input
                id="admin-login-email"
                type="email"
                autoComplete="email"
                disabled={isSubmitting}
                className="h-[var(--size-input-default)] px-3 text-base md:text-[var(--text-size-xs)]"
                {...register("email")}
              />
              {errors.email && (
                <p
                  className="text-[var(--text-size-sm)] text-destructive"
                  role="alert"
                >
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-login-password">Contraseña</Label>
              <Input
                id="admin-login-password"
                type="password"
                autoComplete="current-password"
                disabled={isSubmitting}
                className="h-[var(--size-input-default)] px-3 text-base md:text-[var(--text-size-xs)]"
                {...register("password")}
              />
              {errors.password && (
                <p
                  className="text-[var(--text-size-sm)] text-destructive"
                  role="alert"
                >
                  {errors.password.message}
                </p>
              )}
            </div>
            {errors.root && (
              <p
                className="text-[var(--text-size-sm)] text-destructive"
                role="alert"
              >
                {errors.root.message}
              </p>
            )}
            <Button
              type="submit"
              className="mt-2 h-[var(--size-button-default)] gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="text-primary-foreground" />
                  Ingresando…
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
          <p className="mt-6 text-center text-[var(--text-size-sm)]">
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
