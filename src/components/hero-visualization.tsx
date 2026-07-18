"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Coffee, Droplets, Flame, Orbit } from "lucide-react";

const stages = [
  { label: "Bean", detail: "Origin", icon: Orbit, position: "left-[5%] top-[48%]" },
  { label: "Roast", detail: "Energy", icon: Flame, position: "left-[27%] top-[12%]" },
  { label: "Grind", detail: "Surface", icon: Coffee, position: "right-[22%] top-[12%]" },
  { label: "Brew", detail: "Extraction", icon: Droplets, position: "right-[3%] top-[51%]" },
];

export function HeroVisualization() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[38rem]" role="img" aria-label="Animated coffee journey from bean to roast, grind, and brewed cup">
      <div className="absolute inset-[6%] rounded-full border border-white/[0.06]" />
      <div className="absolute inset-[16%] rounded-full border border-dashed border-[#d99a4e]/20 motion-safe:animate-[spin_38s_linear_infinite]" />
      <motion.div
        animate={reduceMotion ? undefined : { opacity: [0.5, 0.95, 0.5], scale: [0.94, 1.08, 0.94] }}
        transition={{ duration: 4.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute inset-[27%] rounded-full bg-[radial-gradient(circle,rgba(217,154,78,.2),transparent_68%)] blur-xl"
      />

      <div className="absolute left-1/2 top-1/2 z-10 h-[30%] w-[21%] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          data-testid="hero-bean"
          animate={reduceMotion ? undefined : {
            y: [0, -14, 3, 0],
            rotate: [24, 31, 26, 24],
            scale: [1, 1.045, 0.99, 1],
          }}
          transition={{ duration: 7.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          whileHover={reduceMotion ? undefined : { rotate: 34, scale: 1.08, y: -8 }}
          className="relative size-full overflow-hidden rounded-[52%] border border-[#e5aa69]/30 bg-[radial-gradient(circle_at_32%_28%,#965631,#432418_55%,#160d09)] shadow-[0_0_78px_rgba(196,113,51,.3),inset_-14px_-18px_30px_rgba(0,0,0,.32)]"
        >
          <motion.span
            animate={reduceMotion ? undefined : { opacity: [0, 0.48, 0], x: ["-180%", "220%"] }}
            transition={{ duration: 3.8, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2.4, ease: "easeInOut" }}
            className="absolute -top-[15%] h-[130%] w-[22%] -rotate-[12deg] bg-gradient-to-r from-transparent via-[#ffd39d]/45 to-transparent blur-sm"
          />
          <motion.span
            animate={reduceMotion ? undefined : { scaleY: [0.96, 1.04, 0.96], opacity: [0.72, 1, 0.72] }}
            transition={{ duration: 3.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute left-1/2 top-[5%] h-[90%] w-[12%] -translate-x-1/2 -rotate-[8deg] rounded-[50%] border-l border-[#d08a53]/55 bg-[#25140e]/60"
          />
        </motion.div>
      </div>

      <div className="absolute left-1/2 top-1/2 size-[48%] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="relative size-full rounded-full border border-[#d99a4e]/10 shadow-[0_0_70px_rgba(217,154,78,.08)]"
        >
          <span className="absolute left-1/2 top-[-3px] size-1.5 -translate-x-1/2 rounded-full bg-[#efb76f] shadow-[0_0_12px_rgba(239,183,111,.9)]" />
        </motion.div>
      </div>

      {stages.map((stage, index) => {
        const Icon = stage.icon;
        return (
          <motion.div
            key={stage.label}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.12, duration: 0.5 }}
            className={`absolute ${stage.position} z-20 min-w-[6.7rem] rounded-2xl border border-white/[0.09] bg-[#120d09]/82 p-3 shadow-xl backdrop-blur-lg`}
          >
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-full bg-[#d99a4e]/10 text-[#e4aa65]">
                <Icon size={14} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs font-semibold text-[#eee2cf]">{stage.label}</span>
                <span className="mt-0.5 block font-mono text-[0.54rem] uppercase tracking-[0.13em] text-[#8f8272]">{stage.detail}</span>
              </span>
            </div>
          </motion.div>
        );
      })}

      <div className="absolute bottom-[13%] left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/[0.08] bg-black/25 px-3 py-1.5 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#9e907e] backdrop-blur-md">
        <span className="size-1.5 rounded-full bg-[#d99a4e] shadow-[0_0_8px_#d99a4e] motion-safe:animate-pulse" />
        Variable model active
      </div>
    </div>
  );
}
