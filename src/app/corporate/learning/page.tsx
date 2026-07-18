import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Check, Clock3, GraduationCap, Users } from "lucide-react";
import { CorporateLessonExperience } from "@/components/corporate/CorporateLessonExperience";
import {
  CorporatePageHeader,
  CorporatePanel,
  CorporatePreviewNotice,
  CorporateProgress,
  CorporateSectionTitle,
} from "@/components/corporate/CorporateUI";
import {
  featuredCorporateLesson,
  learningAssignments,
  learningPrinciples,
  learningPrograms,
} from "@/data/corporate";

export const metadata: Metadata = {
  title: "Corporate Learning",
  description: "Role-based roasting learning tracks, illustrative assignments, and an expanded rate-of-rise lesson for corporate coffee teams.",
};

export default function CorporateLearningPage() {
  return (
    <main className="relative overflow-hidden px-4 py-8 sm:px-6 sm:py-10 xl:px-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_80%_5%,rgba(201,128,56,.1),transparent_34%)]" />
      <div className="relative mx-auto max-w-[92rem] space-y-10">
        <CorporatePageHeader
          eyebrow="Learning"
          meta="Internal curriculum preview"
          title={<>Build roasting judgment through <span className="editorial-title text-[#e5af6c]">shared evidence.</span></>}
          description="Four role-aware learning tracks connect machine behavior, profile development, standards, and quality. Completion represents internal platform activity, not external accreditation."
          actions={<Link href="/corporate/roasting/standards" className="button-secondary">View standards <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>}
        />
        <CorporatePreviewNotice>Curriculum, assignments, learners, and completion are illustrative. No external certification body, LMS, or HR system is connected.</CorporatePreviewNotice>

        <section aria-labelledby="learning-tracks">
          <CorporateSectionTitle eyebrow="Required track architecture" title="Four connected roasting tracks" description="Topic names below match the foundational corporate curriculum requirements and remain visible rather than hidden behind generic categories." />
          <h2 id="learning-tracks" className="sr-only">Corporate learning tracks</h2>
          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            {learningPrograms.map((program, index) => (
              <CorporatePanel key={program.id} className="flex min-h-[25rem] flex-col p-6 sm:p-7">
                <div className="flex items-center justify-between gap-4"><span className="grid h-11 w-11 place-items-center rounded-xl border border-amber-300/12 bg-amber-300/[0.05]"><BookOpenCheck className="h-5 w-5 text-amber-300/70" aria-hidden="true" /></span><span className="font-mono text-[0.6rem] text-[#6e645a]">TRACK 0{index + 1}</span></div>
                <h3 className="mt-7 text-2xl font-medium tracking-[-0.035em] text-[#eee1ce]">{program.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#968a7e]">{program.description}</p>
                <div className="mt-5 flex flex-wrap gap-2"><span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] px-2.5 py-1 text-[0.62rem] text-[#84786c]"><Clock3 className="h-3 w-3" aria-hidden="true" />{program.duration}</span><span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] px-2.5 py-1 text-[0.62rem] text-[#84786c]"><Users className="h-3 w-3" aria-hidden="true" />{program.assignedLearners} assigned</span><span className="rounded-full border border-amber-300/12 bg-amber-300/[0.04] px-2.5 py-1 text-[0.62rem] text-amber-200/65">Required</span></div>
                <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-white/[0.07] pt-5">
                  {program.topics.map((topic) => <li key={topic} className="flex gap-2 text-xs leading-5 text-[#8f8377]"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-300/55" />{topic}</li>)}
                </ul>
                <div className="mt-auto pt-7"><CorporateProgress value={program.completionPercent} label="Illustrative completion" /></div>
              </CorporatePanel>
            ))}
          </div>
        </section>

        <section className="scroll-mt-28" id="assignments">
          <CorporateSectionTitle eyebrow="Assignments" title="Current learning cadence" description="Assignments show the reporting pattern. Publishing, due-date notifications, and HR synchronization require backend services." />
          <CorporatePanel className="mt-7 overflow-hidden">
            <div aria-label="Learning assignments, horizontally scrollable" className="overflow-x-auto" role="region" tabIndex={0}>
              <table className="w-full min-w-[760px] border-collapse text-left">
                <caption className="sr-only">Corporate learning assignments</caption>
                <thead><tr className="bg-white/[0.02]">{["Assignment", "Scope", "Schedule", "Progress", "Completion"].map((heading) => <th key={heading} scope="col" className="px-5 py-4 text-[0.58rem] font-medium uppercase tracking-[0.13em] text-[#b5a797] sm:px-7">{heading}</th>)}</tr></thead>
                <tbody>{learningAssignments.map((assignment) => {
                  const percent = assignment.assigned ? Math.round((assignment.completed / assignment.assigned) * 100) : 0;
                  return <tr key={assignment.id} className="border-t border-white/[0.06]"><th scope="row" className="px-5 py-5 text-sm font-medium text-[#ddd0bd] sm:px-7">{assignment.title}</th><td className="px-5 py-5 text-xs text-[#8f8377] sm:px-7">{assignment.location}</td><td className="px-5 py-5 text-xs text-[#8f8377] sm:px-7">{assignment.dueLabel}</td><td className="px-5 py-5 sm:px-7"><span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-2.5 py-1 text-[0.61rem] text-[#9e9184]">{assignment.progress}</span></td><td className="px-5 py-5 sm:px-7"><div className="flex items-center gap-3"><div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full rounded-full bg-amber-300/65" style={{ width: `${percent}%` }} /></div><span className="font-mono text-xs text-[#b9ab98]">{assignment.completed}/{assignment.assigned}</span></div></td></tr>;
                })}</tbody>
              </table>
            </div>
          </CorporatePanel>
        </section>

        <section>
          <CorporateSectionTitle eyebrow="Expanded lesson experience" title="Show the teaching—not only the completion bar." description="This sample demonstrates the content anatomy available to every corporate lesson." />
          <div className="mt-7"><CorporateLessonExperience lesson={featuredCorporateLesson} /></div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
          <div><CorporateSectionTitle eyebrow="Program principles" title="Internal learning with clear boundaries" description="The platform can support structured learning without overstating accreditation, machine authority, or universal roast rules." /></div>
          <CorporatePanel className="p-6 sm:p-8"><ul className="space-y-4">{learningPrinciples.map((principle) => <li key={principle} className="flex gap-3 text-sm leading-7 text-[#a99d8f]"><span className="mt-1.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-300/[0.07]"><Check className="h-3 w-3 text-amber-300/70" aria-hidden="true" /></span>{principle}</li>)}</ul></CorporatePanel>
        </section>

        <div className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 text-xs leading-5 text-[#786d63]"><GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-amber-300/60" aria-hidden="true" />“Certification” in this foundation means an internal acknowledgement of completed learning and checks. It is not a license, safety authorization, or third-party credential.</div>
      </div>
    </main>
  );
}
