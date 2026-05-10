import { useQuery } from "@tanstack/react-query";

import {
  getProjectApplicationReport,
  getReportsSummary,
} from "@/services/admin-reports.service";

export function useReportsSummary() {
  return useQuery({
    queryKey: ["admin-reports", "summary"],
    queryFn: getReportsSummary,
  });
}

export function useProjectApplicationReport() {
  return useQuery({
    queryKey: ["admin-reports", "projects-applications"],
    queryFn: getProjectApplicationReport,
  });
}
