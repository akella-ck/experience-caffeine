import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Captions,
  Check,
  ChevronRight,
  CircleAlert,
  CircleGauge,
  Clock3,
  Coffee,
  Droplets,
  Gauge,
  Play,
  SlidersHorizontal,
  Sparkles,
  Thermometer,
} from "lucide-react";
import Link from "next/link";
import { BackgroundParticles } from "@/components/background-particles";
import { BrewLabPreview } from "@/components/brew-lab-preview";
import { BusinessPreview } from "@/components/business-preview";
import { GuidedSessionPreview } from "@/components/guided-session-preview";
import { HeroVisualization } from "@/components/hero-visualization";
import { HomeIntentRouter } from "@/components/home-intent-router";
import { HomeJourney } from "@/components/home-journey";
import { MethodCard } from "@/components/MethodCard";
import { SectionHeading } from "@/components/SectionHeading";
import { TastePreview } from "@/components/taste-preview";
import { brewingMethods, grinders, lessons } from "@/data";

export const metadata: Metadata = {
  title: "Master the science of every cup",
  description:
    "Explore coffee origins, calibrate your grinder, build a practical recipe, and follow a guided brew from first pour to final adjustment.",
};

const featuredGrinderIds = [
  "baratza-encore",
  "timemore-c2",
  "fellow-ode-gen-2",
  "comandante-c40",
] as const;

const learningHighlights = [
  "coffee-freshness-and-storage",
  "water-quality-at-home",
  "how-grind-size-changes-extraction",
  "coffee-water-ratio",
  "using-a-scale",
  "equipment-cleaning",
  "flavor-notes",
];

