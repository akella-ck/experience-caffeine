"use client";

import { useMemo, useRef, useState } from "react";
import { Archive, BadgeCheck, Check, Copy, GitCompareArrows, Pencil, Plus, Search, X } from "lucide-react";
import { corporateRecipes as initialRecipes } from "@/data/corporate";
import { recipeRatio, validateCorporateRecipe } from "@/lib/corporate/recipe-validation";
import { useAccessibleDialog } from "@/hooks/use-accessible-dialog";
import type { CorporateRecipe, CorporateRecipeMethod, CorporateRecipeRevision, OperationalStatus, RecipePour } from "@/types";
import { OperationalField, OperationalNotice, OperationalPageIntro, OperationalStatusBadge } from "./OperationalUI";

const methods: CorporateRecipeMethod[] = ["Espresso", "Filter", "V60", "Batch brewer", "Cold brew", "AeroPress", "Signature beverage", "Cupping", "Roast reference"];
const statuses: OperationalStatus[] = ["draft", "in-review", "approved", "archived"];

function cloneRecipe(recipe: CorporateRecipe): CorporateRecipe {
  return { ...recipe, locationIds: [...recipe.locationIds], equipmentIds: [...recipe.equipmentIds], pours: recipe.pours.map((pour) => ({ ...pour })), steps: [...recipe.steps], qualityTarget: [...recipe.qualityTarget], tastingNotes: [...recipe.tastingNotes], staffNotes: [...recipe.staffNotes], tags: [...recipe.tags], revisionHistory: recipe.revisionHistory.map((revision) => ({ ...revision, snapshot: { ...revision.snapshot, qualityTarget: [...revision.snapshot.qualityTarget], staffNotes: [...revision.snapshot.staffNotes] } })) };
}

function blankRecipe(): CorporateRecipe {
  const template = cloneRecipe(initialRecipes[0]);
  return { ...template, id: `recipe-${Date.now()}`, code: "NEW-RECIPE", name: "Untitled recipe", method: "Filter", roastProfileId: null, status: "draft", version: 1, revisionHistory: [], approvedBy: null, owner: "Current operator", updatedAt: new Date().toISOString(), pours: [], steps: ["Add an operational step"], qualityTarget: ["Define a measurable cup target"], tastingNotes: [], staffNotes: [], tags: [] };
}

function captureRevision(recipe: CorporateRecipe, summary: string): CorporateRecipeRevision {
  return {
    version: recipe.version,
    changedAt: recipe.updatedAt,
    changedBy: recipe.owner,
    summary,
    snapshot: {
      status: recipe.status,
      method: recipe.method,
      coffeeDoseGrams: recipe.coffeeDoseGrams,
      waterGrams: recipe.waterGrams,
      yieldGrams: recipe.yieldGrams,
      temperatureCelsius: recipe.temperatureCelsius,
      targetBrewTime: recipe.targetBrewTime,
      grinder: recipe.grinder,
      grinderSetting: recipe.grinderSetting,
      qualityTarget: [...recipe.qualityTarget],
      staffNotes: [...recipe.staffNotes],
    },
  };
}

function poursToText(pours: RecipePour[]) {
  return pours.map((pour) => `${pour.label} | ${pour.cumulativeWaterGrams} | ${pour.atSeconds}`).join("\n");
}

function textToPours(value: string): RecipePour[] {
  return value.split("\n").map((line, index) => {
    const [label, grams, seconds] = line.split("|").map((part) => part.trim());
    return { id: `pour-${index + 1}`, label: label || `Pour ${index + 1}`, cumulativeWaterGrams: Number(grams) || 0, atSeconds: Number(seconds) || 0 };
  }).filter((pour) => pour.label.trim());
}

