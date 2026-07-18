import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Captions, Check, Clock3, FlaskConical, Play } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MemberPreviewGate } from "@/components/auth/MemberPreviewGate";
import { GlassPanel } from "@/components/GlassPanel";
import { lessonTracks, lessons } from "@/data/lessons";
import type { LessonTrackId } from "@/types";

type LessonPageProps = { params: Promise<{ slug: string }> };

const practiceByTrack: Record<LessonTrackId, { observe: string; practice: string; check: string }> = {
  "coffee-foundations": {
    observe: "Start with the information you can verify: the coffee, roast date, origin or blend, process when known, and what you perceive in the cup.",
    practice: "Compare two coffees with the same simple brew recipe. Write down one aroma, one flavor, and one texture before reading the bag notes again.",
    check: "Which observation came from your cup, and which detail came from the producer or roaster?",
  },
  "brewing-science": {
    observe: "Treat recipe variables as a connected system. Record dose, water, grind, temperature, time, and technique before deciding what changed the taste.",
    practice: "Brew one baseline, change only the lesson’s focal variable by a small amount, then taste both cups as they cool.",
    check: "Did you keep the remaining major variables stable enough to interpret the result?",
  },
  "equipment-skills": {
    observe: "A repeatable recipe depends on clean equipment, a known setup, and controls you can describe. Model numbers are context—not universal units.",
    practice: "Document your current setup and perform one low-risk practice pass. Follow the manufacturer’s instructions for calibration, disassembly, heat, blades, burrs, and cleaning products.",
    check: "Could another brewer reproduce your setup without guessing which tool or setting you used?",
  },
  "sensory-skills": {
    observe: "Sensory language works best as a comparison. Notice aroma, acidity, sweetness, bitterness, texture, clarity, and finish without forcing a flavor-note match.",
    practice: "Taste two cups side by side at hot, warm, and cooler temperatures. Record a difference before deciding which cup you prefer.",
    check: "Can you describe what changed without using only good, bad, strong, or weak?",
  },
};

