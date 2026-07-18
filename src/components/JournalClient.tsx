"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Beaker,
  ChevronDown,
  Coffee,
  MapPin,
  Plus,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import { brewMethods, grinders, journalEntries } from "@/data";
import type { BrewMethodId, JournalEntry } from "@/types";
import { JournalEntryCard } from "@/components/JournalEntryCard";

const STORAGE_KEY = "experience-caffeine-journal-v1";

function isJournalEntry(value: unknown): value is JournalEntry {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.createdAt === "string" &&
    !Number.isNaN(Date.parse(item.createdAt)) &&
    typeof item.coffeeName === "string" &&
    typeof item.originId === "string" &&
    typeof item.origin === "string" &&
    typeof item.roaster === "string" &&
    typeof item.roastDate === "string" &&
    !Number.isNaN(Date.parse(item.roastDate)) &&
    typeof item.brewMethodId === "string" &&
    typeof item.grinderId === "string" &&
    typeof item.grindSetting === "string" &&
    typeof item.coffeeDoseGrams === "number" && Number.isFinite(item.coffeeDoseGrams) &&
    typeof item.waterGrams === "number" && Number.isFinite(item.waterGrams) &&
    typeof item.temperatureCelsius === "number" && Number.isFinite(item.temperatureCelsius) &&
    typeof item.brewTimeSeconds === "number" && Number.isFinite(item.brewTimeSeconds) &&
    Array.isArray(item.tasteNotes) &&
    item.tasteNotes.every((note) => typeof note === "string") &&
    typeof item.notes === "string" &&
    typeof item.rating === "number" &&
    item.rating >= 1 &&
    item.rating <= 5
  );
}

