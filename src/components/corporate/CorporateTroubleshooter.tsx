"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, ClipboardCheck, RotateCcw, Save, Search } from "lucide-react";
import { diagnoseCorporateIssue } from "@/lib/corporate/troubleshooting";
import type {
  CorporateRecentChange,
  CorporateTroubleScope,
  CorporateTroubleSymptom,
  CorporateTroubleTiming,
  CorporateTroubleshootingInput,
  CorporateTroubleshootingResult,
  SavedCorporateTroubleshootingRecord,
} from "@/types";
import { OperationalField, OperationalNotice, OperationalPageIntro } from "./OperationalUI";

const symptoms: Array<{ value: CorporateTroubleSymptom; label: string }> = [
  { value: "sour", label: "Sour" }, { value: "bitter", label: "Bitter" }, { value: "hollow", label: "Hollow" }, { value: "flat", label: "Flat" }, { value: "weak", label: "Weak" }, { value: "harsh", label: "Harsh" }, { value: "dry", label: "Dry" }, { value: "astringent", label: "Astringent" }, { value: "smoky", label: "Smoky" }, { value: "baked", label: "Baked" }, { value: "scorched", label: "Scorched" }, { value: "underdeveloped", label: "Underdeveloped" }, { value: "inconsistent-shots", label: "Inconsistent between shots" }, { value: "slow-drawdown", label: "Slow drawdown" }, { value: "fast-drawdown", label: "Fast drawdown" },
];
const timingOptions: Array<{ value: CorporateTroubleTiming; label: string }> = [{ value: "faster", label: "Faster than target" }, { value: "on-target", label: "Inside target" }, { value: "slower", label: "Slower than target" }, { value: "variable", label: "Variable" }, { value: "not-measured", label: "Not measured" }];
const scopeOptions: Array<{ value: CorporateTroubleScope; label: string }> = [{ value: "single-cup", label: "Single cup" }, { value: "station", label: "Station" }, { value: "location", label: "Location" }, { value: "batch", label: "Coffee batch" }];
const changeOptions: Array<{ value: CorporateRecentChange; label: string }> = [{ value: "none", label: "None known" }, { value: "coffee", label: "Coffee" }, { value: "grinder", label: "Grinder" }, { value: "water", label: "Water" }, { value: "recipe", label: "Recipe" }, { value: "equipment", label: "Equipment" }];
const steps = ["Signal", "Brew context", "Operating context"];

const initialInput: CorporateTroubleshootingInput = {
  symptom: "sour",
  timing: "not-measured",
  scope: "single-cup",
  recentChanges: ["none"],
  method: "V60",
  coffeeId: "",
  coffeeName: "",
  roastDate: "",
  roastProfileId: "",
  grinder: "",
  grindSetting: "",
  doseGrams: undefined,
  waterGrams: undefined,
  yieldGrams: undefined,
  brewTimeSeconds: undefined,
  temperatureCelsius: undefined,
  waterProfile: "",
  machine: "",
  location: "North Roastery",
  shift: "",
  notes: "",
};

