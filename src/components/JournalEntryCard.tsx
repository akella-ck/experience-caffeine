"use client";

import {
  Beaker,
  CalendarDays,
  ChevronDown,
  Clock3,
  Copy,
  Droplets,
  Gauge,
  MapPin,
  Scale,
  Star,
  Thermometer,
  Trash2,
} from "lucide-react";
import type { JournalEntry } from "@/types";

type JournalEntryCardProps = {
  entry: JournalEntry;
  methodName: string;
  grinderName: string;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
};

function formatBrewTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function Metric({ icon: Icon, label, value }: { icon: typeof Scale; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/10 p-3">
      <Icon aria-hidden="true" className="mb-2 size-3.5 text-amber-300/80" />
      <p className="text-[9px] uppercase tracking-[0.14em] text-[#74685e]">{label}</p>
      <p className="mt-1 text-xs font-medium text-[#ded3c5] tabular-nums">{value}</p>
    </div>
  );
}

export function JournalEntryCard({
  entry,
  methodName,
  grinderName,
  expanded,
  onToggle,
  onDelete,
  onDuplicate,
}: JournalEntryCardProps) {
  const parsedDate = new Date(entry.createdAt);
  const createdDate = Number.isNaN(parsedDate.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(parsedDate);

  return (
    <article className="glass-panel rounded-[1.5rem] transition-colors hover:border-white/[0.14]">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <button
            aria-expanded={expanded}
            className="group min-w-0 flex-1 text-left focus-visible:rounded-xl"
            onClick={onToggle}
            type="button"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl border border-amber-300/10 bg-amber-300/[0.06]">
                <Beaker aria-hidden="true" className="size-4 text-amber-200" />
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="truncate text-base font-medium tracking-[-0.02em] text-[#f2e8da] sm:text-lg">{entry.coffeeName}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#82756a]"><CalendarDays aria-hidden="true" className="size-3" />{createdDate}</span>
                </span>
                <span className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs text-[#958779]">
                  <span>{entry.roaster}</span><span aria-hidden="true">·</span><span>{entry.origin}</span><span aria-hidden="true">·</span><span>{methodName}</span>
                </span>
              </span>
            </div>
          </button>

          <div className="flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3 sm:border-0 sm:pt-0">
            <div aria-label={`${entry.rating} out of 5 stars`} className="mr-2 flex gap-0.5">
              {Array.from({ length: 5 }, (_, index) => (
                <Star aria-hidden="true" className={`size-3.5 ${index < entry.rating ? "fill-amber-300 text-amber-300" : "text-white/10"}`} key={index} />
              ))}
            </div>
            <button
              aria-label={`Duplicate ${entry.coffeeName} recipe`}
              className="grid size-10 place-items-center rounded-full text-[#8e8175] transition hover:bg-white/[0.05] hover:text-[#e7dccd]"
              onClick={onDuplicate}
              title="Duplicate recipe"
              type="button"
            >
              <Copy aria-hidden="true" className="size-4" />
            </button>
            <button
              aria-label={`Delete ${entry.coffeeName} journal entry`}
              className="grid size-10 place-items-center rounded-full text-[#8e8175] transition hover:bg-red-400/10 hover:text-red-200"
              onClick={onDelete}
              title="Delete entry"
              type="button"
            >
              <Trash2 aria-hidden="true" className="size-4" />
            </button>
            <button
              aria-label={expanded ? `Collapse ${entry.coffeeName} details` : `Expand ${entry.coffeeName} details`}
              className="grid size-10 place-items-center rounded-full text-[#8e8175] transition hover:bg-white/[0.05] hover:text-[#e7dccd]"
              onClick={onToggle}
              type="button"
            >
              <ChevronDown aria-hidden="true" className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {expanded ? (
        <div className="border-t border-white/[0.07] bg-black/10 p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            <Metric icon={MapPin} label="Origin" value={entry.origin} />
            <Metric icon={Gauge} label="Grinder" value={grinderName} />
            <Metric icon={Gauge} label="Setting" value={entry.grindSetting} />
            <Metric icon={Scale} label="Coffee" value={`${entry.coffeeDoseGrams} g`} />
            <Metric icon={Droplets} label="Water" value={`${entry.waterGrams} g`} />
            <Metric icon={Thermometer} label="Temp" value={`${entry.temperatureCelsius}°C`} />
            <Metric icon={Clock3} label="Brew time" value={formatBrewTime(entry.brewTimeSeconds)} />
            <Metric icon={CalendarDays} label="Roasted" value={entry.roastDate} />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[.8fr_1.2fr]">
            <div className="rounded-xl border border-white/[0.06] p-4">
              <p className="text-[9px] uppercase tracking-[0.15em] text-[#74685e]">Taste notes</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {entry.tasteNotes.map((note) => (
                  <span className="rounded-full border border-amber-300/10 bg-amber-300/[0.05] px-2.5 py-1 text-[10px] text-[#c9b9a8]" key={note}>{note}</span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.06] p-4">
              <p className="text-[9px] uppercase tracking-[0.15em] text-[#74685e]">Brew notes</p>
              <p className="mt-3 text-xs leading-5 text-[#aa9c8e]">{entry.notes}</p>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
