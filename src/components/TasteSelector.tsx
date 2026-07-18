"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CircleDashed,
  Droplets,
  Gauge,
  Layers,
  Minus,
  MoveDown,
  MoveUp,
  Sparkles,
  Waves,
  Zap,
} from "lucide-react";
import { brewMethods } from "@/data";
import { diagnoseBrew } from "@/lib/troubleshooting";
import type {
  BrewDiagnosis,
  BrewMethodId,
  BrewSpeed,
  CoffeeFreshness,
  RoastLevel,
  TasteProblem,
} from "@/types";
import { TroubleshootingResult } from "@/components/TroubleshootingResult";

const tasteOptions: Array<{
  value: TasteProblem;
  label: string;
  description: string;
  icon: typeof Zap;
}> = [
  { value: "sour", label: "Sour", description: "Sharp, puckering, or lemon-like", icon: Zap },
  { value: "bitter", label: "Bitter", description: "Harsh, burnt, or lingering", icon: Waves },
  { value: "weak", label: "Weak", description: "Watery with little presence", icon: Droplets },
  { value: "too-strong", label: "Too strong", description: "Heavy or overly concentrated", icon: Layers },
  { value: "dry", label: "Dry", description: "Astringent, tea-bag sensation", icon: MoveDown },
  { value: "hollow", label: "Hollow", description: "Flavor at the edges, empty center", icon: CircleDashed },
  { value: "flat", label: "Flat", description: "Muted aroma and little liveliness", icon: Minus },
];

const speedOptions: Array<{ value: BrewSpeed; label: string; detail: string; icon: typeof Gauge }> = [
  { value: "faster", label: "Faster", detail: "Finished before the recipe window", icon: MoveUp },
  { value: "as-expected", label: "As expected", detail: "Finished inside the target window", icon: Gauge },
  { value: "slower", label: "Slower", detail: "Finished after the recipe window", icon: MoveDown },
];

const roastOptions: Array<{ value: RoastLevel; label: string }> = [
  { value: "light", label: "Light" },
  { value: "medium", label: "Medium" },
  { value: "medium-dark", label: "Medium-dark" },
  { value: "dark", label: "Dark" },
];

const freshnessOptions: Array<{ value: CoffeeFreshness; label: string; detail: string }> = [
  { value: "fresh", label: "Fresh", detail: "Known recent roast date" },
  { value: "unknown", label: "Unsure", detail: "Roast date unknown" },
  { value: "stale", label: "Possibly stale", detail: "Old or poorly sealed" },
];

const questionLabels = ["Taste", "Brew speed", "Method", "Roast"];

type TasteSelectorStateProps = {
  searchParams: ReturnType<typeof useSearchParams>;
};

export function TasteSelector() {
  const searchParams = useSearchParams();
  return <TasteSelectorState key={searchParams.toString()} searchParams={searchParams} />;
}

