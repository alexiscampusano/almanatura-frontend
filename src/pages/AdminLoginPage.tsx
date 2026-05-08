import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { login } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const redirectTarget =
    (location.state as { from?: string } | null)?.from ?? "/admin/projects";

  useEffect(() => {
    if (accessToken) {
      navigate("/admin/projects", { replace: true });
    }
  }, [accessToken, navigate]);

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

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/20 px-4 py-8">
      <section className="w-full max-w-md border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Ingreso administrativo</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Solo usuarios internos autorizados pueden acceder.
        </p>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-medium">
            Correo
            <input
              required
              type="email"
              autoComplete="email"
              disabled={isLoading}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 border border-input bg-background px-3 outline-none focus:border-ring focus:ring-1 focus:ring-ring/50"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Contrasena
            <input
              required
              type="password"
              autoComplete="current-password"
              disabled={isLoading}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 border border-input bg-background px-3 outline-none focus:border-ring focus:ring-1 focus:ring-ring/50"
            />
          </label>
          {errorMessage && (
            <p className="text-sm text-destructive" role="alert">
              {errorMessage}
            </p>
          )}
          <Button type="submit" className="mt-2 h-11" disabled={isLoading}>
            {isLoading ? "Ingresando..." : "Entrar"}
          </Button>
        </form>
      </section>
    </main>
  );
}
