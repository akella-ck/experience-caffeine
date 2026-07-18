import Link from "next/link";
import { ArrowRight, Eye, FlaskConical, Lightbulb, RotateCcw } from "lucide-react";
import type { BrewDiagnosis, BrewMethodId, RoastLevel } from "@/types";

type TroubleshootingResultProps = {
  diagnosis: BrewDiagnosis;
  onRestart: () => void;
  brewMethodId?: BrewMethodId | null;
  roastLevel?: RoastLevel | null;
};

export function TroubleshootingResult({ diagnosis, onRestart, brewMethodId, roastLevel }: TroubleshootingResultProps) {
  const brewLabHref = `/brew-lab${brewMethodId ? `?method=${brewMethodId}${roastLevel ? `&roast=${roastLevel}` : ""}` : ""}`;
  return (
    <section aria-labelledby="diagnosis-title" aria-live="polite" className="glass-panel relative overflow-hidden rounded-[2rem]">
      <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-amber-400/[0.09] blur-3xl" />
      <div className="relative border-b border-white/[0.08] p-6 sm:p-8 lg:p-10">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full border border-amber-300/20 bg-amber-300/[0.08]">
            <FlaskConical aria-hidden="true" className="size-4 text-amber-200" />
          </span>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-amber-200/65">Taste diagnosis</p>
            <p className="mt-1 text-xs text-[#897b6e]">Rule {diagnosis.matchedRuleId}</p>
          </div>
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8e8073]">Likely cause</p>
        <h2 className="mt-3 max-w-3xl text-balance text-3xl font-medium tracking-[-0.04em] text-[#fff7eb] sm:text-4xl" id="diagnosis-title">
          {diagnosis.likelyCause}
        </h2>
      </div>

      <div className="grid gap-px bg-white/[0.08] sm:grid-cols-3">
        <div className="bg-[#120e0b] p-6 sm:p-7">
          <Lightbulb aria-hidden="true" className="mb-5 size-5 text-amber-300" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#83766a]">First adjustment</p>
          <p className="mt-3 text-sm font-medium leading-6 text-[#ece1d2]">{diagnosis.firstAdjustment}</p>
        </div>
        <div className="bg-[#120e0b] p-6 sm:p-7">
          <FlaskConical aria-hidden="true" className="mb-5 size-5 text-amber-300" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#83766a]">Why it may help</p>
          <p className="mt-3 text-sm leading-6 text-[#b8aa9a]">{diagnosis.whyItHelps}</p>
        </div>
        <div className="bg-[#120e0b] p-6 sm:p-7">
          <Eye aria-hidden="true" className="mb-5 size-5 text-amber-300" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#83766a]">Observe next time</p>
          <p className="mt-3 text-sm leading-6 text-[#b8aa9a]">{diagnosis.observeNext}</p>
        </div>
      </div>

      <div className="border-t border-white/[0.08] bg-amber-300/[0.025] p-6 sm:p-8">
        <div className="flex items-start gap-3 rounded-2xl border border-amber-300/10 bg-black/10 p-4">
          <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber-300" />
          <p className="text-sm leading-6 text-[#ad9e8f]"><span className="font-medium text-[#e6d9ca]">One variable at a time.</span> {diagnosis.principle}</p>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link className="button-primary flex-1" href={brewLabHref}>
            Build the adjusted recipe
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <button className="button-secondary flex-1" onClick={onRestart} type="button">
            <RotateCcw aria-hidden="true" className="size-4" />
            Diagnose another cup
          </button>
        </div>
      </div>
    </section>
  );
}
