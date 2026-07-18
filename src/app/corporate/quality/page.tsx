import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Coffee,
  Eye,
  FlaskConical,
  Palette,
  Scale,
  TriangleAlert,
} from "lucide-react";
import { CorporateCuppingRecords } from "@/components/corporate/CorporateCuppingRecords";
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
  batchApprovalRecords,
  brewQualityChecks,
  correctiveActionRecords,
  cuppingRecords,
  qualityAlerts,
  qualityFramework,
  qualityLocations,
  qualityMetricSnapshot,
  qualityObservations,
  roastDeviationRecords,
} from "@/data/corporate";

export const metadata: Metadata = {
  title: "Corporate Quality",
  description: "Illustrative quality signals, location comparisons, observations, and controlled review workflow for corporate coffee programs.",
};

const severityStyles = {
  Low: "border-white/[0.08] bg-white/[0.025] text-[#94887b]",
  Medium: "border-amber-300/15 bg-amber-300/[0.05] text-amber-200/75",
  High: "border-rose-300/15 bg-rose-300/[0.05] text-rose-200/75",
} as const;

export default function CorporateQualityPage() {
  return (
    <main className="relative overflow-hidden px-4 py-8 sm:px-6 sm:py-10 xl:px-10">
      <div className="relative mx-auto max-w-[92rem] space-y-10">
        <CorporatePageHeader
          eyebrow="Quality"
          meta="Illustrative checks"
          title={<>Make quality signals <span className="editorial-title text-[#e5af6c]">reviewable.</span></>}
          description="Bring sensory, recipe, equipment, and process observations into one controlled review path. Scores support attention; they do not replace cupping or accountable release decisions."
          actions={<><Link href="/corporate/troubleshoot" className="button-secondary">Troubleshoot a cup <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link><Link href="/corporate/roasting/standards" className="button-primary">Review standards</Link></>}
        />
        <CorporatePreviewNotice>Quality scores and observations are mock records. No live café, cupping, production, or device feed is connected.</CorporatePreviewNotice>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Quality-control metrics">
          <CorporateMetricCard label="Batch consistency" value={`${qualityMetricSnapshot.batchConsistencyPercent}%`} detail="Illustrative profile adherence across recent batches" signal="on-track" icon={<Activity className="h-5 w-5" aria-hidden="true" />} />
          <CorporateMetricCard label="Roast-color variance" value={qualityMetricSnapshot.roastColorVariance} detail="Internal reference units across the sample set" signal="review" icon={<Palette className="h-5 w-5" aria-hidden="true" />} />
          <CorporateMetricCard label="Weight-loss variance" value={`${qualityMetricSnapshot.weightLossVariancePercent}%`} detail="Spread around internal batch references" signal="on-track" icon={<Scale className="h-5 w-5" aria-hidden="true" />} />
          <CorporateMetricCard label="Average cupping score" value={qualityMetricSnapshot.averageCuppingScore.toFixed(1)} detail="Illustrative reviewed records only" signal="on-track" icon={<Coffee className="h-5 w-5" aria-hidden="true" />} />
          <CorporateMetricCard label="Recipe adherence" value={`${qualityMetricSnapshot.recipeAdherencePercent}%`} detail="Recorded café brew checks" signal="review" icon={<ClipboardCheck className="h-5 w-5" aria-hidden="true" />} />
          <CorporateMetricCard label="Open corrective actions" value={String(qualityMetricSnapshot.openCorrectiveActions)} detail="Require a named owner and verification" signal="attention" icon={<TriangleAlert className="h-5 w-5" aria-hidden="true" />} />
        </section>

        <section id="quality-alerts" className="scroll-mt-28">
          <CorporateSectionTitle eyebrow="Corrective actions & alerts" title="Separate the signal from the accountable response" description="Alerts call for human review. Corrective actions preserve one first action, an owner, and the evidence required before closure." />
          <div className="mt-7 grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
            <CorporatePanel className="p-5 sm:p-6">
              <h3 className="text-lg font-medium text-[#e3d6c3]">Quality alerts</h3>
              <ol className="mt-5 space-y-3">
                {qualityAlerts.map((alert) => (
                  <li className="rounded-xl border border-white/[0.07] bg-black/10 p-4" key={alert.id}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div><p className="text-sm font-medium text-[#ddd0bd]">{alert.title}</p><p className="mt-1 text-[0.62rem] text-[#a99c8e]">{alert.scope} · {alert.detectedAt}</p></div>
                      <span className={`rounded-full border px-2.5 py-1 text-[0.58rem] ${severityStyles[alert.severity]}`}>{alert.severity} · {alert.status}</span>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-[#93877a]"><span className="text-[#c6b7a3]">Recommended check:</span> {alert.recommendedCheck}</p>
                  </li>
                ))}
              </ol>
            </CorporatePanel>
            <CorporatePanel className="overflow-hidden">
              <div className="border-b border-white/[0.07] p-5 sm:p-6"><h3 className="text-lg font-medium text-[#e3d6c3]">Corrective-action register</h3><p className="mt-2 text-xs leading-5 text-[#a99c8e]">Mock workflow records; no task, message, or approval is sent.</p></div>
              <ol className="divide-y divide-white/[0.06]">
                {correctiveActionRecords.map((action) => (
                  <li className="p-5 sm:p-6" key={action.id}>
                    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-medium text-[#ddd0bd]">{action.title}</p><p className="mt-1 text-[0.62rem] text-[#a99c8e]">{action.source} · {action.owner} · {action.dueLabel}</p></div><span className="rounded-full border border-amber-300/12 bg-amber-300/[0.04] px-2.5 py-1 text-amber-200/80">{action.status}</span></div>
                    <p className="mt-4 text-xs leading-5 text-[#9a8d80]"><span className="text-[#c8b8a4]">First action:</span> {action.firstAction}</p>
                    <p className="mt-2 text-xs leading-5 text-[#a99c8e]"><span className="text-[#c8b8a4]">Verify with:</span> {action.verification}</p>
                  </li>
                ))}
              </ol>
            </CorporatePanel>
          </div>
        </section>

        <Suspense fallback={<div className="glass-panel grid min-h-72 place-items-center rounded-[1.75rem] text-sm text-[#9e907e]">Preparing cupping records…</div>}>
          <CorporateCuppingRecords initialRecords={cuppingRecords} />
        </Suspense>

        <section>
          <CorporateSectionTitle eyebrow="Production quality" title="Review release evidence and roast deviations together" description="A deviation is a reason to inspect context, not an automatic defect verdict. Batch disposition remains a named human decision." />
          <div className="mt-7 grid gap-5 xl:grid-cols-2">
            <CorporatePanel className="overflow-hidden">
              <div className="border-b border-white/[0.07] p-5 sm:p-6"><h3 className="text-lg font-medium text-[#e3d6c3]">Batch approvals</h3></div>
              <div aria-label="Batch approvals, horizontally scrollable" className="overflow-x-auto outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-300/70" role="region" tabIndex={0}>
                <table className="w-full min-w-[640px] border-collapse text-left">
                  <caption className="sr-only">Illustrative batch approval records</caption>
                  <thead><tr className="bg-white/[0.02]">{["Batch", "Profile", "Evidence", "Disposition"].map((heading) => <th className="px-5 py-3 text-[0.56rem] font-medium uppercase tracking-[0.13em] text-[#b5a797]" key={heading} scope="col">{heading}</th>)}</tr></thead>
                  <tbody>{batchApprovalRecords.map((record) => <tr className="border-t border-white/[0.06]" key={record.id}><th className="px-5 py-4 font-mono text-xs text-[#d5c6b1]" scope="row">{record.batchCode}</th><td className="px-5 py-4 text-xs text-[#a99c8e]">{record.roastProfile}</td><td className="max-w-sm px-5 py-4 text-xs leading-5 text-[#a99c8e]">{record.evidence}</td><td className="px-5 py-4"><span className="block text-xs text-[#b8a996]">{record.status}</span><span className="mt-1 block text-[0.56rem] text-[#a99c8e]">{record.reviewer} · {record.updatedAt}</span></td></tr>)}</tbody>
                </table>
              </div>
            </CorporatePanel>
            <CorporatePanel className="p-5 sm:p-6">
              <h3 className="text-lg font-medium text-[#e3d6c3]">Roast deviations</h3>
              <div className="mt-5 space-y-3">
                {roastDeviationRecords.map((deviation) => (
                  <article className="rounded-xl border border-white/[0.07] bg-black/10 p-4" key={deviation.id}>
                    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-[0.58rem] text-[#a99c8e]">{deviation.batchCode}</p><h4 className="mt-1 text-sm font-medium text-[#ddd0bd]">{deviation.metric}</h4></div><SignalPill signal={deviation.signal} /></div>
                    <dl className="mt-4 grid grid-cols-2 gap-3 text-xs"><div><dt className="text-[#a99c8e]">Target</dt><dd className="mt-1 text-[#c7b9a8]">{deviation.target}</dd></div><div><dt className="text-[#a99c8e]">Observed</dt><dd className="mt-1 text-[#d1c2ad]">{deviation.observed}</dd></div></dl>
                    <p className="mt-4 border-t border-white/[0.06] pt-3 text-xs leading-5 text-[#8b7f73]">{deviation.disposition}</p>
                  </article>
                ))}
              </div>
            </CorporatePanel>
          </div>
        </section>

        <section>
          <CorporateSectionTitle eyebrow="Brew-quality checks" title="Verify the published recipe in service" description="Each check keeps adherence beside a human observation. A pass does not imply permanent equipment or technique stability." />
          <CorporatePanel className="mt-7 overflow-hidden">
            <div aria-label="Brew quality checks, horizontally scrollable" className="overflow-x-auto outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-300/70" role="region" tabIndex={0}>
              <table className="w-full min-w-[900px] border-collapse text-left">
                <caption className="sr-only">Illustrative brew-quality checks</caption>
                <thead><tr className="bg-white/[0.02]">{["Location", "Recipe", "Method", "Adherence", "Result", "Observation"].map((heading) => <th className="px-5 py-4 text-[0.58rem] font-medium uppercase tracking-[0.13em] text-[#b5a797]" key={heading} scope="col">{heading}</th>)}</tr></thead>
                <tbody>{brewQualityChecks.map((check) => <tr className="border-t border-white/[0.06]" key={check.id}><th className="px-5 py-5 text-sm font-medium text-[#ddd0bd]" scope="row">{check.location}<span className="mt-1 block font-mono text-[0.56rem] font-normal text-[#a99c8e]">{check.checkedAt}</span></th><td className="px-5 py-5 text-xs text-[#a99c8e]">{check.recipe}</td><td className="px-5 py-5 text-xs text-[#a99c8e]">{check.method}</td><td className="px-5 py-5 font-mono text-xs text-[#d4c4ae]">{check.adherencePercent}%</td><td className="px-5 py-5"><span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-2.5 py-1 text-[0.6rem] text-[#b9aa9a]">{check.result}</span></td><td className="max-w-md px-5 py-5 text-xs leading-5 text-[#a99c8e]">{check.observation}</td></tr>)}</tbody>
              </table>
            </div>
          </CorporatePanel>
        </section>

        <section>
          <CorporateSectionTitle eyebrow="Location quality" title="Compare the signal with its context" description="A location score stays attached to check coverage, recipe adherence, and the leading human observation." />
          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            {qualityLocations.map((location) => (
              <CorporatePanel key={location.id} className="p-6">
                <div className="flex items-start justify-between gap-4"><div><h3 className="text-xl font-medium tracking-[-0.03em] text-[#eaddca]">{location.name}</h3><p className="mt-2 text-xs text-[#786d63]">{location.checksCompleted} of {location.checksExpected} expected checks recorded</p></div><SignalPill signal={location.signal} /></div>
                <div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-xl border border-white/[0.06] bg-black/10 p-4"><p className="text-[0.58rem] uppercase tracking-[0.12em] text-[#a99c8e]">Quality score</p><p className="mt-2 font-mono text-2xl text-[#eddabf]">{location.qualityScore}</p></div><div className="rounded-xl border border-white/[0.06] bg-black/10 p-4"><p className="text-[0.58rem] uppercase tracking-[0.12em] text-[#a99c8e]">Recipe adherence</p><p className="mt-2 font-mono text-2xl text-[#eddabf]">{location.recipeAdherence}%</p></div></div>
                <div className="mt-6"><CorporateProgress value={Math.round((location.checksCompleted / location.checksExpected) * 100)} label="Check coverage" /></div>
                <p className="mt-6 border-l border-amber-300/20 pl-4 text-xs leading-6 text-[#918579]">{location.leadingObservation}</p>
              </CorporatePanel>
            ))}
          </div>
        </section>

        <section id="observations" className="scroll-mt-28">
          <CorporateSectionTitle eyebrow="Observation queue" title="Recent quality records" description="Recommendations identify the next controlled check, not an automatic root-cause verdict." />
          <CorporatePanel className="mt-7 overflow-hidden">
            <div aria-label="Quality observations, horizontally scrollable" className="overflow-x-auto outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-300/70" role="region" tabIndex={0}>
              <table className="w-full min-w-[900px] border-collapse text-left">
                <caption className="sr-only">Recent corporate quality observations</caption>
                <thead><tr className="bg-white/[0.02]">{["Observation", "Location", "Category", "Severity", "Status", "Recommended next check"].map((heading) => <th key={heading} scope="col" className="px-5 py-4 text-[0.58rem] font-medium uppercase tracking-[0.13em] text-[#b5a797]">{heading}</th>)}</tr></thead>
                <tbody>{qualityObservations.map((observation) => <tr key={observation.id} className="border-t border-white/[0.06]"><th scope="row" className="px-5 py-5"><span className="block text-sm font-medium text-[#ddd0bd]">{observation.title}</span><span className="mt-1 block font-mono text-[0.58rem] text-[#a99c8e]">{observation.reportedAt}</span></th><td className="px-5 py-5 text-xs text-[#a99c8e]">{observation.location}</td><td className="px-5 py-5 text-xs text-[#a99c8e]">{observation.category}</td><td className="px-5 py-5"><span className={`rounded-full border px-2.5 py-1 text-[0.6rem] ${severityStyles[observation.severity]}`}>{observation.severity}</span></td><td className="px-5 py-5 text-xs text-[#b9aa9a]">{observation.status}</td><td className="max-w-md px-5 py-5 text-xs leading-5 text-[#a99c8e]">{observation.recommendation}</td></tr>)}</tbody>
              </table>
            </div>
          </CorporatePanel>
        </section>

        <section className="grid gap-7 xl:grid-cols-[.62fr_1.38fr] xl:items-start">
          <CorporateSectionTitle eyebrow="Review method" title="One observation, one interpretable next check" description="Close records only when a repeated check supports the explanation." />
          <ol className="grid gap-3 md:grid-cols-3">
            {qualityFramework.map((step, index) => <li key={step.id}><CorporatePanel className="h-full p-5"><div className="flex items-center justify-between"><span className="font-mono text-[0.62rem] text-amber-300/65">0{index + 1}</span>{index === 0 ? <Eye className="h-4 w-4 text-[#766b60]" aria-hidden="true" /> : index === 1 ? <FlaskConical className="h-4 w-4 text-[#766b60]" aria-hidden="true" /> : <CheckCircle2 className="h-4 w-4 text-[#766b60]" aria-hidden="true" />}</div><h3 className="mt-7 text-lg font-medium text-[#e1d4c1]">{step.title}</h3><p className="mt-3 text-xs leading-6 text-[#8f8377]">{step.detail}</p></CorporatePanel></li>)}
          </ol>
        </section>
      </div>
    </main>
  );
}
