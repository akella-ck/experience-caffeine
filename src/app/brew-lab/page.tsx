import type { Metadata } from "next";
import { Suspense } from "react";
import { MemberPreviewGate } from "@/components/auth/MemberPreviewGate";
import { BrewLabConfigurator } from "@/components/BrewLabConfigurator";

export const metadata: Metadata = {
  title: "Brew Lab",
  description: "Build a grinder-aware coffee recipe and get a practical starting point for your next brew.",
};

export default function BrewLabPage() {
  return (
    <MemberPreviewGate
      description="Match an origin, roast, brewer, grinder, and cup size to a practical recipe. Members can change every input and carry the result into a guided brew."
      features={["Grinder-specific starting ranges", "Live dose, temperature, bloom, and pour calculations", "Taste-led adjustment guidance"]}
      loginPath="/brew-lab"
      secondaryHref="/brew-methods"
      secondaryLabel="Explore brewing methods"
      title="Build a recipe around the equipment on your counter."
    >
      <main className="min-h-screen bg-[#0b0908] text-[#f7f0e5]">
        <Suspense
          fallback={
            <div className="section-shell grid min-h-screen place-items-center pt-24 text-sm text-[#9e907e]">
              Calibrating the recipe deck…
            </div>
          }
        >
          <BrewLabConfigurator />
        </Suspense>
      </main>
    </MemberPreviewGate>
  );
}
