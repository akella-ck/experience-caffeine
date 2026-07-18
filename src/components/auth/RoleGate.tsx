"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { canRoleAccess, rolesForAccess, type RouteAccessLevel } from "@/auth/access";
import type { RoleGateProps } from "@/auth/types";
import { AccessDenied } from "@/components/auth/AccessDenied";
import { useAuth } from "@/components/auth/AuthProvider";

export function RoleGate({ allow, children, fallback = null, pending = null }: RoleGateProps) {
  const { isHydrated, role } = useAuth();

  if (!isHydrated) return pending;
  if (canRoleAccess(role, allow)) return children;
  return typeof fallback === "function" ? fallback(role) : fallback;
}

type RouteGuardProps = {
  access: Exclude<RouteAccessLevel, "public">;
  children: ReactNode;
  requiredLabel: string;
  nextPath?: string;
};

function GuardPending() {
  return (
    <main className="grid min-h-[100svh] place-items-center bg-[#0b0908] px-5 text-sm text-[#9e907e]">
      Checking demo access…
    </main>
  );
}

export function RouteGuard({ access, children, requiredLabel, nextPath }: RouteGuardProps) {
  const pathname = usePathname();
  const currentPath = typeof window === "undefined" ? pathname : `${pathname}${window.location.search}`;
  const returnPath = nextPath ?? currentPath;

  return (
    <RoleGate
      allow={rolesForAccess(access)}
      fallback={(role) => (
        <AccessDenied
          nextPath={returnPath}
          requiredAccess={access}
          requiredLabel={requiredLabel}
          role={role}
        />
      )}
      pending={<GuardPending />}
    >
      {children}
    </RoleGate>
  );
}

export function MemberRouteGuard({ children, nextPath }: { children: ReactNode; nextPath?: string }) {
  return <RouteGuard access="member" nextPath={nextPath} requiredLabel="member tools">{children}</RouteGuard>;
}

export function IndividualRouteGuard({ children, nextPath }: { children: ReactNode; nextPath?: string }) {
  return <RouteGuard access="individual" nextPath={nextPath} requiredLabel="the individual workspace">{children}</RouteGuard>;
}

export function CorporateRouteGuard({ children, nextPath }: { children: ReactNode; nextPath?: string }) {
  return <RouteGuard access="corporate" nextPath={nextPath} requiredLabel="the corporate workspace">{children}</RouteGuard>;
}
