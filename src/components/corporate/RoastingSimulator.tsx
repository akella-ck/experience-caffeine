"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Flame, Gauge, Pause, Play, RotateCcw, ShieldAlert, Wind, XOctagon } from "lucide-react";
import { roastProfiles } from "@/data/corporate";
import type { RoastCurvePoint, RoastSimulationEvent, RoastSimulationPhase } from "@/types";
import { OperationalNotice, OperationalPageIntro } from "./OperationalUI";
import { RoastCurveChart } from "./RoastCurveChart";

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function interpolate(points: RoastCurvePoint[], seconds: number) {
  const nextIndex = points.findIndex((point) => point.seconds >= seconds);
  const next = nextIndex < 0 ? points[points.length - 1] : points[nextIndex];
  const previous = nextIndex <= 0 ? points[0] : points[nextIndex - 1];
  if (!next || !previous) return { temperature: 0, rateOfRise: 0 };
  const duration = Math.max(1, next.seconds - previous.seconds);
  const progress = Math.max(0, Math.min(1, (seconds - previous.seconds) / duration));
  return {
    temperature: Math.round((previous.beanTemperatureC + (next.beanTemperatureC - previous.beanTemperatureC) * progress) * 10) / 10,
    rateOfRise: Math.round((previous.rateOfRiseCPerMinute + (next.rateOfRiseCPerMinute - previous.rateOfRiseCPerMinute) * progress) * 10) / 10,
  };
}

