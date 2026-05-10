export type InternalRole = "SUPER_USER" | "EVENT_MANAGER";

export type UserSummary = {
  id: number;
  email: string;
  name: string;
  role: InternalRole;
};

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  role: InternalRole;
  enabled?: boolean;
};
