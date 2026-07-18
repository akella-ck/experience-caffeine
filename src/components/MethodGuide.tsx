import {
  ArrowLeft,
  ArrowRight,
  Bean as BeanIcon,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  Coffee,
  Gauge,
  ListChecks,
  Thermometer,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import type { Bean, BrewingMethod, Grinder } from "@/types";
import { GlassPanel } from "@/components/GlassPanel";
import { GrindScale } from "@/components/GrindScale";
import { SectionHeading } from "@/components/SectionHeading";
import { VideoLessonCard } from "@/components/VideoLessonCard";

type RelatedGrinder = Pick<Grinder, "id" | "name" | "brand" | "adjustmentType">;

type MethodGuideProps = {
  method: BrewingMethod;
  relatedBeans: readonly Bean[];
  relatedGrinders: readonly RelatedGrinder[];
  previous?: Pick<BrewingMethod, "id" | "name">;
  next?: Pick<BrewingMethod, "id" | "name">;
};

function formatStepDuration(seconds: number) {
  if (seconds < 60) return `${seconds} sec`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours && minutes) return `${hours} hr ${minutes} min`;
  if (hours) return `${hours} hr`;
  const remainingSeconds = seconds % 60;
  return remainingSeconds ? `${minutes} min ${remainingSeconds} sec` : `${minutes} min`;
}