function topCount(values: string[]) {
  if (values.length === 0) return null;
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function Stat({ icon: Icon, label, value, detail }: {
  icon: typeof BarChart3;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#75695e]">{label}</p>
        <Icon aria-hidden="true" className="size-4 text-amber-300/75" />
      </div>
      <p className="mt-5 truncate text-xl font-medium tracking-[-0.03em] text-[#f1e7da] sm:text-2xl">{value}</p>
      <p className="mt-1 text-[10px] text-[#7e7165]">{detail}</p>
    </div>
  );
}

export function JournalClient() {
  const [entries, setEntries] = useState<JournalEntry[]>([...journalEntries]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [methodFilter, setMethodFilter] = useState<"all" | BrewMethodId>("all");
  const [ratingFilter, setRatingFilter] = useState<"all" | "4" | "5">("all");
  const [expandedId, setExpandedId] = useState<string | null>(journalEntries[0]?.id ?? null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (Array.isArray(parsed)) setEntries(parsed.filter(isJournalEntry));
        }
      } catch {
        setStatus("Saved journal data could not be read; sample entries are shown instead.");
      } finally {
        setIsHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const saveTimer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      } catch {
        setStatus("This browser could not save the latest journal change.");
      }
    }, 0);
    return () => window.clearTimeout(saveTimer);
  }, [entries, isHydrated]);

  const filteredEntries = useMemo(() => entries.filter((entry) => {
    const methodMatches = methodFilter === "all" || entry.brewMethodId === methodFilter;
    const ratingMatches = ratingFilter === "all" || entry.rating >= Number(ratingFilter);
    return methodMatches && ratingMatches;
  }), [entries, methodFilter, ratingFilter]);

  const stats = useMemo(() => {
    const average = entries.length
      ? entries.reduce((total, entry) => total + entry.rating, 0) / entries.length
      : 0;
    const topMethodId = topCount(entries.map((entry) => entry.brewMethodId));
    const topMethod = brewMethods.find((method) => method.id === topMethodId)?.name ?? "—";
    const favoriteOrigin = topCount(entries.map((entry) => entry.origin)) ?? "—";

    const grindScores = new Map<string, { total: number; count: number }>();
    entries.forEach((entry) => {
      const grinderName = grinders.find((grinder) => grinder.id === entry.grinderId)?.name ?? entry.grinderId;
      const key = `${grinderName} · ${entry.grindSetting}`;
      const current = grindScores.get(key) ?? { total: 0, count: 0 };
      grindScores.set(key, { total: current.total + entry.rating, count: current.count + 1 });
    });
    const bestGrind = [...grindScores.entries()].sort(
      (a, b) => b[1].total / b[1].count - a[1].total / a[1].count,
    )[0]?.[0] ?? "—";

    return { average, topMethod, favoriteOrigin, bestGrind };
  }, [entries]);

  function addMockEntry() {
    const source = entries[0] ?? journalEntries[0];
    if (!source) return;
    const newEntry: JournalEntry = {
      ...source,
      id: makeId(),
      createdAt: new Date().toISOString(),
      coffeeName: "Lab test · new recipe",
      tasteNotes: ["Sweet", "Balanced"],
      notes: "Mock entry ready to replace with observations from the next guided brew.",
      rating: 4,
    };
    setEntries((current) => [newEntry, ...current]);
    setExpandedId(newEntry.id);
    setStatus("Mock journal entry added and saved locally.");
  }

  function deleteEntry(id: string) {
    setEntries((current) => current.filter((entry) => entry.id !== id));
    if (expandedId === id) setExpandedId(null);
    setStatus("Journal entry deleted from this browser.");
  }

  function duplicateEntry(entry: JournalEntry) {
    const duplicate: JournalEntry = {
      ...entry,
      id: makeId(),
      createdAt: new Date().toISOString(),
      coffeeName: `${entry.coffeeName} · next attempt`,
      notes: `${entry.notes} Duplicate recipe—change one variable and record the result.`,
    };
    setEntries((current) => [duplicate, ...current]);
    setExpandedId(duplicate.id);
    setStatus("Recipe duplicated for another attempt.");
  }

  return (
    <div className="relative overflow-hidden pb-24 pt-28 sm:pt-32">
      <div className="ambient-grid pointer-events-none absolute inset-x-0 top-0 h-[48rem] opacity-60" />
      <div className="pointer-events-none absolute left-[9%] top-20 size-80 rounded-full bg-[#a75f2c]/10 blur-[110px]" />

      <div className="section-shell relative">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Personal brew record · local</p>
            <h1 className="page-title mt-5">A memory for every <span className="editorial-title amber-text">cup.</span></h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-[#b8aa99] sm:text-lg">
              Keep the variables that worked, record what changed, and make the next brew an informed experiment.
            </p>
          </div>
          <button className="button-primary shrink-0" onClick={addMockEntry} type="button">
            <Plus aria-hidden="true" className="size-4" />
            Add mock entry
          </button>
        </div>

        <p aria-live="polite" className={`mb-4 min-h-5 text-xs text-amber-200/70 ${status ? "opacity-100" : "opacity-0"}`}>{status || "Journal status"}</p>

        <section aria-labelledby="journal-summary" className="glass-panel rounded-[2rem] p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-amber-200/60">Your brew signal</p>
              <h2 className="mt-2 text-xl font-medium tracking-[-0.025em]" id="journal-summary">Journal summary</h2>
            </div>
            <BarChart3 aria-hidden="true" className="size-5 text-[#947d65]" />
          </div>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            <Stat detail={`${entries.length} recorded brews`} icon={Star} label="Average rating" value={entries.length ? `${stats.average.toFixed(1)} / 5` : "—"} />
            <Stat detail="Most repeated method" icon={Coffee} label="Most used" value={stats.topMethod} />
            <Stat detail="By number of brews" icon={MapPin} label="Favorite origin" value={stats.favoriteOrigin} />
            <Stat detail="Grinder + setting by average rating" icon={Trophy} label="Best grind range" value={stats.bestGrind} />
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-4 border-b border-white/[0.08] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-[#e8ded1]"><Beaker aria-hidden="true" className="size-4 text-amber-300" /> Brew history</p>
            <p className="mt-1 text-xs text-[#786c62]">Showing {filteredEntries.length} of {entries.length} entries</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <label className="relative">
              <span className="sr-only">Filter by brewing method</span>
              <SlidersHorizontal aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-[#796d62]" />
              <select
                className="form-control min-w-0 appearance-none pl-9 pr-9 text-xs sm:w-48"
                onChange={(event) => setMethodFilter(event.target.value as "all" | BrewMethodId)}
                value={methodFilter}
              >
                <option value="all">All methods</option>
                {brewMethods.map((method) => <option key={method.id} value={method.id}>{method.name}</option>)}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#796d62]" />
            </label>
            <label className="relative">
              <span className="sr-only">Filter by rating</span>
              <select
                className="form-control min-w-0 appearance-none pl-3 pr-9 text-xs sm:w-36"
                onChange={(event) => setRatingFilter(event.target.value as "all" | "4" | "5")}
                value={ratingFilter}
              >
                <option value="all">All ratings</option>
                <option value="4">4+ stars</option>
                <option value="5">5 stars</option>
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#796d62]" />
            </label>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {filteredEntries.map((entry) => (
            <JournalEntryCard
              entry={entry}
              expanded={expandedId === entry.id}
              grinderName={grinders.find((grinder) => grinder.id === entry.grinderId)?.name ?? entry.grinderId}
              key={entry.id}
              methodName={brewMethods.find((method) => method.id === entry.brewMethodId)?.name ?? entry.brewMethodId}
              onDelete={() => deleteEntry(entry.id)}
              onDuplicate={() => duplicateEntry(entry)}
              onToggle={() => setExpandedId((current) => current === entry.id ? null : entry.id)}
            />
          ))}

          {filteredEntries.length === 0 ? (
            <div className="glass-panel rounded-[1.5rem] px-5 py-14 text-center">
              <Sparkles aria-hidden="true" className="mx-auto size-5 text-amber-300/70" />
              <h3 className="mt-4 text-lg font-medium text-[#ede3d5]">No brews match these filters</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#897c70]">Clear the filters or add a mock entry to keep exploring the journal.</p>
              <button className="button-secondary mt-5" onClick={() => { setMethodFilter("all"); setRatingFilter("all"); }} type="button">Clear filters</button>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-amber-300/10 bg-amber-300/[0.035] p-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <Sparkles aria-hidden="true" className="mt-1 size-4 shrink-0 text-amber-300" />
            <p className="max-w-xl text-xs leading-5 text-[#9f9184]">Entries stay in this browser for now. Cloud sync and accounts are planned, but no brew data is sent anywhere in this foundational version.</p>
          </div>
          <Link className="button-quiet shrink-0 !px-2" href="/brew-lab">Build another recipe <ArrowRight aria-hidden="true" className="size-4" /></Link>
        </div>
      </div>
    </div>
  );
}
