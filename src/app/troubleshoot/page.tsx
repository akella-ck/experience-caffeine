import type { Metadata } from "next";
import { Suspense } from "react";
import { MemberPreviewGate } from "@/components/auth/MemberPreviewGate";
import { TasteSelector } from "@/components/TasteSelector";

export const metadata: Metadata = {
  title: "Taste Troubleshooter",
  description: "Diagnose sour, bitter, weak, dry, hollow, flat, or overly strong coffee one variable at a time.",
};

export default function TroubleshootPage() {
  return (
    <MemberPreviewGate
      description="Describe the taste, timing, method, and roast. The diagnostic chooses one controlled adjustment and explains what to observe in the next cup."
      features={["Seven taste symptoms with deterministic guidance", "Method- and roast-aware recommendations", "One-variable-at-a-time experiments"]}
      loginPath="/troubleshoot"
      title="Turn a disappointing cup into a useful next test."
    >
      <main className="min-h-screen bg-[#0b0908] text-[#f7f0e5]">
        <Suspense fallback={<div className="section-shell grid min-h-screen place-items-center text-sm text-[#9e907e]">Preparing the sensory diagnostic…</div>}>
          <TasteSelector />
        </Suspense>
      </main>
    </MemberPreviewGate>
  );
}
