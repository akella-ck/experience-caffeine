import type { Metadata } from "next";
import { Suspense } from "react";
import { GuidedBrewExperience } from "@/components/GuidedBrewExperience";

export const metadata: Metadata = {
  title: "Guided Brew",
  description: "Follow a clear brewing sequence with live water targets, timing, and technique cues.",
  robots: { index: false, follow: false },
};

export default function GuidedBrewPage() {
  return (
    <Suspense fallback={<main className="grid min-h-[100svh] place-items-center bg-[#0b0908] px-5 text-sm text-[#9e907e]">Preparing the guided brew…</main>}>
      <GuidedBrewExperience />
    </Suspense>
  );
}
