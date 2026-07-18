import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Building2,
  Check,
  ClipboardCheck,
  Coffee,
  Factory,
  Gauge,
  Link2,
  Radio,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { CorporateInquiryForm } from "@/components/corporate/CorporateInquiryForm";
import { CorporatePanel, IntegrationStatusPill } from "@/components/corporate/CorporateUI";
import { corporateIntegrations, corporateOfferings, businessAudiences } from "@/data/corporate";

export const metadata: Metadata = {
  title: "Coffee Education & Quality for Business",
  description: "A corporate coffee platform foundation for staff learning, recipe standards, roast references, quality workflows, and multi-location consistency.",
  openGraph: {
    title: "Experience Caffeine for Business",
    description: "Turn coffee knowledge into repeatable quality across batches, bars, and locations.",
    type: "website",
  },
};

const offeringIcons: Record<(typeof corporateOfferings)[number]["icon"], LucideIcon> = {
  roast: Factory,
  recipe: SlidersHorizontal,
  learning: BookOpenCheck,
  equipment: Settings2,
  monitoring: Activity,
  diagnostics: Gauge,
  locations: Building2,
  records: ClipboardCheck,
};

const targetAudiences = [
  "Independent cafés",
  "Coffee chains",
  "Specialty roasters",
  "Training academies",
  "Equipment manufacturers",
  "Green coffee importers",
  "Quality teams",
] as const;

