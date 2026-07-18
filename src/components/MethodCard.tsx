import { ArrowUpRight, Coffee, Gauge, Timer } from "lucide-react";
import Link from "next/link";

export type MethodCardData = {
  id: string;
  name: string;
  difficulty: string;
  duration: string;
  body: string;
  clarity: string;
  description?: string;
};

type MethodCardProps = {
  method: MethodCardData;
  index?: number;
};

export function MethodCard({ method, index = 0 }: MethodCardProps) {
  return (
    <article className="group relative flex h-full min-h-[24rem] flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-[#17120e]/85 p-6 transition duration-500 hover:-translate-y-1 hover:border-amber-300/25 hover:bg-[#1b1510] focus-within:border-amber-300/50 sm:p-7">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-44 opacity-60 transition-opacity duration-500 group-hover:opacity-90"
        style={{
          background: `radial-gradient(circle at ${24 + ((index * 17) % 58)}% 20%, rgba(196, 122, 50, .22), transparent 45%)`,
        }}
      />
      <div className="relative flex items-start justify-between">
        <span className="font-mono text-[0.65rem] tracking-[0.2em] text-[#87796b]">
          METHOD {String(index + 1).padStart(2, "0")}
        </span>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[0.68rem] text-[#bfb09e]">
          {method.difficulty}
        </span>
      </div>

      <div className="relative my-8 flex h-24 items-center justify-center" aria-hidden="true">
        <span className="absolute h-24 w-24 rounded-full border border-amber-200/10 shadow-[0_0_60px_rgba(205,133,59,0.12)] transition-transform duration-700 group-hover:scale-110" />
        <Coffee className="h-12 w-12 stroke-[1.2] text-amber-200/80" />
        <span className="absolute bottom-0 h-px w-24 bg-gradient-to-r from-transparent via-amber-200/30 to-transparent" />
      </div>

      <h3 className="relative text-2xl font-semibold tracking-[-0.035em] text-[#f4ead8]">
        <Link
          href={`/brew-methods/${method.id}`}
          className="rounded-sm outline-none after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-amber-300/70"
        >
          {method.name}
          <span className="sr-only"> brewing guide</span>
        </Link>
      </h3>
      {method.description ? (
        <p className="relative mt-3 line-clamp-2 text-sm leading-6 text-[#a99d8e]">
          {method.description}
        </p>
      ) : null}

      <dl className="relative mt-auto grid grid-cols-3 gap-2 border-t border-white/[0.07] pt-5">
        <div>
          <dt className="flex items-center gap-1.5 text-[0.62rem] uppercase tracking-wider text-[#766b60]">
            <Timer className="h-3 w-3" /> Time
          </dt>
          <dd className="mt-1.5 text-xs text-[#d8cbb9]">{method.duration}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-[0.62rem] uppercase tracking-wider text-[#766b60]">
            <Gauge className="h-3 w-3" /> Body
          </dt>
          <dd className="mt-1.5 text-xs text-[#d8cbb9]">{method.body}</dd>
        </div>
        <div>
          <dt className="text-[0.62rem] uppercase tracking-wider text-[#766b60]">Clarity</dt>
          <dd className="mt-1.5 flex items-center justify-between text-xs text-[#d8cbb9]">
            {method.clarity}
            <ArrowUpRight className="h-3.5 w-3.5 text-amber-300/70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </dd>
        </div>
      </dl>
    </article>
  );
}
