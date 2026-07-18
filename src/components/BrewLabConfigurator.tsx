"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Beaker,
  ChevronDown,
  Coffee,
  Droplets,
  Gauge,
  RotateCw,
  Scale,
  Sparkles,
  Thermometer,
  Timer,
} from "lucide-react";
import { brewMethods, coffeeOrigins, grinders } from "@/data";
import { calculateRecipe } from "@/lib/recipe";
import type { BrewMethodId, GrinderId, OriginId, RoastLevel } from "@/types";

const roastOptions: Array<{ value: RoastLevel; label: string; detail: string }> = [
  { value: "light", label: "Light", detail: "Bright · aromatic" },
  { value: "medium", label: "Medium", detail: "Balanced · sweet" },
  { value: "medium-dark", label: "Medium-dark", detail: "Round · rich" },
  { value: "dark", label: "Dark", detail: "Bold · roasty" },
];

const cupPresetsByMethod: Record<BrewMethodId, readonly number[]> = {
  v60: [250, 350, 500],
  aeropress: [200, 240, 300],
  "french-press": [350, 450, 600],
  chemex: [400, 500, 750],
  espresso: [36, 54, 72],
  "moka-pot": [120, 180, 240],
  "cold-brew": [500, 750, 1000],
  "automatic-drip": [500, 750, 1000],
};

type SelectFieldProps<T extends string> = {
  id: string;
  label: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (value: T) => void;
  hint?: string;
};

function SelectField<T extends string>({ id, label, value, options, onChange, hint }: SelectFieldProps<T>) {
  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-3">
        <label className="text-sm font-medium text-[#e9dfd0]" htmlFor={id}>{label}</label>
        {hint ? <span className="text-[10px] text-[#7f7266]">{hint}</span> : null}
      </div>
      <div className="relative">
        <select
          className="form-control appearance-none pr-11"
          id={id}
          onChange={(event) => onChange(event.target.value as T)}
          value={value}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#89796b]" />
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, unit }: {
  icon: typeof Scale;
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/[0.07] bg-black/10 p-4">
      <Icon aria-hidden="true" className="mb-3 size-4 text-[#dca15e]" />
      <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#7e7165]">{label}</p>
      <p className="mt-1 truncate text-lg font-medium tracking-[-0.02em] text-[#f6eee3] tabular-nums">
        {value}{unit ? <span className="ml-1 text-xs font-normal text-[#9b8d7f]">{unit}</span> : null}
      </p>
    </div>
  );
}

type BrewLabConfiguratorStateProps = {
  searchParams: ReturnType<typeof useSearchParams>;
};

export function BrewLabConfigurator() {
  const searchParams = useSearchParams();
  return <BrewLabConfiguratorState key={searchParams.toString()} searchParams={searchParams} />;
}

