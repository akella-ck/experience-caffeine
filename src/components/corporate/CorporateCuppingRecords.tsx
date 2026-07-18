"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Check, ClipboardPlus, Coffee, X } from "lucide-react";
import type { CuppingRecord } from "@/data/corporate";
import { CorporatePanel, CorporateSectionTitle } from "@/components/corporate/CorporateUI";

type CorporateCuppingRecordsProps = {
  initialRecords: readonly CuppingRecord[];
  openCapture?: boolean;
};

export function CorporateCuppingRecords({
  initialRecords,
  openCapture = false,
}: CorporateCuppingRecordsProps) {
  const searchParams = useSearchParams();
  const [records, setRecords] = useState<CuppingRecord[]>(() =>
    initialRecords.map((record) => ({ ...record })),
  );
  const [captureOpen, setCaptureOpen] = useState(
    openCapture || searchParams.get("record") === "cupping",
  );
  const [status, setStatus] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const score = Number(data.get("score"));
    const next: CuppingRecord = {
      id: `cupping-local-${Date.now()}`,
      coffee: String(data.get("coffee") ?? "").trim(),
      batchCode: String(data.get("batchCode") ?? "").trim(),
      roastProfile: String(data.get("roastProfile") ?? "").trim(),
      location: String(data.get("location") ?? "").trim(),
      panel: "Current reviewer · session-only",
      score,
      status: "Draft",
      notes: String(data.get("notes") ?? "").trim(),
      cuppedAt: "This session · just now",
    };

    setRecords((current) => [next, ...current]);
    setStatus(`${next.coffee} was added as a local draft. No data was transmitted.`);
    form.reset();
    setCaptureOpen(false);
  }

  return (
    <section id="record-cupping" className="scroll-mt-28">
      <CorporateSectionTitle
        eyebrow="Cupping records"
        title="Keep sensory evidence beside the batch decision"
        description="Scores are illustrative internal records, not live quality data or third-party certification. The capture below remains in this page session only."
        action={captureOpen ? undefined : (
          <button className="button-primary" onClick={() => setCaptureOpen(true)} type="button">
            <ClipboardPlus className="h-4 w-4" aria-hidden="true" /> Record mock cupping
          </button>
        )}
      />

      <p aria-live="polite" className="mt-4 min-h-5 text-xs text-emerald-200/70">{status}</p>

      {captureOpen ? (
        <CorporatePanel className="mt-3 p-5 sm:p-7">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-amber-300/65">Session-only capture</p>
              <h3 className="mt-2 text-xl font-medium text-[#eadcc9]">Add a mock cupping record</h3>
              <p className="mt-2 max-w-2xl text-xs leading-5 text-[#887c70]">This form demonstrates the record shape. It does not approve a batch, notify a team, or persist after refresh.</p>
            </div>
            <button aria-label="Close cupping record form" className="grid size-11 shrink-0 place-items-center rounded-full border border-white/[0.08] text-[#95887b] hover:bg-white/[0.04]" onClick={() => setCaptureOpen(false)} type="button">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <form className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" onSubmit={submit}>
            <label className="block text-xs font-medium text-[#d4c6b5]" htmlFor="cupping-coffee">Coffee
              <input autoFocus className="form-control mt-2" id="cupping-coffee" name="coffee" placeholder="Coffee or lot name" required />
            </label>
            <label className="block text-xs font-medium text-[#d4c6b5]" htmlFor="cupping-batch">Batch code
              <input className="form-control mt-2" id="cupping-batch" name="batchCode" placeholder="B-0248" required />
            </label>
            <label className="block text-xs font-medium text-[#d4c6b5]" htmlFor="cupping-profile">Roast profile
              <input className="form-control mt-2" id="cupping-profile" name="roastProfile" placeholder="Profile name and version" required />
            </label>
            <label className="block text-xs font-medium text-[#d4c6b5]" htmlFor="cupping-location">Location
              <select className="form-control mt-2" defaultValue="North Roastery" id="cupping-location" name="location">
                <option>North Roastery</option>
                <option>Training Lab</option>
                <option>South Market</option>
                <option>Harbor Point</option>
                <option>Union Hall</option>
              </select>
            </label>
            <label className="block text-xs font-medium text-[#d4c6b5]" htmlFor="cupping-score">Internal score
              <input className="form-control mt-2" id="cupping-score" max="100" min="0" name="score" placeholder="86.5" required step="0.1" type="number" />
            </label>
            <label className="block text-xs font-medium text-[#d4c6b5] sm:col-span-2 lg:col-span-3" htmlFor="cupping-notes">Sensory notes
              <textarea className="form-control mt-2 min-h-24 resize-y" id="cupping-notes" name="notes" placeholder="Record aroma, flavor, finish, and any uncertainty…" required />
            </label>
            <div className="sm:col-span-2 lg:col-span-3">
              <button className="button-primary" type="submit"><Check className="h-4 w-4" aria-hidden="true" /> Save local draft</button>
            </div>
          </form>
        </CorporatePanel>
      ) : null}

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {records.map((record) => (
          <CorporatePanel className="flex h-full flex-col p-5" key={record.id}>
            <div className="flex items-start justify-between gap-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-amber-300/12 bg-amber-300/[0.05]"><Coffee className="h-4 w-4 text-amber-300/70" aria-hidden="true" /></span>
              <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-2.5 py-1 text-[0.58rem] text-[#94877a]">{record.status}</span>
            </div>
            <p className="mt-6 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#74695e]">{record.batchCode} · {record.cuppedAt}</p>
            <h3 className="mt-2 text-lg font-medium text-[#e7dac8]">{record.coffee}</h3>
            <p className="mt-1 text-xs text-[#817568]">{record.roastProfile}</p>
            <p className="mt-5 text-sm leading-6 text-[#a99c8d]">{record.notes}</p>
            <dl className="mt-auto grid grid-cols-[1fr_auto] gap-3 border-t border-white/[0.07] pt-5 text-xs">
              <div><dt className="text-[0.56rem] uppercase tracking-[0.12em] text-[#6e645a]">Panel</dt><dd className="mt-1 text-[#9b8e81]">{record.panel}</dd></div>
              <div className="text-right"><dt className="text-[0.56rem] uppercase tracking-[0.12em] text-[#6e645a]">Score</dt><dd className="mt-1 font-mono text-xl text-[#edc088]">{record.score.toFixed(1)}</dd></div>
            </dl>
          </CorporatePanel>
        ))}
      </div>
    </section>
  );
}
