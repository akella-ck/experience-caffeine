import { ArrowUpRight, MapPin, Mountain } from "lucide-react";
import Link from "next/link";

export type OriginCardData = {
  id: string;
  name: string;
  regions: readonly string[];
  altitude: string;
  processes: readonly string[];
  flavorNotes: readonly string[];
  recommendedRoasts: readonly string[];
  recommendedMethods: readonly string[];
  description: string;
};

type OriginCardProps = {
  origin: OriginCardData;
  accent?: number;
};

export function OriginCard({ origin, accent = 0 }: OriginCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-[#17120e]/90 p-6 transition duration-500 hover:border-amber-300/25 sm:p-7">
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
        style={{ backgroundColor: `hsl(${28 + (accent % 4) * 7} 60% 36% / .23)` }}
      />
      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-amber-300/70">
          <MapPin className="h-3.5 w-3.5" /> Origin profile
        </div>
        <ArrowUpRight className="h-4 w-4 text-[#786c60] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber-200" />
      </div>
      <h3 className="relative mt-7 text-3xl font-semibold tracking-[-0.045em] text-[#f4ead8]">
        {origin.name}
      </h3>
      <div className="relative mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#978b7e]">
        <span>{origin.regions.slice(0, 2).join(" · ")}</span>
        <span className="inline-flex items-center gap-1.5">
          <Mountain className="h-3.5 w-3.5" /> {origin.altitude}
        </span>
      </div>
      <p className="relative mt-5 text-sm leading-6 text-[#b5a999]">{origin.description}</p>

      <div className="relative mt-6">
        <p className="text-[0.63rem] uppercase tracking-[0.16em] text-[#776b60]">Flavor signal</p>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label={`Typical flavors from ${origin.name}`}>
          {origin.flavorNotes.slice(0, 5).map((note, index) => (
            <li
              key={note}
              className={`rounded-full border px-3 py-1.5 text-xs ${
                index === 0
                  ? "border-amber-300/25 bg-amber-300/[0.08] text-amber-100"
                  : "border-white/[0.08] bg-white/[0.025] text-[#c2b5a5]"
              }`}
            >
              {note}
            </li>
          ))}
        </ul>
      </div>

      <dl className="relative mt-auto grid grid-cols-3 gap-4 border-t border-white/[0.07] pt-6">
        <div>
          <dt className="text-[0.62rem] uppercase tracking-[0.15em] text-[#756a5f]">Processing</dt>
          <dd className="mt-2 text-xs leading-5 text-[#c5b9aa]">{origin.processes.slice(0, 2).join(" / ")}</dd>
        </div>
        <div>
          <dt className="text-[0.62rem] uppercase tracking-[0.15em] text-[#756a5f]">Roast</dt>
          <dd className="mt-2 text-xs capitalize leading-5 text-[#c5b9aa]">{origin.recommendedRoasts.slice(0, 2).join(" / ")}</dd>
        </div>
        <div>
          <dt className="text-[0.62rem] uppercase tracking-[0.15em] text-[#756a5f]">Try with</dt>
          <dd className="mt-2 text-xs leading-5 text-[#c5b9aa]">{origin.recommendedMethods.slice(0, 2).join(" / ")}</dd>
        </div>
      </dl>
      <Link
        href={`/brew-lab?origin=${origin.id}`}
        className="relative mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 text-xs font-medium text-[#e9dcc8] outline-none transition hover:border-amber-200/30 hover:bg-amber-200/[0.07] focus-visible:ring-2 focus-visible:ring-amber-300/70"
      >
        Build a {origin.name} recipe
      </Link>
    </article>
  );
}
