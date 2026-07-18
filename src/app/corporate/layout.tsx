import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CorporateNavigation } from "@/components/corporate/CorporateNavigation";
import { CorporateRouteGuard } from "@/components/auth/RouteGuards";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CorporateLayout({ children }: { children: ReactNode }) {
  return (
    <CorporateRouteGuard>
      <div className="min-h-screen bg-[#090705] pt-[4.65rem] text-[#f4ead8]">
        <CorporateNavigation />
        <div className="min-h-[calc(100vh-4.65rem)] lg:pl-64">{children}</div>
      </div>
    </CorporateRouteGuard>
  );
}
