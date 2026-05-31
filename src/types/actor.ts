import type { ProjectPillar } from "@/types/project";
import type { ApplicationStatus } from "@/types/application";

export type ActorProjectInfo = {
  projectId: number;
  projectTitle: string;
  pillar: ProjectPillar;
  applicationStatus: ApplicationStatus;
};

export type ActorResponse = {
  id: number;
  fullName: string;
  region: string;
  email?: string;
  phone?: string;
  nationalId?: string;
  notes?: string;
  createdAt?: string;
  projects: ActorProjectInfo[];
};