export function CorporateTroubleshooter() {
  const [input, setInput] = useState<CorporateTroubleshootingInput>(initialInput);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<CorporateTroubleshootingResult | null>(null);
  const [records, setRecords] = useState<SavedCorporateTroubleshootingRecord[]>([]);
  const [saved, setSaved] = useState(false);
  const stepPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step === 0) return;
    const heading = stepPanelRef.current?.querySelector("h2");
    heading?.setAttribute("tabindex", "-1");
    heading?.focus();
  }, [step]);

  function update<K extends keyof CorporateTroubleshootingInput>(field: K, value: CorporateTroubleshootingInput[K]) {
    setInput((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }

  function toggleChange(value: CorporateRecentChange) {
    setInput((current) => {
      if (value === "none") return { ...current, recentChanges: ["none"] };
      const withoutNone = current.recentChanges.filter((change) => change !== "none");
      return { ...current, recentChanges: withoutNone.includes(value) ? withoutNone.filter((change) => change !== value) : [...withoutNone, value] };
    });
  }

  function generate() {
    setResult(diagnoseCorporateIssue(input));
    setSaved(false);
  }

  function saveRecord() {
    if (!result || saved) return;
    const record: SavedCorporateTroubleshootingRecord = { id: `issue-${Date.now()}`, createdAt: new Date().toISOString(), input: { ...input, recentChanges: [...input.recentChanges] }, result: { ...result, possibleCauses: [...result.possibleCauses], evidenceToCapture: [...result.evidenceToCapture], whatToMeasureNext: [...result.whatToMeasureNext] }, status: "open" };
    setRecords((current) => [record, ...current]);
    setSaved(true);
  }

  function reset() {
    setInput(initialInput);
    setStep(0);
    setResult(null);
    setSaved(false);
  }

  return (
    <div className="section-shell py-10 sm:py-14">
      <OperationalPageIntro description="Capture enough operating context to produce a deterministic, uncertainty-aware first check. Guidance changes one major variable at a time and never replaces equipment, safety, or quality-release procedures." eyebrow="Quality operations · Controlled diagnosis" title="Troubleshoot the system, not only the symptom." />

      <div className="mt-7 grid items-start gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(21rem,.9fr)]">
        <section className="glass-panel overflow-hidden rounded-[2rem]">
          <div className="border-b border-white/[0.08] p-5 sm:px-7"><p aria-live="polite" className="sr-only">Step {step + 1} of {steps.length}: {steps[step]}</p><div className="grid grid-cols-3 gap-2">{steps.map((label, index) => <button aria-current={step === index ? "step" : undefined} className={`rounded-xl border px-3 py-3 text-left ${step === index ? "border-amber-300/25 bg-amber-300/[0.08] text-amber-100" : "border-white/[0.06] text-[#a89a8b]"}`} key={label} onClick={() => setStep(index)} type="button"><span className="block font-mono text-[9px]">0{index + 1}</span><span className="mt-1 block text-xs">{label}</span></button>)}</div></div>
          <div ref={stepPanelRef} className="min-h-[34rem] p-5 sm:p-7">
            {step === 0 ? <div><h2 className="text-2xl font-medium tracking-[-0.035em]">What is the strongest observable symptom?</h2><p className="mt-2 text-sm text-[#8f8174]">Choose one primary signal so the first action remains interpretable.</p><div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">{symptoms.map((symptom) => <button aria-pressed={input.symptom === symptom.value} className={`min-h-16 rounded-xl border p-3 text-left text-xs ${input.symptom === symptom.value ? "border-amber-300/35 bg-amber-300/[0.09] text-amber-100" : "border-white/[0.07] bg-white/[0.02] text-[#a99b8c]"}`} key={symptom.value} onClick={() => update("symptom", symptom.value)} type="button">{symptom.label}</button>)}</div><div className="mt-6 grid gap-5 sm:grid-cols-2"><OperationalField label="Timing or drawdown"><select className="form-control" onChange={(event) => update("timing", event.target.value as CorporateTroubleTiming)} value={input.timing}>{timingOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></OperationalField><OperationalField label="Observed scope"><select className="form-control" onChange={(event) => update("scope", event.target.value as CorporateTroubleScope)} value={input.scope}>{scopeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></OperationalField></div></div> : null}

            {step === 1 ? <div><h2 className="text-2xl font-medium tracking-[-0.035em]">Record the coffee and brew.</h2><p className="mt-2 text-sm text-[#8f8174]">Unknown fields can remain blank; confidence will reflect missing measurements.</p><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><OperationalField label="Method"><input className="form-control" onChange={(event) => update("method", event.target.value)} value={input.method} /></OperationalField><OperationalField label="Coffee ID"><input className="form-control" onChange={(event) => update("coffeeId", event.target.value)} value={input.coffeeId ?? ""} /></OperationalField><OperationalField label="Coffee name"><input className="form-control" onChange={(event) => update("coffeeName", event.target.value)} value={input.coffeeName ?? ""} /></OperationalField><OperationalField label="Roast date"><input className="form-control" onChange={(event) => update("roastDate", event.target.value)} type="date" value={input.roastDate ?? ""} /></OperationalField><OperationalField label="Roast profile ID"><input className="form-control" onChange={(event) => update("roastProfileId", event.target.value)} value={input.roastProfileId ?? ""} /></OperationalField><OperationalField label="Grinder"><input className="form-control" onChange={(event) => update("grinder", event.target.value)} value={input.grinder ?? ""} /></OperationalField><OperationalField label="Grind setting"><input className="form-control" onChange={(event) => update("grindSetting", event.target.value)} value={input.grindSetting ?? ""} /></OperationalField>{([ ["Dose", "doseGrams"], ["Water", "waterGrams"], ["Yield", "yieldGrams"], ["Brew time", "brewTimeSeconds"], ["Temperature", "temperatureCelsius"] ] as const).map(([label, field]) => <OperationalField hint={field === "temperatureCelsius" ? "°C" : field === "brewTimeSeconds" ? "seconds" : "grams"} key={field} label={label}><input className="form-control" min="0" onChange={(event) => update(field, event.target.value === "" ? undefined : Number(event.target.value))} type="number" value={input[field] ?? ""} /></OperationalField>)}</div></div> : null}

            {step === 2 ? <div><h2 className="text-2xl font-medium tracking-[-0.035em]">Add operating context.</h2><p className="mt-2 text-sm text-[#8f8174]">This helps distinguish a coffee issue from a location, machine, or process pattern.</p><div className="mt-6 grid gap-5 sm:grid-cols-2"><OperationalField label="Location"><input className="form-control" onChange={(event) => update("location", event.target.value)} value={input.location} /></OperationalField><OperationalField label="Shift"><input className="form-control" onChange={(event) => update("shift", event.target.value)} placeholder="Opening · midday · closing" value={input.shift ?? ""} /></OperationalField><OperationalField label="Machine"><input className="form-control" onChange={(event) => update("machine", event.target.value)} value={input.machine ?? ""} /></OperationalField><OperationalField label="Water profile"><input className="form-control" onChange={(event) => update("waterProfile", event.target.value)} value={input.waterProfile ?? ""} /></OperationalField></div><fieldset className="mt-6"><legend className="text-xs font-medium text-[#d8cbbb]">Recent changes</legend><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{changeOptions.map((option) => <button aria-pressed={input.recentChanges.includes(option.value)} className={`rounded-xl border p-3 text-left text-xs ${input.recentChanges.includes(option.value) ? "border-amber-300/30 bg-amber-300/[0.08] text-amber-100" : "border-white/[0.07] text-[#9a8c7e]"}`} key={option.value} onClick={() => toggleChange(option.value)} type="button">{option.label}</button>)}</div></fieldset><div className="mt-6"><OperationalField hint="Optional" label="Observations"><textarea className="form-control min-h-28" onChange={(event) => update("notes", event.target.value)} value={input.notes} /></OperationalField></div></div> : null}
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-white/[0.08] p-5 sm:px-7"><button className="button-quiet !px-2" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))} type="button"><ArrowLeft className="size-4" /> Back</button>{step < 2 ? <button className="button-primary" onClick={() => setStep((current) => Math.min(2, current + 1))} type="button">Continue <ArrowRight className="size-4" /></button> : <button className="button-primary" disabled={!input.method.trim() || !input.location.trim()} onClick={generate} type="button"><Search className="size-4" /> Generate assessment</button>}</div>
        </section>

        <aside className="space-y-5 xl:sticky xl:top-24">
          {result ? <section aria-live="polite" className={`overflow-hidden rounded-[2rem] border ${result.severity === "hold" ? "border-red-300/25 bg-red-300/[0.045]" : "border-amber-300/18 bg-amber-300/[0.035]"}`}><div className="border-b border-white/[0.08] p-5 sm:p-6"><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-amber-200/70">Deterministic assessment · {result.confidence} confidence</p><h2 className="mt-3 text-2xl font-medium tracking-[-0.035em]">Inspect {result.inspectionTarget} first.</h2></div>{result.severity === "hold" ? <AlertTriangle className="size-5 text-red-200" /> : <ClipboardCheck className="size-5 text-amber-200" />}</div><p className="mt-4 text-sm leading-6 text-[#b9aa9b]">{result.likelyCause}</p></div><div className="space-y-5 p-5 sm:p-6"><div><p className="text-[9px] uppercase tracking-[0.15em] text-[#827569]">Possible causes</p><ul className="mt-2 space-y-2 text-xs leading-5 text-[#b6a899]">{result.possibleCauses.map((cause) => <li className="flex gap-2" key={cause}><span className="text-amber-300">•</span>{cause}</li>)}</ul></div><div className="rounded-xl border border-amber-300/15 bg-amber-300/[0.05] p-4"><p className="text-[9px] uppercase tracking-[0.15em] text-amber-200/60">First variable or check</p><p className="mt-2 text-sm font-medium text-[#ebddca]">{result.firstVariableToChange}</p><p className="mt-2 text-xs leading-5 text-[#aa9c8d]">{result.firstAction}</p></div><div><p className="text-[9px] uppercase tracking-[0.15em] text-[#827569]">Why</p><p className="mt-2 text-xs leading-5 text-[#b6a899]">{result.why}</p></div><div><p className="text-[9px] uppercase tracking-[0.15em] text-[#827569]">Measure next</p><ul className="mt-2 space-y-2 text-xs leading-5 text-[#b6a899]">{result.whatToMeasureNext.map((measure) => <li className="flex gap-2" key={measure}><Check className="mt-0.5 size-3.5 shrink-0 text-amber-300" />{measure}</li>)}</ul></div><OperationalNotice tone={result.severity === "hold" ? "red" : "neutral"}>{result.containment}<br />{result.escalationRecommendation}</OperationalNotice><p className="text-[10px] leading-5 text-[#776b5f]">{result.safetyNote}</p><div className="grid gap-2 sm:grid-cols-2"><button className="button-primary" disabled={saved} onClick={saveRecord} type="button"><Save className="size-4" /> {saved ? "Saved locally" : "Save local record"}</button><button className="button-secondary" onClick={reset} type="button"><RotateCcw className="size-4" /> New diagnosis</button></div></div></section> : <OperationalNotice tone="neutral"><strong className="block text-[#d5c8b8]">Assessment waits for context</strong>Complete the three short sections. Unknown measurements can remain blank; the result will use moderate-confidence language.</OperationalNotice>}
          {records.length > 0 ? <section className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.025] p-5"><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#887b6f]">Saved this session · {records.length}</p><ol className="mt-4 space-y-3">{records.slice(0, 4).map((record) => <li className="rounded-xl border border-white/[0.06] p-3" key={record.id}><p className="text-xs font-medium capitalize text-[#d9ccbd]">{record.input.symptom.replaceAll("-", " ")} · {record.input.location}</p><p className="mt-1 text-[10px] text-[#75695f]">{record.result.inspectionTarget} inspection · {record.status}</p></li>)}</ol></section> : null}
        </aside>
      </div>
    </div>
  );
}