export function generateStaticParams() {
  return lessons
    .filter((lesson) => lesson.id !== "grind-size-and-extraction")
    .map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = lessons.find((candidate) => candidate.slug === slug && candidate.id !== "grind-size-and-extraction");
  return lesson
    ? { title: lesson.title, description: lesson.summary }
    : { title: "Lesson Not Found", robots: { index: false, follow: false } };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const lessonIndex = lessons.findIndex((candidate) => candidate.slug === slug && candidate.id !== "grind-size-and-extraction");
  if (lessonIndex < 0) notFound();

  const lesson = lessons[lessonIndex];
  const track = lessonTracks.find((candidate) => candidate.id === lesson.trackId);
  const practice = practiceByTrack[lesson.trackId];
  const related = lessons.filter((candidate) => candidate.trackId === lesson.trackId && candidate.id !== lesson.id).slice(0, 3);

  return (
    <MemberPreviewGate
      description={`${lesson.summary} Members can open the complete observation, practice, and reflection sequence.`}
      features={["A concise concept model", "A controlled practice at the brew bench", "A reflection prompt and related next lessons"]}
      loginPath={`/learn/${lesson.slug}`}
      secondaryHref="/learn"
      secondaryLabel="Explore public lessons"
      title={`Continue the ${lesson.title} lesson.`}
    >
      <main className="relative min-h-screen overflow-hidden bg-[#0b0908] pb-24 pt-32 text-[#f7f0e5] sm:pt-40">
        <div className="ambient-grid pointer-events-none absolute inset-x-0 top-0 h-[45rem] opacity-60" />
        <div className="section-shell relative">
          <Link className="inline-flex min-h-11 items-center gap-2 text-xs text-[#a99b8c] hover:text-amber-200" href="/learn"><ArrowLeft className="size-4" aria-hidden="true" /> Learning library</Link>
          <header className="mt-8 max-w-4xl">
            <p className="eyebrow">{track?.title ?? "Learning"} · {lesson.type}</p>
            <h1 className="page-title mt-6">{lesson.title}</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#b8aa99] sm:text-lg">{lesson.summary}</p>
            <div className="mt-7 flex flex-wrap gap-2 text-xs text-[#a99b8c]"><span className="rounded-full border border-white/10 px-3 py-2">{lesson.difficulty}</span><span className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-2"><Clock3 className="size-3.5" aria-hidden="true" /> {lesson.durationMinutes} min</span><span className="rounded-full border border-white/10 px-3 py-2">{lesson.progress.replace("-", " ")}</span></div>
          </header>

          <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_.72fr] lg:items-start">
            <article className="glass-panel rounded-[2rem] p-6 sm:p-9">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-amber-300/70">Lesson sequence</p>
              <ol className="mt-7 space-y-8">
                {[
                  ["Build the model", lesson.summary],
                  ["Know what to observe", practice.observe],
                  ["Run one controlled practice", practice.practice],
                ].map(([heading, body], index) => (
                  <li className="grid gap-4 border-b border-white/[0.07] pb-8 last:border-0 last:pb-0 sm:grid-cols-[2.5rem_1fr]" key={heading}>
                    <span className="grid size-10 place-items-center rounded-full border border-amber-300/15 bg-amber-300/[0.05] font-mono text-xs text-amber-200">0{index + 1}</span>
                    <div><h2 className="text-xl font-medium text-[#eadfd0]">{heading}</h2><p className="mt-3 text-sm leading-7 text-[#aa9d8e]">{body}</p></div>
                  </li>
                ))}
              </ol>
            </article>

            <aside className="space-y-5 lg:sticky lg:top-28">
              <GlassPanel className="overflow-hidden" glow="amber">
                <div className="relative grid aspect-video place-items-center border-b border-white/[0.07] bg-[radial-gradient(circle_at_center,rgba(217,154,78,.14),transparent_55%),#100c09]">
                  <span className="grid size-16 place-items-center rounded-full border border-amber-300/25 bg-amber-300/[0.08]"><Play className="ml-1 size-5 text-amber-200" aria-hidden="true" /></span>
                  <span className="absolute bottom-4 left-4 rounded-full bg-black/45 px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#b6a898]">Instructional video placeholder</span>
                </div>
                <div className="p-5"><div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-[#e7dbca]">{lesson.title}: guided observation</p><span className="flex items-center gap-1 text-[10px] text-[#a99b8c]"><Captions className="size-3.5" aria-hidden="true" /> Captions planned</span></div><p className="mt-3 text-xs leading-5 text-[#8f8275]">Replace this area with reviewed, licensed, captioned instruction before production publishing.</p></div>
              </GlassPanel>
              <section className="rounded-[1.6rem] border border-amber-300/15 bg-amber-300/[0.04] p-5">
                <FlaskConical className="size-4 text-amber-300" aria-hidden="true" /><h2 className="mt-5 text-lg font-medium">Knowledge check</h2><p className="mt-3 text-sm leading-6 text-[#aa9d8e]">{practice.check}</p><details className="mt-4 rounded-xl border border-white/[0.08] p-4"><summary className="cursor-pointer text-xs font-medium text-amber-100 outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70">Show the review cue</summary><p className="mt-3 flex gap-2 text-xs leading-5 text-[#9f9284]"><Check className="mt-0.5 size-3.5 shrink-0 text-amber-300" aria-hidden="true" />Use a recorded observation and the controlled-practice conditions to support your answer.</p></details>
              </section>
            </aside>
          </div>

          <section className="mt-14 border-t border-white/[0.08] pt-10" aria-labelledby="related-lessons">
            <h2 className="text-2xl font-medium" id="related-lessons">Continue this track</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">{related.map((item) => <Link className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5" href={item.id === "grind-size-and-extraction" ? "/learn/grind-size" : `/learn/${item.slug}`} key={item.id}><p className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-amber-300/60">{item.durationMinutes} min · {item.type}</p><h3 className="mt-4 text-base font-medium text-[#e7dbca]">{item.title}</h3><span className="mt-5 flex items-center gap-2 text-xs text-[#9f9284]">Open lesson <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span></Link>)}</div>
          </section>
        </div>
      </main>
    </MemberPreviewGate>
  );
}
