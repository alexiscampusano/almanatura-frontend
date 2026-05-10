import type {
  ProjectApplicationReportRow,
  ReportsSummaryResponse,
} from "@/types/reports";

import { apiClient } from "./api.client";

export async function getReportsSummary(): Promise<ReportsSummaryResponse> {
  const response = await apiClient.get<ReportsSummaryResponse>(
    "/admin/reports/summary",
  );
  return response.data;
}

export async function getProjectApplicationReport(): Promise<
  ProjectApplicationReportRow[]
> {
  const response = await apiClient.get<ProjectApplicationReportRow[]>(
    "/admin/reports/projects/applications",
  );
  return response.data;
}
