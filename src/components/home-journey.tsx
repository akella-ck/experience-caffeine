"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Bean, Blend, BookOpenCheck, SlidersHorizontal, Waves } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const steps = [
  {
    title: "Choose your coffee",
    short: "Coffee",
    detail: "Start with origin, process, roast, and the flavors already present in the bean.",
    signal: "Ethiopia · Washed",
    metric: "Floral / citrus",
    href: "/explore",
    action: "Explore coffee origins",
    icon: Bean,
  },
  {
    title: "Match your grinder",
    short: "Grinder",
    detail: "Translate grind language into a useful starting range for the equipment on your counter.",
    signal: "Baratza Encore",
    metric: "14–18 range",
    href: "/grinders",
    action: "Find my grinder",
    icon: Blend,
  },
  {
    title: "Follow the recipe",
    short: "Recipe",
    detail: "Use a clear ratio, temperature, pour structure, and time target—not a vague set of instructions.",
    signal: "15 g → 250 g",
    metric: "1:16.7 ratio",
    href: "/brew-lab",
    action: "Build my recipe",
    icon: BookOpenCheck,
  },
  {
    title: "Taste and adjust",
    short: "Taste",
    detail: "Read sourness, bitterness, strength, and texture as clues to what happened during extraction.",
    signal: "Slightly sour",
    metric: "Grind finer",
    href: "/troubleshoot",
    action: "Troubleshoot this cup",
    icon: Waves,
  },
  {
    title: "Improve every brew",
    short: "Refine",
    detail: "Record one change at a time so the next cup teaches you something useful.",
    signal: "Iteration 04",
    metric: "+0.6 rating",
    href: "/journal",
    action: "Open my brew journal",
    icon: SlidersHorizontal,
  },
];

export function HomeJourney() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const current = steps[active];
  const Icon = current.icon;

  return (
    <div className="mt-12 grid overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#0d0907] lg:grid-cols-[0.72fr_1.28fr]">
      <div className="border-b border-white/[0.08] p-3 lg:border-b-0 lg:border-r lg:p-5">
        <div className="grid grid-cols-5 gap-1 lg:flex lg:flex-col lg:gap-1.5">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const selected = index === active;
            return (
              <button
                key={step.title}
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={selected}
                className={`group relative flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl px-1 text-center transition-colors lg:min-h-0 lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:py-3 lg:text-left ${
                  selected ? "bg-[#d99a4e]/10 text-[#f0c78f]" : "text-[#807568] hover:bg-white/[0.035] hover:text-[#c9bdac]"
                }`}
              >
                <span className={`grid size-7 shrink-0 place-items-center rounded-full border ${selected ? "border-[#d99a4e]/40" : "border-white/[0.08]"}`}>
                  <StepIcon size={13} strokeWidth={1.7} aria-hidden="true" />
                </span>
                <span className="text-[0.59rem] font-semibold sm:text-[0.66rem] lg:text-xs">{step.short}<span className="hidden lg:inline">. {step.title.replace(`${step.short} `, "")}</span></span>
                <span className="ml-auto hidden font-mono text-[0.56rem] text-[#6d6256] lg:block">0{index + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative min-h-[25rem] overflow-hidden p-6 sm:p-10 lg:p-14">
        <div className="ambient-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="absolute right-0 top-0 size-72 rounded-full bg-[#a85f34]/10 blur-[90px]" aria-hidden="true" />
        <AnimatePresence mode="wait">
          <motion.div
            key={current.title}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className="relative z-10 flex h-full flex-col"
          >
            <div className="flex items-start justify-between gap-5">
              <span className="grid size-12 place-items-center rounded-2xl border border-[#d99a4e]/20 bg-[#d99a4e]/[0.08] text-[#dca05a]">
                <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.17em] text-[#766b5f]">
                Step {active + 1} / {steps.length}
              </span>
            </div>
            <h3 className="mt-10 max-w-xl text-3xl font-medium tracking-[-0.04em] text-[#f2e8d7] sm:text-4xl">{current.title}</h3>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#a99d8d] sm:text-base">{current.detail}</p>
            <Link href={current.href} className="mt-5 inline-flex min-h-11 self-start items-center gap-2 rounded-full text-xs font-semibold text-[#e6b374] transition hover:text-[#f3c78f]">
              {current.action} <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <div className="mt-auto grid gap-3 pt-10 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.08] bg-black/20 p-4">
                <span className="block font-mono text-[0.56rem] uppercase tracking-[0.15em] text-[#766b5e]">Input signal</span>
                <strong className="mt-2 block text-sm font-medium text-[#e8dcc9]">{current.signal}</strong>
              </div>
              <div className="rounded-xl border border-[#d99a4e]/15 bg-[#d99a4e]/[0.045] p-4">
                <span className="block font-mono text-[0.56rem] uppercase tracking-[0.15em] text-[#967651]">Next decision</span>
                <strong className="mt-2 block text-sm font-medium text-[#e2ae6c]">{current.metric}</strong>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
