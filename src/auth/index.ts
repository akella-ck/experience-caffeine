export {
  accessForPath,
  authenticateDemoCredentials,
  canAccessPath,
  canRoleAccess,
  CORPORATE_ROLES,
  dashboardPathForRole,
  INDIVIDUAL_ROLES,
  isAuthenticatedRole,
  MEMBER_ROLES,
  parseAuthSession,
  PUBLIC_ROLES,
  rolesForAccess,
  ROUTE_ACCESS_RULES,
  safeInternalPath,
} from "@/auth/access";
export { navigationForRole } from "@/auth/navigation";
export { clearStoredSessions } from "@/auth/storage";
export type { SessionStorageTarget } from "@/auth/storage";
export type {
  AuthContextValue,
  AuthSession,
  AuthenticatedRole,
  DemoCredential,
  LoginInput,
  LoginResult,
  RoleGateProps,
  UserRole,
} from "@/auth/types";
export type { RouteAccessLevel, RouteAccessRule } from "@/auth/access";
