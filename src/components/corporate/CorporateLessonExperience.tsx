import { Check, CircleAlert, FlaskConical, Target } from "lucide-react";
import type { CorporateLessonDetail } from "@/data/corporate";
import { VideoLessonCard } from "@/components/VideoLessonCard";
import { CorporateKnowledgeCheck } from "@/components/corporate/CorporateKnowledgeCheck";
import { CorporatePanel, CorporateSectionTitle } from "@/components/corporate/CorporateUI";

export function CorporateLessonExperience({ lesson }: { lesson: CorporateLessonDetail }) {
  return (
    <CorporatePanel className="overflow-hidden">
      <div className="border-b border-white/[0.08] p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2"><span className="rounded-full border border-amber-300/15 bg-amber-300/[0.055] px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-amber-200/75">Expanded sample lesson</span><span className="rounded-full border border-white/[0.08] px-3 py-1 text-[0.6rem] text-[#81756a]">{lesson.duration}</span><span className="rounded-full border border-white/[0.08] px-3 py-1 text-[0.6rem] text-[#81756a]">{lesson.difficulty}</span></div>
        <h2 className="mt-5 text-balance text-3xl font-medium tracking-[-0.045em] text-[#f0e4d2] sm:text-4xl">{lesson.title}</h2>
      </div>

      <div className="space-y-12 p-6 sm:p-8 lg:p-10">
        <section>
          <CorporateSectionTitle eyebrow="Objectives" title="After this lesson, the learner can…" />
          <ul className="mt-6 grid gap-3 lg:grid-cols-3">
            {lesson.objectives.map((objective) => <li key={objective} className="flex gap-3 rounded-xl border border-white/[0.07] bg-black/10 p-4 text-sm leading-6 text-[#a99d8f]"><Target className="mt-1 h-4 w-4 shrink-0 text-amber-300/65" aria-hidden="true" />{objective}</li>)}
          </ul>
        </section>

        <section className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
          <CorporateSectionTitle eyebrow="Explanation" title="Read the trend in context." description="A useful graph makes momentum visible; it does not remove the need for machine knowledge, physical milestones, and sensory verification." />
          <div className="space-y-4">{lesson.explanation.map((paragraph) => <p key={paragraph} className="text-sm leading-7 text-[#aa9e90]">{paragraph}</p>)}</div>
        </section>

        <section>
          <CorporateSectionTitle eyebrow="Explanation diagram" title="A roast curve is an evidence timeline." description="This simplified sequence is conceptual. It does not prescribe a target curve or control setting." />
          <ol className="mt-7 grid gap-3 lg:grid-cols-4">
            {lesson.diagram.map((step, index) => (
              <li key={step.label} className="relative rounded-2xl border border-white/[0.07] bg-black/10 p-5">
                <div className="flex items-center justify-between"><span className="font-mono text-[0.62rem] text-amber-300/65">0{index + 1}</span><span className="h-2 w-2 rounded-full bg-amber-300/50 shadow-[0_0_12px_rgba(217,154,78,.4)]" /></div>
                <h3 className="mt-6 text-base font-medium text-[#e3d6c4]">{step.label}</h3>
                <p className="mt-3 text-xs leading-5 text-[#8f8377]">{step.detail}</p>
                <p className="mt-5 border-t border-white/[0.06] pt-4 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-amber-200/55">{step.signal}</p>
              </li>
            ))}
          </ol>
        </section>

        <VideoLessonCard title={lesson.video.title} duration={lesson.video.duration} chapters={lesson.video.chapters} captionsAvailable={lesson.video.captionsAvailable} eyebrow="Roasting lesson film" description="First-party video placeholder. Playback and completion tracking are not connected in this foundation." />

        <section className="grid gap-8 lg:grid-cols-[1fr_.85fr]">
          <CorporatePanel className="p-6 sm:p-7">
            <p className="flex items-center gap-2 font-mono text-[0.61rem] uppercase tracking-[0.16em] text-amber-300/65"><FlaskConical className="h-4 w-4" aria-hidden="true" /> Knowledge check</p>
            <div className="mt-6"><CorporateKnowledgeCheck check={lesson.knowledgeCheck} /></div>
          </CorporatePanel>
          <CorporatePanel className="p-6 sm:p-7">
            <p className="font-mono text-[0.61rem] uppercase tracking-[0.16em] text-amber-300/65">Operator checklist</p>
            <ul className="mt-5 space-y-3">{lesson.checklist.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[#a99d8f]"><span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-300/[0.07]"><Check className="h-3 w-3 text-amber-300/70" aria-hidden="true" /></span>{item}</li>)}</ul>
          </CorporatePanel>
        </section>

        <div className="flex items-start gap-3 rounded-2xl border border-amber-300/14 bg-amber-300/[0.045] p-5 text-sm leading-7 text-[#ae9f8e]"><CircleAlert className="mt-1 h-4 w-4 shrink-0 text-amber-300/75" aria-hidden="true" /><p><strong className="text-[#e7dac7]">Variability matters.</strong> {lesson.variabilityCaveat}</p></div>
      </div>
    </CorporatePanel>
  );
}
