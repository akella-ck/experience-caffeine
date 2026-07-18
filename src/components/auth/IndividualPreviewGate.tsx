"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { INDIVIDUAL_ROLES } from "@/auth/access";
import { AccessDenied } from "@/components/auth/AccessDenied";
import { PublicFeaturePreview } from "@/components/auth/PublicFeaturePreview";
import { RoleGate } from "@/components/auth/RoleGate";

type IndividualPreviewGateProps = {
  children: ReactNode;
  title: string;
  description: string;
  features: readonly string[];
  loginPath: string;
  eyebrow?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function IndividualPreviewGate({ children, ...previewProps }: IndividualPreviewGateProps) {
  const pathname = usePathname();
  const returnPath = typeof window === "undefined"
    ? previewProps.loginPath
    : `${pathname}${window.location.search}`;

  return (
    <RoleGate
      allow={INDIVIDUAL_ROLES}
      fallback={(role) => role === "public"
        ? <PublicFeaturePreview {...previewProps} loginPath={returnPath} />
        : (
          <AccessDenied
            nextPath={returnPath}
            requiredAccess="individual"
            requiredLabel="the individual workspace"
            role={role}
          />
        )}
      pending={<main className="grid min-h-[100svh] place-items-center bg-[#0b0908] px-5 text-sm text-[#9e907e]">Preparing the preview…</main>}
    >
      {children}
    </RoleGate>
  );
}
