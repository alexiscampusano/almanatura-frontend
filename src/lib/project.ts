import {
  GraduationCap,
  Heartbeat,
  Laptop,
  MusicNotes,
  Rocket,
} from "@phosphor-icons/react";
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

export const PILLAR_CONFIG: Record<
  ProjectPillar,
  { label: string; icon: typeof Laptop; bg: string }
> = {
  TECHNOLOGY: { label: "Tecnología", icon: Laptop, bg: "bg-sky-100" },
  EDUCATION: { label: "Educación", icon: GraduationCap, bg: "bg-amber-100" },
  HEALTH: { label: "Salud", icon: Heartbeat, bg: "bg-emerald-100" },
  ENTREPRENEURSHIP: {
    label: "Emprendimiento",
    icon: Rocket,
    bg: "bg-violet-100",
  },
  CULTURE: { label: "Cultura", icon: MusicNotes, bg: "bg-rose-100" },
};

export const ALL_PILLARS: ProjectPillar[] = [
  "TECHNOLOGY",
  "EDUCATION",
  "HEALTH",
  "ENTREPRENEURSHIP",
  "CULTURE",
];
