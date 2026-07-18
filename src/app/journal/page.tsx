import type { Metadata } from "next";
import { IndividualPreviewGate } from "@/components/auth/IndividualPreviewGate";
import { JournalClient } from "@/components/JournalClient";

export const metadata: Metadata = {
  title: "Brew Journal",
  description: "Save brew recipes, compare tasting notes, and turn each cup into a useful next adjustment.",
  robots: { index: false, follow: false },
};

export default function JournalPage() {
  return (
    <IndividualPreviewGate
      description="Record equipment, recipe variables, timing, tasting notes, and ratings so each cup becomes evidence for the next adjustment."
      features={["Searchable local brew history", "Recipe duplication and comparison", "Rating, method, origin, and grind summaries"]}
      loginPath="/journal"
      secondaryHref="/learn/grind-size"
      secondaryLabel="Try a public lesson"
      title="Build a private brew history, one measured cup at a time."
    >
      <main className="min-h-screen bg-[#0b0908] text-[#f7f0e5]">
        <JournalClient />
      </main>
    </IndividualPreviewGate>
  );
}
