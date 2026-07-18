import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, BookOpenCheck, Building2, ClipboardCheck, Gauge, Target, Users } from "lucide-react";
import {
  CorporateMetricCard,
  CorporatePageHeader,
  CorporatePanel,
  CorporatePreviewNotice,
  CorporateProgress,
  CorporateSectionTitle,
  SignalPill,
} from "@/components/corporate/CorporateUI";
import {
  corporateActivity,
  corporateLocations,
  corporateMetrics,
  corporateQuickActions,
  dashboardOperationalSignals,
  dashboardPriorityActions,
  dashboardRecentRoastBatches,
  dashboardRecentTroubleshootingRecords,
  learningPrograms,
  roastingStandards,
} from "@/data/corporate";

export const metadata: Metadata = {
  title: "Corporate Dashboard",
  description: "Illustrative organization-wide learning, quality, standards, team, and location readiness for the Experience Caffeine corporate workspace.",
};

const metricIcons = [BookOpenCheck, Gauge, ClipboardCheck, Building2];

const modules = [
  ["Roasting", "/corporate/roasting/session"],
  ["Roast Profiles", "/corporate/roast-profiles"],
  ["Recipe Manager", "/corporate/recipes"],
  ["Learning", "/corporate/learning"],
  ["Equipment", "/corporate/equipment"],
  ["Quality", "/corporate/quality"],
  ["Troubleshoot", "/corporate/troubleshoot"],
  ["Team", "/corporate/team"],
  ["Locations", "/corporate/locations"],
  ["Integrations", "/corporate/integrations"],
  ["Settings", "/corporate/settings"],
] as const;

