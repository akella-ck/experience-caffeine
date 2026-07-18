import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Beaker, Droplets, Gauge, SlidersHorizontal } from "lucide-react";
import { GlassPanel } from "@/components/GlassPanel";
import { MethodCard } from "@/components/MethodCard";
import { SectionHeading } from "@/components/SectionHeading";
import { brewMethods } from "@/data/brewing-methods";

export const metadata: Metadata = {
  title: "Brewing Methods",
  description:
    "Compare V60, AeroPress, French Press, Chemex, espresso, Moka Pot, cold brew, and automatic drip by body, clarity, time, and technique.",
};

export default function BrewMethodsPage() {
  return (
    <main className="relative overflow-hidden bg-[#0c0a08] text-[#f4ead8]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[48rem] bg-[radial-gradient(circle_at_18%_12%,rgba(224,161,81,.11),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(126,73,37,.18),transparent_34%)]" />

      <section className="relative mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40 lg:px-10 lg:pt-44">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.66fr] lg:items-end">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200/15 bg-amber-200/[0.05] px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber-200/80">
              <Beaker className="h-3.5 w-3.5" /> Brewing systems
            </div>
            <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#f5ead7] sm:text-6xl lg:text-7xl">
              Choose the way you want your coffee to <span className="text-amber-200/90">speak.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-base leading-8 text-[#b0a395] sm:text-lg">
              Each brewer is a different instrument for controlling contact time, flow, pressure, and filtration. Compare the cup first; then learn the technique.
            </p>
          </div>
          <GlassPanel className="p-6 sm:p-7" glow="amber">
            <p className="relative font-mono text-[0.64rem] uppercase tracking-[0.19em] text-amber-300/70">A useful rule</p>
            <p className="relative mt-4 text-xl leading-8 tracking-[-0.02em] text-[#e9dcc8]">
              There is no “best” brewer—only the brewer that emphasizes the texture, clarity, and ritual you want today.
            </p>
          </GlassPanel>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading
          eyebrow="Eight ways in"
          title="Compare the cup before the equipment."
          description="Start with body, clarity, time, and how hands-on you want to be. Every guide includes a baseline recipe, a visual grind reference, and taste-led corrections."
        />
        <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 xl:grid-cols-4">
          {brewMethods.map((method, index) => (
            <MethodCard
              key={method.id}
              index={index}
              method={{
                id: method.id,
                name: method.name,
                difficulty: method.difficulty,
                duration: method.brewTime,
                body: method.body,
                clarity: method.clarity,
                description: method.tagline,
              }}
            />
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading
          eyebrow="Method matrix"
          title="The same coffee, translated eight ways."
          description="Use this as a directional comparison. Filters, pressure, recipes, and technique can move any method beyond its typical range."
        />
        <GlassPanel className="mt-10 overflow-hidden sm:mt-12">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <caption className="sr-only">Comparison of coffee brewing methods</caption>
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.025]">
                  {['Method', 'System', 'Grind', 'Ratio', 'Temperature', 'Typical cup'].map((heading) => (
                    <th key={heading} scope="col" className="px-5 py-4 text-[0.62rem] font-medium uppercase tracking-[0.15em] text-[#817569] sm:px-6">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {brewMethods.map((method) => (
                  <tr key={method.id} className="border-b border-white/[0.06] last:border-0 hover:bg-amber-200/[0.025]">
                    <th scope="row" className="px-5 py-5 sm:px-6">
                      <Link href={`/brew-methods/${method.id}`} className="font-medium text-[#eee1ce] underline-offset-4 outline-none hover:text-amber-200 hover:underline focus-visible:ring-2 focus-visible:ring-amber-300/70">
                        {method.name}
                      </Link>
                    </th>
                    <td className="px-5 py-5 text-sm text-[#aa9e90] sm:px-6">{method.category}</td>
                    <td className="px-5 py-5 text-sm capitalize text-[#aa9e90] sm:px-6">{method.grindDescription}</td>
                    <td className="px-5 py-5 font-mono text-xs text-[#cbbdab] sm:px-6">{method.recommendedRatio}</td>
                    <td className="px-5 py-5 font-mono text-xs text-[#cbbdab] sm:px-6">{method.waterTemperature}</td>
                    <td className="px-5 py-5 text-sm text-[#aa9e90] sm:px-6">{method.body} · {method.clarity.toLowerCase()} clarity</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading
          eyebrow="A simple selection model"
          title="Make the choice in three passes."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {[
            {
              icon: Droplets,
              number: "01",
              title: "Choose the texture",
              body: "Paper-filtered pour overs favor clarity. Metal filters and immersion methods retain more oils and body. Pressure produces concentration.",
            },
            {
              icon: Gauge,
              number: "02",
              title: "Choose the involvement",
              body: "Automatic drip asks little during brewing. V60 rewards attentive pouring. AeroPress offers a short, forgiving hands-on ritual.",
            },
            {
              icon: SlidersHorizontal,
              number: "03",
              title: "Calibrate by taste",
              body: "Begin with the guide, observe brew time, then change one major variable. A recipe becomes yours through controlled adjustments.",
            },
          ].map(({ icon: Icon, number, title, body }) => (
            <GlassPanel key={number} className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-amber-300/70" />
                <span className="font-mono text-xs text-[#6f6459]">{number}</span>
              </div>
              <h3 className="mt-8 text-xl font-semibold tracking-[-0.025em] text-[#ebdeca]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#9e9284]">{body}</p>
            </GlassPanel>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 pb-24 pt-10 sm:px-8 sm:pb-32 lg:px-10">
        <GlassPanel className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12" glow="amber">
          <div className="relative">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber-300/70">Have equipment already?</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.045em] text-[#f4ead8] sm:text-4xl">
              Build a recipe around your brewer and grinder.
            </h2>
          </div>
          <Link href="/brew-lab" className="relative inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f1c27d] px-6 text-sm font-semibold text-[#1d1209] outline-none transition hover:bg-[#f5d096] focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#15100c]">
            Configure a brew <ArrowRight className="h-4 w-4" />
          </Link>
        </GlassPanel>
      </section>
    </main>
  );
}
