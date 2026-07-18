"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { rolesForAccess } from "@/auth/access";
import { PublicFeaturePreview } from "@/components/auth/PublicFeaturePreview";
import { RoleGate } from "@/components/auth/RoleGate";

type MemberPreviewGateProps = {
  children: ReactNode;
  title: string;
  description: string;
  features: readonly string[];
  loginPath: string;
  eyebrow?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function MemberPreviewGate({ children, ...previewProps }: MemberPreviewGateProps) {
  const pathname = usePathname();
  const returnPath = typeof window === "undefined"
    ? previewProps.loginPath
    : `${pathname}${window.location.search}`;

  return (
    <RoleGate
      allow={rolesForAccess("member")}
      fallback={<PublicFeaturePreview {...previewProps} loginPath={returnPath} />}
      pending={<main className="grid min-h-[100svh] place-items-center bg-[#0b0908] px-5 text-sm text-[#9e907e]">Preparing the preview…</main>}
    >
      {children}
    </RoleGate>
  );
}