function BrewLabConfiguratorState({ searchParams }: BrewLabConfiguratorStateProps) {
  const requestedOrigin = searchParams.get("origin");
  const requestedMethod = searchParams.get("method");
  const requestedGrinder = searchParams.get("grinder");
  const requestedRoast = searchParams.get("roast");

  const initialOrigin = coffeeOrigins.find((origin) => origin.id === requestedOrigin)?.id ?? "ethiopia";
  const initialMethod = brewMethods.find((method) => method.id === requestedMethod) ?? brewMethods[0];
  const initialGrinder = grinders.find((grinder) => grinder.id === requestedGrinder)?.id ?? "baratza-encore";
  const initialRoast = roastOptions.find((roast) => roast.value === requestedRoast)?.value ?? "light";
  const requestedCupSize = Number(searchParams.get("size"));
  const initialMinimum = initialMethod.id === "espresso" ? 20 : 100;
  const initialCupSize = Number.isFinite(requestedCupSize) && requestedCupSize >= initialMinimum
    ? Math.min(1500, requestedCupSize)
    : initialMethod.defaultCupSizeGrams;

  const [originId, setOriginId] = useState<OriginId>(initialOrigin);
  const [roastLevel, setRoastLevel] = useState<RoastLevel>(initialRoast);
  const [brewMethodId, setBrewMethodId] = useState<BrewMethodId>(initialMethod.id);
  const [grinderId, setGrinderId] = useState<GrinderId>(initialGrinder);
  const [cupSizeGrams, setCupSizeGrams] = useState(initialCupSize);
  const [cupSizeInput, setCupSizeInput] = useState(String(initialCupSize));

  const recipe = useMemo(
    () => calculateRecipe({ originId, roastLevel, brewMethodId, grinderId, cupSizeGrams }),
    [originId, roastLevel, brewMethodId, grinderId, cupSizeGrams],
  );

  const selectedOrigin = coffeeOrigins.find((origin) => origin.id === originId);
  const selectedMethod = brewMethods.find((method) => method.id === brewMethodId);
  const selectedGrinder = grinders.find((grinder) => grinder.id === grinderId);
  const cupPresets = cupPresetsByMethod[brewMethodId];
  const minimumCupSize = brewMethodId === "espresso" ? 20 : 100;

  function changeMethod(nextMethodId: BrewMethodId) {
    const nextMethod = brewMethods.find((method) => method.id === nextMethodId);
    setBrewMethodId(nextMethodId);
    const nextSize = nextMethod?.defaultCupSizeGrams ?? 250;
    setCupSizeGrams(nextSize);
    setCupSizeInput(String(nextSize));
  }

  function resetRecipe() {
    setOriginId("ethiopia");
    setRoastLevel("light");
    setBrewMethodId("v60");
    setGrinderId("baratza-encore");
    setCupSizeGrams(250);
    setCupSizeInput("250");
  }

  function updateCupSizeInput(value: string) {
    setCupSizeInput(value);
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= minimumCupSize && parsed <= 1500) {
      setCupSizeGrams(parsed);
    }
  }

  function commitCupSizeInput() {
    const parsed = Number(cupSizeInput);
    const nextSize = Number.isFinite(parsed)
      ? Math.min(1500, Math.max(minimumCupSize, parsed))
      : cupSizeGrams;
    setCupSizeGrams(nextSize);
    setCupSizeInput(String(nextSize));
  }

  return (
    <div className="relative overflow-hidden pb-24 pt-28 sm:pt-32">
      <div className="ambient-grid pointer-events-none absolute inset-x-0 top-0 h-[48rem] opacity-70" />
      <div className="pointer-events-none absolute left-[8%] top-24 size-72 rounded-full bg-[#a75f2c]/10 blur-[100px]" />

      <div className="section-shell relative">
        <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div>
            <p className="eyebrow">Recipe calibrator · 01</p>
            <h1 className="page-title mt-5 max-w-4xl">Build from the <span className="editorial-title amber-text">variables.</span></h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-[#b8aa99] sm:text-lg">
              Choose your coffee, brewer, and grinder. The lab turns those inputs into a practical starting recipe you can refine by taste.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-amber-300/10 bg-amber-300/[0.035] p-4 text-xs leading-5 text-[#a99a8b]">
            <Sparkles aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-300" />
            <p>Settings are starting ranges. Calibration, burr wear, bean density, coffee age, and technique can all shift the best result.</p>
          </div>
        </div>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,.9fr)_minmax(31rem,1.1fr)]">
          <section aria-labelledby="lab-controls" className="glass-panel rounded-[2rem] p-5 sm:p-7 lg:p-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d9a163]">Input deck</p>
                <h2 className="mt-2 text-xl font-medium tracking-[-0.025em]" id="lab-controls">Your brew setup</h2>
              </div>
              <button className="button-quiet !min-h-10 !px-3" onClick={resetRecipe} type="button">
                <RotateCw aria-hidden="true" className="size-3.5" />
                Reset
              </button>
            </div>

            <div className="space-y-7">
              <fieldset>
                <legend className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#928476]">
                  <span className="grid size-6 place-items-center rounded-full bg-white/[0.05] font-mono text-[9px] text-amber-300">01</span>
                  Coffee profile
                </legend>
                <SelectField
                  id="coffee-origin"
                  label="Origin"
                  onChange={setOriginId}
                  options={coffeeOrigins.map((origin) => ({ value: origin.id, label: origin.name }))}
                  value={originId}
                />
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Roast level">
                  {roastOptions.map((option) => (
                    <button
                      aria-checked={roastLevel === option.value}
                      className={`min-h-[4.4rem] rounded-xl border px-3 py-2.5 text-left transition ${
                        roastLevel === option.value
                          ? "border-amber-300/45 bg-amber-300/10 text-white shadow-[inset_0_0_20px_rgba(217,154,78,.04)]"
                          : "border-white/[0.07] bg-white/[0.025] text-[#998b7e] hover:border-white/15 hover:text-[#ded3c4]"
                      }`}
                      key={option.value}
                      onClick={() => setRoastLevel(option.value)}
                      role="radio"
                      type="button"
                    >
                      <span className="block text-xs font-medium">{option.label}</span>
                      <span className="mt-1 block text-[9px] leading-4 opacity-60">{option.detail}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="grid gap-5 border-t border-white/[0.07] pt-7 sm:grid-cols-2">
                <legend className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#928476] sm:col-span-2">
                  <span className="grid size-6 place-items-center rounded-full bg-white/[0.05] font-mono text-[9px] text-amber-300">02</span>
                  Equipment
                </legend>
                <SelectField
                  id="brew-method"
                  label="Brew method"
                  onChange={changeMethod}
                  options={brewMethods.map((method) => ({ value: method.id, label: method.name }))}
                  value={brewMethodId}
                />
                <SelectField
                  hint="Model-specific"
                  id="grinder"
                  label="Grinder"
                  onChange={setGrinderId}
                  options={grinders.map((grinder) => ({ value: grinder.id, label: grinder.name }))}
                  value={grinderId}
                />
              </fieldset>

              <fieldset className="border-t border-white/[0.07] pt-7">
                <legend className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#928476]">
                  <span className="grid size-6 place-items-center rounded-full bg-white/[0.05] font-mono text-[9px] text-amber-300">03</span>
                  Brew volume
                </legend>
                <label className="text-sm font-medium text-[#e9dfd0]" htmlFor="cup-size">
                  {brewMethodId === "espresso" ? "Beverage yield" : "Brew water"}
                </label>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <div className="relative flex-1">
                    <input
                      className="form-control pr-10 tabular-nums"
                      id="cup-size"
                      inputMode="numeric"
                      max={1500}
                      min={minimumCupSize}
                      onBlur={commitCupSizeInput}
                      onChange={(event) => updateCupSizeInput(event.target.value)}
                      step={brewMethodId === "espresso" ? 1 : 10}
                      type="number"
                      value={cupSizeInput}
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#8e8073]">g</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {cupPresets.map((size) => (
                      <button
                        aria-pressed={cupSizeGrams === size}
                        className={`min-h-12 rounded-xl border px-3 text-xs tabular-nums transition ${
                          cupSizeGrams === size ? "border-amber-300/35 bg-amber-300/10 text-amber-100" : "border-white/[0.07] text-[#97897b] hover:bg-white/[0.04]"
                        }`}
                        key={size}
                        onClick={() => {
                          setCupSizeGrams(size);
                          setCupSizeInput(String(size));
                        }}
                        type="button"
                      >
                        {size} g
                      </button>
                    ))}
                  </div>
                </div>
              </fieldset>
            </div>
          </section>

          <section aria-labelledby="recipe-summary" className="glass-panel overflow-hidden rounded-[2rem] border-amber-300/10 xl:sticky xl:top-24">
            <p aria-live="polite" className="sr-only">
              {selectedOrigin?.name} {selectedMethod?.name} recipe updated: {recipe.coffeeDoseGrams} grams coffee, {recipe.waterGrams} grams {brewMethodId === "espresso" ? "yield" : "water"}, {recipe.grinderSetting} grinder setting.
            </p>
            <div className="relative border-b border-white/[0.07] p-5 sm:p-7 lg:p-8">
              <div className="pointer-events-none absolute -right-12 -top-20 size-64 rounded-full bg-amber-400/[0.08] blur-3xl" />
              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/15 bg-amber-300/[0.06] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-amber-200">
                    <span className="size-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,.8)]" />
                    Recommended starting point
                  </span>
                  <h2 className="mt-4 text-2xl font-medium tracking-[-0.035em] text-white sm:text-3xl" id="recipe-summary">
                    {selectedOrigin?.name} · {selectedMethod?.name}
                  </h2>
                  <p className="mt-2 text-sm text-[#9d8f82]">{roastOptions.find((item) => item.value === roastLevel)?.label} roast · {selectedGrinder?.name}</p>
                </div>
                <div className="grid size-14 shrink-0 place-items-center rounded-2xl border border-amber-300/15 bg-amber-300/[0.07]">
                  <Beaker aria-hidden="true" className="size-6 text-amber-200" />
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-7 lg:p-8">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Metric icon={Coffee} label="Coffee" unit="g" value={recipe.coffeeDoseGrams} />
                <Metric icon={Droplets} label={brewMethodId === "espresso" ? "Yield" : "Water"} unit="g" value={recipe.waterGrams} />
                <Metric icon={Thermometer} label="Water temp" unit="°C" value={recipe.waterTemperatureCelsius} />
                <Metric icon={Timer} label="Brew time" value={recipe.targetBrewTime} />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#85786d]">
                    <Gauge aria-hidden="true" className="size-3.5 text-amber-300" />
                    Grinder target
                  </div>
                  <p className="mt-3 text-xl font-medium text-[#f5ecdf]">{recipe.grinderSetting}</p>
                  <p className="mt-1 text-xs text-[#938577]">{recipe.grindDescription}</p>
                </div>
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#85786d]">
                    <Scale aria-hidden="true" className="size-3.5 text-amber-300" />
                    Ratio & bloom
                  </div>
                  <p className="mt-3 text-xl font-medium text-[#f5ecdf]">{recipe.ratioLabel}</p>
                  <p className="mt-1 text-xs text-[#938577]">{recipe.bloomAmountGrams} g for {recipe.bloomDurationSeconds} sec</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-medium text-[#efe5d8]">Pour sequence</h3>
                  <span className="text-[10px] text-[#766a5f]">Cumulative water targets</span>
                </div>
                <ol className="grid gap-2 sm:grid-cols-2">
                  {recipe.pourStages.map((stage, index) => (
                    <li className="flex min-h-16 items-center gap-3 rounded-xl border border-white/[0.06] bg-black/10 px-3.5 py-3" key={stage.id}>
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-amber-300/10 font-mono text-[10px] text-amber-200">{index + 1}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#e8ddcf]">{stage.label}</p>
                        <p className="mt-0.5 text-[10px] text-[#897c70]">to {stage.cumulativeWaterGrams} g · at {Math.floor(stage.startAtSeconds / 60)}:{String(stage.startAtSeconds % 60).padStart(2, "0")}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_1.15fr]">
                <div className="rounded-2xl border border-white/[0.07] p-4">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#7d7064]">Expected cup</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {recipe.expectedFlavorProfile.map((note) => (
                      <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[10px] text-[#cbbdad]" key={note}>{note}</span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.035] p-4">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-amber-200/65">First adjustment</p>
                  <p className="mt-2 text-xs leading-5 text-[#c8b9a9]">{recipe.adjustmentTip}</p>
                </div>
              </div>

              <Link
                className="button-primary mt-6 w-full"
                href={`/guided-brew?origin=${originId}&roast=${roastLevel}&method=${brewMethodId}&grinder=${grinderId}&size=${cupSizeGrams}`}
              >
                Start guided brew
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <p className="mt-4 text-center text-[10px] leading-4 text-[#74685e]">Adjust based on taste and drawdown time. Change only one major variable between brews.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
