import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Bean, Compass, Waves } from "lucide-react";
import { ExploreCatalog } from "@/components/ExploreCatalog";
import { GlassPanel } from "@/components/GlassPanel";
import { SectionHeading } from "@/components/SectionHeading";
import { brewMethods } from "@/data/brewing-methods";
import { origins } from "@/data/origins";
import type { BrewMethodId } from "@/types";

export const metadata: Metadata = {
  title: "Explore Coffee Origins",
  description:
    "Compare coffee from Ethiopia, Colombia, Brazil, Kenya, and Guatemala by flavor, processing, roast, and ideal brewing method.",
};

const methodNames = Object.fromEntries(
  brewMethods.map((method) => [method.id, method.name]),
) as Record<BrewMethodId, string>;

export default function ExplorePage() {
  return (
    <main className="relative overflow-hidden bg-[#0c0a08] text-[#f4ead8]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_70%_10%,rgba(183,107,44,.15),transparent_35%),radial-gradient(circle_at_20%_16%,rgba(232,181,105,.07),transparent_28%)]" />

      <section className="relative mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40 lg:px-10 lg:pt-44">
        <div className="grid items-end gap-12 lg:grid-cols-[1fr_0.72fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200/15 bg-amber-200/[0.05] px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber-200/80">
              <Compass className="h-3.5 w-3.5" /> Coffee origin atlas
            </div>
            <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#f5ead7] sm:text-6xl lg:text-7xl">
              Geography becomes <span className="text-amber-200/90">flavor.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-base leading-8 text-[#b0a395] sm:text-lg">
              Trace how elevation, cultivar, and processing shape what reaches your cup. Start with the flavor you enjoy, then find an origin and brew method that lets it speak clearly.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { value: "05", label: "Origins", icon: Bean },
              { value: "21", label: "Flavor signals", icon: Waves },
              { value: "08", label: "Brew paths", icon: Compass },
            ].map(({ value, label, icon: Icon }) => (
              <GlassPanel key={label} className="p-4 sm:p-5">
                <Icon className="h-4 w-4 text-amber-300/65" />
                <p className="mt-5 font-mono text-xl text-[#eddfca] sm:text-2xl">{value}</p>
                <p className="mt-1 text-[0.65rem] uppercase tracking-[0.12em] text-[#817568]">{label}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading
          eyebrow="Taste-first discovery"
          title="Find a coffee by its signals, not its reputation."
          description="These profiles describe common tendencies, not guarantees. Variety, processing, roast, freshness, and brewing all influence the final cup."
        />
        <div className="mt-10 sm:mt-14">
          <Suspense fallback={<div className="glass-panel grid min-h-72 place-items-center rounded-[1.75rem] text-sm text-[#9e907e]">Mapping origin signals…</div>}>
            <ExploreCatalog origins={origins} methodNames={methodNames} />
          </Suspense>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 pb-24 pt-10 sm:px-8 sm:pb-32 lg:px-10">
        <GlassPanel className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12" glow="amber">
          <div className="relative">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber-300/70">Next experiment</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.045em] text-[#f4ead8] sm:text-4xl">
              Turn an origin profile into a brewable recipe.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#a99d8f] sm:text-base">
              Choose your coffee, roast, brewer, grinder, and cup size. Brew Lab will translate them into a transparent starting point you can adjust by taste.
            </p>
          </div>
          <Link
            href="/brew-lab"
            className="relative inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f1c27d] px-6 text-sm font-semibold text-[#1d1209] outline-none transition hover:bg-[#f5d096] focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#15100c]"
          >
            Open Brew Lab <ArrowRight className="h-4 w-4" />
          </Link>
        </GlassPanel>
      </section>
    </main>
  );
}
