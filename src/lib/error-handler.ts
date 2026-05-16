import { isAxiosError } from "axios";

type ErrorLike = unknown;

export function getErrorMessage(error: ErrorLike, fallback: string): string {
  if (!isAxiosError(error)) return fallback;

  const status = error.response?.status;
  const data = error.response?.data as { message?: string } | undefined;

  if (status === 400) return data?.message ?? "Revisa los datos enviados.";
  if (status === 401) return "Sesión expirada. Inicia sesión nuevamente.";
  if (status === 403) return "No tienes permiso para esta acción.";
  if (status === 404) return "El recurso no fue encontrado.";
  if (status === 409) return "Ya existe un registro con esos datos.";
  if (status === 429) return "Demasiados intentos. Espera un momento.";

  return fallback;
}

export function isNotFoundError(error: ErrorLike): boolean {
  return isAxiosError(error) && error.response?.status === 404;
}

export function isForbiddenError(error: ErrorLike): boolean {
  return isAxiosError(error) && error.response?.status === 403;
}

export function isConflictError(error: ErrorLike): boolean {
  return isAxiosError(error) && error.response?.status === 409;
}

export function isUnauthorizedError(error: ErrorLike): boolean {
  return isAxiosError(error) && error.response?.status === 401;
}
