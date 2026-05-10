export type ApplicationStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "REJECTED"
  | "NEEDS_INFO"
  | "APPROVED"
  | "REGISTERED_AS_ACTOR";

export type SubmitApplicationPayload = {
  projectId: number;
  fullName: string;
  email: string;
  dni: string;
  phone?: string;
};

export type ApplicationSubmittedResponse = {
  id: number;
  projectId: number;
  submittedAt: string;
};

export type AdminApplicationResponse = {
  id: number;
  projectId: number;
  actorId: number | null;
  status: ApplicationStatus;
  fullName: string;
  email: string;
  phone: string | null;
  nationalId: string;
  createdAt: string;
};