export default function CorporateDashboardPage() {
  return (
    <main className="relative overflow-hidden px-4 py-8 sm:px-6 sm:py-10 xl:px-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_75%_5%,rgba(201,128,56,.1),transparent_34%)]" />
      <div className="relative mx-auto max-w-[92rem] space-y-8">
        <CorporatePageHeader
          eyebrow="Corporate dashboard"
          meta="Sample workspace"
          title={<>Good morning, <span className="editorial-title text-[#e5af6c]">Elena.</span></>}
          description="A role-aware view of learning, standards, quality, and location readiness. Every number below is illustrative and does not represent a live organization."
          actions={<Link href="/corporate/learning" className="button-secondary">View learning <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>}
        />

        <CorporatePreviewNotice />

        <section aria-label="Production at a glance" className="space-y-5">
          <CorporateSectionTitle
            eyebrow="Operating now"
            title="Production at a glance"
            description="Compact workspace signals drawn from illustrative records. The active session is a simulation; no live production equipment is controlled here."
          />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {dashboardOperationalSignals.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group rounded-[1.35rem] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,246,228,.05),rgba(255,255,255,.015)_48%),rgba(18,13,10,.7)] p-5 outline-none transition hover:border-amber-300/20 hover:bg-amber-300/[0.025] focus-visible:ring-2 focus-visible:ring-amber-300/70"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="max-w-[12rem] text-[0.62rem] font-medium uppercase tracking-[0.13em] text-[#82766a]">{item.label}</p>
                  <SignalPill signal={item.signal} />
                </div>
                <p className="mt-6 font-mono text-xl tracking-[-0.04em] text-[#eadcc8]">{item.value}</p>
                <p className="mt-2 min-h-10 text-xs leading-5 text-[#786d63]">{item.detail}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[0.64rem] font-medium text-amber-200/60 transition-colors group-hover:text-amber-100">
                  Open module <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="dashboard-signals">
          <h2 id="dashboard-signals" className="sr-only">Organization signals</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {corporateMetrics.map((metric, index) => {
              const Icon = metricIcons[index] ?? BarChart3;
              return <CorporateMetricCard key={metric.id} {...metric} icon={<Icon className="h-5 w-5" aria-hidden="true" />} />;
            })}
          </div>
        </section>

        <CorporatePanel className="p-5 sm:p-7">
          <CorporateSectionTitle
            eyebrow="Quick actions"
            title="Move from signal to work"
            description="Each action opens a real corporate route. Actions that save data remain local or illustrative in this foundation."
          />
          <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {corporateQuickActions.map((action, index) => (
              <Link
                key={action.id}
                href={action.href}
                className="group flex min-h-24 items-start gap-3 rounded-xl border border-white/[0.07] bg-black/10 p-4 outline-none transition hover:border-amber-300/20 hover:bg-amber-300/[0.025] focus-visible:ring-2 focus-visible:ring-amber-300/70"
              >
                <span className="mt-0.5 font-mono text-[0.58rem] text-amber-300/45">{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-sm font-medium text-[#ded1be]">{action.title}</strong>
                  <span className="mt-1.5 block text-xs leading-5 text-[#766b61]">{action.detail}</span>
                </span>
                <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#675e55] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </CorporatePanel>

        <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
          <CorporatePanel className="p-5 sm:p-7">
            <CorporateSectionTitle eyebrow="Priority queue" title="What needs a human decision" description="Signals are prompts for review, not automated conclusions." />
            <div className="mt-6 space-y-2">
              {dashboardPriorityActions.map((action, index) => (
                <Link key={action.id} href={action.href} className="group flex min-h-20 items-center gap-4 rounded-xl border border-white/[0.07] bg-black/10 p-4 outline-none transition hover:border-amber-300/20 hover:bg-amber-300/[0.025] focus-visible:ring-2 focus-visible:ring-amber-300/70">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/[0.08] font-mono text-[0.62rem] text-amber-300/65">0{index + 1}</span>
                  <span className="min-w-0 flex-1"><strong className="block text-sm font-medium text-[#e4d7c5]">{action.title}</strong><span className="mt-1 block text-xs leading-5 text-[#807469]">{action.detail}</span></span>
                  <span className="hidden text-[0.62rem] font-medium text-amber-200/65 sm:block">{action.label}</span><ArrowRight className="h-4 w-4 shrink-0 text-[#6f645a] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </CorporatePanel>

          <CorporatePanel className="p-5 sm:p-7">
            <CorporateSectionTitle eyebrow="Learning readiness" title="Required tracks" action={<Link href="/corporate/learning" className="text-xs text-amber-200/65 hover:text-amber-100">Open learning</Link>} />
            <div className="mt-6 space-y-5">
              {learningPrograms.map((program) => <CorporateProgress key={program.id} value={program.completionPercent} label={program.title} />)}
            </div>
            <div className="mt-7 grid grid-cols-2 gap-2 border-t border-white/[0.07] pt-5">
              <div className="rounded-xl bg-black/10 p-4"><p className="text-[0.58rem] uppercase tracking-[0.12em] text-[#a99c8e]">Assigned learners</p><p className="mt-2 font-mono text-xl text-[#e6d9c6]">41</p></div>
              <div className="rounded-xl bg-black/10 p-4"><p className="text-[0.58rem] uppercase tracking-[0.12em] text-[#a99c8e]">Internal tracks</p><p className="mt-2 font-mono text-xl text-[#e6d9c6]">{learningPrograms.length}</p></div>
            </div>
          </CorporatePanel>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
          <CorporatePanel className="overflow-hidden">
            <div className="p-5 sm:p-7">
              <CorporateSectionTitle
                eyebrow="Roast records"
                title="Recent roast batches"
                description="Reference and simulated records for workflow design; not a production batch log."
                action={<Link href="/corporate/roasting/session" className="text-xs text-amber-200/65 hover:text-amber-100">Open roasting</Link>}
              />
            </div>
            <div aria-label="Recent roast batches, horizontally scrollable" className="overflow-x-auto border-t border-white/[0.07]" role="region" tabIndex={0}>
              <table className="w-full min-w-[680px] border-collapse text-left">
                <caption className="sr-only">Recent illustrative roast batches</caption>
                <thead>
                  <tr className="bg-white/[0.02]">
                    {["Batch", "Profile", "Machine", "Status", "Timing"].map((heading) => (
                      <th key={heading} scope="col" className="px-5 py-3 text-[0.58rem] font-medium uppercase tracking-[0.13em] text-[#b5a797] sm:px-7">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dashboardRecentRoastBatches.map((batch) => (
                    <tr key={batch.id} className="border-t border-white/[0.06]">
                      <th scope="row" className="px-5 py-4 font-mono text-xs text-[#cfc0ac] sm:px-7">{batch.code}</th>
                      <td className="px-5 py-4 text-xs text-[#9b8f82] sm:px-7">{batch.profile}</td>
                      <td className="px-5 py-4 text-xs text-[#807469] sm:px-7">{batch.machine}</td>
                      <td className="px-5 py-4 sm:px-7"><SignalPill signal={batch.signal} /><span className="ml-2 text-[0.62rem] text-[#a99c8e]">{batch.status}</span></td>
                      <td className="whitespace-nowrap px-5 py-4 font-mono text-[0.62rem] text-[#a99c8e] sm:px-7">{batch.timing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CorporatePanel>

          <CorporatePanel className="p-5 sm:p-7">
            <CorporateSectionTitle
              eyebrow="Taste diagnostics"
              title="Recent troubleshooting records"
              description="Each record preserves the first variable to change and the context to observe next."
              action={<Link href="/corporate/troubleshoot" className="text-xs text-amber-200/65 hover:text-amber-100">Troubleshoot a cup</Link>}
            />
            <ol className="mt-6 space-y-2">
              {dashboardRecentTroubleshootingRecords.map((record) => (
                <li key={record.id} className="rounded-xl border border-white/[0.06] bg-black/10 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-[#dcd0bd]">{record.issue}</p>
                      <p className="mt-1 text-[0.64rem] text-[#a99c8e]">{record.context}</p>
                    </div>
                    <SignalPill signal={record.signal} />
                  </div>
                  <p className="mt-3 text-xs leading-5 text-[#918579]"><span className="text-[#c5b6a2]">First adjustment:</span> {record.firstAdjustment}</p>
                  <p className="mt-2 font-mono text-[0.58rem] text-[#635b53]">{record.recordedAt}</p>
                </li>
              ))}
            </ol>
          </CorporatePanel>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_.75fr]">
          <CorporatePanel className="overflow-hidden">
            <div className="p-5 sm:p-7"><CorporateSectionTitle eyebrow="Location comparison" title="Readiness by location" description="Quality and learning signals are shown together so a score is never isolated from its operating context." action={<Link href="/corporate/locations" className="text-xs text-amber-200/65 hover:text-amber-100">All locations</Link>} /></div>
            <div aria-label="Location readiness comparison, horizontally scrollable" className="overflow-x-auto border-t border-white/[0.07]" role="region" tabIndex={0}>
              <table className="w-full min-w-[680px] border-collapse text-left">
                <caption className="sr-only">Corporate location readiness</caption>
                <thead><tr className="bg-white/[0.02]">{["Location", "Team", "Learning", "Quality", "Signal"].map((heading) => <th key={heading} scope="col" className="px-5 py-3 text-[0.58rem] font-medium uppercase tracking-[0.13em] text-[#b5a797] sm:px-7">{heading}</th>)}</tr></thead>
                <tbody>{corporateLocations.map((location) => <tr key={location.id} className="border-t border-white/[0.06]"><th scope="row" className="px-5 py-4 sm:px-7"><span className="block text-sm font-medium text-[#dfd2bf]">{location.name}</span><span className="mt-1 block text-[0.62rem] text-[#a99c8e]">{location.code} · {location.format}</span></th><td className="px-5 py-4 font-mono text-xs text-[#b5a797] sm:px-7">{location.teamCount}</td><td className="px-5 py-4 font-mono text-xs text-[#c4b6a3] sm:px-7">{location.learningCompletion}%</td><td className="px-5 py-4 font-mono text-xs text-[#c4b6a3] sm:px-7">{location.qualityScore}</td><td className="px-5 py-4 sm:px-7"><SignalPill signal={location.signal} /></td></tr>)}</tbody>
              </table>
            </div>
          </CorporatePanel>

          <CorporatePanel className="p-5 sm:p-7">
            <CorporateSectionTitle eyebrow="Standards" title="Approval coverage" action={<Link href="/corporate/roasting/standards" className="text-xs text-amber-200/65 hover:text-amber-100">Standards library</Link>} />
            <div className="mt-7 flex items-center gap-6">
              <div className="relative grid h-28 w-28 shrink-0 place-items-center rounded-full border-[7px] border-amber-300/15 after:absolute after:inset-[-7px] after:rounded-full after:border-[7px] after:border-transparent after:border-t-amber-300/70 after:border-r-amber-300/70 after:rotate-45"><span className="font-mono text-2xl text-[#f0dfc5]">73%</span></div>
              <div><p className="text-sm font-medium text-[#dbcebb]">{roastingStandards.filter((standard) => standard.status === "Approved").length} standards represented</p><p className="mt-2 text-xs leading-5 text-[#7d7166]">The full illustrative workspace references eleven standards; six are included in this preview dataset.</p></div>
            </div>
            <div className="mt-7 space-y-2">{["Approved", "In review", "Draft"].map((status) => <div key={status} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/10 px-4 py-3 text-xs"><span className="text-[#95887c]">{status}</span><span className="font-mono text-[#d5c7b3]">{roastingStandards.filter((standard) => standard.status === status).length}</span></div>)}</div>
          </CorporatePanel>
        </div>

        <div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
          <CorporatePanel className="p-5 sm:p-7">
            <CorporateSectionTitle eyebrow="Module map" title="Corporate workspace" description="Every navigation destination below is a real foundational or operational route." />
            <div className="mt-6 grid grid-cols-2 gap-2">
              {modules.map(([label, href]) => <Link key={href} href={href} className="flex min-h-12 items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-black/10 px-3 text-xs text-[#9e9184] outline-none transition hover:border-amber-300/20 hover:text-[#e2d5c3] focus-visible:ring-2 focus-visible:ring-amber-300/70"><span>{label}</span><ArrowRight className="h-3.5 w-3.5 text-[#6d6258]" aria-hidden="true" /></Link>)}
            </div>
          </CorporatePanel>
          <CorporatePanel className="p-5 sm:p-7">
            <CorporateSectionTitle eyebrow="Activity" title="Recent workspace events" description="Illustrative event summaries; no production audit log is connected." />
            <ol className="mt-6 space-y-1">
              {corporateActivity.map((activity) => <li key={activity.id} className="flex gap-4 border-b border-white/[0.06] py-4 last:border-0"><span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/[0.07]"><Target className="h-3.5 w-3.5 text-amber-300/60" aria-hidden="true" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-medium text-[#dcd0bd]">{activity.title}</span><span className="mt-1 block text-xs leading-5 text-[#7f7368]">{activity.detail}</span></span><span className="hidden shrink-0 font-mono text-[0.58rem] text-[#655c54] sm:block">{activity.timestamp}</span></li>)}
            </ol>
          </CorporatePanel>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 text-xs leading-5 text-[#786d63]"><Users className="h-4 w-4 shrink-0 text-amber-300/60" aria-hidden="true" />This dashboard is a UI and data-model foundation. Production metrics require authenticated organization storage, event ingestion, definitions, permissions, and audit controls.</div>
      </div>
    </main>
  );
}
