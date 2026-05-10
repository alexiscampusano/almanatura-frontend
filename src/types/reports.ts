import type { ProjectPillar, ProjectStatus } from "@/types/project";

export type ProjectStatusCount = {
  status: ProjectStatus;
  count: number;
};

export type ReportsSummaryResponse = {
  projectsByStatus: ProjectStatusCount[];
  totalProjects: number;
  totalApplications: number;
  totalImpactEntries: number;
  totalOutboundNotifications: number;
};

export type ProjectApplicationReportRow = {
  id: number;
  title: string;
  startsAt: string | null;
  pillar: ProjectPillar;
  status: ProjectStatus;
  applicationCount: number;
};
