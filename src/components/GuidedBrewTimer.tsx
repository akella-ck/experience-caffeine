"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CircleAlert,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Check,
  Droplets,
  Pause,
  Play,
  RotateCcw,
  Scale,
} from "lucide-react";
import { ProgressRing } from "@/components/ProgressRing";
import { brewTimerReducer, initialBrewTimerState } from "@/lib/brew-timer";
import type { BrewMethodId, RoastLevel } from "@/types";

export type GuidedBrewStep = {
  id: string;
  title: string;
  instruction: string;
  durationSeconds: number;
  targetWaterGrams: number;
  cue: string;
};

type GuidedBrewTimerProps = {
  recipeTitle: string;
  steps: GuidedBrewStep[];
  methodLabel: string;
  brewMethodId: BrewMethodId;
  roastLevel: RoastLevel;
  returnHref: string;
};

function formatTime(totalSeconds: number) {
  if (totalSeconds >= 3600) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function GuidedBrewTimer({
  recipeTitle,
  steps,
  methodLabel,
  brewMethodId,
  roastLevel,
  returnHref,
}: GuidedBrewTimerProps) {
  const [{ stepIndex, stepElapsed, totalElapsed, isRunning }, dispatch] = useReducer(
    brewTimerReducer,
    initialBrewTimerState,
  );
  const runningClockRef = useRef<{ startedAt: number; stepElapsed: number; totalElapsed: number } | null>(null);
  const pausedElapsedRef = useRef({ stepElapsed, totalElapsed });

  const step = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;
  const isUntimed = step.durationSeconds <= 0;
  const hasTimedOut = step.durationSeconds > 0 && stepElapsed >= step.durationSeconds;

  useEffect(() => {
    if (!isRunning) pausedElapsedRef.current = { stepElapsed, totalElapsed };
  }, [isRunning, stepElapsed, totalElapsed]);

  const synchronizeClock = useCallback(() => {
    const clock = runningClockRef.current;
    if (!clock) return;
    dispatch({
      type: "sync-time",
      baseStepElapsed: clock.stepElapsed,
      baseTotalElapsed: clock.totalElapsed,
      elapsedSeconds: Math.floor((Date.now() - clock.startedAt) / 1000),
      stepDurationSeconds: step.durationSeconds,
    });
  }, [step.durationSeconds]);

  useEffect(() => {
    if (!isRunning || isUntimed) return;
    runningClockRef.current = {
      startedAt: Date.now(),
      stepElapsed: pausedElapsedRef.current.stepElapsed,
      totalElapsed: pausedElapsedRef.current.totalElapsed,
    };
    const timerId = window.setInterval(() => {
      synchronizeClock();
    }, 250);
    return () => {
      runningClockRef.current = null;
      window.clearInterval(timerId);
    };
  }, [isRunning, isUntimed, synchronizeClock]);

  const progress = useMemo(() => {
    if (step.durationSeconds > 0) {
      return Math.min(100, (stepElapsed / step.durationSeconds) * 100);
    }
    return 100;
  }, [step.durationSeconds, stepElapsed]);

  const currentCumulativeWeight = useMemo(() => {
    const previousTarget = steps
      .slice(0, stepIndex)
      .reduce((latest, item) => Math.max(latest, item.targetWaterGrams), 0);
    if (step.targetWaterGrams <= previousTarget || step.durationSeconds <= 0) {
      return Math.max(previousTarget, step.targetWaterGrams);
    }
    const pourProgress = Math.min(1, stepElapsed / step.durationSeconds);
    return Math.round(previousTarget + (step.targetWaterGrams - previousTarget) * pourProgress);
  }, [step.durationSeconds, step.targetWaterGrams, stepElapsed, stepIndex, steps]);

  function goToStep(nextIndex: number) {
    dispatch({ type: "go-to-step", index: nextIndex, stepCount: steps.length });
  }

  function restart() {
    dispatch({ type: "restart" });
  }

  function toggleTimer() {
    if (isRunning) {
      synchronizeClock();
      dispatch({ type: "pause" });
      return;
    }
    dispatch({ type: "toggle-running" });
  }

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-[#0b0908] text-[#f7f0e5]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(195,118,51,.16),transparent_38%),radial-gradient(circle_at_15%_80%,rgba(112,66,35,.12),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.4)_1px,transparent_1px)] [background-size:52px_52px]" />

      <header className="relative z-10 flex items-center justify-between border-b border-white/8 px-4 py-4 sm:px-7">
        <Link
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-[#cbbcab] transition hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          href={returnHref}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Exit
        </Link>
        <div className="min-w-0 px-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-300/70">
            Guided brew
          </p>
          <h1 className="truncate text-sm font-medium sm:text-base">{recipeTitle}</h1>
        </div>
        <button
          aria-label="Restart guided brew"
          className="grid size-11 place-items-center rounded-full text-[#cbbcab] transition hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          onClick={restart}
          type="button"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
        </button>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100svh-77px)] max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10 lg:px-8 lg:py-8">
        <section className="flex min-w-0 flex-col items-center justify-center">
          <div className="mb-5 flex w-full max-w-2xl items-center justify-between text-xs text-[#998b7c]">
            <span>Step {stepIndex + 1} of {steps.length}</span>
            <span>Total {formatTime(totalElapsed)}</span>
          </div>

          <div className="relative mb-7">
            {step.targetWaterGrams > 0 && step.id !== "bloom" && step.id !== "drawdown" && (
              <div className="pointer-events-none absolute inset-8 animate-pulse rounded-full bg-amber-500/5 blur-3xl motion-reduce:animate-none" />
            )}
            <ProgressRing
              label={`${step.title} timer`}
              size={280}
              strokeWidth={5}
              value={progress}
            >
              <span className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a9957d]">
                {isUntimed ? "Taste & reflect" : hasTimedOut ? "Ready" : isRunning ? "Brewing" : "Paused"}
              </span>
              {isUntimed ? (
                <Coffee className="my-3 size-14 text-amber-200" strokeWidth={1.2} aria-hidden="true" />
              ) : (
                <span className="font-mono text-6xl font-light tracking-[-0.08em] text-white tabular-nums sm:text-7xl">
                  {formatTime(stepElapsed)}
                </span>
              )}
              {step.durationSeconds > 0 && (
                <span className="mt-2 text-xs text-[#88796a]">
                  target {formatTime(step.durationSeconds)}
                </span>
              )}
            </ProgressRing>
          </div>

          <div aria-live="polite" className="max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-medium tracking-[-0.035em] text-[#fffaf0] sm:text-4xl">
              {step.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-6 text-[#b8a999] sm:text-base sm:leading-7">
              {step.instruction}
            </p>
          </div>

          {isUntimed ? (
            <Link
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-amber-300/15 bg-amber-300/[0.045] px-4 text-xs font-medium text-amber-100 transition hover:border-amber-300/30 hover:bg-amber-300/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              href={`/troubleshoot?method=${brewMethodId}&roast=${roastLevel}`}
            >
              <CircleAlert aria-hidden="true" className="size-4" />
              Coffee tastes off? Troubleshoot this brew
            </Link>
          ) : null}

          <div className="mt-7 grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4 text-center backdrop-blur-sm">
              <Scale aria-hidden="true" className="mx-auto mb-2 size-4 text-amber-300" />
              <p className="text-[10px] uppercase tracking-[0.19em] text-[#8e7f70]">Target weight</p>
              <p className="mt-1 text-xl font-medium tabular-nums text-white">{step.targetWaterGrams} g</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4 text-center backdrop-blur-sm">
              <Droplets aria-hidden="true" className="mx-auto mb-2 size-4 text-amber-300" />
              <p className="text-[10px] uppercase tracking-[0.19em] text-[#8e7f70]">Current cumulative</p>
              <p className="mt-1 text-xl font-medium tabular-nums text-white">{currentCumulativeWeight} g</p>
              <p className="mt-0.5 text-[9px] text-[#6f6258]">guided estimate</p>
            </div>
            <div className="col-span-2 rounded-2xl border border-white/8 bg-white/[0.035] p-4 text-center backdrop-blur-sm sm:col-span-1">
              <Coffee aria-hidden="true" className="mx-auto mb-2 size-4 text-amber-300" />
              <p className="text-[10px] uppercase tracking-[0.19em] text-[#8e7f70]">Pour cue</p>
              <p className="mt-1 truncate text-sm font-medium text-white">{step.cue}</p>
            </div>
          </div>

          <div className="mt-7 flex w-full max-w-xl items-center gap-3">
            <button
              aria-label="Previous brewing step"
              className="grid size-12 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[#cbbcab] transition enabled:hover:bg-white/10 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
              disabled={isFirst}
              onClick={() => goToStep(stepIndex - 1)}
              type="button"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            {isUntimed ? (
              <Link
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#f0ad58] px-6 font-semibold text-[#1f1309] shadow-[0_12px_40px_rgba(221,139,55,.18)] transition hover:bg-[#ffc274] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                href="/journal"
              >
                <Coffee aria-hidden="true" className="size-4" /> Record this brew
              </Link>
            ) : hasTimedOut && !isLast ? (
              <button
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#f0ad58] px-6 font-semibold text-[#1f1309] shadow-[0_12px_40px_rgba(221,139,55,.18)] transition hover:bg-[#ffc274] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                onClick={() => goToStep(stepIndex + 1)}
                type="button"
              >
                Next step <ChevronRight aria-hidden="true" className="size-4" />
              </button>
            ) : (
              <button
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#f0ad58] px-6 font-semibold text-[#1f1309] shadow-[0_12px_40px_rgba(221,139,55,.18)] transition hover:bg-[#ffc274] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                onClick={toggleTimer}
                type="button"
              >
                {isRunning ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4 fill-current" />}
                {isRunning ? "Pause" : stepElapsed > 0 ? "Continue" : "Start timer"}
              </button>
            )}
            {isLast ? (
              <Link
                aria-label="Finish and exit guided brew"
                className="grid size-12 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[#cbbcab] transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                href={returnHref}
              >
                <Check aria-hidden="true" className="size-5" />
              </Link>
            ) : (
              <button
                aria-label="Next brewing step"
                className="grid size-12 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[#cbbcab] transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                onClick={() => goToStep(stepIndex + 1)}
                type="button"
              >
                <ChevronRight aria-hidden="true" className="size-5" />
              </button>
            )}
          </div>
        </section>

        <aside className="hidden rounded-[2rem] border border-white/8 bg-[#16110e]/80 p-5 backdrop-blur-xl lg:block">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-medium text-white">Brew sequence</h2>
            <span className="rounded-full border border-amber-300/15 bg-amber-400/5 px-2.5 py-1 text-[10px] uppercase tracking-wider text-amber-200/70">
              {methodLabel}
            </span>
          </div>
          <ol className="space-y-1">
            {steps.map((item, index) => {
              const isActive = index === stepIndex;
              const isComplete = index < stepIndex;
              return (
                <li key={item.id}>
                  <button
                    aria-current={isActive ? "step" : undefined}
                    className={`flex min-h-14 w-full items-center gap-3 rounded-xl px-3 text-left transition focus-visible:outline-2 focus-visible:outline-amber-400 ${
                      isActive ? "bg-amber-400/10 text-white" : "text-[#85786c] hover:bg-white/[0.035] hover:text-[#d7c8b8]"
                    }`}
                    onClick={() => goToStep(index)}
                    type="button"
                  >
                    <span className={`grid size-7 shrink-0 place-items-center rounded-full border text-[10px] ${
                      isActive
                        ? "border-amber-300/50 bg-amber-300 text-[#211308]"
                        : isComplete
                          ? "border-amber-300/20 bg-amber-300/10 text-amber-200"
                          : "border-white/10"
                    }`}>
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm">{item.title}</span>
                    {item.targetWaterGrams > 0 && (
                      <span className="text-[10px] tabular-nums">{item.targetWaterGrams} g</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="mt-5 border-t border-white/8 pt-5 text-xs leading-5 text-[#76695e]">
            Watch flow and drawdown, not only the clock. Your grinder, coffee, and pouring technique can shift the finish time.
          </p>
        </aside>
      </main>
    </div>
  );
}