export function RoastingSimulator() {
  const [profileId, setProfileId] = useState(roastProfiles[0].id);
  const [phase, setPhase] = useState<RoastSimulationPhase>("ready");
  const [elapsed, setElapsed] = useState(0);
  const [speed, setSpeed] = useState(4);
  const [power, setPower] = useState(72);
  const [airflow, setAirflow] = useState(28);
  const [drum, setDrum] = useState(70);
  const [events, setEvents] = useState<RoastSimulationEvent[]>([]);
  const [note, setNote] = useState("");
  const profile = roastProfiles.find((candidate) => candidate.id === profileId) ?? roastProfiles[0];

  useEffect(() => {
    if (phase !== "roasting") return;
    const timer = window.setInterval(() => {
      setElapsed((current) => {
        const next = Math.min(profile.totalTimeSeconds, current + speed);
        if (next >= profile.totalTimeSeconds) {
          window.clearInterval(timer);
          setPhase("complete");
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase, profile.totalTimeSeconds, speed]);

  const telemetry = useMemo(() => interpolate(profile.curve, elapsed), [elapsed, profile.curve]);
  const progress = Math.min(100, (elapsed / profile.totalTimeSeconds) * 100);
  const nextMilestone = profile.curve.find((point) => point.seconds > elapsed && point.event);

  function logEvent(label: string, detail: string, kind: RoastSimulationEvent["kind"] = "operator") {
    setEvents((current) => [{ id: `${label}-${Date.now()}`, atSeconds: elapsed, label, detail, kind }, ...current]);
  }

  function reset() {
    setPhase("ready");
    setElapsed(0);
    setEvents([]);
    setPower(72);
    setAirflow(28);
    setDrum(70);
  }

  function changeProfile(nextId: string) {
    setProfileId(nextId);
    setPhase("ready");
    setElapsed(0);
    setEvents([]);
  }

  return (
    <div className="section-shell py-10 sm:py-14">
      <OperationalPageIntro
        description="Practice event logging and observe a reference curve without contacting a roaster, probe, or production control system."
        eyebrow="Roasting operations · Training sandbox"
        title="Roasting session simulator."
      />

      <div className="mt-6 rounded-[1.5rem] border-2 border-red-300/35 bg-[linear-gradient(135deg,rgba(127,29,29,.26),rgba(69,10,10,.14))] p-5 text-red-50 shadow-[0_0_45px_rgba(185,28,28,.09)]" role="status">
        <div className="flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-full border border-red-200/25 bg-red-200/10"><ShieldAlert className="size-5" /></span><div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-red-200">Simulation Mode — No equipment is being controlled</p><h2 className="mt-2 text-xl font-medium">No values or actions leave this browser.</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-red-100/75">This interface cannot start, stop, heat, cool, change airflow, change drum speed, or drop coffee on physical equipment. Always operate real roasters at the machine under trained supervision and manufacturer procedures.</p></div></div>
      </div>

      <div className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(0,1.25fr)_22rem]">
        <section aria-labelledby="simulation-console" className="glass-panel rounded-[2rem] p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <label className="block flex-1 text-xs text-[#b9ab9c]">Reference profile<select className="form-control mt-2" disabled={phase === "roasting"} onChange={(event) => changeProfile(event.target.value)} value={profileId}>{roastProfiles.map((item) => <option key={item.id} value={item.id}>{item.code} · {item.name}</option>)}</select></label>
            <label className="block text-xs text-[#b9ab9c]">Simulation speed<select className="form-control mt-2 min-w-32" onChange={(event) => setSpeed(Number(event.target.value))} value={speed}>{[1, 4, 12].map((value) => <option key={value} value={value}>{value}×</option>)}</select></label>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/15 p-4 sm:p-6">
            <div className="flex items-start justify-between gap-5"><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#8f8174]" id="simulation-console">Simulation clock</p><time className="mt-2 block font-mono text-5xl font-light tracking-[-0.07em] tabular-nums text-[#fff6e9] sm:text-6xl" dateTime={`PT${elapsed}S`}>{formatTime(elapsed)}</time></div><span aria-live="polite" className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] ${phase === "roasting" ? "border-amber-300/25 bg-amber-300/10 text-amber-200" : phase === "complete" ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200" : phase === "aborted" ? "border-red-300/20 bg-red-300/10 text-red-200" : "border-white/10 text-[#918477]"}`}>{phase}</span></div>
            <div aria-label="Roast simulation progress" aria-valuemax={100} aria-valuemin={0} aria-valuenow={Math.round(progress)} className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]" role="progressbar"><div className="h-full rounded-full bg-gradient-to-r from-[#9b5735] to-[#efb66c] transition-[width]" style={{ width: `${progress}%` }} /></div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[{ label: "Bean temp", value: `${telemetry.temperature}°C`, icon: Flame }, { label: "Rate of rise", value: `${telemetry.rateOfRise}°/min`, icon: Gauge }, { label: "Next event", value: nextMilestone?.event?.replace("-", " ") ?? "Complete", icon: AlertTriangle }, { label: "Target drop", value: formatTime(profile.totalTimeSeconds), icon: Gauge }].map(({ label, value, icon: Icon }) => <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3" key={label}><Icon className="mb-3 size-4 text-amber-300" /><p className="text-[9px] uppercase tracking-[0.14em] text-[#75695e]">{label}</p><p className="mt-1 truncate text-sm font-medium capitalize text-[#eadfd0]">{value}</p></div>)}
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              {[["Machine", profile.roasterModel], ["Coffee", profile.coffee], ["Batch", `${profile.batchSizeKg} kg`], ["Ambient", `${Math.round((23 + Math.sin(elapsed / 90) * 0.6) * 10) / 10}°C simulated`]].map(([label, value]) => <div className="rounded-xl border border-white/[0.06] p-3" key={label}><dt className="text-[9px] uppercase tracking-[0.13em] text-[#71655a]">{label}</dt><dd className="mt-1 truncate text-[#cfc1b1]">{value}</dd></div>)}
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              {phase === "roasting" ? <button className="button-primary" onClick={() => setPhase("paused")} type="button"><Pause className="size-4" /> Pause simulation</button> : <button className="button-primary" disabled={phase === "complete" || phase === "aborted"} onClick={() => { setPhase("roasting"); if (elapsed === 0) logEvent("Simulation started", profile.name, "system"); }} type="button"><Play className="size-4" /> {phase === "paused" ? "Continue" : "Start simulation"}</button>}
              <button className="button-secondary" onClick={reset} type="button"><RotateCcw className="size-4" /> Reset</button>
              <button className="button-quiet text-red-200" disabled={phase === "ready" || phase === "complete" || phase === "aborted"} onClick={() => { setPhase("aborted"); logEvent("Simulation ended", "Operator ended the local simulation.", "warning"); }} type="button"><XOctagon className="size-4" /> End simulation</button>
            </div>
          </div>

          <div className="mt-6"><RoastCurveChart compact profiles={[profile]} /></div>
        </section>

        <aside className="space-y-5">
          <section className="glass-panel rounded-[1.75rem] p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#c8955c]">Simulated operator inputs</p>
            <p className="mt-3 text-xs leading-5 text-[#8c7f72]">These sliders alter displayed session notes only. They are not linked to equipment or the reference telemetry curve.</p>
            {[{ label: "Power", value: power, setter: setPower, icon: Flame }, { label: "Airflow", value: airflow, setter: setAirflow, icon: Wind }, { label: "Drum", value: drum, setter: setDrum, icon: Gauge }].map(({ label, value, setter, icon: Icon }) => <label className="mt-5 block" key={label}><span className="flex items-center justify-between text-xs text-[#c7b8a8]"><span className="flex items-center gap-2"><Icon className="size-3.5 text-amber-300" />{label}</span><strong>{value}%</strong></span><input aria-label={`Simulated ${label.toLowerCase()} percentage`} className="mt-3 w-full accent-amber-400" max="100" min="0" onChange={(event) => setter(Number(event.target.value))} onPointerUp={() => logEvent(`${label} marker`, `${value}% simulated setting`)} type="range" value={value} /></label>)}
            <button className="button-secondary mt-6 w-full" onClick={() => logEvent("Operator note", `Power ${power}% · Airflow ${airflow}% · Drum ${drum}%`)} type="button">Mark simulated event</button>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="button-quiet !min-h-11 !rounded-xl !border-white/10 !px-2 text-[10px]" onClick={() => logEvent("Yellowing recorded", `${telemetry.temperature}°C`, "milestone")} type="button">Record yellowing</button>
              <button className="button-quiet !min-h-11 !rounded-xl !border-white/10 !px-2 text-[10px]" onClick={() => logEvent("First crack recorded", `${telemetry.temperature}°C`, "milestone")} type="button">Record first crack</button>
              <button className="button-quiet !min-h-11 !rounded-xl !border-white/10 !px-2 text-[10px]" onClick={() => { logEvent("Drop marked", `${telemetry.temperature}°C`, "milestone"); setPhase("complete"); }} type="button">Mark drop</button>
              <button className="button-quiet !min-h-11 !rounded-xl !border-white/10 !px-2 text-[10px]" onClick={() => logEvent("Cooling begun", "Simulation-only cooling marker", "milestone")} type="button">Begin cooling</button>
            </div>
            <label className="mt-4 block text-xs text-[#b9ab9c]">Operator note<textarea className="form-control mt-2 min-h-20" onChange={(event) => setNote(event.target.value)} placeholder="Observation for this simulated session…" value={note} /></label>
            <button className="button-secondary mt-2 w-full" disabled={!note.trim()} onClick={() => { logEvent("Operator note", note); setNote(""); }} type="button">Add note</button>
          </section>
          <section className="rounded-[1.75rem] border border-white/[0.08] bg-white/[0.025] p-5"><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#8b7e71]">Session log</p>{events.length === 0 ? <p className="mt-4 text-xs leading-5 text-[#75695e]">Start the simulation or mark an event to create a local log.</p> : <ol className="mt-4 max-h-72 space-y-3 overflow-y-auto scrollbar-subtle">{events.map((event) => <li className="border-l border-amber-300/20 pl-3" key={event.id}><p className="text-xs font-medium text-[#dfd2c3]">{formatTime(event.atSeconds)} · {event.label}</p><p className="mt-1 text-[10px] leading-4 text-[#7f7367]">{event.detail}</p></li>)}</ol>}</section>
          <OperationalNotice tone="neutral"><strong className="block text-[#d7c9ba]">Reference, not instruction</strong> Real roast decisions depend on machine behavior, batch condition, trained observation, and approved operating procedures.</OperationalNotice>
        </aside>
      </div>
    </div>
  );
}
