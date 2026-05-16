import type { ProjectPillar, ProjectStatus } from "@/types/project";

export const PILLAR_LABELS: Record<ProjectPillar, string> = {
  TECHNOLOGY: "Tecnología",
  EDUCATION: "Educación",
  HEALTH: "Salud",
  ENTREPRENEURSHIP: "Emprendimiento",
  CULTURE: "Cultura",
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicado",
  CANCELLED: "Cancelado",
};

export const STATUS_VARIANT: Record<
  ProjectStatus,
  "default" | "secondary" | "destructive"
> = {
  DRAFT: "secondary",
  PUBLISHED: "default",
  CANCELLED: "destructive",
};
