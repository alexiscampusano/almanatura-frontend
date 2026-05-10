import type { ApplicationStatus } from "@/types/application";

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  SUBMITTED: "Enviada",
  UNDER_REVIEW: "En revisión",
  REJECTED: "Rechazada",
  NEEDS_INFO: "Requiere información",
  APPROVED: "Aprobada",
  REGISTERED_AS_ACTOR: "Registrado como actor",
};

const NEXT_STATUSES: Record<ApplicationStatus, ApplicationStatus[]> = {
  SUBMITTED: ["UNDER_REVIEW", "REJECTED"],
  UNDER_REVIEW: ["REJECTED", "NEEDS_INFO", "APPROVED"],
  NEEDS_INFO: ["UNDER_REVIEW", "REJECTED"],
  APPROVED: ["REGISTERED_AS_ACTOR"],
  REJECTED: [],
  REGISTERED_AS_ACTOR: [],
};

export function allowedNextStatuses(
  from: ApplicationStatus,
): ApplicationStatus[] {
  return NEXT_STATUSES[from] ?? [];
}
