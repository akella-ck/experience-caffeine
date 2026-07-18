import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Factory,
  Gauge,
  MapPinned,
  Workflow,
} from "lucide-react";

const outcomes = [
  { label: "Roast profiles", icon: Factory },
  { label: "Recipe standards", icon: Workflow },
  { label: "Staff learning", icon: BookOpenCheck },
  { label: "Quality signals", icon: Gauge },
] as const;

const operatingSignals = [
  { label: "Approved café recipes", value: "12", status: "Prototype" },
  { label: "Training completion", value: "84%", status: "Prototype" },
  { label: "Connected locations", value: "03", status: "Planned" },
] as const;

export function BusinessPreview() {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.07] bg-[#0c0907]">
      <div className="ambient-grid pointer-events-none absolute inset-0 opacity-35" aria-hidden="true" />
      <div className="pointer-events-none absolute right-[-8rem] top-[-10rem] size-[32rem] rounded-full bg-[#a75f2c]/10 blur-[110px]" aria-hidden="true" />
      <div className="section-shell section-pad relative grid gap-12 lg:grid-cols-[.92fr_1.08fr] lg:items-center">
        <div>
          <p className="eyebrow">For cafés &amp; roasters</p>
          <h2 className="mt-6 max-w-3xl text-balance text-4xl font-medium leading-[1.02] tracking-[-0.05em] sm:text-6xl">
            Turn coffee knowledge into <span className="editorial-title text-[#e5af6c]">repeatable quality.</span>
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-[#aa9e8e] sm:text-base">
            Standardize roast records, café recipes, training, equipment workflows, and quality checks without losing the judgment of the people doing the work.
          </p>
          <div className="mt-7 grid grid-cols-2 gap-2 sm:max-w-xl">
            {outcomes.map(({ label, icon: Icon }) => (
              <div className="flex min-h-12 items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-xs text-[#bcae9d]" key={label}>
                <Icon aria-hidden="true" className="size-3.5 shrink-0 text-[#dba25f]" />
                {label}
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="button-primary" href="/for-business">
              Explore corporate platform <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link className="button-secondary" href="/login?role=corporate&amp;next=/corporate/dashboard">
              Corporate login
            </Link>
          </div>
        </div>

        <div className="glass-panel overflow-hidden rounded-[2rem]">
          <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl border border-[#d99a4e]/15 bg-[#d99a4e]/[0.06] text-[#dca25e]">
                <MapPinned aria-hidden="true" className="size-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-[#eee3d4]">Operations signal</p>
                <p className="mt-0.5 text-[10px] text-[#786d62]">Illustrative corporate workspace</p>
              </div>
            </div>
            <span className="rounded-full border border-[#d99a4e]/15 bg-[#d99a4e]/[0.05] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-[#c9955c]">Demo data</span>
          </div>
          <div className="space-y-2 p-4 sm:p-6">
            {operatingSignals.map((signal) => (
              <div className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl border border-white/[0.07] bg-black/15 p-4" key={signal.label}>
                <div>
                  <p className="text-xs text-[#9d9081]">{signal.label}</p>
                  <p className="mt-2 text-2xl font-medium tracking-[-0.035em] text-[#f0e5d6]">{signal.value}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] ${signal.status === "Planned" ? "border-white/[0.08] text-[#85796d]" : "border-[#9fb88b]/20 bg-[#9fb88b]/[0.06] text-[#a9c293]"}`}>
                  {signal.status === "Prototype" ? <BadgeCheck aria-hidden="true" className="size-3" /> : null}
                  {signal.status}
                </span>
              </div>
            ))}
          </div>
          <p className="border-t border-white/[0.07] px-5 py-4 text-[10px] leading-5 text-[#766b60] sm:px-7">
            No production systems or coffee equipment are connected in this demonstration.
          </p>
        </div>
      </div>
    </section>
  );
}
