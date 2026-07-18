import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ClipboardCheck, Coffee, Download, FileCheck2, GitBranch, ShieldCheck } from "lucide-react";
import {
  CorporateMetricCard,
  CorporatePageHeader,
  CorporatePanel,
  CorporatePreviewNotice,
  CorporateSectionTitle,
  CorporateWarning,
  StandardStatusPill,
} from "@/components/corporate/CorporateUI";
import { operationalStandardsLibrary, roastingStandards, standardReviewStages } from "@/data/corporate";

export const metadata: Metadata = {
  title: "Roasting Standards",
  description: "Versioned illustrative roast standards connecting sensory intent, release checks, approval status, and service handoff.",
};

export default function RoastingStandardsPage() {
  const approved = roastingStandards.filter((standard) => standard.status === "Approved").length;
  const inReview = roastingStandards.filter((standard) => standard.status === "In review").length;
  const draft = roastingStandards.filter((standard) => standard.status === "Draft").length;

  return (
    <main className="relative overflow-hidden px-4 py-8 sm:px-6 sm:py-10 xl:px-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_80%_5%,rgba(201,128,56,.1),transparent_34%)]" />
      <div className="relative mx-auto max-w-[92rem] space-y-10">
        <CorporatePageHeader
          eyebrow="Roasting · Standards"
          meta="Read-only reference"
          title={<>Version the intent before you <span className="editorial-title text-[#e5af6c]">scale the roast.</span></>}
          description="Standards connect intended use, roast direction, sensory targets, and release checks. Operational profiles and batch controls remain in the separate roasting workspace."
          actions={<><Link href="/corporate/roast-profiles" className="button-secondary">Open roast profiles <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link><Link href="/corporate/roasting/session" className="button-primary">Roasting workspace <Coffee className="h-4 w-4" aria-hidden="true" /></Link></>}
        />
        <CorporatePreviewNotice>All standards, versions, owners, and approvals are illustrative. No live production batch is approved or released from this page.</CorporatePreviewNotice>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Standards summary">
          <CorporateMetricCard label="Approved" value={String(approved)} detail="Represented in the preview" signal="on-track" icon={<FileCheck2 className="h-5 w-5" aria-hidden="true" />} />
          <CorporateMetricCard label="In review" value={String(inReview)} detail="Awaiting human decision" signal="review" icon={<GitBranch className="h-5 w-5" aria-hidden="true" />} />
          <CorporateMetricCard label="Draft" value={String(draft)} detail="Not available for service" signal="review" icon={<ClipboardCheck className="h-5 w-5" aria-hidden="true" />} />
          <CorporateMetricCard label="Release checks" value="3 ea." detail="Sensory and service context" signal="on-track" icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />} />
        </section>

        <section>
          <CorporateSectionTitle eyebrow="Operational standards library" title="Thirteen references around every production batch" description="Cards are styled as document references so the future download workflow is legible. Files are intentionally unavailable until approved content, ownership, storage, and audit controls exist." />
          <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {operationalStandardsLibrary.map((reference, index) => (
              <CorporatePanel key={reference.id} className="flex min-h-[21rem] flex-col p-5">
                <div className="flex items-start justify-between gap-4"><span className="grid h-10 w-10 place-items-center rounded-xl border border-amber-300/12 bg-amber-300/[0.05]"><ClipboardCheck className="h-4 w-4 text-amber-300/70" aria-hidden="true" /></span><span className="font-mono text-[0.56rem] text-[#665d54]">{String(index + 1).padStart(2, "0")}</span></div>
                <p className="mt-6 text-[0.58rem] font-semibold uppercase tracking-[0.13em] text-amber-200/65">{reference.label}</p>
                <h3 className="mt-2 text-lg font-medium tracking-[-0.025em] text-[#e4d7c4]">{reference.title}</h3>
                <p className="mt-3 text-xs leading-6 text-[#8f8377]">{reference.description}</p>
                <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2">{reference.includes.map((item) => <li key={item} className="flex gap-2 text-[0.62rem] leading-5 text-[#807469]"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-300/50" />{item}</li>)}</ul>
                <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.06] pt-5"><span><span className="block font-mono text-[0.56rem] text-[#6e645a]">{reference.revision}</span><span className="mt-1 block text-[0.56rem] text-[#625951]">{reference.format}</span></span><button type="button" disabled aria-label={`${reference.title} download unavailable in preview`} className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/[0.07] px-3 py-2 text-[0.58rem] text-[#6f655b]"><Download className="h-3 w-3" aria-hidden="true" />Preview only</button></div>
              </CorporatePanel>
            ))}
          </div>
          <div className="mt-5"><CorporateWarning><p><strong className="text-[#e6dac7]">Illustrative, non-legal references.</strong> These cards are not legal, regulatory, food-safety, occupational-safety, certification, or manufacturer instructions, and their ranges are not universal. Organizations must validate content with qualified personnel, applicable requirements, equipment documentation, and their own approved quality system.</p></CorporateWarning></div>
        </section>

        <section>
          <CorporateSectionTitle eyebrow="Standards library" title="Approved language, visible history" description="A standard describes the expected result and verification. It should not become an undocumented substitute for the operational roast profile." />
          <div className="mt-7 grid gap-4 xl:grid-cols-2">
            {roastingStandards.map((standard) => (
              <CorporatePanel key={standard.id} className="p-6 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div><p className="font-mono text-[0.61rem] uppercase tracking-[0.15em] text-amber-300/65">{standard.code} · {standard.version}</p><h3 className="mt-3 text-2xl font-medium tracking-[-0.035em] text-[#ecdfcc]">{standard.name}</h3></div>
                  <StandardStatusPill status={standard.status} />
                </div>
                <p className="mt-4 text-sm leading-6 text-[#9f9385]">{standard.intendedUse}</p>
                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.06] bg-black/10 p-4"><dt className="text-[0.58rem] uppercase tracking-[0.12em] text-[#70665c]">Roast direction</dt><dd className="mt-2 text-xs leading-5 text-[#a99c8e]">{standard.roastDirection}</dd></div>
                  <div className="rounded-xl border border-white/[0.06] bg-black/10 p-4"><dt className="text-[0.58rem] uppercase tracking-[0.12em] text-[#70665c]">Color reference</dt><dd className="mt-2 text-xs leading-5 text-[#a99c8e]">{standard.referenceColor}</dd></div>
                </dl>
                <div className="mt-6"><p className="text-[0.58rem] uppercase tracking-[0.12em] text-[#70665c]">Sensory target</p><ul className="mt-3 flex flex-wrap gap-2">{standard.sensoryTarget.map((note) => <li key={note} className="rounded-full border border-amber-300/10 bg-amber-300/[0.035] px-3 py-1.5 text-[0.66rem] text-[#b9a995]">{note}</li>)}</ul></div>
                <details className="group mt-6 rounded-xl border border-white/[0.07] bg-black/10 p-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-[#d9ccba] outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70"><span>Release checks</span><span className="text-[#74695e] transition-transform group-open:rotate-45">+</span></summary><ul className="mt-4 space-y-2 border-t border-white/[0.06] pt-4">{standard.releaseChecks.map((check) => <li key={check} className="flex gap-2 text-xs leading-5 text-[#918579]"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300/60" aria-hidden="true" />{check}</li>)}</ul></details>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4 text-[0.62rem] text-[#74695e]"><span>{standard.owner}</span><span>{standard.reviewedAt}</span></div>
              </CorporatePanel>
            ))}
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[.65fr_1.35fr] xl:items-start">
          <CorporateSectionTitle eyebrow="Review model" title="Four gates from intent to service" description="Operational controls can change quickly; approved standards should change deliberately and leave an accountable history." />
          <ol className="grid gap-3 sm:grid-cols-2">
            {standardReviewStages.map((stage, index) => <li key={stage.id}><CorporatePanel className="h-full p-5"><div className="flex items-center justify-between"><span className="font-mono text-[0.62rem] text-amber-300/65">0{index + 1}</span><GitBranch className="h-4 w-4 text-[#766b60]" aria-hidden="true" /></div><h3 className="mt-7 text-lg font-medium text-[#e1d4c1]">{stage.label}</h3><p className="mt-3 text-xs leading-6 text-[#8f8377]">{stage.description}</p></CorporatePanel></li>)}
          </ol>
        </section>

        <CorporateWarning><p><strong className="text-[#e6dac7]">Do not transfer numeric roast targets blindly.</strong> Machine design, probe placement and response, batch size, green-coffee properties, environmental conditions, maintenance, controls, and software processing can change the recorded profile. Verify every standard through the organization’s approved safety, production, and quality process.</p></CorporateWarning>
      </div>
    </main>
  );
}
