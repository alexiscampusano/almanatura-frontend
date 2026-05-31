import { isAxiosError } from "axios";

type ErrorLike = unknown;

type ProblemData = {
  code?: string;
  detail?: string;
  violations?: Array<{ field?: string; message?: string }>;
  message?: string;
};

function getProblemData(error: ErrorLike): ProblemData | undefined {
  if (!isAxiosError(error)) return undefined;
  return error.response?.data as ProblemData | undefined;
}

const CODE_MESSAGES: Record<string, string> = {
  VALIDATION_FAILED: "Revisa los datos enviados.",
  MALFORMED_REQUEST: "Revisa los datos enviados.",
  MISSING_PARAMETER: "Falta un parámetro requerido.",
  TYPE_MISMATCH: "Tipo de parámetro inválido.",
  EMAIL_ALREADY_IN_USE: "El correo ya está en uso.",
  APPLICATION_ALREADY_EXISTS:
    "Ya existe una solicitud con ese correo en este proyecto.",
  PROJECT_HAS_APPLICATIONS:
    "El proyecto no se puede eliminar porque tiene solicitudes asociadas.",
  RESOURCE_NOT_FOUND: "El recurso no fue encontrado.",
  RATE_LIMIT_EXCEEDED: "Demasiados intentos. Espera un momento.",
};

export function getErrorMessage(error: ErrorLike, fallback: string): string {
  const pd = getProblemData(error);
  const status = isAxiosError(error) ? error.response?.status : undefined;

  // Validation details first
  if (status === 400) {
    if (pd?.violations && pd.violations.length > 0) {
      return pd.violations
        .map((v) =>
          v.field
            ? `${v.field}: ${v.message ?? "inválido"}`
            : (v.message ?? "inválido"),
        )
        .join("; ");
    }
    if (pd?.code && CODE_MESSAGES[pd.code]) return CODE_MESSAGES[pd.code];
    if (pd?.detail) return pd.detail;
    return "Revisa los datos enviados.";
  }

  // Known code mapping
  if (pd?.code && CODE_MESSAGES[pd.code]) return CODE_MESSAGES[pd.code];

  // Status-based fallbacks
  if (status === 401) return "Sesión expirada. Inicia sesión nuevamente.";
  if (status === 403) return "No tienes permiso para esta acción.";
  if (status === 404) return "El recurso no fue encontrado.";
  if (status === 409) return "Ya existe un registro con esos datos.";
  if (status === 429) return "Demasiados intentos. Espera un momento.";

  if (pd?.detail) return pd.detail;

  return fallback;
}

export function isNotFoundError(error: ErrorLike): boolean {
  const pd = getProblemData(error);
  return (
    isAxiosError(error) &&
    (error.response?.status === 404 || pd?.code === "RESOURCE_NOT_FOUND")
  );
}

export function isForbiddenError(error: ErrorLike): boolean {
  const pd = getProblemData(error);
  return (
    isAxiosError(error) &&
    (error.response?.status === 403 || pd?.code === "ACCESS_DENIED")
  );
}

export function isConflictError(error: ErrorLike): boolean {
  const pd = getProblemData(error);
  return (
    isAxiosError(error) &&
    (error.response?.status === 409 ||
      pd?.code === "APPLICATION_ALREADY_EXISTS" ||
      pd?.code === "EMAIL_ALREADY_IN_USE")
  );
}

export function isUnauthorizedError(error: ErrorLike): boolean {
  const pd = getProblemData(error);
  return (
    isAxiosError(error) &&
    (error.response?.status === 401 ||
      pd?.code === "AUTHENTICATION_REQUIRED" ||
      pd?.code === "INVALID_CREDENTIALS")
  );
}
