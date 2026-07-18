import { ArrowUpRight, Settings2 } from "lucide-react";
import Link from "next/link";

export type GrinderCardData = {
  id: string;
  name: string;
  brand: string;
  adjustmentType: string;
  description: string;
  featuredRange?: string;
};

type GrinderCardProps = {
  grinder: GrinderCardData;
  index?: number;
};

export function GrinderCard({ grinder, index = 0 }: GrinderCardProps) {
  return (
    <article className="group relative flex h-full min-h-[22rem] flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-[#17120e]/90 p-6 transition duration-500 hover:-translate-y-1 hover:border-amber-300/25 focus-within:border-amber-300/50 sm:p-7">
      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[#85786a]">
          GR–{String(index + 1).padStart(2, "0")}
        </span>
        <Settings2 className="h-4 w-4 text-amber-300/65" />
      </div>

      <div className="relative my-7 flex h-24 items-center justify-center" aria-hidden="true">
        <div className="absolute h-20 w-20 rounded-full border border-white/[0.08] bg-[repeating-conic-gradient(from_0deg,rgba(210,145,75,.35)_0_2deg,transparent_2deg_15deg)] shadow-[0_0_50px_rgba(196,122,50,0.12)] transition-transform duration-700 group-hover:rotate-12">
          <div className="absolute inset-3 rounded-full border border-amber-200/15 bg-[#100c09]" />
          <div className="absolute inset-[1.8rem] rounded-full bg-amber-200/55 shadow-[0_0_18px_rgba(245,194,125,.3)]" />
        </div>
      </div>

      <p className="relative text-xs font-medium uppercase tracking-[0.16em] text-amber-300/70">
        {grinder.brand}
      </p>
      <h3 className="relative mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#f4ead8]">
        <Link
          href={`/grinders/${grinder.id}`}
          className="rounded-sm outline-none after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-amber-300/70"
        >
          {grinder.name}
          <span className="sr-only"> grinder guide</span>
        </Link>
      </h3>
      <p className="relative mt-3 line-clamp-3 text-sm leading-6 text-[#a99d8e]">
        {grinder.description}
      </p>

      <div className="relative mt-auto flex items-end justify-between gap-4 border-t border-white/[0.07] pt-5">
        <div>
          <p className="text-[0.62rem] uppercase tracking-wider text-[#756a5f]">Adjustment</p>
          <p className="mt-1.5 max-w-48 text-xs leading-5 text-[#d0c3b3]">{grinder.adjustmentType}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-[#827568] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber-200" />
      </div>
    </article>
  );
}
