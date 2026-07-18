"use client";

import { ArrowDown, ArrowUp, Gauge, Waves } from "lucide-react";
import { useState } from "react";
import { GlassPanel } from "@/components/GlassPanel";

const levels = [
  {
    name: "Fine",
    particle: 3,
    count: 62,
    surface: 92,
    resistance: 90,
    direction: "Higher extraction tendency",
    clue: "With every other variable fixed, water can move slowly and the finish may become bitter or drying.",
    move: "If the brew is slow and dry, move a small step coarser.",
  },
  {
    name: "Medium-fine",
    particle: 4,
    count: 48,
    surface: 76,
    resistance: 72,
    direction: "Moderately high extraction tendency",
    clue: "A common filter-coffee neighborhood when the recipe needs clarity with enough contact time.",
    move: "Use taste and drawdown together before deciding the next move.",
  },
  {
    name: "Medium",
    particle: 5,
    count: 38,
    surface: 58,
    resistance: 52,
    direction: "Middle extraction tendency",
    clue: "A broad starting category for many drip brewers; the exact particle size still depends on dose and basket geometry.",
    move: "Set a measured baseline, then adjust one grinder step at a time.",
  },
  {
    name: "Medium-coarse",
    particle: 7,
    count: 28,
    surface: 39,
    resistance: 34,
    direction: "Moderately low extraction tendency",
    clue: "Water can pass more freely in percolation, while immersion recipes may compensate with a longer steep.",
    move: "If a pour-over is fast and sharply sour, move slightly finer.",
  },
  {
    name: "Coarse",
    particle: 9,
    count: 20,
    surface: 23,
    resistance: 18,
    direction: "Lower extraction tendency",
    clue: "Useful for long-contact immersion, but going unnecessarily coarse can leave a cup hollow or thin.",
    move: "If strength is adequate but flavor is hollow, try a small step finer.",
  },
] as const;

function position(index: number, salt: number) {
  return ((index * (31 + salt * 3) + salt * 17) % 97) / 97;
}

export function GrindLessonSimulator() {
  const [levelIndex, setLevelIndex] = useState(2);
  const level = levels[levelIndex];

  return (
    <GlassPanel className="p-5 sm:p-8" glow="amber">
      <div className="relative grid gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-center">
        <div>
          <div className="flex items-center justify-between">
            <p className="font-mono text-[0.63rem] uppercase tracking-[0.18em] text-amber-300/70">Particle field</p>
            <span className="rounded-full border border-amber-200/15 bg-amber-200/[0.05] px-3 py-1 text-xs text-amber-100/80">{level.name}</span>
          </div>
          <div className="relative mt-5 h-64 overflow-hidden rounded-[1.4rem] border border-white/[0.07] bg-[#0b0907]" aria-hidden="true">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(205,133,60,.08),transparent_65%)]" />
            {Array.from({ length: level.count }, (_, index) => (
              <span
                key={`${level.name}-${index}`}
                className="absolute rounded-[45%] bg-gradient-to-br from-[#b77a43] to-[#4d2d19] shadow-[0_1px_2px_rgba(0,0,0,.55)] transition-all duration-500 motion-reduce:transition-none"
                style={{
                  width: level.particle,
                  height: Math.max(2, level.particle * 0.72),
                  left: `${3 + position(index, levelIndex) * 92}%`,
                  top: `${4 + position(index, levelIndex + 7) * 88}%`,
                  transform: `rotate(${position(index, levelIndex + 12) * 100}deg)`,
                }}
              />
            ))}
          </div>
          <label htmlFor="grind-lesson-size" className="mt-6 block text-sm font-medium text-[#e1d3bf]">Move the grind from fine to coarse</label>
          <input
            id="grind-lesson-size"
            type="range"
            min={0}
            max={levels.length - 1}
            step={1}
            value={levelIndex}
            onChange={(event) => setLevelIndex(Number(event.target.value))}
            className="mt-4 h-2 w-full cursor-pointer accent-[#eab66f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
            aria-valuetext={level.name}
          />
          <div className="mt-2 flex justify-between font-mono text-[0.6rem] uppercase tracking-[0.12em] text-[#776c61]"><span>Fine</span><span>Coarse</span></div>
        </div>

        <div aria-live="polite">
          <p className="font-mono text-[0.63rem] uppercase tracking-[0.18em] text-[#7f7367]">If the recipe stays unchanged</p>
          <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#eee1cd]">{level.direction}</h3>
          <p className="mt-4 text-sm leading-7 text-[#aaa092]">{level.clue}</p>

          <div className="mt-7 space-y-5">
            <SignalBar label="Relative exposed surface" value={level.surface} icon={Waves} />
            <SignalBar label="Percolation resistance" value={level.resistance} icon={Gauge} />
          </div>

          <div className="mt-7 rounded-2xl border border-amber-200/12 bg-amber-200/[0.045] p-5">
            <p className="flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.14em] text-amber-300/70">
              {levelIndex < 2 ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />} Next controlled move
            </p>
            <p className="mt-3 text-sm leading-6 text-[#c0b2a1]">{level.move}</p>
          </div>
          <p className="mt-5 text-xs leading-5 text-[#7f7367]">Direction is illustrative, not a measurement. Brewing method and technique can change the outcome.</p>
        </div>
      </div>
    </GlassPanel>
  );
}

function SignalBar({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Gauge }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-xs"><span className="flex items-center gap-2 text-[#9b8f82]"><Icon className="h-3.5 w-3.5" /> {label}</span><span className="font-mono text-[#c8baa8]">{value < 34 ? "low" : value > 74 ? "high" : "medium"}</span></div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full rounded-full bg-gradient-to-r from-[#8c5229] to-[#efbd78] transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${value}%` }} /></div>
    </div>
  );
}
