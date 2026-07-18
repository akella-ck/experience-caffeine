import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Beaker, Check, ChevronRight, Clock3, FlaskConical, Lightbulb, RotateCcw } from "lucide-react";
import { GlassPanel } from "@/components/GlassPanel";
import { GrindLessonSimulator } from "@/components/GrindLessonSimulator";
import { GrindScale } from "@/components/GrindScale";
import { SectionHeading } from "@/components/SectionHeading";
import { lessons } from "@/data/lessons";

export const metadata: Metadata = {
  title: "How Grind Size Changes Extraction",
  description:
    "An interactive coffee lesson connecting grind size, surface area, flow resistance, extraction, brew time, and taste-led adjustments.",
  openGraph: {
    title: "How Grind Size Changes Extraction",
    description: "Learn to make one controlled grinder adjustment and understand what changes in the cup.",
    type: "article",
  },
};

export default function GrindSizeLessonPage() {
  const lesson = lessons.find((candidate) => candidate.id === "grind-size-and-extraction");

  if (!lesson) {
    notFound();
  }

  const sections = lesson.sections ?? [];

  return (
    <main className="relative overflow-hidden bg-[#0c0a08] text-[#f4ead8]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[50rem] bg-[radial-gradient(circle_at_72%_12%,rgba(207,135,61,.15),transparent_31%),radial-gradient(circle_at_17%_30%,rgba(105,62,33,.16),transparent_34%)]" />

      <article>
        <header className="relative mx-auto max-w-5xl px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-36 lg:px-10 lg:pt-40">
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-[#8c8074]">
              <li><Link href="/learn" className="rounded-sm outline-none hover:text-amber-200 focus-visible:ring-2 focus-visible:ring-amber-300/70">Learn</Link></li>
              <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
              <li><Link href="/learn#brewing-science" className="rounded-sm outline-none hover:text-amber-200 focus-visible:ring-2 focus-visible:ring-amber-300/70">Brewing Science</Link></li>
              <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
              <li aria-current="page" className="text-[#c4b7a7]">Grind size</li>
            </ol>
          </nav>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-amber-200/15 bg-amber-200/[0.05] px-3 py-1.5 font-mono text-[0.64rem] uppercase tracking-[0.15em] text-amber-200/75">Interactive lesson</span>
            <span className="flex items-center gap-1.5 rounded-full border border-white/[0.09] bg-white/[0.025] px-3 py-1.5 font-mono text-[0.64rem] uppercase tracking-[0.15em] text-[#9b8e81]"><Clock3 className="h-3 w-3" /> {lesson.durationMinutes} min</span>
            <span className="rounded-full border border-white/[0.09] bg-white/[0.025] px-3 py-1.5 font-mono text-[0.64rem] uppercase tracking-[0.15em] text-[#9b8e81]">{lesson.difficulty}</span>
          </div>
          <h1 className="mt-7 max-w-4xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#f5ead7] sm:text-6xl lg:text-7xl">{lesson.title}</h1>
          <p className="mt-7 max-w-3xl text-pretty text-lg leading-8 text-[#b0a395] sm:text-xl sm:leading-9">{lesson.summary}</p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { label: "You will connect", value: "Particle size + flow" },
              { label: "You will observe", value: "Time + taste" },
              { label: "You will practice", value: "One-variable tests" },
            ].map(({ label, value }) => (
              <GlassPanel key={label} className="p-4 sm:p-5"><p className="text-[0.61rem] uppercase tracking-[0.14em] text-[#786d62]">{label}</p><p className="mt-2 text-sm text-[#dccfbc]">{value}</p></GlassPanel>
            ))}
          </div>
        </header>

        <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <SectionHeading eyebrow="Interactive model" title="Move one variable and watch two effects travel together." description="In a percolation brew, a finer grind generally exposes more surface and creates more flow resistance. Explore the direction, then bring the idea back to taste." />
          <div className="mt-10 sm:mt-12"><GrindLessonSimulator /></div>
        </section>

        <section className="relative mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="space-y-16 sm:space-y-20">
            {sections.slice(0, 2).map((section, index) => (
              <LessonSection key={section.id} number={index + 1} heading={section.heading} body={section.body} takeaway={section.takeaway} />
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <SectionHeading eyebrow="Shared visual language" title="Five useful categories, not five standard measurements." description="Use texture to translate recipes across grinder models. Pair it with your exact setting when you record a brew." />
          <GlassPanel className="mt-10 p-5 sm:mt-12 sm:p-8"><GrindScale active="medium-fine" /></GlassPanel>
        </section>

        <section className="relative mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="space-y-16 sm:space-y-20">
            {sections.slice(2).map((section, index) => (
              <LessonSection key={section.id} number={index + 3} heading={section.heading} body={section.body} takeaway={section.takeaway} />
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <SectionHeading eyebrow="Bench exercise" title="Taste a three-point grind bracket." description="You are not trying to make three perfect brews. You are building a sensory reference around your current setting." />
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {[
              { label: "Cup A", setting: "One meaningful step coarser", observe: "Notice flow, brightness, sweetness, and whether the finish feels empty." },
              { label: "Cup B", setting: "Your current baseline", observe: "Use the same dose, water, temperature, and pour pattern. This is the comparison anchor." },
              { label: "Cup C", setting: "One meaningful step finer", observe: "Notice slower flow, sweetness development, bitterness, and any drying finish." },
            ].map(({ label, setting, observe }, index) => (
              <GlassPanel key={label} className="p-6 sm:p-7" glow={index === 1 ? "amber" : "none"}>
                <div className="relative flex items-center justify-between"><span className="font-mono text-[0.63rem] uppercase tracking-[0.18em] text-amber-300/70">{label}</span><Beaker className="h-4 w-4 text-[#766a60]" /></div>
                <h3 className="relative mt-6 text-xl font-semibold tracking-[-0.025em] text-[#e9dcc8]">{setting}</h3>
                <p className="relative mt-4 text-sm leading-7 text-[#9f9385]">{observe}</p>
              </GlassPanel>
            ))}
          </div>
          <GlassPanel className="mt-5 p-6 sm:p-8">
            <h3 className="flex items-center gap-3 text-lg font-semibold text-[#e9dcc8]"><RotateCcw className="h-5 w-5 text-amber-300/70" /> Keep the comparison interpretable</h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {['Use the same coffee and dose', 'Keep water amount and temperature fixed', 'Repeat the same pouring pattern', 'Taste all cups again as they cool'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#a99c8e]"><Check className="h-4 w-4 shrink-0 text-amber-300/60" /> {item}</li>
              ))}
            </ul>
          </GlassPanel>
        </section>

        <section className="relative mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <SectionHeading eyebrow="Knowledge check" title="Can you choose the first move?" />
          <div className="mt-9 space-y-3">
            <details className="group rounded-[1.3rem] border border-white/[0.08] bg-white/[0.025] p-5 open:border-amber-200/20 sm:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-[#e2d4c0] outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70"><span>A V60 finishes fast and tastes sharply sour. What would you change first?</span><span className="text-amber-300/65 transition group-open:rotate-45">+</span></summary>
              <p className="mt-4 border-t border-white/[0.07] pt-4 text-sm leading-7 text-[#a99d8f]">Grind slightly finer while leaving dose, water, temperature, and pouring unchanged. Observe whether the flow slows and sweetness becomes clearer.</p>
            </details>
            <details className="group rounded-[1.3rem] border border-white/[0.08] bg-white/[0.025] p-5 open:border-amber-200/20 sm:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-[#e2d4c0] outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70"><span>A brew is slow with a distinctly dry finish. What would you test?</span><span className="text-amber-300/65 transition group-open:rotate-45">+</span></summary>
              <p className="mt-4 border-t border-white/[0.07] pt-4 text-sm leading-7 text-[#a99d8f]">Try a small step coarser. Keep agitation steady for this comparison so the grind change is the clearest explanation.</p>
            </details>
          </div>
        </section>

        <footer className="relative mx-auto max-w-7xl px-5 pb-24 pt-10 sm:px-8 sm:pb-32 lg:px-10">
          <GlassPanel className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12" glow="amber">
            <div className="relative">
              <p className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber-300/70"><Lightbulb className="h-3.5 w-3.5" /> Lesson complete</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.045em] text-[#f4ead8] sm:text-4xl">Turn the model into one measured brew.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#9f9385]">Build a starting recipe for your grinder, then record the setting, drawdown, and one taste observation.</p>
            </div>
            <Link href="/brew-lab" className="relative inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f1c27d] px-6 text-sm font-semibold text-[#1d1209] outline-none transition hover:bg-[#f5d096] focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#15100c]">Build the baseline <ArrowRight className="h-4 w-4" /></Link>
          </GlassPanel>
        </footer>
      </article>
    </main>
  );
}

function LessonSection({ number, heading, body, takeaway }: { number: number; heading: string; body: string; takeaway?: string }) {
  return (
    <section className="grid gap-5 sm:grid-cols-[4rem_1fr] sm:gap-8">
      <span className="font-mono text-sm text-amber-300/65">{String(number).padStart(2, "0")}</span>
      <div>
        <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-[#eee1cd] sm:text-4xl">{heading}</h2>
        <p className="mt-5 text-base leading-8 text-[#aaa092] sm:text-lg sm:leading-9">{body}</p>
        {takeaway ? <div className="mt-7 flex gap-3 rounded-2xl border border-amber-200/12 bg-amber-200/[0.04] p-5 text-sm leading-7 text-[#bcae9d]"><FlaskConical className="mt-1 h-4 w-4 shrink-0 text-amber-300/70" /><p><span className="font-medium text-[#e3d5c1]">Takeaway:</span> {takeaway}</p></div> : null}
      </div>
    </section>
  );
}
