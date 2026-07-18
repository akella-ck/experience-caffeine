"use client";

import { ArrowRight, FlaskConical } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const tastes = {
  Sour: ["Possible under-extraction", "Brew speed, method, and roast will tell us whether grind, temperature, or technique is the best first move."],
  Bitter: ["Possible over-extraction", "A slow brew can point toward a coarser grind; a normal-time dark roast may instead need cooler water."],
  Weak: ["Strength or extraction issue", "The cup may need more coffee, or it may have brewed too quickly to develop enough flavor."],
  "Too strong": ["Concentrated recipe", "Dose and water ratio are the first clues, but brew time helps separate strength from over-extraction."],
  Dry: ["Possible excess extraction", "A slow finish, fine grind, or heavy agitation can each create a drying sensation."],
  Hollow: ["Possible uneven extraction", "Flow time and method help distinguish an uneven brew from a grind that is simply too coarse."],
} as const;

const tasteParams: Record<Taste, string> = {
  Sour: "sour",
  Bitter: "bitter",
  Weak: "weak",
  "Too strong": "too-strong",
  Dry: "dry",
  Hollow: "hollow",
};

type Taste = keyof typeof tastes;

export function TastePreview() {
  const [taste, setTaste] = useState<Taste>("Sour");
  const [cause, recommendation] = tastes[taste];

  return (
    <div className="grid gap-3 lg:grid-cols-[0.75fr_1.25fr]">
      <div className="glass-panel rounded-[1.6rem] p-5 sm:p-7">
        <span className="font-mono text-[0.57rem] uppercase tracking-[0.16em] text-[#8b7f70]">What did you taste?</span>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
          {(Object.keys(tastes) as Taste[]).map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setTaste(item)}
              aria-pressed={taste === item}
              className={`min-h-12 rounded-xl border px-3 text-sm transition-colors ${taste === item ? "border-[#d99a4e]/45 bg-[#d99a4e]/10 text-[#efc58c]" : "border-white/[0.08] bg-white/[0.025] text-[#a99d8d] hover:border-white/[0.16]"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="relative overflow-hidden rounded-[1.6rem] border border-[#d99a4e]/20 bg-[linear-gradient(135deg,rgba(217,154,78,.1),rgba(255,255,255,.025))] p-6 sm:p-9">
        <FlaskConical className="absolute right-8 top-7 text-[#d99a4e]/15" size={62} strokeWidth={1} aria-hidden="true" />
        <span className="font-mono text-[0.57rem] uppercase tracking-[0.16em] text-[#a27b53]">Early hypothesis</span>
        <h3 className="mt-4 text-2xl font-medium tracking-[-0.035em] text-[#f0e4d1]">{cause}</h3>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[#b1a493]">{recommendation}</p>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-5">
          <span className="text-[0.65rem] text-[#7f7366]">Taste alone is a clue—not a complete diagnosis.</span>
          <Link href={`/troubleshoot?taste=${tasteParams[taste]}`} className="inline-flex items-center gap-2 text-xs font-semibold text-[#e6b373] hover:text-[#f3cf9f]">
            Continue with this taste <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
