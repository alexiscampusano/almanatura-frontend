export const FLAGS = {
  enableNotifications: import.meta.env.VITE_FF_NOTIFICATIONS !== "false",
  enableUserManagement: import.meta.env.VITE_FF_USER_MGMT !== "false",
  enableReports: import.meta.env.VITE_FF_REPORTS !== "false",
} as const;

export type FlagKey = keyof typeof FLAGS;

export function isFlagEnabled(flag: FlagKey): boolean {
  return FLAGS[flag];
}
