import {
  ArrowLeft,
  ArrowRight,
  Brush,
  Check,
  ChevronRight,
  CircleAlert,
  Coffee,
  Gauge,
  RotateCcw,
  Settings2,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import type { BrewRecipe, BrewingMethod, Grinder } from "@/types";
import { GlassPanel } from "@/components/GlassPanel";
import { GrindScale } from "@/components/GrindScale";
import { SectionHeading } from "@/components/SectionHeading";
import { VideoLessonCard } from "@/components/VideoLessonCard";

type GrinderGuideProps = {
  grinder: Grinder;
  methods: readonly BrewingMethod[];
  recipes: readonly BrewRecipe[];
  previous?: Pick<Grinder, "id" | "name">;
  next?: Pick<Grinder, "id" | "name">;
};

export function GrinderGuide({ grinder, methods, recipes, previous, next }: GrinderGuideProps) {
  const methodNames = Object.fromEntries(methods.map((method) => [method.id, method.name]));

  return (
    <main className="relative overflow-hidden bg-[#0c0a08] text-[#f4ead8]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[52rem] bg-[radial-gradient(circle_at_74%_12%,rgba(205,134,62,.16),transparent_30%),radial-gradient(circle_at_14%_28%,rgba(103,61,32,.17),transparent_34%)]" />

      <section className="relative mx-auto max-w-7xl px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-36 lg:px-10 lg:pt-40">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-[#8c8074]">
            <li><Link href="/grinders" className="rounded-sm outline-none hover:text-amber-200 focus-visible:ring-2 focus-visible:ring-amber-300/70">Grinder guides</Link></li>
            <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
            <li aria-current="page" className="text-[#c4b7a7]">{grinder.name}</li>
          </ol>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1fr_0.72fr] lg:items-center">
          <div>
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-amber-300/70">{grinder.brand} · Grinder manual</p>
            <h1 className="mt-6 max-w-4xl text-balance text-5xl font-semibold leading-[0.96] tracking-[-0.055em] text-[#f5ead7] sm:text-6xl lg:text-7xl">{grinder.name}</h1>
            <p className="mt-5 text-balance text-xl tracking-[-0.02em] text-amber-200/85 sm:text-2xl">{grinder.adjustmentType}</p>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-[#b0a395]">{grinder.overview}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/brew-lab?grinder=${grinder.id}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f1c27d] px-6 text-sm font-semibold text-[#1d1209] outline-none transition hover:bg-[#f5d096] focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0c0a08]">Use this grinder <ArrowRight className="h-4 w-4" /></Link>
              <a href="#settings" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] px-6 text-sm text-[#e1d3c0] outline-none transition hover:border-amber-200/25 focus-visible:ring-2 focus-visible:ring-amber-300/70">See all settings</a>
            </div>
          </div>
          <GrinderHeroVisual grinder={grinder} />
        </div>

        <dl className="mt-12 grid grid-cols-1 overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-white/[0.025] sm:grid-cols-3 lg:mt-16">
          {[
            { label: "Burr system", value: grinder.burrType, icon: Settings2 },
            { label: "Adjustment", value: grinder.adjustmentType, icon: Gauge },
            { label: "Best coverage", value: grinder.bestFor.slice(0, 4).map((id) => methodNames[id]).join(" · "), icon: Coffee },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="border-b border-white/[0.07] p-5 last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:p-6">
              <dt className="flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.14em] text-[#7b7065]"><Icon className="h-3.5 w-3.5" /> {label}</dt>
              <dd className="mt-3 text-sm leading-6 text-[#dfd1bd]">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.68fr_1fr]">
          <div>
            <SectionHeading eyebrow="Zero reference" title="Know the edge without grinding on it." />
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#9f9385]">
              A zero point helps explain why two units may disagree. It is a calibration reference, never a place to run coffee.
            </p>
          </div>
          <GlassPanel className="p-6 sm:p-8" glow="amber">
            <div className="relative flex items-start gap-3 rounded-2xl border border-amber-200/15 bg-amber-200/[0.05] p-4 text-sm leading-6 text-[#b4a695]">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-300/75" />
              <p>Protect the burrs and your hands. Follow the manufacturer’s manual, unplug before opening the chamber, and never force the adjustment past first contact.</p>
            </div>
            <ol className="relative mt-6 space-y-3">
              {grinder.zeroPointInstructions.map((instruction, index) => (
                <li key={instruction} className="grid grid-cols-[2rem_1fr] gap-3 rounded-xl border border-white/[0.06] bg-black/15 p-4 text-sm leading-6 text-[#b3a696]">
                  <span className="font-mono text-xs text-amber-300/65">0{index + 1}</span>{instruction}
                </li>
              ))}
            </ol>
          </GlassPanel>
        </div>
      </section>

      <section id="settings" className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading
          eyebrow="Setting matrix"
          title="Start in range. Finish by taste."
          description="Keep dose, water, temperature, and technique stable while moving the grind. That makes the cause of a flavor change easier to read."
        />
        <GlassPanel className="mt-10 overflow-hidden sm:mt-12">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <caption className="sr-only">{grinder.name} grind settings by brewing method</caption>
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.025]">
                  {['Brewing method', 'Starting setting', 'Grind description', 'Adjustment advice'].map((heading) => (
                    <th key={heading} scope="col" className="px-5 py-4 text-[0.62rem] font-medium uppercase tracking-[0.15em] text-[#817569] sm:px-6">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grinder.settings.map((setting) => (
                  <tr key={setting.brewMethodId} className="border-b border-white/[0.06] last:border-0 hover:bg-amber-200/[0.025]">
                    <th scope="row" className="px-5 py-5 sm:px-6"><Link href={`/brew-methods/${setting.brewMethodId}`} className="font-medium text-[#eee1ce] underline-offset-4 outline-none hover:text-amber-200 hover:underline focus-visible:ring-2 focus-visible:ring-amber-300/70">{methodNames[setting.brewMethodId]}</Link></th>
                    <td className="px-5 py-5 font-mono text-sm text-amber-200/85 sm:px-6">{setting.startingRange}</td>
                    <td className="px-5 py-5 text-sm capitalize text-[#aea193] sm:px-6">{setting.grindDescription}</td>
                    <td className="max-w-md px-5 py-5 text-xs leading-6 text-[#988c80] sm:px-6">{setting.adjustmentAdvice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-white/[0.07] bg-amber-200/[0.035] px-5 py-4 text-xs leading-5 text-[#9f9385] sm:px-6">
            Recommended starting points only. Calibration, burr wear, bean density, roast, age, and brewing technique can move the useful setting.
          </div>
        </GlassPanel>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading eyebrow="Particle reference" title="Use the dial and the texture together." description="The visual scale lets you recover when a recipe was written for another grinder." />
        <GlassPanel className="mt-10 p-5 sm:mt-12 sm:p-8"><GrindScale /></GlassPanel>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading eyebrow="Routine calibration" title="A four-brew loop is usually more useful than one perfect guess." />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {grinder.calibrationSteps.map((step, index) => (
            <GlassPanel key={step} className="p-6">
              <div className="flex items-center justify-between"><RotateCcw className="h-4 w-4 text-amber-300/70" /><span className="font-mono text-xs text-[#70655b]">0{index + 1}</span></div>
              <p className="mt-7 text-sm leading-7 text-[#b2a596]">{step}</p>
            </GlassPanel>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-5 lg:grid-cols-2">
          <GlassPanel className="p-6 sm:p-8">
            <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-[-0.035em] text-[#ebdeca]"><Brush className="h-5 w-5 text-amber-300/70" /> Cleaning protocol</h2>
            <ol className="mt-6 space-y-3">
              {grinder.cleaningSteps.map((step, index) => (
                <li key={step} className="flex gap-3 border-b border-white/[0.06] pb-3 text-sm leading-6 text-[#aaa092] last:border-0 last:pb-0"><Check className="mt-1 h-4 w-4 shrink-0 text-amber-300/60" /><span><span className="sr-only">Step {index + 1}: </span>{step}</span></li>
              ))}
            </ol>
          </GlassPanel>
          <GlassPanel className="p-6 sm:p-8">
            <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-[-0.035em] text-[#ebdeca]"><Wrench className="h-5 w-5 text-amber-300/70" /> Common errors</h2>
            <div className="mt-6 space-y-3">
              {grinder.commonErrors.map((error) => (
                <details key={error.title} className="group rounded-xl border border-white/[0.07] bg-black/15 p-4 open:border-amber-200/15">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-[#d6c8b5] outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70"><span className="flex items-center gap-2"><CircleAlert className="h-4 w-4 text-amber-300/65" />{error.title}</span><span className="text-[#766a60] transition group-open:rotate-45">+</span></summary>
                  <dl className="mt-4 grid gap-3 border-t border-white/[0.06] pt-4 sm:grid-cols-2"><div><dt className="text-[0.6rem] uppercase tracking-wider text-[#73685e]">Symptom</dt><dd className="mt-1.5 text-xs leading-5 text-[#9f9385]">{error.symptom}</dd></div><div><dt className="text-[0.6rem] uppercase tracking-wider text-[#73685e]">Correction</dt><dd className="mt-1.5 text-xs leading-5 text-[#b9ac9c]">{error.correction}</dd></div></dl>
                </details>
              ))}
            </div>
          </GlassPanel>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading eyebrow="Watch the mechanism" title="See zero, adjustment, and cleaning before touching the burr chamber." />
        <VideoLessonCard
          captionsAvailable={grinder.video.captionsAvailable}
          chapters={grinder.video.chapters.map((chapter) => `${chapter.timestamp} · ${chapter.title}`)}
          className="mt-10 sm:mt-12"
          description={grinder.video.description}
          duration={grinder.video.duration}
          thumbnail={grinder.video.thumbnail}
          title={grinder.video.title}
        />
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading eyebrow="Recommended experiments" title={`Brew Lab recipes with ${grinder.name} coordinates.`} />
        {recipes.length ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => {
              const modelSetting = grinder.settings.find((setting) => setting.brewMethodId === recipe.brewMethodId);
              return (
              <GlassPanel key={recipe.id} className="flex h-full flex-col p-6">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.15em] text-amber-300/65">{methodNames[recipe.brewMethodId]} · {modelSetting?.startingRange ?? "Calibrate visually"}</p>
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.025em] text-[#e9dcc8]">{recipe.name}</h3>
                <p className="mt-3 text-sm leading-6 text-[#9d9184]">{recipe.coffeeDoseGrams} g coffee · {recipe.waterGrams} g water · {recipe.temperatureCelsius}°C</p>
                <Link href={`/brew-lab?origin=${recipe.originId}&roast=${recipe.roastLevel}&method=${recipe.brewMethodId}&grinder=${grinder.id}&size=${recipe.waterGrams}`} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 text-xs font-medium text-[#dccfbc] outline-none hover:border-amber-200/30 focus-visible:ring-2 focus-visible:ring-amber-300/70">Open recipe <ArrowRight className="h-3.5 w-3.5" /></Link>
              </GlassPanel>
              );
            })}
          </div>
        ) : (
          <GlassPanel className="mt-10 p-7 text-sm leading-6 text-[#9f9385]">Choose this grinder in Brew Lab to create a model-specific starting recipe.</GlassPanel>
        )}
      </section>

      <nav aria-label="Adjacent grinder guides" className="relative mx-auto grid max-w-7xl gap-4 px-5 pb-24 pt-10 sm:grid-cols-2 sm:px-8 sm:pb-32 lg:px-10">
        {previous ? <GrinderNavLink direction="previous" grinder={previous} /> : <span />}
        {next ? <GrinderNavLink direction="next" grinder={next} /> : null}
      </nav>
    </main>
  );
}

function GrinderHeroVisual({ grinder }: { grinder: Grinder }) {
  return (
    <GlassPanel className="relative min-h-[25rem] p-7 sm:p-9" glow="amber">
      <div className="relative flex h-56 items-center justify-center" aria-hidden="true">
        <div className="absolute h-52 w-52 rounded-full border border-amber-200/[0.08]" />
        <div className="absolute h-40 w-40 rounded-full border border-dashed border-amber-200/[0.12] motion-safe:animate-[spin_28s_linear_infinite]" />
        <div className="relative h-28 w-28 rounded-full border border-white/[0.1] bg-[repeating-conic-gradient(from_0deg,rgba(217,151,78,.38)_0_2deg,transparent_2deg_12deg)] shadow-[0_0_70px_rgba(199,126,56,.14)]">
          <div className="absolute inset-4 rounded-full border border-amber-200/20 bg-[#110d0a]" />
          <div className="absolute inset-[2.6rem] rounded-full bg-amber-200/60 shadow-[0_0_24px_rgba(241,185,110,.3)]" />
        </div>
        <span className="absolute right-[15%] top-[20%] font-mono text-[0.58rem] uppercase tracking-[0.15em] text-amber-200/55">burr</span>
        <span className="absolute bottom-[15%] left-[14%] font-mono text-[0.58rem] uppercase tracking-[0.15em] text-amber-200/55">calibrate</span>
      </div>
      <div className="relative mt-5 border-t border-white/[0.07] pt-6"><p className="font-mono text-[0.62rem] uppercase tracking-[0.15em] text-[#776b60]">Guide principle</p><p className="mt-2 text-sm leading-6 text-[#d0c2b0]">Recordable settings, confirmed by taste.</p><p className="mt-4 text-xs text-[#83776b]">{grinder.description}</p></div>
    </GlassPanel>
  );
}

function GrinderNavLink({ direction, grinder }: { direction: "previous" | "next"; grinder: Pick<Grinder, "id" | "name"> }) {
  return (
    <Link href={`/grinders/${grinder.id}`} className={`flex min-h-24 items-center gap-4 rounded-[1.4rem] border border-white/[0.08] bg-white/[0.025] p-5 outline-none transition hover:border-amber-200/25 hover:bg-amber-200/[0.035] focus-visible:ring-2 focus-visible:ring-amber-300/70 ${direction === "next" ? "justify-between text-right" : ""}`}>
      {direction === "previous" ? <ArrowLeft className="h-4 w-4 text-amber-300/60" /> : null}
      <span className={direction === "next" ? "ml-auto" : ""}><span className="block text-[0.62rem] uppercase tracking-[0.14em] text-[#796d62]">{direction}</span><span className="mt-2 block text-sm font-medium text-[#dfd1be]">{grinder.name}</span></span>
      {direction === "next" ? <ArrowRight className="h-4 w-4 text-amber-300/60" /> : null}
    </Link>
  );
}
