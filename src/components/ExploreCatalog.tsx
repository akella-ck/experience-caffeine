"use client";

import { Filter, Globe2, RotateCcw, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import type { BrewMethodId, CoffeeOrigin, ProcessingMethod, RoastLevel } from "@/types";
import { GlassPanel } from "@/components/GlassPanel";
import { OriginCard } from "@/components/OriginCard";

type FilterState = {
  flavor: string;
  roast: RoastLevel | "all";
  process: ProcessingMethod | "all";
  method: BrewMethodId | "all";
};

type ExploreCatalogProps = {
  origins: readonly CoffeeOrigin[];
  methodNames: Record<BrewMethodId, string>;
};

const initialFilters: FilterState = {
  flavor: "all",
  roast: "all",
  process: "all",
  method: "all",
};

const roastLabels: Record<RoastLevel, string> = {
  light: "Light",
  medium: "Medium",
  "medium-dark": "Medium-dark",
  dark: "Dark",
};

type ExploreCatalogStateProps = ExploreCatalogProps & {
  searchParams: ReturnType<typeof useSearchParams>;
};

export function ExploreCatalog(props: ExploreCatalogProps) {
  const searchParams = useSearchParams();
  return <ExploreCatalogState {...props} key={searchParams.toString()} searchParams={searchParams} />;
}

function ExploreCatalogState({ origins, methodNames, searchParams }: ExploreCatalogStateProps) {
  const requestedOrigin = searchParams.get("origin");
  const initialOrigin = origins.find((origin) => origin.id === requestedOrigin)?.id ?? null;
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [focusedOrigin, setFocusedOrigin] = useState<string | null>(initialOrigin);

  const options = useMemo(
    () => ({
      flavors: [...new Set(origins.flatMap((origin) => origin.flavorNotes))].sort(),
      processes: [...new Set(origins.flatMap((origin) => origin.processes))].sort(),
      methods: [...new Set(origins.flatMap((origin) => origin.recommendedMethods))],
    }),
    [origins],
  );

  const filteredOrigins = useMemo(
    () =>
      origins.filter((origin) => {
        if (focusedOrigin && origin.id !== focusedOrigin) return false;
        if (filters.flavor !== "all" && !origin.flavorNotes.includes(filters.flavor)) return false;
        if (filters.roast !== "all" && !origin.recommendedRoasts.includes(filters.roast)) return false;
        if (filters.process !== "all" && !origin.processes.includes(filters.process)) return false;
        if (filters.method !== "all" && !origin.recommendedMethods.includes(filters.method)) return false;
        return true;
      }),
    [filters, focusedOrigin, origins],
  );

  const reset = () => {
    setFilters(initialFilters);
    setFocusedOrigin(null);
  };

  return (
    <div className="space-y-10">
      <GlassPanel className="p-4 sm:p-6" glow="amber">
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex shrink-0 items-center gap-3 lg:pb-2 lg:pr-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-200/15 bg-amber-200/[0.06] text-amber-200">
              <Filter className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-[#efe3d0]">Tune the landscape</p>
              <p className="text-xs text-[#8f8376]">Filter by what you want in the cup.</p>
            </div>
          </div>
          <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <FilterSelect
              label="Flavor note"
              value={filters.flavor}
              onChange={(value) => setFilters((current) => ({ ...current, flavor: value }))}
            >
              <option value="all">Any flavor</option>
              {options.flavors.map((flavor) => (
                <option key={flavor} value={flavor}>
                  {flavor}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              label="Roast preference"
              value={filters.roast}
              onChange={(value) =>
                setFilters((current) => ({ ...current, roast: value as RoastLevel | "all" }))
              }
            >
              <option value="all">Any roast</option>
              {Object.entries(roastLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              label="Processing"
              value={filters.process}
              onChange={(value) =>
                setFilters((current) => ({ ...current, process: value as ProcessingMethod | "all" }))
              }
            >
              <option value="all">Any process</option>
              {options.processes.map((process) => (
                <option key={process} value={process}>
                  {process}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              label="Brew method"
              value={filters.method}
              onChange={(value) =>
                setFilters((current) => ({ ...current, method: value as BrewMethodId | "all" }))
              }
            >
              <option value="all">Any method</option>
              {options.methods.map((method) => (
                <option key={method} value={method}>
                  {methodNames[method]}
                </option>
              ))}
            </FilterSelect>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-white/10 px-4 text-xs text-[#cfc2b1] outline-none transition hover:border-amber-200/30 hover:text-[#f3e5d0] focus-visible:ring-2 focus-visible:ring-amber-300/70"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </GlassPanel>

      <GlassPanel className="relative min-h-[26rem] p-5 sm:p-8 lg:p-10">
        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <div className="flex items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.19em] text-amber-300/70">
              <Globe2 className="h-3.5 w-3.5" /> Origin signal map
            </div>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[#9f9385]">
              Tap an origin to isolate its profile. Position is illustrative, designed to show relationships rather than borders.
            </p>
          </div>
          <p className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-[#796d62]" aria-live="polite">
            {filteredOrigins.length} of {origins.length} profiles visible
          </p>
        </div>

        <div className="relative mt-6 h-[18rem] overflow-hidden rounded-[1.4rem] border border-white/[0.06] bg-[#0c0a08] sm:h-[22rem]">
          <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="absolute inset-[12%] rounded-[45%] border border-amber-200/[0.07] [transform:rotate(-7deg)]" />
          <div className="absolute inset-[24%_9%] rounded-[50%] border border-dashed border-amber-200/[0.08] [transform:rotate(8deg)]" />
          <div className="absolute left-[20%] top-[24%] h-28 w-28 rounded-full bg-amber-500/[0.07] blur-3xl" />
          <div className="absolute right-[16%] top-[38%] h-36 w-36 rounded-full bg-orange-300/[0.06] blur-3xl" />

          {origins.map((origin) => {
            const isFocused = focusedOrigin === origin.id;
            const isVisible = filteredOrigins.some((item) => item.id === origin.id);
            const labelPosition = origin.id === "kenya"
              ? "left-8 top-[calc(50%+1.35rem)]"
              : origin.id === "guatemala"
                ? "right-8 top-1/2"
                : "left-8 top-1/2";
            return (
              <button
                key={origin.id}
                type="button"
                disabled={!isVisible}
                onClick={() => setFocusedOrigin((current) => (current === origin.id ? null : origin.id))}
                aria-pressed={isFocused}
                tabIndex={isVisible ? 0 : -1}
                className={`group absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full p-3 text-left outline-none transition duration-500 focus-visible:ring-2 focus-visible:ring-amber-300/80 ${
                  isVisible ? "opacity-100" : "invisible pointer-events-none"
                }`}
                style={{ left: `${origin.coordinates.x}%`, top: `${origin.coordinates.y}%` }}
              >
                <span
                  className={`relative flex h-4 w-4 items-center justify-center rounded-full border shadow-[0_0_0_7px_rgba(205,140,67,.07),0_0_26px_rgba(205,140,67,.28)] transition-transform group-hover:scale-125 ${
                    isFocused ? "border-amber-100 bg-amber-200" : "border-amber-200/50 bg-[#a76935]"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1b110a]" />
                </span>
                <span className={`absolute ${labelPosition} w-max -translate-y-1/2 rounded-full border border-white/[0.08] bg-black/55 px-3 py-1.5 text-xs font-medium text-[#e5d7c2] opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 group-focus:opacity-100 sm:opacity-100`}>
                  {origin.name}
                </span>
              </button>
            );
          })}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/[0.07] bg-black/35 px-3 py-2 text-[0.65rem] text-[#86796d] backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-amber-300/60" /> flavor relationships, simplified
          </div>
        </div>
      </GlassPanel>

      {filteredOrigins.length ? (
        <div className="grid gap-5 lg:grid-cols-2 xl:gap-6">
          {filteredOrigins.map((origin, index) => (
            <OriginCard
              key={origin.id}
              origin={{
                ...origin,
                recommendedRoasts: origin.recommendedRoasts.map((roast) => roastLabels[roast]),
                recommendedMethods: origin.recommendedMethods.map((method) => methodNames[method]),
              }}
              accent={index}
            />
          ))}
        </div>
      ) : (
        <GlassPanel className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
          <Sparkles className="h-6 w-6 text-amber-300/60" />
          <h3 className="mt-4 text-xl font-semibold text-[#eee1cd]">No origin matches every signal</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#998d7f]">
            Coffee is varied, but this combination is a little too precise. Clear one filter and widen the landscape.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 min-h-11 rounded-full border border-amber-200/25 bg-amber-200/[0.07] px-5 text-xs font-medium text-amber-100 outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70"
          >
            Clear filters
          </button>
        </GlassPanel>
      )}
    </div>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
};

function FilterSelect({ label, value, onChange, children }: FilterSelectProps) {
  const id = `filter-${label.toLowerCase().replaceAll(" ", "-")}`;
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-[0.62rem] uppercase tracking-[0.14em] text-[#7f7367]">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full appearance-none rounded-xl border border-white/[0.09] bg-[#100d0a] px-3 text-sm text-[#e3d5c1] outline-none transition focus:border-amber-300/40 focus:ring-2 focus:ring-amber-300/20"
      >
        {children}
      </select>
    </label>
  );
}
