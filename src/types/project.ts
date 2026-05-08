export type ProjectPillar =
  | "TECHNOLOGY"
  | "EDUCATION"
  | "HEALTH"
  | "ENTREPRENEURSHIP"
  | "CULTURE";

export type ProjectStatus = "DRAFT" | "PUBLISHED" | "CANCELLED";

export type PublicProjectResponse = {
  id: number;
  title: string;
  description: string;
  pillar: ProjectPillar;
  startsAt: string;
  endsAt: string;
  location: string;
  imageUrl: string | null;
};

export type AdminProjectResponse = {
  id: number;
  title: string;
  description: string;
  pillar: ProjectPillar;
  status: ProjectStatus;
  startsAt: string | null;
  endsAt: string | null;
  location: string | null;
  imageUrl: string | null;
};

export type CreateProjectPayload = {
  title: string;
  description?: string;
  pillar: ProjectPillar;
  startsAt?: string;
  endsAt?: string;
  location?: string;
  imageUrl?: string;
};

export type UpdateProjectPayload = {
  title: string;
  description?: string;
  pillar: ProjectPillar;
  status: ProjectStatus;
  startsAt?: string;
  endsAt?: string;
  location?: string;
  imageUrl?: string;
};
