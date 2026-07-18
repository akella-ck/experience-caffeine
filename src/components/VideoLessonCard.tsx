import { Captions, Check, Play, Timer } from "lucide-react";

type VideoLessonCardProps = {
  title: string;
  duration: string;
  chapters: string[];
  description?: string;
  thumbnail?: string;
  captionsAvailable?: boolean;
  eyebrow?: string;
  className?: string;
};

export function VideoLessonCard({
  title,
  duration,
  chapters,
  description,
  thumbnail,
  captionsAvailable = true,
  eyebrow = "Technique film",
  className = "",
}: VideoLessonCardProps) {
  return (
    <section className={`overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-[#14100d] ${className}`}>
      <div className="group relative aspect-video min-h-56 overflow-hidden bg-[#0b0907]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_66%_35%,rgba(219,151,74,.2),transparent_30%),linear-gradient(135deg,#1f1711,#0b0907_72%)]" />
        {thumbnail ? (
          <div
            className="absolute inset-0 bg-center bg-no-repeat opacity-[0.07] [background-size:36%]"
            style={{ backgroundImage: `url(${thumbnail})` }}
            aria-hidden="true"
          />
        ) : null}
        <div className="absolute left-[56%] top-[22%] h-[42%] w-[20%] -skew-x-6 rounded-b-[45%] border border-amber-100/15 bg-gradient-to-b from-amber-100/[0.1] to-amber-700/[0.1]" />
        <div className="absolute left-[38%] top-[24%] h-[35%] w-[24%] rotate-6 rounded-b-full border-b border-amber-200/20 bg-[conic-gradient(from_140deg,transparent,rgba(210,145,72,.18),transparent_65%)]" />
        <div className="absolute inset-x-[26%] bottom-[18%] h-px bg-gradient-to-r from-transparent via-amber-200/35 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,.025)_50%,transparent_65%)] transition-transform duration-1000 group-hover:translate-x-1/3" />

        <button
          type="button"
          disabled
          aria-label={`${title} video placeholder; playback is not available yet`}
          className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 cursor-not-allowed items-center justify-center rounded-full border border-amber-100/25 bg-[#24180f]/90 text-amber-100 shadow-[0_0_50px_rgba(215,143,65,.18)] outline-none"
        >
          <Play className="ml-1 h-5 w-5 fill-current" />
        </button>

        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-[0.68rem] text-[#e7d9c5] backdrop-blur-md">
          <Timer className="h-3.5 w-3.5" /> {duration}
        </div>
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-[0.68rem] text-[#e7d9c5] backdrop-blur-md">
          <Captions className="h-3.5 w-3.5" /> {captionsAvailable ? "CC" : "Captions planned"}
        </div>
      </div>

      <div className="grid gap-7 p-6 sm:p-7 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-amber-300/70">
            {eyebrow}
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-[#f2e6d2] sm:text-2xl">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-[#9e9284]">
            {description ?? "Video placeholder — connect a licensed lesson or first-party production before launch."}
          </p>
        </div>
        <div>
          <p className="text-[0.63rem] uppercase tracking-[0.16em] text-[#776c61]">Chapters</p>
          <ol className="mt-3 space-y-2">
            {chapters.map((chapter, index) => (
              <li key={chapter} className="flex items-center gap-3 text-xs text-[#c8bbab]">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/10 font-mono text-[0.58rem] text-[#887b6e]">
                  {index + 1}
                </span>
                {chapter}
                {index === 0 ? <Check className="ml-auto h-3.5 w-3.5 text-amber-300/60" /> : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
