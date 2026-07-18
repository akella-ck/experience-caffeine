"use client";

import { CheckCircle2, CircleAlert } from "lucide-react";
import { useState } from "react";
import type { CorporateLessonDetail } from "@/data/corporate";

export function CorporateKnowledgeCheck({ check }: { check: CorporateLessonDetail["knowledgeCheck"] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const correct = selected === check.correctIndex;

  return (
    <fieldset>
      <legend className="text-base font-medium leading-7 text-[#e9dcc8]">{check.question}</legend>
      <div className="mt-5 space-y-2">
        {check.options.map((option, index) => (
          <label key={option} className={`relative flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-xl border p-4 text-left text-sm leading-6 transition focus-within:ring-2 focus-within:ring-amber-300/70 ${selected === index ? "border-amber-300/35 bg-amber-300/[0.07] text-[#eddfcc]" : "border-white/[0.07] bg-black/10 text-[#b2a596] hover:border-white/[0.14]"}`}>
            <input className="peer sr-only" checked={selected === index} name="corporate-knowledge-check" onChange={() => { setSelected(index); setSubmitted(false); }} type="radio" value={index} />
            <span aria-hidden="true" className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${selected === index ? "border-amber-300 bg-amber-300" : "border-white/[0.2]"}`}>{selected === index ? <span className="h-1.5 w-1.5 rounded-full bg-[#24150b]" /> : null}</span>{option}
          </label>
        ))}
      </div>
      <button type="button" disabled={selected === null} onClick={() => setSubmitted(true)} className="button-secondary mt-5 disabled:cursor-not-allowed disabled:opacity-40">Check answer</button>
      {submitted ? (
        <div className={`mt-5 flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${correct ? "border-emerald-300/15 bg-emerald-300/[0.045] text-[#b9c6b0]" : "border-amber-300/15 bg-amber-300/[0.045] text-[#b9ab98]"}`} role="status">
          {correct ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200/75" aria-hidden="true" /> : <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-300/75" aria-hidden="true" />}
          <p><strong className="text-[#e6dbc9]">{correct ? "Correct." : "Not quite."}</strong> {check.explanation}</p>
        </div>
      ) : null}
    </fieldset>
  );
}