export default function ForBusinessPage() {
  return (
    <main className="relative overflow-hidden bg-[#090705] text-[#f4ead8]">
      <section className="relative flex min-h-[90svh] items-center overflow-hidden border-b border-white/[0.07] pb-20 pt-32 sm:pt-40">
        <div className="ambient-grid absolute inset-0 opacity-45" aria-hidden="true" />
        <div className="absolute -left-40 top-20 h-[32rem] w-[32rem] rounded-full bg-[#8f4d2a]/12 blur-[110px]" aria-hidden="true" />
        <div className="absolute -right-40 top-10 h-[38rem] w-[38rem] rounded-full bg-amber-400/[0.07] blur-[120px]" aria-hidden="true" />
        <div className="section-shell relative grid items-center gap-14 lg:grid-cols-[1.03fr_.97fr]">
          <div className="max-w-3xl">
            <div className="eyebrow">Experience Caffeine · Business</div>
            <h1 className="mt-7 text-balance text-5xl font-medium leading-[0.95] tracking-[-0.06em] text-[#f5ecde] sm:text-7xl lg:text-[5.8rem]">
              Turn coffee knowledge into <span className="editorial-title amber-text">repeatable quality.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-base leading-8 text-[#b9ad9d] sm:text-lg">
              Connect roast intent, café recipes, staff learning, equipment context, and quality observations in one shared operating language—without pretending every signal comes from a live device.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/corporate/dashboard" className="button-primary">Explore Corporate Platform <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <Link href="/login?role=corporate&amp;next=/corporate/dashboard" className="button-secondary">Corporate Login</Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/[0.08] pt-6 text-[0.66rem] text-[#817568]">
              <span className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-amber-300/60" aria-hidden="true" /> Role-aware foundation</span>
              <span className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5 text-amber-300/60" aria-hidden="true" /> Multi-location model</span>
              <span className="flex items-center gap-2"><Radio className="h-3.5 w-3.5 text-amber-300/60" aria-hidden="true" /> Honest integration status</span>
            </div>
          </div>
          <BusinessHeroPreview />
        </div>
      </section>

      <section className="section-shell section-pad">
        <div className="max-w-3xl">
          <p className="eyebrow">What we offer</p>
          <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.02] tracking-[-0.05em] sm:text-6xl">One quality system from <span className="editorial-title text-[#e5af6c]">production to service.</span></h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#a99d8e]">Each module can stand alone in a foundational rollout, while the shared data model keeps later integrations from forcing a rebuild.</p>
          <ul aria-label="Teams the corporate platform is designed for" className="mt-7 flex flex-wrap gap-2">
            {targetAudiences.map((audience) => <li className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-[0.65rem] text-[#9d9082]" key={audience}>{audience}</li>)}
          </ul>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {corporateOfferings.map((offering, index) => {
            const Icon = offeringIcons[offering.icon];
            return (
              <CorporatePanel key={offering.id} className="group flex min-h-[22rem] flex-col p-6 transition duration-300 hover:-translate-y-1 hover:border-amber-300/20">
                <div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl border border-amber-300/12 bg-amber-300/[0.05]"><Icon className="h-5 w-5 text-amber-300/70" strokeWidth={1.5} aria-hidden="true" /></span><span className="font-mono text-[0.58rem] text-[#665d54]">0{index + 1}</span></div>
                <h3 className="mt-7 text-xl font-medium leading-7 tracking-[-0.03em] text-[#eee2d1]">{offering.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#968a7e]">{offering.description}</p>
                <p className="mt-auto border-t border-white/[0.07] pt-5 text-[0.66rem] uppercase tracking-[0.12em] text-amber-200/60">{offering.outcome}</p>
              </CorporatePanel>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-[#0d0907]/75">
        <div className="section-shell section-pad grid gap-6 lg:grid-cols-2">
          {businessAudiences.map((audience) => (
            <CorporatePanel key={audience.id} className="p-7 sm:p-9">
              <div className="flex items-center justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl border border-amber-300/12 bg-amber-300/[0.05]">{audience.id === "cafes" ? <Coffee className="h-5 w-5 text-amber-300/75" aria-hidden="true" /> : <Factory className="h-5 w-5 text-amber-300/75" aria-hidden="true" />}</span><span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[#71665c]">{audience.id === "cafes" ? "Service" : "Production"}</span></div>
              <h2 className="mt-8 text-3xl font-medium tracking-[-0.045em] text-[#eee1ce] sm:text-4xl">{audience.title}</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#a29689]">{audience.description}</p>
              <ul className="mt-7 space-y-3">
                {audience.benefits.map((benefit) => <li key={benefit} className="flex gap-3 text-sm leading-6 text-[#b9ac9c]"><span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-300/[0.07]"><Check className="h-3 w-3 text-amber-300/70" aria-hidden="true" /></span>{benefit}</li>)}
              </ul>
            </CorporatePanel>
          ))}
        </div>
      </section>

      <section className="section-shell section-pad">
        <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">Tool integrations</p>
            <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.03] tracking-[-0.05em] sm:text-5xl">Know what is connected—and what <span className="editorial-title text-[#e5af6c]">isn’t yet.</span></h2>
            <p className="mt-6 text-sm leading-7 text-[#a29689]">Status reflects this foundational platform, not a sales promise. “Available” can mean a supported manual workflow; every connector note states whether data moves automatically.</p>
            <div className="mt-7 rounded-2xl border border-amber-300/12 bg-amber-300/[0.035] p-4 text-xs leading-6 text-[#9f9182]">No live scale, espresso machine, roaster, identity provider, or production system is connected in this build.</div>
          </div>
          <div className="space-y-3">
            {corporateIntegrations.map((integration) => (
              <CorporatePanel key={integration.id} className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div><p className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#74695e]">{integration.category}</p><h3 className="mt-2 text-lg font-medium tracking-[-0.025em] text-[#e9dcc9]">{integration.name}</h3></div>
                  <IntegrationStatusPill status={integration.status} />
                </div>
                <p className="mt-4 text-sm leading-6 text-[#9b8f82]">{integration.description}</p>
                <p className="mt-4 border-t border-white/[0.06] pt-4 text-xs leading-5 text-[#73685e]">{integration.availabilityNote}</p>
              </CorporatePanel>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-[#0d0907]/75">
        <div className="section-shell section-pad">
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <p className="eyebrow">A controlled quality loop</p>
              <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.03] tracking-[-0.05em] sm:text-5xl">The standard stays connected to the <span className="editorial-title text-[#e5af6c]">reason behind it.</span></h2>
              <p className="mt-6 max-w-xl text-sm leading-7 text-[#a29689]">Teach the expectation, publish the approved reference, observe service, then make one interpretable change. The corporate model keeps those artifacts related without replacing expert review.</p>
            </div>
            <ol className="grid gap-3 sm:grid-cols-2">
              {[
                ["01", "Define", "Version roast, recipe, and quality intent."],
                ["02", "Teach", "Assign the learning that explains the standard."],
                ["03", "Observe", "Record real service and production context."],
                ["04", "Improve", "Approve one controlled change and keep its history."],
              ].map(([number, title, detail]) => <li key={number}><CorporatePanel className="h-full p-6"><span className="font-mono text-[0.62rem] text-amber-300/65">{number}</span><h3 className="mt-8 text-xl font-medium text-[#eaddca]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#918579]">{detail}</p></CorporatePanel></li>)}
            </ol>
          </div>
        </div>
      </section>

      <section id="inquiry" className="section-shell section-pad scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
          <div>
            <p className="eyebrow">Talk to our team</p>
            <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.03] tracking-[-0.05em] sm:text-5xl">Tell us where consistency is <span className="editorial-title text-[#e5af6c]">breaking down.</span></h2>
            <p className="mt-6 text-sm leading-7 text-[#a29689]">A useful first conversation starts with the current workflow, not a feature checklist. This form is a safe interaction preview and does not transmit data.</p>
          </div>
          <CorporatePanel className="p-6 sm:p-8"><CorporateInquiryForm /></CorporatePanel>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/[0.07] py-24 sm:py-32">
        <div className="ambient-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a85f34]/12 blur-[110px]" aria-hidden="true" />
        <div className="section-shell relative text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-amber-300/18 bg-amber-300/[0.055]"><BarChart3 className="h-5 w-5 text-amber-300/75" aria-hidden="true" /></span>
          <h2 className="mx-auto mt-7 max-w-5xl text-balance text-5xl font-medium leading-[0.98] tracking-[-0.055em] sm:text-7xl">Build consistent coffee across every <span className="editorial-title amber-text">batch, bar and location.</span></h2>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/corporate/dashboard" className="button-primary">Access Corporate Demo <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link><a href="#inquiry" className="button-secondary">Talk to Our Team</a></div>
        </div>
      </section>
    </main>
  );
}

function BusinessHeroPreview() {
  const locations = [
    { name: "South Market", score: 95, status: "On track" },
    { name: "Harbor Point", score: 87, status: "Attention" },
    { name: "North Roastery", score: 94, status: "On track" },
  ];
  return (
    <CorporatePanel className="relative overflow-hidden p-4 sm:p-6">
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-300/[0.08] blur-3xl" />
      <div className="relative flex items-center justify-between border-b border-white/[0.07] pb-4"><div><p className="font-mono text-[0.57rem] uppercase tracking-[0.16em] text-amber-300/65">Quality overview</p><p className="mt-1 text-sm font-medium text-[#e5d8c6]">Northline Coffee Group</p></div><span className="rounded-full border border-sky-300/12 bg-sky-300/[0.04] px-2.5 py-1 text-[0.57rem] text-sky-100/65">Illustrative data</span></div>
      <div className="relative mt-4 grid grid-cols-3 gap-2">
        {[['84%', 'Learning'], ['92.4', 'Quality'], ['8 / 11', 'Standards']].map(([value, label]) => <div key={label} className="rounded-xl border border-white/[0.06] bg-black/15 p-3"><p className="font-mono text-lg text-[#f0c282]">{value}</p><p className="mt-1 text-[0.57rem] uppercase tracking-[0.1em] text-[#74695e]">{label}</p></div>)}
      </div>
      <div className="relative mt-4 space-y-2">
        {locations.map((location) => <div key={location.name} className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-black/15 p-4"><span className="grid h-8 w-8 place-items-center rounded-full border border-white/[0.07]"><Building2 className="h-3.5 w-3.5 text-amber-300/65" aria-hidden="true" /></span><span className="min-w-0 flex-1"><strong className="block truncate text-xs font-medium text-[#ddd0bd]">{location.name}</strong><span className="mt-1 block text-[0.58rem] text-[#74695e]">{location.status}</span></span><span className="font-mono text-sm text-[#d9c7ae]">{location.score}</span></div>)}
      </div>
      <div className="relative mt-4 flex items-center gap-3 rounded-xl border border-amber-300/10 bg-amber-300/[0.035] p-4 text-xs leading-5 text-[#998b7d]"><Link2 className="h-4 w-4 shrink-0 text-amber-300/65" aria-hidden="true" /> Manual and mock signals are labeled separately from future integrations.</div>
    </CorporatePanel>
  );
}
