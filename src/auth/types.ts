import type { ReactNode } from "react";

export type UserRole = "public" | "individual" | "corporate";

export type AuthenticatedRole = Exclude<UserRole, "public">;

export type AuthSession = {
  version: 1;
  role: AuthenticatedRole;
  email: string;
  displayName: string;
  accountName: string;
  signedInAt: string;
};

export type DemoCredential = {
  role: AuthenticatedRole;
  email: string;
  password: string;
  displayName: string;
  accountName: string;
};

export type LoginInput = {
  email: string;
  password: string;
  rememberSession: boolean;
};

export type LoginResult =
  | { ok: true; session: AuthSession }
  | { ok: false; error: string };

export type AuthContextValue = {
  session: AuthSession | null;
  role: UserRole;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (input: LoginInput) => LoginResult;
  logout: () => void;
};

export type RoleGateProps = {
  allow: readonly UserRole[];
  children: ReactNode;
  fallback?: ReactNode | ((role: UserRole) => ReactNode);
  pending?: ReactNode;
};
