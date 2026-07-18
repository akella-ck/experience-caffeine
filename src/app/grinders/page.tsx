import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleDotDashed, Gauge, RotateCcw, Scale, Settings2 } from "lucide-react";
import { GlassPanel } from "@/components/GlassPanel";
import { GrindScale } from "@/components/GrindScale";
import { GrinderCard } from "@/components/GrinderCard";
import { SectionHeading } from "@/components/SectionHeading";
import { grinders } from "@/data/grinders";

export const metadata: Metadata = {
  title: "Coffee Grinder Guides",
  description:
    "Find grinder-specific starting settings, visual grind references, calibration steps, and cleaning guidance for five popular coffee grinders.",
};

const supportedGrinders = grinders.filter((grinder) => grinder.id !== "other");

export default function GrindersPage() {
  return (
    <main className="relative overflow-hidden bg-[#0c0a08] text-[#f4ead8]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[50rem] bg-[radial-gradient(circle_at_75%_10%,rgba(214,144,69,.14),transparent_30%),radial-gradient(circle_at_15%_25%,rgba(116,71,39,.15),transparent_32%)]" />

      <section className="relative mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40 lg:px-10 lg:pt-44">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200/15 bg-amber-200/[0.05] px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber-200/80">
              <Settings2 className="h-3.5 w-3.5" /> Grinder coordinates
            </div>
            <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#f5ead7] sm:text-6xl lg:text-7xl">
              “Medium-fine” is a clue. Your dial is a <span className="text-amber-200/90">coordinate.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-base leading-8 text-[#b0a395] sm:text-lg">
              Translate visual grind language into a useful range for your grinder, then calibrate that range against taste and brew time.
            </p>
          </div>
          <GlassPanel className="p-6 sm:p-7" glow="amber">
            <p className="relative font-mono text-[0.64rem] uppercase tracking-[0.19em] text-amber-300/70">Before you copy a number</p>
            <p className="relative mt-4 text-lg leading-8 tracking-[-0.015em] text-[#e4d6c2]">
              Settings vary with calibration, burr wear, bean density, roast level, coffee age, and technique. Every range here is a starting point.
            </p>
          </GlassPanel>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading
          eyebrow="Equipment library"
          title="Know the adjustment system before making an adjustment."
          description="Each guide explains the dial, a safe zero reference, starting ranges for eight methods, and a repeatable calibration routine."
        />
        <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {supportedGrinders.map((grinder, index) => (
            <GrinderCard
              key={grinder.id}
              index={index}
              grinder={{
                id: grinder.id,
                name: grinder.name,
                brand: grinder.brand,
                adjustmentType: grinder.adjustmentType,
                description: grinder.description,
              }}
            />
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading
          eyebrow="Starting ranges, not absolutes"
          title="One V60 target, five different dial languages."
          description="These settings all aim toward a medium-fine visual range. The number only has meaning when paired with the grinder model."
        />
        <GlassPanel className="mt-10 overflow-hidden sm:mt-12">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <caption className="sr-only">V60 starting settings by grinder</caption>
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.025]">
                  {['Grinder', 'Adjustment system', 'V60 starting range', 'How to move'].map((heading) => (
                    <th key={heading} scope="col" className="px-5 py-4 text-[0.62rem] font-medium uppercase tracking-[0.15em] text-[#817569] sm:px-6">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {supportedGrinders.map((grinder) => {
                  const setting = grinder.settings.find((candidate) => candidate.brewMethodId === "v60");
                  return (
                    <tr key={grinder.id} className="border-b border-white/[0.06] last:border-0 hover:bg-amber-200/[0.025]">
                      <th scope="row" className="px-5 py-5 sm:px-6"><Link href={`/grinders/${grinder.id}`} className="font-medium text-[#eee1ce] underline-offset-4 outline-none hover:text-amber-200 hover:underline focus-visible:ring-2 focus-visible:ring-amber-300/70">{grinder.name}</Link></th>
                      <td className="px-5 py-5 text-sm text-[#a99d8f] sm:px-6">{grinder.adjustmentType}</td>
                      <td className="px-5 py-5 font-mono text-sm text-amber-200/85 sm:px-6">{setting?.startingRange ?? "Visual reference"}</td>
                      <td className="max-w-sm px-5 py-5 text-xs leading-5 text-[#988c80] sm:px-6">{setting?.adjustmentAdvice ?? "Adjust in small increments based on taste."}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading
          eyebrow="Visual anchor"
          title="A number is local. Particle size is shared language."
          description="Use these textures to get close, then save the exact setting that works on your grinder."
        />
        <GlassPanel className="mt-10 p-5 sm:mt-12 sm:p-8">
          <GrindScale active="medium-fine" />
        </GlassPanel>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading eyebrow="Calibration loop" title="Turn a starting range into your repeatable setting." />
        <ol className="mt-10 grid gap-4 lg:grid-cols-4">
          {[
            { icon: CircleDotDashed, title: "Establish reference", body: "Clean and assemble the grinder correctly. Know where its safe zero reference sits." },
            { icon: Scale, title: "Brew a baseline", body: "Use the middle of the range with measured coffee, water, temperature, and time." },
            { icon: Gauge, title: "Taste, then move", body: "Change one small step finer or coarser in response to a clear sensory clue." },
            { icon: RotateCcw, title: "Record and repeat", body: "Save the coffee, batch size, setting, time, and result while the memory is fresh." },
          ].map(({ icon: Icon, title, body }, index) => (
            <li key={title}>
              <GlassPanel className="h-full p-6">
                <div className="flex items-center justify-between"><Icon className="h-5 w-5 text-amber-300/70" /><span className="font-mono text-xs text-[#6d6258]">0{index + 1}</span></div>
                <h3 className="mt-8 text-lg font-semibold tracking-[-0.02em] text-[#e8dbc7]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#9d9184]">{body}</p>
              </GlassPanel>
            </li>
          ))}
        </ol>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 pb-24 pt-10 sm:px-8 sm:pb-32 lg:px-10">
        <GlassPanel className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12" glow="amber">
          <div className="relative">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber-300/70">Put the coordinate to work</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.045em] text-[#f4ead8] sm:text-4xl">Match a grinder setting to your coffee and brewer.</h2>
          </div>
          <Link href="/brew-lab" className="relative inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f1c27d] px-6 text-sm font-semibold text-[#1d1209] outline-none transition hover:bg-[#f5d096] focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#15100c]">Open Brew Lab <ArrowRight className="h-4 w-4" /></Link>
        </GlassPanel>
      </section>
    </main>
  );
}
