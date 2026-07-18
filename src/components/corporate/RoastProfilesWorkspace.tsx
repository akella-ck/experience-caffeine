"use client";

import { useMemo, useRef, useState } from "react";
import { Archive, Check, Copy, GitCompareArrows, Pencil, Plus, Search, X } from "lucide-react";
import { roastProfiles as initialProfiles } from "@/data/corporate";
import { buildReferenceCurve, calculateDevelopmentRatio, validateRoastProfile } from "@/lib/corporate/roast-profile";
import { useAccessibleDialog } from "@/hooks/use-accessible-dialog";
import type { OperationalStatus, RoastProfile } from "@/types";
import { OperationalField, OperationalNotice, OperationalPageIntro, OperationalStatusBadge } from "./OperationalUI";
import { RoastCurveChart } from "./RoastCurveChart";

const statusOptions: Array<{ value: "all" | OperationalStatus; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "approved", label: "Approved" },
  { value: "in-review", label: "In review" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

function deepCopyProfile(profile: RoastProfile): RoastProfile {
  return {
    ...profile,
    curve: profile.curve.map((point) => ({ ...point })),
    notes: [...profile.notes],
    sensoryTargets: [...profile.sensoryTargets],
    revisionHistory: profile.revisionHistory.map((revision) => ({ ...revision })),
  };
}

function createBlankProfile(): RoastProfile {
  const template = deepCopyProfile(initialProfiles[0]);
  const now = new Date().toISOString();
  return {
    ...template,
    id: `profile-${Date.now()}`,
    code: "NEW-PROFILE",
    name: "Untitled roast profile",
    coffeeId: "coffee-new-lot",
    coffee: "New coffee lot",
    status: "draft",
    version: 1,
    qualityScore: null,
    owner: "Current operator",
    updatedAt: now,
    notes: ["Document the intent and changes before requesting review."],
    revisionHistory: [{ version: 1, changedAt: now, changedBy: "Current operator", summary: "Created local draft." }],
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

export function RoastProfilesWorkspace() {
  const [profiles, setProfiles] = useState<RoastProfile[]>(() => initialProfiles.map(deepCopyProfile));
  const [selectedId, setSelectedId] = useState(initialProfiles[0].id);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OperationalStatus>("all");
  const [coffeeFilter, setCoffeeFilter] = useState("all");
  const [machineFilter, setMachineFilter] = useState("all");
  const [styleFilter, setStyleFilter] = useState("all");
  const [draft, setDraft] = useState<RoastProfile | null>(null);
  const [editingExisting, setEditingExisting] = useState(false);
  const [editorIssues, setEditorIssues] = useState<string[]>([]);
  const [message, setMessage] = useState("Profile workspace ready.");
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const issuesRef = useRef<HTMLDivElement>(null);
  const { captureDialogTrigger, dialogRef } = useAccessibleDialog({
    open: draft !== null,
    onClose: () => setDraft(null),
    initialFocusRef: firstFieldRef,
  });

  const coffees = useMemo(() => Array.from(new Set(profiles.map((profile) => profile.coffee))).sort(), [profiles]);
  const machines = useMemo(() => Array.from(new Set(profiles.map((profile) => profile.roasterModel))).sort(), [profiles]);
  const styles = useMemo(() => Array.from(new Set(profiles.map((profile) => profile.intendedUse))).sort(), [profiles]);
  const filteredProfiles = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return profiles.filter((profile) => {
      const matchesQuery = !normalized || [profile.name, profile.code, profile.coffee, profile.origin, profile.owner].some((value) => value.toLowerCase().includes(normalized));
      const matchesStatus = statusFilter === "all" || profile.status === statusFilter;
      const matchesCoffee = coffeeFilter === "all" || profile.coffee === coffeeFilter;
      const matchesMachine = machineFilter === "all" || profile.roasterModel === machineFilter;
      const matchesStyle = styleFilter === "all" || profile.intendedUse === styleFilter;
      return matchesQuery && matchesStatus && matchesCoffee && matchesMachine && matchesStyle;
    });
  }, [coffeeFilter, machineFilter, profiles, query, statusFilter, styleFilter]);
  const selected = profiles.find((profile) => profile.id === selectedId) ?? filteredProfiles[0] ?? profiles[0];
  const comparedProfiles = compareIds.map((id) => profiles.find((profile) => profile.id === id)).filter((profile): profile is RoastProfile => Boolean(profile));

  function updateDraft<K extends keyof RoastProfile>(field: K, value: RoastProfile[K]) {
    setDraft((current) => current ? { ...current, [field]: value } : current);
  }

  function openCreate() {
    captureDialogTrigger();
    setEditingExisting(false);
    setEditorIssues([]);
    setDraft(createBlankProfile());
  }

  function openEdit(profile: RoastProfile) {
    captureDialogTrigger();
    setEditingExisting(true);
    setEditorIssues([]);
    setDraft(deepCopyProfile(profile));
  }

  function saveDraft() {
    if (!draft) return;
    const issues = validateRoastProfile(draft);
    if (!draft.name.trim() || !draft.code.trim() || !draft.coffee.trim()) issues.unshift("Code, name, and coffee are required.");
    if (issues.length > 0) {
      setEditorIssues(issues);
      window.requestAnimationFrame(() => issuesRef.current?.focus());
      return;
    }
    const now = new Date().toISOString();
    const version = editingExisting ? draft.version + 1 : draft.version;
    const next: RoastProfile = {
      ...draft,
      curve: buildReferenceCurve(draft),
      developmentSeconds: draft.totalTimeSeconds - draft.firstCrackSeconds,
      developmentRatioPercent: calculateDevelopmentRatio(draft.firstCrackSeconds, draft.totalTimeSeconds),
      version,
      updatedAt: now,
      revisionHistory: [
        { version, changedAt: now, changedBy: draft.owner, summary: editingExisting ? "Updated in the local operational workspace." : "Created in the local operational workspace." },
        ...draft.revisionHistory,
      ],
    };
    setProfiles((current) => editingExisting ? current.map((profile) => profile.id === next.id ? next : profile) : [next, ...current]);
    setSelectedId(next.id);
    setDraft(null);
    setMessage(`${next.name} saved as version ${next.version}.`);
  }

  function duplicateProfile(profile: RoastProfile) {
    const now = new Date().toISOString();
    const copy: RoastProfile = {
      ...deepCopyProfile(profile),
      id: `${profile.id}-copy-${Date.now()}`,
      code: `${profile.code}-COPY`,
      name: `${profile.name} copy`,
      status: "draft",
      version: 1,
      updatedAt: now,
      qualityScore: null,
      revisionHistory: [{ version: 1, changedAt: now, changedBy: "Current operator", summary: `Duplicated from ${profile.code} v${profile.version}.` }],
    };
    setProfiles((current) => [copy, ...current]);
    setSelectedId(copy.id);
    setMessage(`${profile.name} duplicated as a draft.`);
  }

  function archiveProfile(profile: RoastProfile) {
    setProfiles((current) => current.map((candidate) => candidate.id === profile.id ? { ...candidate, status: "archived", updatedAt: new Date().toISOString() } : candidate));
    setCompareIds((current) => current.filter((id) => id !== profile.id));
    setMessage(`${profile.name} archived locally.`);
  }

  function toggleCompare(id: string) {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((candidate) => candidate !== id);
      if (current.length >= 3) {
        setMessage("Compare supports up to three profiles at a time.");
        return current;
      }
      return [...current, id];
    });
  }

  return (
    <div className="section-shell py-10 sm:py-14">
      <OperationalPageIntro
        actions={<button id="new-profile" className="button-primary scroll-mt-28" onClick={openCreate} type="button"><Plus className="size-4" /> New profile</button>}
        description="Version roast intent, milestones, green metrics, curves, and release context. Changes in this foundational workspace are local and do not control roasting equipment."
        eyebrow="Roasting operations · Profile library"
        title="Roast profiles with traceable intent."
      />
      <p aria-live="polite" className="sr-only">{message}</p>

      <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_11rem_11rem_11rem_11rem]">
        <label className="relative">
          <span className="sr-only">Search roast profiles</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#786c61]" />
          <input className="form-control pl-11" onChange={(event) => setQuery(event.target.value)} placeholder="Search code, coffee, origin, owner…" type="search" value={query} />
        </label>
        <label><span className="sr-only">Filter by status</span><select className="form-control" onChange={(event) => setStatusFilter(event.target.value as "all" | OperationalStatus)} value={statusFilter}>{statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        <label><span className="sr-only">Filter by coffee</span><select className="form-control" onChange={(event) => setCoffeeFilter(event.target.value)} value={coffeeFilter}><option value="all">All coffees</option>{coffees.map((coffee) => <option key={coffee}>{coffee}</option>)}</select></label>
        <label><span className="sr-only">Filter by machine</span><select className="form-control" onChange={(event) => setMachineFilter(event.target.value)} value={machineFilter}><option value="all">All machines</option>{machines.map((machine) => <option key={machine}>{machine}</option>)}</select></label>
        <label><span className="sr-only">Filter by roast style</span><select className="form-control" onChange={(event) => setStyleFilter(event.target.value)} value={styleFilter}><option value="all">All roast styles</option>{styles.map((style) => <option key={style}>{style}</option>)}</select></label>
      </div>

      {comparedProfiles.length > 1 ? (
        <section aria-labelledby="comparison-title" className="glass-panel mt-6 rounded-[1.75rem] p-5 sm:p-7">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#c7955d]">Curve comparison</p><h2 className="mt-2 text-xl font-medium" id="comparison-title">{comparedProfiles.length} profile references</h2></div>
            <button className="button-quiet !min-h-11 !px-3" onClick={() => setCompareIds([])} type="button">Clear</button>
          </div>
          <RoastCurveChart profiles={comparedProfiles} />
        </section>
      ) : null}

      <div className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(23rem,.82fr)_minmax(0,1.18fr)]">
        <section aria-label="Roast profile results" className="space-y-2">
          <div className="mb-3 flex items-center justify-between text-xs text-[#817569]"><span>{filteredProfiles.length} profiles</span><span>{compareIds.length}/3 selected to compare</span></div>
          {filteredProfiles.length === 0 ? <OperationalNotice tone="neutral">No profiles match these filters.</OperationalNotice> : filteredProfiles.map((profile) => (
            <article className={`rounded-2xl border p-4 transition ${selected?.id === profile.id ? "border-amber-300/30 bg-amber-300/[0.055]" : "border-white/[0.08] bg-white/[0.025] hover:border-white/15"}`} key={profile.id}>
              <button className="w-full text-left" onClick={() => setSelectedId(profile.id)} type="button">
                <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#8c7e70]">{profile.code} · v{profile.version}</p><h2 className="mt-2 text-base font-medium text-[#eee3d3]">{profile.name}</h2></div><OperationalStatusBadge status={profile.status} /></div>
                <p className="mt-2 text-xs text-[#998b7e]">{profile.coffee} · {profile.process} · {profile.batchSizeKg} kg</p>
              </button>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.07] pt-3">
                <button aria-pressed={compareIds.includes(profile.id)} className="button-quiet !min-h-11 !px-3 text-[11px]" disabled={profile.status === "archived"} onClick={() => toggleCompare(profile.id)} type="button"><GitCompareArrows className="size-3.5" /> Compare</button>
                <button className="button-quiet !min-h-11 !px-3 text-[11px]" onClick={() => duplicateProfile(profile)} type="button"><Copy className="size-3.5" /> Duplicate</button>
              </div>
            </article>
          ))}
        </section>

        {selected ? (
          <article className="glass-panel overflow-hidden rounded-[2rem] xl:sticky xl:top-24">
            <div className="border-b border-white/[0.08] p-5 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#bd8e59]">{selected.code} · revision {selected.version}</p><h2 className="mt-3 text-2xl font-medium tracking-[-0.035em]">{selected.name}</h2><p className="mt-2 text-sm text-[#9d8f81]">{selected.origin} · {selected.process}</p></div>
                <div className="flex flex-wrap gap-2"><button className="button-secondary !min-h-11 !px-4" onClick={() => openEdit(selected)} type="button"><Pencil className="size-3.5" /> Edit</button>{selected.status !== "archived" ? <button className="button-quiet !min-h-11 !px-3" onClick={() => archiveProfile(selected)} type="button"><Archive className="size-3.5" /> Archive</button> : null}</div>
              </div>
            </div>
            <div className="p-5 sm:p-7">
              <RoastCurveChart compact profiles={[selected]} />
              <dl className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  ["Batch", `${selected.batchSizeKg} kg`], ["Charge", `${selected.chargeTemperatureC}°C`], ["First crack", `${Math.floor(selected.firstCrackSeconds / 60)}:${String(selected.firstCrackSeconds % 60).padStart(2, "0")}`], ["Development", `${selected.developmentSeconds}s · ${selected.developmentRatioPercent}%`],
                  ["Drop", `${selected.dropTemperatureC}°C`], ["Weight loss", `${selected.weightLossPercent}%`], ["Color", selected.roastColor], ["Quality", selected.qualityScore === null ? "Pending" : `${selected.qualityScore}/100`],
                ].map(([label, value]) => <div className="rounded-xl border border-white/[0.07] bg-black/10 p-3" key={label}><dt className="text-[9px] uppercase tracking-[0.14em] text-[#766a5f]">{label}</dt><dd className="mt-2 text-sm font-medium text-[#e9ded0]">{value}</dd></div>)}
              </dl>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/[0.07] p-4"><p className="text-[10px] uppercase tracking-[0.16em] text-[#817468]">Green & machine context</p><p className="mt-3 text-sm leading-6 text-[#b8aa9b]">{selected.greenDensityGramsPerLiter} g/L density · {selected.greenMoisturePercent}% moisture<br />{selected.roasterModel} · {selected.machineId}</p></div>
                <div className="rounded-2xl border border-white/[0.07] p-4"><p className="text-[10px] uppercase tracking-[0.16em] text-[#817468]">Sensory target</p><div className="mt-3 flex flex-wrap gap-1.5">{selected.sensoryTargets.map((target) => <span className="rounded-full bg-white/[0.055] px-2.5 py-1 text-[10px] text-[#cdbdac]" key={target}>{target}</span>)}</div></div>
              </div>
              <div className="mt-5 rounded-2xl border border-white/[0.07] p-4"><p className="text-[10px] uppercase tracking-[0.16em] text-[#817468]">Operator notes</p><ul className="mt-3 space-y-2 text-sm leading-6 text-[#b8aa9b]">{selected.notes.map((note) => <li className="flex gap-2" key={note}><span className="text-amber-300">•</span>{note}</li>)}</ul></div>
              <section className="mt-5 rounded-2xl border border-white/[0.07] p-4" aria-labelledby="profile-revision-history">
                <div className="flex items-center justify-between gap-3"><p className="text-[10px] uppercase tracking-[0.16em] text-[#817468]" id="profile-revision-history">Revision history</p><span className="font-mono text-[9px] text-[#6f645a]">{selected.revisionHistory.length} recorded</span></div>
                <ol className="mt-3 space-y-3">{selected.revisionHistory.map((revision) => <li className="grid gap-1 border-l border-amber-300/20 pl-3 text-xs sm:grid-cols-[5rem_1fr_auto] sm:items-start" key={`${selected.id}-${revision.version}-${revision.changedAt}`}><strong className="text-[#dccfbe]">v{revision.version}</strong><span className="leading-5 text-[#a99b8c]">{revision.summary}</span><span className="font-mono text-[9px] text-[#75695e]">{revision.changedBy} · {formatDate(revision.changedAt)}</span></li>)}</ol>
              </section>
              <p className="mt-5 text-[10px] text-[#75695e]">Owner {selected.owner} · updated {formatDate(selected.updatedAt)}</p>
            </div>
          </article>
        ) : null}
      </div>

      {draft ? (
        <div ref={dialogRef} tabIndex={-1} aria-labelledby="profile-editor-title" aria-modal="true" className="fixed inset-0 z-[80] overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setDraft(null); }} role="dialog">
          <div className="mx-auto my-4 max-w-5xl rounded-[2rem] border border-white/10 bg-[#130e0b] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.08] bg-[#130e0b]/95 p-5 backdrop-blur sm:px-7"><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-amber-300/70">Local profile editor</p><h2 className="mt-2 text-xl font-medium" id="profile-editor-title">{editingExisting ? `Edit ${draft.name}` : "Create roast profile"}</h2></div><button aria-label="Close profile editor" className="grid size-11 place-items-center rounded-full hover:bg-white/5" onClick={() => setDraft(null)} type="button"><X className="size-5" /></button></div>
            <div className="p-5 sm:p-7">
              <OperationalNotice>This editor records intent and reference data only. Saving does not send commands, schedules, or control values to roasting equipment.</OperationalNotice>
              {editorIssues.length > 0 ? <div ref={issuesRef} className="mt-4" role="alert" tabIndex={-1}><OperationalNotice tone="red"><strong className="block">Resolve before saving</strong><ul className="mt-2 list-disc pl-4">{editorIssues.map((issue) => <li key={issue}>{issue}</li>)}</ul></OperationalNotice></div> : null}
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <OperationalField label="Profile code"><input ref={firstFieldRef} className="form-control" onChange={(event) => updateDraft("code", event.target.value)} value={draft.code} /></OperationalField>
                <OperationalField label="Profile name"><input className="form-control" onChange={(event) => updateDraft("name", event.target.value)} value={draft.name} /></OperationalField>
                <OperationalField label="Status"><select className="form-control" onChange={(event) => updateDraft("status", event.target.value as OperationalStatus)} value={draft.status}>{statusOptions.filter((option) => option.value !== "all").map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></OperationalField>
                <OperationalField label="Coffee lot ID"><input className="form-control" onChange={(event) => updateDraft("coffeeId", event.target.value)} value={draft.coffeeId} /></OperationalField>
                <OperationalField label="Coffee"><input className="form-control" onChange={(event) => updateDraft("coffee", event.target.value)} value={draft.coffee} /></OperationalField>
                <OperationalField label="Origin"><input className="form-control" onChange={(event) => updateDraft("origin", event.target.value)} value={draft.origin} /></OperationalField>
                <OperationalField label="Process"><input className="form-control" onChange={(event) => updateDraft("process", event.target.value)} value={draft.process} /></OperationalField>
                <OperationalField label="Machine ID"><input className="form-control" onChange={(event) => updateDraft("machineId", event.target.value)} value={draft.machineId} /></OperationalField>
                <OperationalField label="Roaster model"><input className="form-control" onChange={(event) => updateDraft("roasterModel", event.target.value)} value={draft.roasterModel} /></OperationalField>
                {([
                  ["Batch size", "batchSizeKg", "kg"], ["Green density", "greenDensityGramsPerLiter", "g/L"], ["Green moisture", "greenMoisturePercent", "%"], ["Charge temperature", "chargeTemperatureC", "°C"], ["Turning point", "turningPointSeconds", "sec"], ["Yellowing", "yellowingSeconds", "sec"], ["First crack", "firstCrackSeconds", "sec"], ["Drop time", "totalTimeSeconds", "sec"], ["Drop temperature", "dropTemperatureC", "°C"], ["Weight loss", "weightLossPercent", "%"],
                ] as const).map(([label, field, unit]) => <OperationalField hint={unit} key={field} label={label}><input className="form-control" min="0" onChange={(event) => updateDraft(field, Number(event.target.value))} step="0.1" type="number" value={draft[field]} /></OperationalField>)}
                <OperationalField label="Roast color"><input className="form-control" onChange={(event) => updateDraft("roastColor", event.target.value)} value={draft.roastColor} /></OperationalField>
                <OperationalField hint="0–100 or blank" label="Quality score"><input className="form-control" max="100" min="0" onChange={(event) => updateDraft("qualityScore", event.target.value === "" ? null : Number(event.target.value))} type="number" value={draft.qualityScore ?? ""} /></OperationalField>
                <OperationalField label="Owner"><input className="form-control" onChange={(event) => updateDraft("owner", event.target.value)} value={draft.owner} /></OperationalField>
                <div className="sm:col-span-2 lg:col-span-3"><OperationalField label="Intended use"><input className="form-control" onChange={(event) => updateDraft("intendedUse", event.target.value)} value={draft.intendedUse} /></OperationalField></div>
                <div className="sm:col-span-2 lg:col-span-3"><OperationalField hint="Comma separated" label="Sensory targets"><input className="form-control" onChange={(event) => updateDraft("sensoryTargets", event.target.value.split(",").map((value) => value.trim()).filter(Boolean))} value={draft.sensoryTargets.join(", ")} /></OperationalField></div>
                <div className="sm:col-span-2 lg:col-span-3"><OperationalField hint="One per line" label="Notes"><textarea className="form-control min-h-28" onChange={(event) => updateDraft("notes", event.target.value.split("\n").filter(Boolean))} value={draft.notes.join("\n")} /></OperationalField></div>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] p-5 sm:flex-row sm:justify-end sm:px-7"><button className="button-secondary" onClick={() => setDraft(null)} type="button">Cancel</button><button className="button-primary" onClick={saveDraft} type="button"><Check className="size-4" /> Save local revision</button></div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
