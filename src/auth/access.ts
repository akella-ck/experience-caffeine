import { DEMO_AUTH_ENABLED, DEMO_CREDENTIALS } from "../config/demo-auth";
import type {
  AuthSession,
  AuthenticatedRole,
  LoginInput,
  LoginResult,
  UserRole,
} from "./types";

export const MEMBER_ROLES = ["individual", "corporate"] as const satisfies readonly UserRole[];
export const INDIVIDUAL_ROLES = ["individual"] as const satisfies readonly UserRole[];
export const CORPORATE_ROLES = ["corporate"] as const satisfies readonly UserRole[];
export const PUBLIC_ROLES = ["public", "individual", "corporate"] as const satisfies readonly UserRole[];

export type RouteAccessLevel = "public" | "member" | "individual" | "corporate";

export type RouteAccessRule = {
  path: string;
  access: RouteAccessLevel;
  match: "exact" | "prefix" | "descendants";
};

export const ROUTE_ACCESS_RULES = [
  { path: "/corporate", access: "corporate", match: "prefix" },
  { path: "/dashboard", access: "individual", match: "exact" },
  { path: "/profile", access: "individual", match: "exact" },
  { path: "/journal", access: "individual", match: "prefix" },
  { path: "/brew-lab", access: "member", match: "prefix" },
  { path: "/troubleshoot", access: "member", match: "prefix" },
  { path: "/guided-brew", access: "member", match: "exact" },
  { path: "/brew-methods", access: "member", match: "descendants" },
  { path: "/grinders", access: "member", match: "descendants" },
  { path: "/learn/grind-size", access: "public", match: "exact" },
  { path: "/learn", access: "member", match: "descendants" },
] as const satisfies readonly RouteAccessRule[];

export function rolesForAccess(access: RouteAccessLevel): readonly UserRole[] {
  if (access === "individual") return INDIVIDUAL_ROLES;
  if (access === "corporate") return CORPORATE_ROLES;
  if (access === "member") return MEMBER_ROLES;
  return PUBLIC_ROLES;
}

function ruleMatchesPath(rule: RouteAccessRule, pathname: string) {
  if (rule.match === "exact") return pathname === rule.path;
  if (rule.match === "descendants") return pathname.startsWith(`${rule.path}/`);
  return pathname === rule.path || pathname.startsWith(`${rule.path}/`);
}

export function accessForPath(pathname: string): RouteAccessLevel {
  const normalizedPathname = pathname.split(/[?#]/, 1)[0] || "/";
  return ROUTE_ACCESS_RULES.find((rule) => ruleMatchesPath(rule, normalizedPathname))?.access ?? "public";
}

export function canAccessPath(role: UserRole, pathname: string) {
  return canRoleAccess(role, rolesForAccess(accessForPath(pathname)));
}

export function isAuthenticatedRole(value: unknown): value is AuthenticatedRole {
  return value === "individual" || value === "corporate";
}

export function canRoleAccess(role: UserRole, allow: readonly UserRole[]) {
  return allow.includes(role);
}

export function authenticateDemoCredentials(input: LoginInput): LoginResult {
  if (!DEMO_AUTH_ENABLED) {
    return { ok: false, error: "Demo authentication is disabled in this environment." };
  }

  const normalizedEmail = input.email.trim().toLowerCase();
  const credential = DEMO_CREDENTIALS.find(
    (candidate) => candidate.email === normalizedEmail && candidate.password === input.password,
  );

  if (!credential) {
    return {
      ok: false,
      error: "Those demo credentials do not match an available account.",
    };
  }

  return {
    ok: true,
    session: {
      version: 1,
      role: credential.role,
      email: credential.email,
      displayName: credential.displayName,
      accountName: credential.accountName,
      signedInAt: new Date().toISOString(),
    },
  };
}

export function parseAuthSession(value: string | null): AuthSession | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed !== "object" || parsed === null) return null;
    const candidate = parsed as Record<string, unknown>;
    if (
      candidate.version !== 1 ||
      !isAuthenticatedRole(candidate.role) ||
      typeof candidate.email !== "string" ||
      typeof candidate.displayName !== "string" ||
      typeof candidate.accountName !== "string" ||
      typeof candidate.signedInAt !== "string" ||
      Number.isNaN(Date.parse(candidate.signedInAt))
    ) {
      return null;
    }

    return {
      version: 1,
      role: candidate.role,
      email: candidate.email,
      displayName: candidate.displayName,
      accountName: candidate.accountName,
      signedInAt: candidate.signedInAt,
    };
  } catch {
    return null;
  }
}

export function dashboardPathForRole(role: AuthenticatedRole) {
  return role === "corporate" ? "/corporate/dashboard" : "/dashboard";
}

export function safeInternalPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  if (value.includes("\\") || /[\r\n]/.test(value)) return null;
  return value;
}