function TasteSelectorState({ searchParams }: TasteSelectorStateProps) {
  const initialMethod = brewMethods.find((method) => method.id === searchParams.get("method"))?.id ?? null;
  const initialRoast = roastOptions.find((roast) => roast.value === searchParams.get("roast"))?.value ?? null;
  const initialTaste = tasteOptions.find((option) => option.value === searchParams.get("taste"))?.value ?? null;
  const [questionIndex, setQuestionIndex] = useState(initialTaste ? 1 : 0);
  const [taste, setTaste] = useState<TasteProblem | null>(initialTaste);
  const [speed, setSpeed] = useState<BrewSpeed | null>(null);
  const [brewMethodId, setBrewMethodId] = useState<BrewMethodId | null>(initialMethod);
  const [roastLevel, setRoastLevel] = useState<RoastLevel | null>(initialRoast);
  const [freshness, setFreshness] = useState<CoffeeFreshness>("unknown");
  const [diagnosis, setDiagnosis] = useState<BrewDiagnosis | null>(null);

  const canContinue = [Boolean(taste), Boolean(speed), Boolean(brewMethodId), Boolean(roastLevel)][questionIndex];

  function continueFlow() {
    if (!canContinue) return;
    if (questionIndex < questionLabels.length - 1) {
      setQuestionIndex((current) => current + 1);
      return;
    }
    if (!taste || !speed || !brewMethodId || !roastLevel) return;
    setDiagnosis(diagnoseBrew({ taste, speed, brewMethodId, roastLevel, freshness }));
  }

  function restart() {
    setQuestionIndex(0);
    setTaste(null);
    setSpeed(null);
    setBrewMethodId(initialMethod);
    setRoastLevel(initialRoast);
    setFreshness("unknown");
    setDiagnosis(null);
  }

  return (
    <div className="relative overflow-hidden pb-24 pt-28 sm:pt-32">
      <div className="ambient-grid pointer-events-none absolute inset-x-0 top-0 h-[48rem] opacity-70" />
      <div className="pointer-events-none absolute right-[8%] top-28 size-80 rounded-full bg-[#a75f2c]/10 blur-[110px]" />

      <div className="section-shell relative">
        <div className="mx-auto mb-10 max-w-4xl text-center sm:mb-14">
          <p className="eyebrow justify-center before:hidden">Sensory diagnostic · 04 signals</p>
          <h1 className="page-title mt-5">Read what the <span className="editorial-title amber-text">cup</span> is telling you.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-[#b8aa99] sm:text-lg">
            Describe one brew. We’ll identify the most likely cause and suggest one controlled adjustment for the next cup.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          {diagnosis ? (
            <TroubleshootingResult
              brewMethodId={brewMethodId}
              diagnosis={diagnosis}
              onRestart={restart}
              roastLevel={roastLevel}
            />
          ) : (
            <section aria-labelledby="question-title" className="glass-panel overflow-hidden rounded-[2rem]">
              <p aria-live="polite" className="sr-only">
                Question {questionIndex + 1} of {questionLabels.length}: {questionLabels[questionIndex]}
              </p>
              <div className="border-b border-white/[0.08] px-5 py-5 sm:px-8">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9c8e80]">
                    Question {questionIndex + 1} / {questionLabels.length}
                  </p>
                  <p className="text-[10px] text-[#75695f]">Change one major variable next</p>
                </div>
                <div aria-hidden="true" className="mt-4 grid grid-cols-4 gap-2">
                  {questionLabels.map((label, index) => (
                    <div key={label}>
                      <div className={`h-0.5 rounded-full transition-colors ${index <= questionIndex ? "bg-amber-300" : "bg-white/[0.08]"}`} />
                      <p className={`mt-2 hidden text-[9px] uppercase tracking-wider sm:block ${index === questionIndex ? "text-[#d7b07f]" : "text-[#5f554d]"}`}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="min-h-[31rem] p-5 sm:p-8 lg:p-10">
                {questionIndex === 0 ? (
                  <fieldset>
                    <legend className="text-balance text-2xl font-medium tracking-[-0.035em] text-[#fff7eb] sm:text-3xl" id="question-title">
                      What did the coffee taste like?
                    </legend>
                    <p className="mt-3 text-sm leading-6 text-[#958779]">Choose the strongest problem, even if more than one applies.</p>
                    <div className="mt-7 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {tasteOptions.map(({ value, label, description, icon: Icon }) => (
                        <button
                          aria-pressed={taste === value}
                          className={`group min-h-28 rounded-2xl border p-4 text-left transition ${taste === value ? "border-amber-300/45 bg-amber-300/10" : "border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.035]"}`}
                          key={value}
                          onClick={() => setTaste(value)}
                          type="button"
                        >
                          <Icon aria-hidden="true" className={`mb-4 size-4 ${taste === value ? "text-amber-200" : "text-[#89796c] group-hover:text-[#c79b68]"}`} />
                          <span className="block text-sm font-medium text-[#eee4d7]">{label}</span>
                          <span className="mt-1 block text-xs leading-5 text-[#85786c]">{description}</span>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                ) : null}

                {questionIndex === 1 ? (
                  <fieldset>
                    <legend className="text-balance text-2xl font-medium tracking-[-0.035em] text-[#fff7eb] sm:text-3xl" id="question-title">
                      Was the brew faster or slower than expected?
                    </legend>
                    <p className="mt-3 text-sm leading-6 text-[#958779]">Compare total brew or drawdown time with the recipe’s target range.</p>
                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                      {speedOptions.map(({ value, label, detail, icon: Icon }) => (
                        <button
                          aria-pressed={speed === value}
                          className={`min-h-40 rounded-2xl border p-5 text-left transition ${speed === value ? "border-amber-300/45 bg-amber-300/10" : "border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.035]"}`}
                          key={value}
                          onClick={() => setSpeed(value)}
                          type="button"
                        >
                          <Icon aria-hidden="true" className={`mb-7 size-5 ${speed === value ? "text-amber-200" : "text-[#89796c]"}`} />
                          <span className="block text-base font-medium text-[#eee4d7]">{label}</span>
                          <span className="mt-2 block text-xs leading-5 text-[#85786c]">{detail}</span>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                ) : null}

                {questionIndex === 2 ? (
                  <fieldset>
                    <legend className="text-balance text-2xl font-medium tracking-[-0.035em] text-[#fff7eb] sm:text-3xl" id="question-title">
                      Which brewing method did you use?
                    </legend>
                    <p className="mt-3 text-sm leading-6 text-[#958779]">Method changes how brew time and resistance should be interpreted.</p>
                    <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {brewMethods.map((method) => (
                        <button
                          aria-pressed={brewMethodId === method.id}
                          className={`min-h-24 rounded-2xl border p-4 text-left transition ${brewMethodId === method.id ? "border-amber-300/45 bg-amber-300/10 text-[#fff1df]" : "border-white/[0.07] bg-white/[0.02] text-[#9c8f81] hover:border-white/15 hover:text-[#e2d7c8]"}`}
                          key={method.id}
                          onClick={() => setBrewMethodId(method.id)}
                          type="button"
                        >
                          <span className="font-mono text-[9px] uppercase tracking-[0.14em] opacity-50">{method.category}</span>
                          <span className="mt-3 block text-sm font-medium">{method.name}</span>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                ) : null}

                {questionIndex === 3 ? (
                  <fieldset>
                    <legend className="text-balance text-2xl font-medium tracking-[-0.035em] text-[#fff7eb] sm:text-3xl" id="question-title">
                      Which roast level did you use?
                    </legend>
                    <p className="mt-3 text-sm leading-6 text-[#958779]">Roast development changes solubility and the useful temperature range.</p>
                    <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {roastOptions.map((option, index) => (
                        <button
                          aria-pressed={roastLevel === option.value}
                          className={`relative min-h-28 overflow-hidden rounded-2xl border p-4 text-left transition ${roastLevel === option.value ? "border-amber-300/45 bg-amber-300/10" : "border-white/[0.07] bg-white/[0.02] hover:border-white/15"}`}
                          key={option.value}
                          onClick={() => setRoastLevel(option.value)}
                          type="button"
                        >
                          <span
                            aria-hidden="true"
                            className="mb-5 block size-8 rounded-full border border-white/10 shadow-[inset_-5px_-5px_9px_rgba(0,0,0,.35)]"
                            style={{ backgroundColor: ["#a9683e", "#87502f", "#63351f", "#3b2016"][index] }}
                          />
                          <span className="text-sm font-medium text-[#eee4d7]">{option.label}</span>
                        </button>
                      ))}
                    </div>

                    {taste === "flat" ? (
                      <div className="mt-7 border-t border-white/[0.08] pt-6">
                        <p className="flex items-center gap-2 text-sm font-medium text-[#e6dbcd]"><Sparkles aria-hidden="true" className="size-4 text-amber-300" /> How fresh is the coffee?</p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-3">
                          {freshnessOptions.map((option) => (
                            <button
                              aria-pressed={freshness === option.value}
                              className={`rounded-xl border p-3 text-left ${freshness === option.value ? "border-amber-300/35 bg-amber-300/[0.08]" : "border-white/[0.07]"}`}
                              key={option.value}
                              onClick={() => setFreshness(option.value)}
                              type="button"
                            >
                              <span className="block text-xs font-medium text-[#e4d8c9]">{option.label}</span>
                              <span className="mt-1 block text-[10px] text-[#817468]">{option.detail}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </fieldset>
                ) : null}
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-white/[0.08] bg-black/10 p-5 sm:px-8">
                <button
                  className="button-quiet !px-2 disabled:cursor-not-allowed disabled:opacity-30"
                  disabled={questionIndex === 0}
                  onClick={() => setQuestionIndex((current) => Math.max(0, current - 1))}
                  type="button"
                >
                  <ArrowLeft aria-hidden="true" className="size-4" />
                  Back
                </button>
                <button className="button-primary min-w-36 disabled:cursor-not-allowed disabled:opacity-40" disabled={!canContinue} onClick={continueFlow} type="button">
                  {questionIndex === questionLabels.length - 1 ? "See diagnosis" : "Continue"}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
