import { BookOpen, Check, Clock3, FlaskConical, Play, Target } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { Lesson } from "@/types";

type LessonCardProps = {
  lesson: Lesson;
  href?: string;
  index?: number;
};

const typeIcons: Record<Lesson["type"], LucideIcon> = {
  Article: BookOpen,
  Interactive: FlaskConical,
  Video: Play,
  Practice: Target,
};

const progressLabels: Record<Lesson["progress"], string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  complete: "Complete",
};

const progressWidths: Record<Lesson["progress"], string> = {
  "not-started": "w-0",
  "in-progress": "w-1/2",
  complete: "w-full",
};

export function LessonCard({ lesson, href, index = 0 }: LessonCardProps) {
  const Icon = typeIcons[lesson.type];

  return (
    <article className="group relative flex h-full min-h-[19rem] flex-col overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#15110e]/90 p-5 transition duration-500 hover:border-amber-300/20 hover:bg-[#19130f] focus-within:border-amber-300/45 sm:p-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-50"
        style={{ background: `radial-gradient(circle at ${20 + ((index * 19) % 65)}% 5%, rgba(205,133,60,.19), transparent 45%)` }}
      />
      <div className="relative flex items-center justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200/10 bg-amber-200/[0.05] text-amber-200/75"><Icon className="h-4 w-4" /></span>
        <span className="rounded-full border border-white/[0.08] bg-black/15 px-2.5 py-1 text-[0.62rem] text-[#918578]">{lesson.difficulty}</span>
      </div>
      <p className="relative mt-6 font-mono text-[0.61rem] uppercase tracking-[0.17em] text-amber-300/60">{lesson.type}</p>
      <h3 className="relative mt-3 text-xl font-semibold leading-7 tracking-[-0.025em] text-[#ecdfcb]">
        {href ? (
          <Link href={href} className="rounded-sm outline-none after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-amber-300/70">
            {lesson.title}
          </Link>
        ) : (
          lesson.title
        )}
      </h3>
      <p className="relative mt-3 line-clamp-3 text-sm leading-6 text-[#9f9385]">{lesson.summary}</p>
      <div className="relative mt-auto pt-6">
        <div className="mb-3 flex items-center justify-between text-[0.65rem]">
          <span className="flex items-center gap-1.5 text-[#887c70]"><Clock3 className="h-3 w-3" /> {lesson.durationMinutes} min</span>
          <span className={`flex items-center gap-1.5 ${lesson.progress === "complete" ? "text-amber-200/75" : "text-[#887c70]"}`}>
            {lesson.progress === "complete" ? <Check className="h-3 w-3" /> : null}{progressLabels[lesson.progress]}
          </span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-white/[0.07]" aria-label={`${progressLabels[lesson.progress]} progress`}>
          <div className={`h-full rounded-full bg-amber-300/65 ${progressWidths[lesson.progress]}`} />
        </div>
        {!href ? <p className="mt-3 text-[0.62rem] uppercase tracking-[0.12em] text-[#655b52]">Course module preview</p> : null}
      </div>
    </article>
  );
}
