export type ProjectImpactEntryResponse = {
  id: number;
  projectId: number;
  recordedAt: string;
  metricLabel: string;
  numericValue: number | null;
  notes: string | null;
};

export type CreateProjectImpactEntryPayload = {
  recordedAt: string;
  metricLabel: string;
  numericValue?: number;
  notes?: string;
};