export function MethodGuide({
  method,
  relatedBeans,
  relatedGrinders,
  previous,
  next,
}: MethodGuideProps) {
  const activeGrind = method.grindDescription === "extra-coarse" ? "coarse" : method.grindDescription;

  return (
    <main className="relative overflow-hidden bg-[#0c0a08] text-[#f4ead8]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[52rem] bg-[radial-gradient(circle_at_72%_14%,rgba(201,128,56,.16),transparent_30%),radial-gradient(circle_at_12%_26%,rgba(109,65,35,.16),transparent_35%)]" />

      <section className="relative mx-auto max-w-7xl px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-36 lg:px-10 lg:pt-40">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-[#8c8074]">
            <li><Link href="/brew-methods" className="rounded-sm outline-none hover:text-amber-200 focus-visible:ring-2 focus-visible:ring-amber-300/70">Brew methods</Link></li>
            <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
            <li aria-current="page" className="text-[#c4b7a7]">{method.name}</li>
          </ol>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1fr_0.72fr] lg:items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-amber-200/15 bg-amber-200/[0.05] px-3 py-1.5 font-mono text-[0.64rem] uppercase tracking-[0.15em] text-amber-200/75">{method.category}</span>
              <span className="rounded-full border border-white/[0.09] bg-white/[0.025] px-3 py-1.5 font-mono text-[0.64rem] uppercase tracking-[0.15em] text-[#9b8e81]">{method.difficulty}</span>
            </div>
            <h1 className="mt-7 text-balance text-5xl font-semibold leading-[0.96] tracking-[-0.055em] text-[#f5ead7] sm:text-6xl lg:text-7xl">{method.name}</h1>
            <p className="mt-5 text-balance text-xl tracking-[-0.02em] text-amber-200/85 sm:text-2xl">{method.tagline}</p>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-[#b0a395]">{method.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/brew-lab?method=${method.id}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f1c27d] px-6 text-sm font-semibold text-[#1d1209] outline-none transition hover:bg-[#f5d096] focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0c0a08]">
                Build a {method.name} recipe <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#technique" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] px-6 text-sm text-[#e1d3c0] outline-none transition hover:border-amber-200/25 focus-visible:ring-2 focus-visible:ring-amber-300/70">Read the technique</a>
            </div>
          </div>

          <MethodHeroVisual method={method} />
        </div>

        <dl className="mt-12 grid grid-cols-2 overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-white/[0.025] sm:grid-cols-4 lg:mt-16">
          {[
            { label: "Brew time", value: method.brewTime, icon: Clock3 },
            { label: "Starting ratio", value: method.recommendedRatio, icon: Gauge },
            { label: "Water", value: method.waterTemperature, icon: Thermometer },
            { label: "Grind", value: method.grindDescription, icon: Coffee },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="border-b border-r border-white/[0.07] p-5 last:border-r-0 sm:border-b-0 sm:p-6">
              <dt className="flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.14em] text-[#7b7065]"><Icon className="h-3.5 w-3.5" /> {label}</dt>
              <dd className="mt-3 text-sm capitalize text-[#dfd1bd] sm:text-base">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <SectionHeading eyebrow="Bench setup" title="Everything in reach before water meets coffee." />
            <GlassPanel className="mt-9 p-6 sm:p-8">
              <h3 className="flex items-center gap-3 text-lg font-semibold text-[#ecdfcb]"><Wrench className="h-5 w-5 text-amber-300/70" /> Required equipment</h3>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {method.equipment.map((item) => (
                  <li key={item} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/15 px-4 py-3 text-sm text-[#bdb0a0]">
                    <Check className="h-4 w-4 shrink-0 text-amber-300/65" /> {item}
                  </li>
                ))}
              </ul>
            </GlassPanel>
          </div>
          <GlassPanel className="p-6 sm:p-8" glow="amber">
            <p className="relative font-mono text-[0.64rem] uppercase tracking-[0.18em] text-amber-300/70">Baseline recipe</p>
            <div className="relative mt-6 grid grid-cols-2 gap-3">
              {[
                ["Yield", `${method.defaultCupSizeGrams} g`],
                ["Ratio", method.recommendedRatio],
                ["Temperature", method.waterTemperature],
                ["Bloom", method.defaultBloomSeconds ? `${method.defaultBloomSeconds} sec` : "Not required"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/[0.07] bg-black/15 p-4">
                  <p className="text-[0.61rem] uppercase tracking-[0.14em] text-[#796e63]">{label}</p>
                  <p className="mt-2 font-mono text-sm text-[#e3d5c1]">{value}</p>
                </div>
              ))}
            </div>
            <p className="relative mt-6 border-l border-amber-300/30 pl-4 text-sm leading-6 text-[#9f9385]">
              This is a recommended starting point. Grinder calibration, burr wear, bean density, roast, age, and technique will change the result.
            </p>
          </GlassPanel>
        </div>
      </section>

      <section id="technique" className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading
          eyebrow="Technique sequence"
          title="Control the brew one observable step at a time."
          description="Read the whole sequence once before starting. During the brew, prioritize even wetting and repeatable movements over chasing the clock."
        />
        <ol className="mt-10 border-t border-white/[0.08] sm:mt-14">
          {method.steps.map((step) => (
            <li key={step.id} className="grid gap-4 border-b border-white/[0.08] py-7 sm:grid-cols-[5rem_0.6fr_1fr_auto] sm:items-start sm:gap-6 sm:py-8">
              <span className="font-mono text-xs text-amber-300/65">{String(step.order).padStart(2, "0")}</span>
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#e9dcc8]">{step.title}</h3>
              <div>
                <p className="text-sm leading-7 text-[#aaa092]">{step.instruction}</p>
                {step.tip ? <p className="mt-3 border-l border-amber-300/25 pl-4 text-xs leading-5 text-[#928679]">Why: {step.tip}</p> : null}
              </div>
              <div className="flex flex-wrap gap-2 sm:max-w-28 sm:justify-end">
                {step.durationSeconds ? <span className="rounded-full border border-white/[0.08] px-2.5 py-1 font-mono text-[0.62rem] text-[#9c9083]">{formatStepDuration(step.durationSeconds)}</span> : null}
                {step.targetWaterGrams ? <span className="rounded-full border border-amber-200/15 bg-amber-200/[0.04] px-2.5 py-1 font-mono text-[0.62rem] text-amber-200/75">{step.targetWaterGrams}g</span> : null}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading
          eyebrow="Grind calibration"
          title={`Start ${method.grindDescription}, then let flow and flavor answer.`}
          description={method.grindRange}
        />
        <GlassPanel className="mt-10 p-5 sm:mt-12 sm:p-8">
          <GrindScale active={activeGrind} />
          <div className="mt-7 flex items-start gap-3 rounded-2xl border border-amber-200/10 bg-amber-200/[0.04] p-4 text-sm leading-6 text-[#ac9f90]">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-300/70" />
            <p>Change the grind in small steps. If brew time and flavor disagree, trust the cup: drawdown is evidence, not the goal.</p>
          </div>
        </GlassPanel>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading eyebrow="Failure modes" title="Common mistakes leave recognizable clues." />
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {method.commonMistakes.map((mistake) => (
            <GlassPanel key={mistake.title} className="p-6 sm:p-7">
              <h3 className="flex items-center gap-3 text-lg font-semibold text-[#e9dcc8]"><CircleAlert className="h-4 w-4 text-amber-300/70" /> {mistake.title}</h3>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <div><dt className="text-[0.62rem] uppercase tracking-[0.14em] text-[#776c61]">You may notice</dt><dd className="mt-2 text-sm leading-6 text-[#a79a8c]">{mistake.symptom}</dd></div>
                <div><dt className="text-[0.62rem] uppercase tracking-[0.14em] text-[#776c61]">Try next</dt><dd className="mt-2 text-sm leading-6 text-[#c3b5a4]">{mistake.correction}</dd></div>
              </dl>
            </GlassPanel>
          ))}
        </div>
        <GlassPanel className="mt-5 p-6 sm:p-8">
          <h3 className="flex items-center gap-3 text-lg font-semibold text-[#e9dcc8]"><ListChecks className="h-5 w-5 text-amber-300/70" /> Quick diagnostics</h3>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {method.troubleshooting.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-[#aaa092]"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300/60" /> {item}</li>
            ))}
          </ul>
          <Link href={`/troubleshoot?method=${method.id}`} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-5 text-xs font-medium text-[#ddcfbc] outline-none hover:border-amber-200/30 focus-visible:ring-2 focus-visible:ring-amber-300/70">Open taste troubleshooter <ArrowRight className="h-3.5 w-3.5" /></Link>
        </GlassPanel>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading eyebrow="Watch the movement" title="A complete technique lesson, chaptered for the brew bench." />
        <VideoLessonCard
          captionsAvailable={method.video.captionsAvailable}
          chapters={method.video.chapters.map((chapter) => `${chapter.timestamp} · ${chapter.title}`)}
          className="mt-10 sm:mt-12"
          description={method.video.description}
          duration={method.video.duration}
          thumbnail={method.video.thumbnail}
          title={method.video.title}
        />
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading eyebrow="Build the system" title="Coffees and grinders that pair naturally with this method." />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <GlassPanel className="p-6 sm:p-8">
            <h3 className="flex items-center gap-3 text-lg font-semibold text-[#e9dcc8]"><BeanIcon className="h-5 w-5 text-amber-300/70" /> Related coffees</h3>
            <div className="mt-5 space-y-2">
              {relatedBeans.map((bean) => (
                <Link key={bean.id} href={`/explore?origin=${bean.originId}`} className="flex min-h-14 items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-black/15 px-4 py-3 outline-none transition hover:border-amber-200/20 hover:bg-amber-200/[0.035] focus-visible:ring-2 focus-visible:ring-amber-300/70">
                  <span><span className="block text-sm font-medium text-[#dfd2c0]">{bean.name}</span><span className="mt-1 block text-xs text-[#877b6f]">{bean.region} · {bean.flavorNotes.slice(0, 2).join(", ")}</span></span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#75695e]" />
                </Link>
              ))}
            </div>
          </GlassPanel>
          <GlassPanel className="p-6 sm:p-8">
            <h3 className="flex items-center gap-3 text-lg font-semibold text-[#e9dcc8]"><Gauge className="h-5 w-5 text-amber-300/70" /> Related grinder guides</h3>
            <div className="mt-5 space-y-2">
              {relatedGrinders.map((grinder) => (
                <Link key={grinder.id} href={`/grinders/${grinder.id}`} className="flex min-h-14 items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-black/15 px-4 py-3 outline-none transition hover:border-amber-200/20 hover:bg-amber-200/[0.035] focus-visible:ring-2 focus-visible:ring-amber-300/70">
                  <span><span className="block text-sm font-medium text-[#dfd2c0]">{grinder.name}</span><span className="mt-1 block text-xs text-[#877b6f]">{grinder.brand} · {grinder.adjustmentType}</span></span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#75695e]" />
                </Link>
              ))}
            </div>
          </GlassPanel>
        </div>
      </section>

      <nav aria-label="Adjacent brewing guides" className="relative mx-auto grid max-w-7xl gap-4 px-5 pb-24 pt-10 sm:grid-cols-2 sm:px-8 sm:pb-32 lg:px-10">
        {previous ? <GuideNavLink direction="previous" method={previous} /> : <span />}
        {next ? <GuideNavLink direction="next" method={next} /> : null}
      </nav>
    </main>
  );
}

function MethodHeroVisual({ method }: { method: BrewingMethod }) {
  return (
    <GlassPanel className="relative min-h-[25rem] p-7 sm:p-9" glow="amber">
      <div className="relative flex h-56 items-center justify-center" aria-hidden="true">
        <div className="absolute h-52 w-52 rounded-full border border-amber-200/[0.08]" />
        <div className="absolute h-36 w-36 rounded-full border border-dashed border-amber-200/[0.12] motion-safe:animate-[spin_24s_linear_infinite]" />
        <div className="relative h-28 w-32 rounded-b-[45%] border border-amber-100/20 bg-gradient-to-b from-amber-100/[0.08] to-amber-700/[0.12] shadow-[0_26px_60px_rgba(0,0,0,.4)]">
          <div className="absolute -top-5 left-1/2 h-12 w-20 -translate-x-1/2 rounded-[50%] border border-amber-100/20 bg-[#15100c]" />
          <div className="absolute -bottom-3 left-4 right-4 h-4 rounded-[50%] bg-amber-700/25 blur-sm" />
        </div>
        <div className="absolute right-[20%] top-[14%] font-mono text-[0.58rem] uppercase tracking-[0.15em] text-amber-200/55">flow</div>
        <div className="absolute bottom-[13%] left-[16%] font-mono text-[0.58rem] uppercase tracking-[0.15em] text-amber-200/55">extraction</div>
      </div>
      <div className="relative mt-5 flex items-end justify-between border-t border-white/[0.07] pt-6">
        <div><p className="font-mono text-[0.62rem] uppercase tracking-[0.15em] text-[#776b60]">Cup signature</p><p className="mt-2 text-sm text-[#d8cab7]">{method.flavorProfile.join(" · ")}</p></div>
        <span className="font-mono text-3xl text-amber-200/80">{method.recommendedRatio.split("–")[0]}</span>
      </div>
    </GlassPanel>
  );
}

function GuideNavLink({ direction, method }: { direction: "previous" | "next"; method: Pick<BrewingMethod, "id" | "name"> }) {
  return (
    <Link href={`/brew-methods/${method.id}`} className={`flex min-h-24 items-center gap-4 rounded-[1.4rem] border border-white/[0.08] bg-white/[0.025] p-5 outline-none transition hover:border-amber-200/25 hover:bg-amber-200/[0.035] focus-visible:ring-2 focus-visible:ring-amber-300/70 ${direction === "next" ? "justify-between text-right" : ""}`}>
      {direction === "previous" ? <ArrowLeft className="h-4 w-4 text-amber-300/60" /> : null}
      <span className={direction === "next" ? "ml-auto" : ""}><span className="block text-[0.62rem] uppercase tracking-[0.14em] text-[#796d62]">{direction}</span><span className="mt-2 block text-sm font-medium text-[#dfd1be]">{method.name}</span></span>
      {direction === "next" ? <ArrowRight className="h-4 w-4 text-amber-300/60" /> : null}
    </Link>
  );
}