export function CorporateRecipeWorkspace() {
  const [recipes, setRecipes] = useState<CorporateRecipe[]>(() => initialRecipes.map(cloneRecipe));
  const [query, setQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<"all" | CorporateRecipeMethod>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | OperationalStatus>("all");
  const [draft, setDraft] = useState<CorporateRecipe | null>(null);
  const [editingExisting, setEditingExisting] = useState(false);
  const [issues, setIssues] = useState<string[]>([]);
  const [message, setMessage] = useState("Recipe library ready.");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const issuesRef = useRef<HTMLDivElement>(null);
  const { captureDialogTrigger, dialogRef } = useAccessibleDialog({
    open: draft !== null,
    onClose: () => setDraft(null),
    initialFocusRef: firstFieldRef,
  });

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return recipes.filter((recipe) => {
      const matchesQuery = !normalized || [recipe.name, recipe.code, recipe.coffee, recipe.origin, recipe.owner, ...recipe.tags].some((value) => value.toLowerCase().includes(normalized));
      return matchesQuery && (methodFilter === "all" || recipe.method === methodFilter) && (statusFilter === "all" || recipe.status === statusFilter);
    });
  }, [methodFilter, query, recipes, statusFilter]);
  const comparedRecipes = compareIds.map((id) => recipes.find((recipe) => recipe.id === id)).filter((recipe): recipe is CorporateRecipe => Boolean(recipe));

  function updateDraft<K extends keyof CorporateRecipe>(field: K, value: CorporateRecipe[K]) {
    setDraft((current) => current ? { ...current, [field]: value } : current);
  }

  function openCreate() { captureDialogTrigger(); setEditingExisting(false); setIssues([]); setDraft(blankRecipe()); }
  function openEdit(recipe: CorporateRecipe) { captureDialogTrigger(); setEditingExisting(true); setIssues([]); setDraft(cloneRecipe(recipe)); }

  function saveDraft() {
    if (!draft) return;
    const validation = validateCorporateRecipe(draft);
    if (validation.length > 0) {
      setIssues(validation.map((issue) => issue.message));
      window.requestAnimationFrame(() => issuesRef.current?.focus());
      return;
    }
    const previous = editingExisting ? recipes.find((recipe) => recipe.id === draft.id) : undefined;
    const next = {
      ...draft,
      version: editingExisting ? draft.version + 1 : draft.version,
      updatedAt: new Date().toISOString(),
      revisionHistory: previous
        ? [captureRevision(previous, "State preserved before local edit."), ...previous.revisionHistory]
        : draft.revisionHistory,
    };
    setRecipes((current) => editingExisting ? current.map((recipe) => recipe.id === next.id ? next : recipe) : [next, ...current]);
    setDraft(null);
    setMessage(`${next.name} saved as version ${next.version}.`);
  }

  function duplicate(recipe: CorporateRecipe) {
    const next = { ...cloneRecipe(recipe), id: `${recipe.id}-copy-${Date.now()}`, code: `${recipe.code}-COPY`, name: `${recipe.name} copy`, status: "draft" as const, version: 1, revisionHistory: [], approvedBy: null, updatedAt: new Date().toISOString() };
    setRecipes((current) => [next, ...current]);
    setMessage(`${recipe.name} duplicated as a draft.`);
  }

  function archive(recipe: CorporateRecipe) {
    setRecipes((current) => current.map((candidate) => candidate.id === recipe.id ? { ...candidate, status: "archived", updatedAt: new Date().toISOString() } : candidate));
    setMessage(`${recipe.name} archived locally.`);
  }

  function approve(recipe: CorporateRecipe) {
    const candidate = { ...recipe, status: "approved" as const, approvedBy: "Current quality lead" };
    const validation = validateCorporateRecipe(candidate);
    if (validation.length > 0) { setMessage(`Cannot approve ${recipe.name}: ${validation[0].message}`); return; }
    setRecipes((current) => current.map((item) => item.id === recipe.id ? { ...candidate, version: item.version + 1, updatedAt: new Date().toISOString(), revisionHistory: [captureRevision(item, "State preserved before approval."), ...item.revisionHistory] } : item));
    setMessage(`${recipe.name} approved locally.`);
  }

  function toggleCompare(id: string) {
    setCompareIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 2 ? [...current, id] : [current[1], id]);
  }

  return (
    <div className="section-shell py-10 sm:py-14">
      <OperationalPageIntro actions={<button id="new-recipe" className="button-primary scroll-mt-28" onClick={openCreate} type="button"><Plus className="size-4" /> New recipe</button>} description="Create, review, and approve location-aware operating recipes with equipment, profile, technique, and quality context. This foundation stores changes locally." eyebrow="Operations · Recipe governance" title="Recipes built for repeatable service." />
      <p aria-live="polite" className="mt-4 min-h-5 text-xs text-[#9d8f80]">{message}</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_14rem_12rem]">
        <label className="relative"><span className="sr-only">Search recipes</span><Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#776b5f]" /><input className="form-control pl-11" onChange={(event) => setQuery(event.target.value)} placeholder="Search recipes, coffee, tags, owner…" type="search" value={query} /></label>
        <label><span className="sr-only">Filter recipe method</span><select className="form-control" onChange={(event) => setMethodFilter(event.target.value as "all" | CorporateRecipeMethod)} value={methodFilter}><option value="all">All categories</option>{methods.map((method) => <option key={method}>{method}</option>)}</select></label>
        <label><span className="sr-only">Filter recipe status</span><select className="form-control" onChange={(event) => setStatusFilter(event.target.value as "all" | OperationalStatus)} value={statusFilter}><option value="all">All statuses</option>{statuses.map((status) => <option key={status} value={status}>{status.replace("-", " ")}</option>)}</select></label>
      </div>

      {comparedRecipes.length === 2 ? (
        <section className="glass-panel mt-6 rounded-[1.6rem] p-5 sm:p-6" aria-labelledby="recipe-compare-title">
          <div className="flex items-center justify-between gap-4"><div><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-amber-300/70">Revision comparison</p><h2 className="mt-2 text-xl font-medium" id="recipe-compare-title">Two operating references</h2></div><button className="button-quiet !min-h-11 !px-3" onClick={() => setCompareIds([])} type="button">Clear</button></div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {comparedRecipes.map((recipe) => (
              <article className="rounded-2xl border border-white/[0.08] bg-black/10 p-4" key={recipe.id}>
                <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[9px] text-[#7e7165]">{recipe.code} · v{recipe.version}</p><h3 className="mt-2 text-base font-medium">{recipe.name}</h3></div><OperationalStatusBadge status={recipe.status} /></div>
                <dl className="mt-4 grid grid-cols-2 gap-2 text-xs"><div><dt className="text-[#74685d]">Dose / liquid</dt><dd className="mt-1 text-[#d7cabb]">{recipe.coffeeDoseGrams} g / {recipe.waterGrams ?? recipe.yieldGrams} g</dd></div><div><dt className="text-[#74685d]">Grinder</dt><dd className="mt-1 text-[#d7cabb]">{recipe.grinder} · {recipe.grinderSetting}</dd></div><div><dt className="text-[#74685d]">Time / temp</dt><dd className="mt-1 text-[#d7cabb]">{recipe.targetBrewTime} · {recipe.temperatureCelsius}°C</dd></div><div><dt className="text-[#74685d]">Scope</dt><dd className="mt-1 text-[#d7cabb]">{recipe.locationIds.join(", ")}</dd></div></dl>
                <div className="mt-4 border-t border-white/[0.07] pt-3"><p className="text-[9px] uppercase tracking-[0.13em] text-[#74685d]">Staff notes</p><p className="mt-2 text-xs leading-5 text-[#a99b8c]">{recipe.staffNotes.join(" · ") || "No staff notes"}</p></div>
                <details className="mt-4 border-t border-white/[0.07] pt-3">
                  <summary className="cursor-pointer text-xs font-medium text-amber-200/75">Prior revisions ({recipe.revisionHistory.length})</summary>
                  {recipe.revisionHistory.length ? <ol className="mt-3 space-y-3">{recipe.revisionHistory.map((revision) => <li className="rounded-xl border border-white/[0.06] p-3 text-[10px] leading-5 text-[#9f9183]" key={`${recipe.id}-${revision.version}-${revision.changedAt}`}><strong className="block text-xs text-[#d5c8b8]">v{revision.version} · {revision.snapshot.status.replace("-", " ")}</strong><span>{revision.snapshot.coffeeDoseGrams} g → {revision.snapshot.waterGrams ?? revision.snapshot.yieldGrams} g · {revision.snapshot.temperatureCelsius}°C · {revision.snapshot.grinderSetting}</span><span className="mt-1 block">{revision.summary}</span></li>)}</ol> : <p className="mt-3 text-[10px] text-[#75695e]">No prior revision snapshot yet.</p>}
                </details>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {filtered.length === 0 ? <OperationalNotice tone="neutral">No recipes match the current filters.</OperationalNotice> : filtered.map((recipe) => (
          <article className="glass-panel flex flex-col rounded-[1.6rem] p-5 sm:p-6" key={recipe.id}>
            <div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#8d7f72]">{recipe.code} · v{recipe.version}</p><h2 className="mt-2 text-xl font-medium tracking-[-0.025em] text-[#f0e6d8]">{recipe.name}</h2><p className="mt-2 text-xs text-[#948679]">{recipe.coffee} · {recipe.method}</p></div><OperationalStatusBadge status={recipe.status} /></div>
            <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">{[["Dose", `${recipe.coffeeDoseGrams} g`], [recipe.method === "Espresso" ? "Yield" : "Water", `${recipe.method === "Espresso" ? recipe.yieldGrams : recipe.waterGrams} g`], ["Temperature", `${recipe.temperatureCelsius}°C`], ["Ratio", `1:${recipeRatio(recipe)}`]].map(([label, value]) => <div className="rounded-xl border border-white/[0.07] bg-black/10 p-3" key={label}><dt className="text-[9px] uppercase tracking-[0.12em] text-[#74685d]">{label}</dt><dd className="mt-1.5 text-sm font-medium text-[#e4d8ca]">{value}</dd></div>)}</dl>
            <div className="mt-4 rounded-xl border border-white/[0.07] p-3"><p className="text-[9px] uppercase tracking-[0.14em] text-[#74685d]">Quality target</p><p className="mt-2 text-xs leading-5 text-[#b7a99a]">{recipe.qualityTarget.join(" · ")}</p></div>
            <p className="mt-4 text-[10px] text-[#75695e]">{recipe.locationIds.join(", ")} · {recipe.grinder} {recipe.grinderSetting} · {recipe.approvedBy ? `Approved by ${recipe.approvedBy}` : "Approval pending"}</p>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-white/[0.07] pt-4"><button className="button-secondary !min-h-11 !px-3 text-[11px]" onClick={() => openEdit(recipe)} type="button"><Pencil className="size-3.5" /> Edit</button><button aria-pressed={compareIds.includes(recipe.id)} className="button-quiet !min-h-11 !px-3 text-[11px]" onClick={() => toggleCompare(recipe.id)} type="button"><GitCompareArrows className="size-3.5" /> Compare</button><button className="button-quiet !min-h-11 !px-3 text-[11px]" onClick={() => duplicate(recipe)} type="button"><Copy className="size-3.5" /> Duplicate</button>{recipe.status === "in-review" || recipe.status === "draft" ? <button className="button-quiet !min-h-11 !px-3 text-[11px] text-emerald-200" onClick={() => approve(recipe)} type="button"><BadgeCheck className="size-3.5" /> Approve</button> : null}{recipe.status !== "archived" ? <button className="button-quiet !min-h-11 !px-3 text-[11px]" onClick={() => archive(recipe)} type="button"><Archive className="size-3.5" /> Archive</button> : null}</div>
          </article>
        ))}
      </div>

      {draft ? (
        <div ref={dialogRef} tabIndex={-1} aria-labelledby="recipe-editor-title" aria-modal="true" className="fixed inset-0 z-[80] overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setDraft(null); }} role="dialog">
          <div className="mx-auto my-4 max-w-5xl rounded-[2rem] border border-white/10 bg-[#130e0b] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.08] bg-[#130e0b]/95 p-5 backdrop-blur sm:px-7"><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-amber-300/70">Local recipe editor</p><h2 className="mt-2 text-xl font-medium" id="recipe-editor-title">{editingExisting ? `Edit ${draft.name}` : "Create recipe"}</h2></div><button aria-label="Close recipe editor" className="grid size-11 place-items-center rounded-full hover:bg-white/5" onClick={() => setDraft(null)} type="button"><X className="size-5" /></button></div>
            <div className="p-5 sm:p-7">
              {issues.length > 0 ? <div ref={issuesRef} role="alert" tabIndex={-1}><OperationalNotice tone="red"><strong className="block">Resolve before saving</strong><ul className="mt-2 list-disc pl-4">{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul></OperationalNotice></div> : null}
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <OperationalField label="Recipe code"><input ref={firstFieldRef} className="form-control" onChange={(event) => updateDraft("code", event.target.value)} value={draft.code} /></OperationalField>
                <OperationalField label="Recipe name"><input className="form-control" onChange={(event) => updateDraft("name", event.target.value)} value={draft.name} /></OperationalField>
                <OperationalField label="Category"><select className="form-control" onChange={(event) => updateDraft("method", event.target.value as CorporateRecipeMethod)} value={draft.method}>{methods.map((method) => <option key={method}>{method}</option>)}</select></OperationalField>
                <OperationalField label="Coffee"><input className="form-control" onChange={(event) => updateDraft("coffee", event.target.value)} value={draft.coffee} /></OperationalField>
                <OperationalField label="Origin"><input className="form-control" onChange={(event) => updateDraft("origin", event.target.value)} value={draft.origin} /></OperationalField>
                <OperationalField hint="Optional" label="Roast profile ID"><input className="form-control" onChange={(event) => updateDraft("roastProfileId", event.target.value || null)} value={draft.roastProfileId ?? ""} /></OperationalField>
                <OperationalField hint="Comma separated" label="Location IDs"><input className="form-control" onChange={(event) => updateDraft("locationIds", event.target.value.split(",").map((value) => value.trim()).filter(Boolean))} value={draft.locationIds.join(", ")} /></OperationalField>
                <OperationalField hint="Comma separated" label="Equipment IDs"><input className="form-control" onChange={(event) => updateDraft("equipmentIds", event.target.value.split(",").map((value) => value.trim()).filter(Boolean))} value={draft.equipmentIds.join(", ")} /></OperationalField>
                <OperationalField label="Grinder"><input className="form-control" onChange={(event) => updateDraft("grinder", event.target.value)} value={draft.grinder} /></OperationalField>
                <OperationalField label="Grinder setting"><input className="form-control" onChange={(event) => updateDraft("grinderSetting", event.target.value)} value={draft.grinderSetting} /></OperationalField>
                <OperationalField label="Grind target"><input className="form-control" onChange={(event) => updateDraft("grindTarget", event.target.value)} value={draft.grindTarget} /></OperationalField>
                {([ ["Coffee dose", "coffeeDoseGrams", "g"], ["Water", "waterGrams", "g · optional for espresso"], ["Yield", "yieldGrams", "g · optional"], ["Temperature", "temperatureCelsius", "°C"], ["Target time", "targetTimeSeconds", "seconds"], ["Pressure", "pressureBar", "bar · optional"] ] as const).map(([label, field, hint]) => <OperationalField hint={hint} key={field} label={label}><input className="form-control" min="0" onChange={(event) => updateDraft(field, event.target.value === "" && (field === "waterGrams" || field === "yieldGrams" || field === "pressureBar") ? null : Number(event.target.value))} step="0.1" type="number" value={draft[field] ?? ""} /></OperationalField>)}
                <OperationalField label="Display time range"><input className="form-control" onChange={(event) => updateDraft("targetBrewTime", event.target.value)} value={draft.targetBrewTime} /></OperationalField>
                <OperationalField label="Status"><select className="form-control" onChange={(event) => updateDraft("status", event.target.value as OperationalStatus)} value={draft.status}>{statuses.map((status) => <option key={status} value={status}>{status.replace("-", " ")}</option>)}</select></OperationalField>
                <OperationalField label="Owner"><input className="form-control" onChange={(event) => updateDraft("owner", event.target.value)} value={draft.owner} /></OperationalField>
                <div className="sm:col-span-2 lg:col-span-3"><OperationalField hint="Label | cumulative grams | seconds, one per line" label="Pour stages"><textarea className="form-control min-h-24" onChange={(event) => updateDraft("pours", textToPours(event.target.value))} value={poursToText(draft.pours)} /></OperationalField></div>
                <div className="sm:col-span-2"><OperationalField hint="One per line" label="Operational steps"><textarea className="form-control min-h-28" onChange={(event) => updateDraft("steps", event.target.value.split("\n").filter(Boolean))} value={draft.steps.join("\n")} /></OperationalField></div>
                <OperationalField hint="One per line" label="Quality targets"><textarea className="form-control min-h-28" onChange={(event) => updateDraft("qualityTarget", event.target.value.split("\n").filter(Boolean))} value={draft.qualityTarget.join("\n")} /></OperationalField>
                <div className="sm:col-span-2"><OperationalField hint="One per line" label="Tasting notes"><textarea className="form-control min-h-24" onChange={(event) => updateDraft("tastingNotes", event.target.value.split("\n").filter(Boolean))} value={draft.tastingNotes.join("\n")} /></OperationalField></div>
                <OperationalField hint="One per line" label="Staff notes"><textarea className="form-control min-h-24" onChange={(event) => updateDraft("staffNotes", event.target.value.split("\n").filter(Boolean))} value={draft.staffNotes.join("\n")} /></OperationalField>
                <OperationalField hint="Comma separated" label="Tags"><input className="form-control" onChange={(event) => updateDraft("tags", event.target.value.split(",").map((value) => value.trim()).filter(Boolean))} value={draft.tags.join(", ")} /></OperationalField>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] p-5 sm:flex-row sm:justify-end sm:px-7"><button className="button-secondary" onClick={() => setDraft(null)} type="button">Cancel</button><button className="button-primary" onClick={saveDraft} type="button"><Check className="size-4" /> Save local recipe</button></div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
