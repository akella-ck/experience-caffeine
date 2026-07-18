import { ArrowUpRight, Check, Droplets, Gauge, Thermometer } from "lucide-react";
import Link from "next/link";

const inputs = [
  ["Coffee", "Ethiopian Yirgacheffe"],
  ["Roast", "Light"],
  ["Method", "V60"],
  ["Grinder", "Baratza Encore"],
];

const outputs = [
  { label: "Grind", value: "16", note: "Encore setting", icon: Gauge },
  { label: "Dose", value: "15 g", note: "Coffee", icon: Check },
  { label: "Water", value: "250 g", note: "1:16.7 ratio", icon: Droplets },
  { label: "Temp", value: "94°", note: "Celsius", icon: Thermometer },
];

export function BrewLabPreview() {
  return (
    <div className="glass-panel relative overflow-hidden rounded-[2rem]">
      <div className="absolute right-[-10%] top-[-25%] size-96 rounded-full bg-[#c8793f]/10 blur-[90px]" aria-hidden="true" />
      <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
        <div className="border-b border-white/[0.08] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.17em] text-[#8c806f]">Recipe inputs</span>
            <span className="flex items-center gap-1.5 text-[0.65rem] text-[#9fb88b]">
              <span className="size-1.5 rounded-full bg-[#9fb88b]" /> Ready
            </span>
          </div>
          <div className="mt-6 space-y-2">
            {inputs.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-black/15 px-4 py-3.5">
                <span className="text-xs text-[#82776a]">{label}</span>
                <strong className="text-right text-xs font-medium text-[#dfd3c0]">{value}</strong>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[0.68rem] leading-5 text-[#71665b]">Adjust based on taste, drawdown time, bean age, and your grinder&apos;s calibration.</p>
        </div>

        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.17em] text-[#b78958]">Recommended starting point</span>
              <h3 className="mt-2 text-2xl font-medium tracking-[-0.035em] text-[#f1e7d5]">Bright &amp; articulate V60</h3>
            </div>
            <span className="rounded-full border border-white/[0.09] px-3 py-1.5 font-mono text-[0.56rem] uppercase tracking-[0.13em] text-[#928575]">2:45–3:15</span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-2 sm:gap-3">
            {outputs.map((output) => {
              const Icon = output.icon;
              return (
                <div key={output.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
                  <div className="flex items-center justify-between text-[#8f8273]">
                    <span className="text-[0.68rem]">{output.label}</span>
                    <Icon size={14} strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <strong className="mt-5 block text-2xl font-medium tracking-[-0.04em] text-[#f2c17f] sm:text-3xl">{output.value}</strong>
                  <span className="mt-1 block text-[0.62rem] text-[#74695d]">{output.note}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-[#d99a4e]/15 bg-[#d99a4e]/[0.045] p-4">
            <div>
              <span className="block font-mono text-[0.53rem] uppercase tracking-[0.14em] text-[#8f704f]">Pour structure</span>
              <span className="mt-1.5 block text-xs text-[#cbbba6]">45 g bloom → 150 g → 250 g</span>
            </div>
            <Link href="/brew-lab" aria-label="Open this recipe in Brew Lab" className="grid size-10 shrink-0 place-items-center rounded-full bg-[#df9f55] text-[#1b1008] transition-transform hover:-translate-y-0.5">
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
