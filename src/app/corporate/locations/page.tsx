import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  Check,
  ClipboardList,
  Coffee,
  Gauge,
  MapPin,
  RefreshCcw,
  TriangleAlert,
  Users,
} from "lucide-react";
import {
  CorporateMetricCard,
  CorporatePageHeader,
  CorporatePanel,
  CorporatePreviewNotice,
  CorporateProgress,
  CorporateSectionTitle,
  SignalPill,
} from "@/components/corporate/CorporateUI";
import { corporateLocations, rolloutChecklist } from "@/data/corporate";

export const metadata: Metadata = {
  title: "Corporate Locations",
  description: "Illustrative multi-location coffee program readiness across teams, learning, standards, quality, and equipment context.",
};

export default function CorporateLocationsPage() {
  const teamCount = corporateLocations.reduce((sum, location) => sum + location.teamCount, 0);
  const averageLearning = Math.round(corporateLocations.reduce((sum, location) => sum + location.learningCompletion, 0) / corporateLocations.length);
  const averageQuality = corporateLocations.reduce((sum, location) => sum + location.qualityScore, 0) / corporateLocations.length;

  return (
    <main className="relative overflow-hidden px-4 py-8 sm:px-6 sm:py-10 xl:px-10">
      <div className="relative mx-auto max-w-[92rem] space-y-10">
        <CorporatePageHeader
          eyebrow="Locations"
          meta="Multi-location preview"
          title={<>Consistency with the local context <span className="editorial-title text-[#e5af6c]">still attached.</span></>}
          description="Compare learning, standards, quality, and equipment readiness without treating every café or production site as an interchangeable score."
          actions={<Link href="/corporate/quality" className="button-secondary">Review quality <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>}
        />
        <CorporatePreviewNotice>Locations, teams, assigned recipes, issues, calibration timestamps, equipment, and readiness scores are illustrative. No live store, scheduling, POS, maintenance, or device system is connected.</CorporatePreviewNotice>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Location summary">
          <CorporateMetricCard label="Locations" value={String(corporateLocations.length)} detail="Three café formats, one roastery" signal="on-track" icon={<Building2 className="h-5 w-5" aria-hidden="true" />} />
          <CorporateMetricCard label="Team represented" value={String(teamCount)} detail="Illustrative organization total" signal="on-track" icon={<Users className="h-5 w-5" aria-hidden="true" />} />
          <CorporateMetricCard label="Learning average" value={`${averageLearning}%`} detail="Across location summaries" signal="review" icon={<BookOpenCheck className="h-5 w-5" aria-hidden="true" />} />
          <CorporateMetricCard label="Quality average" value={averageQuality.toFixed(1)} detail="Mock composite score" signal="on-track" icon={<Gauge className="h-5 w-5" aria-hidden="true" />} />
        </section>

        <section>
          <CorporateSectionTitle eyebrow="Location cards" title="Readiness at a glance" description="Each signal stays next to the team, recipes, recent issues, equipment context, last calibration, and accountable lead." />
          <div className="mt-7 grid gap-4 xl:grid-cols-2">
            {corporateLocations.map((location) => (
              <CorporatePanel key={location.id} className="p-6 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl border border-amber-300/12 bg-amber-300/[0.05]"><MapPin className="h-5 w-5 text-amber-300/70" aria-hidden="true" /></span><div><p className="font-mono text-[0.58rem] uppercase tracking-[0.13em] text-[#a99c8e]">{location.code} · {location.region}</p><h3 className="mt-1 text-xl font-medium text-[#eadcc9]">{location.name}</h3></div></div><SignalPill signal={location.signal} /></div>
                <p className="mt-5 text-sm text-[#95897c]">{location.format}</p>
                <dl className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">{[["Team", String(location.teamCount)], ["Learning", `${location.learningCompletion}%`], ["Quality", String(location.qualityScore)], ["Standards", String(location.activeStandards)]].map(([label, value]) => <div key={label} className="rounded-xl border border-white/[0.06] bg-black/10 p-3"><dt className="text-[0.56rem] uppercase tracking-[0.11em] text-[#a99c8e]">{label}</dt><dd className="mt-2 font-mono text-sm text-[#d9cbb8]">{value}</dd></div>)}</dl>
                <div className="mt-6"><CorporateProgress value={location.learningCompletion} label="Learning readiness" /></div>
                <div className="mt-6"><p className="text-[0.58rem] uppercase tracking-[0.12em] text-[#a99c8e]">Equipment context</p><ul className="mt-3 flex flex-wrap gap-2">{location.equipment.map((item) => <li key={item} className="rounded-full border border-white/[0.07] bg-white/[0.02] px-2.5 py-1 text-[0.6rem] text-[#a99c8e]">{item}</li>)}</ul></div>
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.07] bg-black/10 p-4">
                    <p className="flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.12em] text-[#a99c8e]"><ClipboardList className="h-3.5 w-3.5 text-amber-300/75" aria-hidden="true" /> Assigned recipes</p>
                    <ul className="mt-3 space-y-2">{location.assignedRecipes.map((recipe) => <li className="text-xs leading-5 text-[#a29688]" key={recipe}>{recipe}</li>)}</ul>
                  </div>
                  <div className="rounded-xl border border-white/[0.07] bg-black/10 p-4">
                    <p className="flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.12em] text-[#a99c8e]"><TriangleAlert className="h-3.5 w-3.5 text-amber-300/75" aria-hidden="true" /> Recent issues</p>
                    {location.recentIssues.length ? <ul className="mt-3 space-y-2">{location.recentIssues.map((issue) => <li className="text-xs leading-5 text-[#a29688]" key={issue}>{issue}</li>)}</ul> : <p className="mt-3 flex items-center gap-2 text-xs text-emerald-200/60"><Check className="h-3.5 w-3.5" aria-hidden="true" /> No open issues in mock data</p>}
                  </div>
                </div>
                <div className="mt-3 flex items-start gap-3 rounded-xl border border-amber-300/10 bg-amber-300/[0.03] p-4 text-xs leading-5 text-[#94877a]"><RefreshCcw className="mt-0.5 h-4 w-4 shrink-0 text-amber-300/60" aria-hidden="true" /><span><span className="block text-[0.56rem] uppercase tracking-[0.12em] text-[#70655b]">Last calibration</span><span className="mt-1 block text-[#b1a291]">{location.lastCalibration}</span></span></div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4 text-[0.62rem] text-[#a99c8e]"><span>Lead · {location.lead}</span><span>{location.teamCount} team members · local preview {location.localTime}</span></div>
              </CorporatePanel>
            ))}
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[.68fr_1.32fr] xl:items-start">
          <CorporateSectionTitle eyebrow="Rollout model" title="A location is ready when the whole system is ready" description="Opening a recipe link alone is not a rollout. Team access, equipment context, learning, standards, and quality cadence move together." />
          <CorporatePanel className="p-6 sm:p-7">
            <div className="space-y-3">
              {rolloutChecklist.map((item) => {
                const percent = Math.round((item.completeLocations / corporateLocations.length) * 100);
                return <div key={item.id} className="grid gap-3 rounded-xl border border-white/[0.06] bg-black/10 p-4 sm:grid-cols-[1fr_12rem_auto] sm:items-center"><span className="flex items-center gap-3 text-sm text-[#b2a493]"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-300/[0.06]"><Check className="h-3.5 w-3.5 text-amber-300/65" aria-hidden="true" /></span>{item.label}</span><div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full rounded-full bg-amber-300/65" style={{ width: `${percent}%` }} /></div><span className="font-mono text-xs text-[#a99b89]">{item.completeLocations}/{corporateLocations.length}</span></div>;
              })}
            </div>
          </CorporatePanel>
        </section>

        <CorporatePanel className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div><p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-amber-300/65">Equipment follows location context</p><h2 className="mt-3 text-2xl font-medium tracking-[-0.035em] text-[#e8dbc8]">Review the inventory behind each readiness signal.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#8f8377]">The foundational equipment registry records context manually and labels prototype connectors separately.</p></div>
          <Link href="/corporate/equipment" className="button-primary">Open equipment <Coffee className="h-4 w-4" aria-hidden="true" /></Link>
        </CorporatePanel>
      </div>
    </main>
  );
}
