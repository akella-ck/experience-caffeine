import type { CorporatePreferences } from "./types";

export const defaultCorporatePreferences: CorporatePreferences = {
  organizationName: "Northline Coffee Group",
  programName: "Northline Quality Program",
  unitSystem: "Metric",
  temperatureUnit: "Celsius",
  defaultRecipeVisibility: "Organization",
  qualityDigest: "Weekly",
  learningReminders: true,
  requireStandardApproval: true,
};

export const settingsReadiness = [
  { id: "identity", label: "Identity and role access", status: "Foundation", detail: "Local role-aware guard; production identity and organization tenancy are separate backend work." },
  { id: "persistence", label: "Organization preferences", status: "Local preview", detail: "Controls can be evaluated in-session but are not saved to a server." },
  { id: "notifications", label: "Notifications", status: "Planned", detail: "Email, push, and escalation delivery require a production messaging service." },
  { id: "audit", label: "Audit history", status: "Planned", detail: "Immutable audit storage is not included in the foundational UI." },
] as const;
