import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import { CorporatePageHeader, CorporatePanel, CorporatePreviewNotice } from "@/components/corporate/CorporateUI";

export default function CorporateIndexPage() {
  return (
    <main className="relative overflow-hidden px-4 py-8 sm:px-6 sm:py-10 xl:px-10">
      <div className="relative mx-auto max-w-[92rem] space-y-6">
        <CorporatePageHeader
          eyebrow="Corporate workspace"
          meta="Northline Coffee Group · preview"
          title={<>Operations, learning, and quality in one <span className="editorial-title text-[#e5af6c]">reviewable system.</span></>}
          description="Open the dashboard to review illustrative production signals, roast profiles, recipes, quality records, learning, equipment, teams, and locations."
          actions={<Link href="/corporate/dashboard" className="button-primary">Open dashboard <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>}
        />
        <CorporatePreviewNotice>This static demo does not connect to production equipment, customer systems, or live organizational data.</CorporatePreviewNotice>
        <CorporatePanel className="flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-amber-300/15 bg-amber-300/[0.06]">
              <Building2 className="size-5 text-amber-200" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-medium text-[#eadcc9]">Continue to the operating dashboard</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#a99c8e]">The dashboard is the starting point for role-aware corporate navigation and priority review.</p>
            </div>
          </div>
          <Link href="/corporate/dashboard" className="button-secondary shrink-0">Continue <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </CorporatePanel>
      </div>
    </main>
  );
}
