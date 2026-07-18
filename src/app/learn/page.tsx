import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, BookOpen, FlaskConical, ScanSearch, SlidersHorizontal, Sparkles } from "lucide-react";
import { GlassPanel } from "@/components/GlassPanel";
import { LessonCard } from "@/components/LessonCard";
import { lessons, lessonTracks } from "@/data/lessons";
import type { LessonTrackId } from "@/types";

export const metadata: Metadata = {
  title: "Learn Coffee",
  description:
    "Follow practical learning tracks in coffee foundations, brewing science, equipment skills, and sensory tasting.",
};

const trackIcons: Record<LessonTrackId, LucideIcon> = {
  "coffee-foundations": BookOpen,
  "brewing-science": FlaskConical,
  "equipment-skills": SlidersHorizontal,
  "sensory-skills": ScanSearch,
};

export default function LearnPage() {
  const completed = lessons.filter((lesson) => lesson.progress === "complete").length;
  const inProgress = lessons.filter((lesson) => lesson.progress === "in-progress").length;
  const grindLesson = lessons.find((lesson) => lesson.id === "grind-size-and-extraction");

  return (
    <main className="relative overflow-hidden bg-[#0c0a08] text-[#f4ead8]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[50rem] bg-[radial-gradient(circle_at_72%_10%,rgba(209,137,64,.14),transparent_31%),radial-gradient(circle_at_18%_25%,rgba(117,70,37,.15),transparent_33%)]" />

      <section className="relative mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40 lg:px-10 lg:pt-44">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.68fr] lg:items-end">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200/15 bg-amber-200/[0.05] px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber-200/80"><BookOpen className="h-3.5 w-3.5" /> Learning library</div>
            <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#f5ead7] sm:text-6xl lg:text-7xl">Learn the variable. <span className="text-amber-200/90">Taste the change.</span></h1>
            <p className="mt-7 max-w-2xl text-pretty text-base leading-8 text-[#b0a395] sm:text-lg">Short, connected lessons turn coffee theory into an observation you can make at the brew bench. Start anywhere; keep one experiment small.</p>
          </div>
          <GlassPanel className="p-6 sm:p-7" glow="amber">
            <div className="relative flex items-center justify-between">
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-amber-300/70">Your local progress</p>
              <span className="font-mono text-xl text-[#e9dcc8]">{completed}/{lessons.length}</span>
            </div>
            <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-200" style={{ width: `${Math.max(4, (completed / lessons.length) * 100)}%` }} />
            </div>
            <p className="relative mt-4 text-xs leading-5 text-[#918578]">{inProgress} lessons in progress · Progress is sample data in this foundational version.</p>
          </GlassPanel>
        </div>
      </section>

      {grindLesson ? (
        <section className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
          <GlassPanel className="grid overflow-hidden lg:grid-cols-[0.85fr_1.15fr]" glow="amber">
            <div className="relative flex min-h-72 items-center justify-center border-b border-white/[0.07] bg-[#100d0a] p-8 lg:border-b-0 lg:border-r" aria-hidden="true">
              <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle,rgba(225,166,98,.26)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(circle,black,transparent_72%)]" />
              <div className="relative h-40 w-40 rounded-full border border-amber-200/10 shadow-[0_0_80px_rgba(201,128,56,.12)]">
                {Array.from({ length: 30 }, (_, index) => (
                  <span key={index} className="absolute rounded-[45%] bg-gradient-to-br from-[#b97b43] to-[#4d2d19]" style={{ width: 2 + (index % 5), height: 2 + (index % 4), left: `${11 + ((index * 29) % 78)}%`, top: `${10 + ((index * 43) % 78)}%`, transform: `rotate(${index * 17}deg)` }} />
                ))}
                <div className="absolute inset-10 flex items-center justify-center rounded-full border border-amber-200/15 bg-[#15100c]"><FlaskConical className="h-7 w-7 text-amber-200/70" /></div>
              </div>
            </div>
            <div className="relative p-7 sm:p-10 lg:p-12">
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.19em] text-amber-300/70">Featured interactive · {grindLesson.durationMinutes} min</p>
              <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.045em] text-[#f2e6d2] sm:text-4xl">{grindLesson.title}</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#a99d8f] sm:text-base">{grindLesson.summary}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {['Surface area', 'Flow resistance', 'Taste sequence', 'Controlled test'].map((topic) => <span key={topic} className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-xs text-[#a99d8f]">{topic}</span>)}
              </div>
              <Link href="/learn/grind-size" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f1c27d] px-6 text-sm font-semibold text-[#1d1209] outline-none transition hover:bg-[#f5d096] focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#15100c]">Start the lesson <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </GlassPanel>
        </section>
      ) : null}

      <nav aria-label="Learning tracks" className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {lessonTracks.map((track) => {
            const Icon = trackIcons[track.id];
            return (
              <li key={track.id}>
                <a href={`#${track.id}`} className="flex min-h-16 items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 text-sm text-[#cfc1af] outline-none transition hover:border-amber-200/25 hover:bg-amber-200/[0.035] focus-visible:ring-2 focus-visible:ring-amber-300/70"><Icon className="h-4 w-4 text-amber-300/65" />{track.title}<span className="ml-auto font-mono text-[0.62rem] text-[#73685e]">{track.lessonIds.length}</span></a>
              </li>
            );
          })}
        </ul>
      </nav>

      {lessonTracks.map((track, trackIndex) => {
        const trackLessons = lessons.filter((lesson) => lesson.trackId === track.id);
        const TrackIcon = trackIcons[track.id];
        return (
          <section key={track.id} id={track.id} className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
            <div className="grid gap-6 border-b border-white/[0.08] pb-8 md:grid-cols-[auto_1fr_auto] md:items-start">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-200/12 bg-amber-200/[0.05] text-amber-200/75"><TrackIcon className="h-5 w-5" /></span>
              <div>
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.17em] text-[#786d62]">Track {String(trackIndex + 1).padStart(2, "0")}</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#eee1cd] sm:text-4xl">{track.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9f9385]">{track.description}</p>
              </div>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[#74695e]">{trackLessons.reduce((total, lesson) => total + lesson.durationMinutes, 0)} min path</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {trackLessons.map((lesson, index) => (
                <LessonCard key={lesson.id} lesson={lesson} index={index} href={lesson.id === "grind-size-and-extraction" ? "/learn/grind-size" : `/learn/${lesson.slug}`} />
              ))}
            </div>
          </section>
        );
      })}

      <section className="relative mx-auto max-w-7xl px-5 pb-24 pt-10 sm:px-8 sm:pb-32 lg:px-10">
        <GlassPanel className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12" glow="amber">
          <div className="relative">
            <p className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-amber-300/70"><Sparkles className="h-3.5 w-3.5" /> Practice closes the loop</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.045em] text-[#f4ead8] sm:text-4xl">Apply one idea in your next cup.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#9f9385]">A lesson becomes useful when it changes what you notice. Brew a baseline, make one controlled adjustment, and record the result.</p>
          </div>
          <Link href="/brew-lab" className="relative inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f1c27d] px-6 text-sm font-semibold text-[#1d1209] outline-none transition hover:bg-[#f5d096] focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#15100c]">Plan an experiment <ArrowRight className="h-4 w-4" /></Link>
        </GlassPanel>
      </section>
    </main>
  );
}