export default function Home() {
  const featuredGrinders = featuredGrinderIds
    .map((id) => grinders.find((grinder) => grinder.id === id))
    .filter((grinder) => grinder !== undefined);
  const featuredLessons = learningHighlights
    .map((slug) => lessons.find((lesson) => lesson.slug === slug))
    .filter((lesson) => lesson !== undefined);

  return (
    <main>
      <section className="relative flex min-h-[96svh] items-center overflow-hidden border-b border-white/[0.07] pb-16 pt-28 sm:pt-32">
        <div className="ambient-grid absolute inset-0 opacity-35" aria-hidden="true" />
        <div className="absolute left-[-12rem] top-[10%] size-[34rem] rounded-full bg-[#7e4529]/10 blur-[110px]" aria-hidden="true" />
        <BackgroundParticles />
        <div className="section-shell relative z-10 grid items-center gap-12 lg:grid-cols-[1.04fr_.96fr] lg:gap-4">
          <div className="max-w-[46rem]">
            <div className="eyebrow">Coffee, calibrated</div>
            <h1 className="display-title mt-7">
              Master the science of <span className="editorial-title amber-text">every cup.</span>
            </h1>
            <p className="mt-7 max-w-[40rem] text-base leading-8 text-[#bcb09e] sm:text-lg">
              Explore coffee beans, understand roast profiles, calibrate your grinder, and follow guided brewing lessons designed around your equipment.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/brew-lab" className="button-primary">
                Enter the Brew Lab <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/brew-methods" className="button-secondary">
                Explore brewing methods <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
            <Link
              href="/troubleshoot"
              className="mt-4 flex min-h-11 w-full items-center gap-2 rounded-2xl border border-[#d99a4e]/15 bg-[#d99a4e]/[0.035] px-4 py-2.5 text-xs text-[#bdae9b] transition hover:border-[#d99a4e]/30 hover:bg-[#d99a4e]/[0.07] hover:text-[#f0c58c] sm:w-fit sm:rounded-full"
            >
              <CircleAlert size={15} className="shrink-0 text-[#dca35f]" aria-hidden="true" />
              <span className="min-w-0 flex-1 sm:flex-none">
                Cup already brewed and tastes off? <strong className="whitespace-nowrap font-semibold text-[#e2ae6d] sm:ml-1">Troubleshoot it</strong>
              </span>
              <ArrowRight size={13} className="shrink-0" aria-hidden="true" />
            </Link>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/[0.08] pt-6">
              {[
                ["08", "Brew methods"],
                ["05", "Grinder guides"],
                ["01", "Variable at a time"],
              ].map(([value, label]) => (
                <div key={label} className="flex items-baseline gap-2">
                  <strong className="font-mono text-sm font-medium text-[#e7ae68]">{value}</strong>
                  <span className="text-[0.68rem] text-[#7f7468]">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <HeroVisualization />
        </div>
      </section>

      <HomeIntentRouter />

      <section className="section-shell section-pad">
        <SectionHeading
          eyebrow="The learning loop"
          title={<>A repeatable path from <span className="editorial-title text-[#e6b273]">curiosity to clarity.</span></>}
          description="Coffee gets easier when every choice connects to the next. Move through the loop, taste the result, and make one useful adjustment."
        />
        <HomeJourney />
      </section>

      <section className="border-y border-white/[0.07] bg-[#0d0907]/72">
        <div className="section-shell section-pad">
          <div className="mb-11 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Taste diagnostics"
              title={<>The cup is giving you <span className="editorial-title text-[#e5af6c]">useful data.</span></>}
              description="Describe what you tasted and how the brew ran. The troubleshooter turns those clues into one controlled next step."
            />
            <Link href="/troubleshoot" className="button-primary shrink-0 self-start lg:self-auto">
              Troubleshoot my cup <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <TastePreview />
        </div>
      </section>

      <section className="relative border-y border-white/[0.07] bg-[#0d0907]/72">
        <div className="section-shell section-pad">
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Brew Lab · Preview"
              title={<>A recipe built around <span className="editorial-title text-[#e6b273]">your equipment.</span></>}
              description="Move beyond broad labels like medium-fine. Brew Lab combines the coffee, roast, method, grinder, and cup size into one practical starting point."
            />
            <Link href="/brew-lab" className="button-secondary shrink-0 self-start lg:self-auto">
              Build your recipe <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <BrewLabPreview />
        </div>
      </section>

      <section className="section-shell section-pad">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Method library"
            title={<>Choose a brewer. Learn its <span className="editorial-title text-[#e6b273]">behavior.</span></>}
            description="Each guide connects technique to cup character, so you understand both what to do and what the variables are changing."
          />
          <Link href="/brew-methods" className="button-quiet shrink-0 self-start sm:self-auto">
            View method library <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {brewingMethods.map((method, index) => (
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

      <section className="relative overflow-hidden border-y border-white/[0.07] bg-[#0d0907]">
        <div className="absolute right-[-10%] top-[-20%] size-[36rem] rounded-full bg-[#9d5932]/10 blur-[120px]" aria-hidden="true" />
        <div className="section-shell section-pad relative grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <div className="eyebrow">Grinder intelligence</div>
            <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.02] tracking-[-0.05em] sm:text-5xl">
              “Medium-fine” isn&apos;t a <span className="editorial-title text-[#e4ae6d]">setting.</span>
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-7 text-[#a99d8d] sm:text-base">
              Brew Lab translates grind descriptions into model-specific ranges, then tells you which direction to move based on taste and brew time.
            </p>
            <div className="mt-7 rounded-2xl border border-[#d99a4e]/15 bg-[#d99a4e]/[0.045] p-4 text-xs leading-6 text-[#bda88e]">
              <strong className="text-[#e0aa67]">Starting ranges only.</strong> Calibration, burr wear, bean density, roast level, coffee age, and technique all shift the right setting.
            </div>
            <Link href="/grinders" className="button-secondary mt-7">
              Find your grinder <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="glass-panel rounded-[2rem] p-3 sm:p-5">
            <div className="flex items-center justify-between px-3 pb-4 pt-2">
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[#817668]">V60 calibration map</span>
              <span className="rounded-full border border-white/[0.08] px-2.5 py-1 text-[0.56rem] text-[#897d6e]">Medium-fine</span>
            </div>
            <div className="space-y-2">
              {featuredGrinders.map((grinder, index) => {
                const setting = grinder.settings.find((item) => item.brewMethodId === "v60");
                return (
                  <Link key={grinder.id} href={`/grinders/${grinder.slug}`} className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border border-white/[0.07] bg-black/15 p-4 transition-colors hover:border-[#d99a4e]/25 hover:bg-[#d99a4e]/[0.035] sm:p-5">
                    <span className="grid size-9 place-items-center rounded-full border border-white/[0.08] font-mono text-[0.58rem] text-[#7f7467]">0{index + 1}</span>
                    <span>
                      <strong className="block text-sm font-medium text-[#e5dac8]">{grinder.name}</strong>
                      <span className="mt-1 block text-[0.62rem] text-[#796e62]">Recommended starting range</span>
                    </span>
                    <span className="flex items-center gap-3 text-right">
                      <strong className="font-mono text-sm font-medium text-[#e0a45e]">{setting?.startingRange ?? "Calibrate by taste"}</strong>
                      <ChevronRight size={14} className="text-[#665b50] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell section-pad grid gap-14 lg:grid-cols-[1fr_.82fr] lg:items-center">
        <div className="order-2 lg:order-1">
          <GuidedSessionPreview />
        </div>
        <div className="order-1 lg:order-2">
          <div className="eyebrow">Guided brew mode</div>
          <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.02] tracking-[-0.05em] sm:text-5xl">
            Your technique, <span className="editorial-title text-[#e5af6c]">paced in real time.</span>
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-7 text-[#a99d8d] sm:text-base">
            Keep your hands on the kettle. Large cues show the current step, cumulative water target, and time window from bloom through drawdown.
          </p>
          <ul className="mt-7 space-y-3 text-sm text-[#bcb09e]">
            {["Readable from across the counter", "Pause, repeat, or advance any step", "Designed for touch and one-handed use"].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="grid size-5 place-items-center rounded-full bg-[#d99a4e]/10 text-[#dda25d]"><Check size={11} aria-hidden="true" /></span>
                {item}
              </li>
            ))}
          </ul>
          <Link href="/guided-brew" className="button-primary mt-8">
            Preview a demo V60 <Play size={14} fill="currentColor" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <BusinessPreview />

      <section className="section-shell section-pad">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Learning library"
            title={<>Build intuition, one variable <span className="editorial-title text-[#e5af6c]">at a time.</span></>}
            description="Short, visual lessons explain the fundamentals without assuming you already speak coffee."
          />
          <Link href="/learn" className="button-quiet shrink-0 self-start sm:self-auto">
            See all learning tracks <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featuredLessons.map((lesson, index) => (
            <Link
              key={lesson.id}
              href={lesson.slug === "how-grind-size-changes-extraction" ? "/learn/grind-size" : "/learn"}
              className={`group relative min-h-52 overflow-hidden rounded-[1.4rem] border border-white/[0.08] bg-white/[0.025] p-5 transition-colors hover:border-[#d99a4e]/25 hover:bg-[#d99a4e]/[0.035] ${index === 0 || index === 5 ? "lg:col-span-2" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-9 place-items-center rounded-xl border border-[#d99a4e]/15 bg-[#d99a4e]/[0.05] text-[#d79a53]">
                  {index % 3 === 0 ? <BookOpen size={16} strokeWidth={1.5} /> : index % 3 === 1 ? <CircleGauge size={16} strokeWidth={1.5} /> : <SlidersHorizontal size={16} strokeWidth={1.5} />}
                </span>
                <span className="font-mono text-[0.53rem] uppercase tracking-[0.14em] text-[#74695e]">{lesson.durationMinutes} min</span>
              </div>
              <h3 className="mt-7 max-w-sm text-lg font-medium tracking-[-0.03em] text-[#e9decc]">{lesson.title}</h3>
              <div className="absolute inset-x-5 bottom-5 flex items-center justify-between border-t border-white/[0.07] pt-4 text-[0.6rem] text-[#7d7165]">
                <span>{lesson.difficulty} · {lesson.type}</span>
                <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </div>
            </Link>
          ))}
          <Link href="/learn" className="group flex min-h-52 flex-col justify-between rounded-[1.4rem] border border-[#d99a4e]/20 bg-[linear-gradient(145deg,rgba(217,154,78,.1),rgba(255,255,255,.02))] p-5">
            <Sparkles size={18} className="text-[#dca35f]" aria-hidden="true" />
            <div>
              <p className="text-lg font-medium tracking-[-0.03em]">Follow a complete track</p>
              <span className="mt-3 flex items-center gap-2 text-xs text-[#d7a76e]">Open learning hub <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" /></span>
            </div>
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/[0.07] py-24 sm:py-32">
        <div className="ambient-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="absolute left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a85f34]/12 blur-[110px]" aria-hidden="true" />
        <div className="section-shell relative z-10 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-full border border-[#d99a4e]/20 bg-[#d99a4e]/[0.06] text-[#dca15c]">
            <Coffee size={19} strokeWidth={1.4} aria-hidden="true" />
          </div>
          <h2 className="mx-auto mt-7 max-w-4xl text-balance text-5xl font-medium leading-[0.98] tracking-[-0.055em] sm:text-7xl">
            Your best cup is one <span className="editorial-title amber-text">adjustment away.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#a99d8d] sm:text-base">
            Start with a clear recipe. Taste carefully. Keep what worked and change one thing next time.
          </p>
          <Link href="/brew-lab" className="button-primary mt-9">
            Build your first recipe <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <div className="mx-auto mt-12 flex max-w-xl flex-wrap justify-center gap-x-6 gap-y-3 font-mono text-[0.55rem] uppercase tracking-[0.13em] text-[#6f6459]">
            <span className="flex items-center gap-1.5"><Gauge size={11} /> Calibrated grind</span>
            <span className="flex items-center gap-1.5"><Thermometer size={11} /> Water target</span>
            <span className="flex items-center gap-1.5"><Droplets size={11} /> Pour stages</span>
            <span className="flex items-center gap-1.5"><Clock3 size={11} /> Guided timing</span>
            <span className="flex items-center gap-1.5"><Captions size={11} /> Visual lessons</span>
          </div>
        </div>
      </section>
    </main>
  );
}
